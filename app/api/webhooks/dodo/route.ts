import DodoPayments from "dodopayments";
import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { purchases, sportingEvents, proSubscriptions } from "@/schema/database";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: (process.env.NEXT_PUBLIC_DODO_MODE ?? "live_mode") as "live_mode" | "test_mode",
  webhookKey: process.env.DODO_WEBHOOK_SECRET!,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const PRO_PRODUCT_IDS = [
  process.env.NEXT_PUBLIC_DODO_PRICE_ID_PRO_MONTHLY,
  process.env.NEXT_PUBLIC_DODO_PRICE_ID_PRO_ANNUAL,
].filter(Boolean);

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const headers = {
    "webhook-id": request.headers.get("webhook-id") ?? "",
    "webhook-signature": request.headers.get("webhook-signature") ?? "",
    "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
  };

  let payload: ReturnType<typeof client.webhooks.unwrap>;
  try {
    payload = client.webhooks.unwrap(rawBody, { headers });
  } catch (err) {
    console.error("[dodo webhook] signature validation failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = payload as unknown as { type: string; data: Record<string, unknown> };
  console.log("[dodo webhook] event type:", event.type);

  // ── Subscription active / updated ─────────────────────────────────────────
  if (event.type === "subscription.active" || event.type === "subscription.updated") {
    const sub = event.data as {
      subscription_id: string;
      product_id: string;
      status: string;
      payment_frequency_interval: string;
      next_billing_date: string;
      customer: { customer_id: string; email: string };
    };

    const email = sub.customer?.email;
    if (!email) return NextResponse.json({ received: true });

    const billingCycle = sub.payment_frequency_interval === "yearly" ? "annual" : "monthly";
    const currentPeriodEnd = sub.next_billing_date ? new Date(sub.next_billing_date) : null;

    try {
      await db
        .insert(proSubscriptions)
        .values({
          email,
          paddleSubscriptionId: sub.subscription_id,
          paddleCustomerId: sub.customer.customer_id,
          paddlePriceId: sub.product_id,
          billingCycle,
          status: sub.status ?? "active",
          currentPeriodEnd,
        })
        .onConflictDoUpdate({
          target: proSubscriptions.paddleSubscriptionId,
          set: {
            status: sub.status ?? "active",
            currentPeriodEnd,
            updatedAt: new Date(),
          },
        });
      console.log(`[dodo webhook] ✓ pro subscription upserted — email: ${email}, cycle: ${billingCycle}`);
    } catch (err) {
      console.error("[dodo webhook] failed to upsert pro subscription:", err);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    try {
      const { error } = await supabaseAdmin.auth.admin.createUser({ email, email_confirm: true });
      if (error && !error.message.includes("already been registered")) {
        console.error("[dodo webhook] failed to create Supabase user:", error.message);
      }
    } catch (err) {
      console.error("[dodo webhook] Supabase user provisioning error:", err);
    }

    return NextResponse.json({ received: true });
  }

  // ── Subscription cancelled ────────────────────────────────────────────────
  if (event.type === "subscription.cancelled") {
    const sub = event.data as { subscription_id: string };
    try {
      await db
        .update(proSubscriptions)
        .set({ status: "cancelled", cancelledAt: new Date(), updatedAt: new Date() })
        .where(eq(proSubscriptions.paddleSubscriptionId, sub.subscription_id));
      console.log(`[dodo webhook] ✓ pro subscription cancelled — sub: ${sub.subscription_id}`);
    } catch (err) {
      console.error("[dodo webhook] failed to cancel subscription:", err);
    }
    return NextResponse.json({ received: true });
  }

  // ── Payment succeeded ─────────────────────────────────────────────────────
  if (event.type !== "payment.succeeded") {
    return NextResponse.json({ received: true });
  }

  const payment = event.data as {
    payment_id: string;
    product_id: string;
    currency: string;
    total_amount: number;
    customer: { customer_id: string; email: string };
    metadata?: { sporting_event_id?: string; price_tier?: string };
  };

  const email = payment.customer?.email;
  if (!email) {
    console.error("[dodo webhook] missing email on payment:", payment.payment_id);
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  // Skip pro transactions — handled by subscription events
  if (PRO_PRODUCT_IDS.includes(payment.product_id)) {
    console.log("[dodo webhook] Pro payment — handled by subscription events, skipping");
    return NextResponse.json({ received: true });
  }

  const sportingEventId = payment.metadata?.sporting_event_id;
  if (!sportingEventId) {
    console.error("[dodo webhook] missing sporting_event_id in metadata, payment:", payment.payment_id);
    return NextResponse.json({ error: "Missing sporting_event_id" }, { status: 400 });
  }

  let sportingEvent: { id: string; slug: string } | undefined;
  try {
    [sportingEvent] = await db
      .select({ id: sportingEvents.id, slug: sportingEvents.slug })
      .from(sportingEvents)
      .where(eq(sportingEvents.id, sportingEventId))
      .limit(1);
  } catch (err) {
    console.error("[dodo webhook] DB lookup failed:", sportingEventId, err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!sportingEvent) {
    console.error("[dodo webhook] sporting event not found:", sportingEventId);
    return NextResponse.json({ error: "Unknown sporting event" }, { status: 400 });
  }

  const priceTier = payment.metadata?.price_tier ?? "standard";
  const pricePaid = String(payment.total_amount / 100);
  const currency = payment.currency ?? "GBP";

  try {
    const inserted = await db
      .insert(purchases)
      .values({
        email,
        sportingEventId,
        paddleOrderId: payment.payment_id,
        paddleCustomerId: payment.customer.customer_id,
        paddlePriceId: payment.product_id,
        priceTier,
        pricePaid,
        currency,
        status: "active",
      })
      .onConflictDoNothing()
      .returning({ id: purchases.id });
    console.log("[dodo webhook] insert result:", inserted.length ? inserted[0].id : "SKIPPED (conflict)");
  } catch (err) {
    console.error("[dodo webhook] failed to insert purchase:", err);
    return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
  }

  try {
    const { error } = await supabaseAdmin.auth.admin.createUser({ email, email_confirm: true });
    if (error && !error.message.includes("already been registered")) {
      console.error("[dodo webhook] failed to create Supabase user:", error.message);
    }
  } catch (err) {
    console.error("[dodo webhook] Supabase user provisioning error:", err);
  }

  console.log(`[dodo webhook] ✓ purchase recorded — email: ${email}, event: ${sportingEvent.slug}, tier: ${priceTier}`);
  return NextResponse.json({ received: true });
}
