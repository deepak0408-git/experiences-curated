import { Paddle, EventName, Environment } from "@paddle/paddle-node-sdk";
import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { purchases, sportingEvents, proSubscriptions } from "@/schema/database";

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment:
    process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "sandbox"
      ? Environment.sandbox
      : Environment.production,
});

// Service-role client — never exposed to the browser
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  const signature = request.headers.get("paddle-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch (err) {
    console.error("[paddle webhook] failed to read body:", err);
    return NextResponse.json({ error: "Failed to read body" }, { status: 400 });
  }

  let event;
  try {
    event = await paddle.webhooks.unmarshal(
      rawBody,
      process.env.PADDLE_WEBHOOK_SECRET!,
      signature
    );
  } catch (err) {
    console.error("[paddle webhook] signature validation failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // ── Subscription activated ────────────────────────────────────────────────
  if (
    event?.eventType === EventName.SubscriptionActivated ||
    event?.eventType === EventName.SubscriptionUpdated
  ) {
    const sub = event.data;
    const customerId = sub.customerId;
    if (!customerId) return NextResponse.json({ received: true });

    let email: string | null = null;
    try {
      const customerResponse = await paddle.customers.get(customerId);
      email = customerResponse.email ?? null;
    } catch (err) {
      console.error("[paddle webhook] failed to fetch customer for sub:", customerId, err);
      return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
    }

    if (!email) return NextResponse.json({ received: true });

    const priceId = sub.items?.[0]?.price?.id ?? "";
    const billingCycle = priceId === process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_ANNUAL
      ? "annual"
      : "monthly";
    const currentPeriodEnd = sub.currentBillingPeriod?.endsAt
      ? new Date(sub.currentBillingPeriod.endsAt)
      : null;

    try {
      await db
        .insert(proSubscriptions)
        .values({
          email,
          paddleSubscriptionId: sub.id,
          paddleCustomerId: customerId,
          paddlePriceId: priceId,
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
      console.log(`[paddle webhook] ✓ pro subscription upserted — email: ${email}, cycle: ${billingCycle}`);
    } catch (err) {
      console.error("[paddle webhook] failed to upsert pro subscription:", err);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    // Provision Supabase user if not already existing
    try {
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
      });
      if (createError && !createError.message.includes("already been registered")) {
        console.error("[paddle webhook] failed to create Supabase user:", createError.message);
      }
    } catch (err) {
      console.error("[paddle webhook] Supabase user provisioning error:", err);
    }

    return NextResponse.json({ received: true });
  }

  // ── Subscription cancelled ─────────────────────────────────────────────────
  if (event?.eventType === EventName.SubscriptionCanceled) {
    const sub = event.data;
    try {
      await db
        .update(proSubscriptions)
        .set({ status: "cancelled", cancelledAt: new Date(), updatedAt: new Date() })
        .where(eq(proSubscriptions.paddleSubscriptionId, sub.id));
      console.log(`[paddle webhook] ✓ pro subscription cancelled — sub: ${sub.id}`);
    } catch (err) {
      console.error("[paddle webhook] failed to cancel subscription:", err);
    }
    return NextResponse.json({ received: true });
  }

  // Only act on completed transactions for event pack purchases
  if (event?.eventType !== EventName.TransactionCompleted) {
    return NextResponse.json({ received: true });
  }

  const txn = event.data;
  const customData = txn.customData as {
    sporting_event_id?: string;
    price_tier?: string;
  } | null;

  console.log("[paddle webhook] transaction completed:", txn.id);
  console.log("[paddle webhook] customerId:", txn.customerId);
  console.log("[paddle webhook] customData:", JSON.stringify(customData));

  if (!txn.customerId) {
    console.error("[paddle webhook] missing customerId on txn:", txn.id);
    return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
  }

  // Resolve customer email
  let email: string | null = null;
  try {
    const customerResponse = await paddle.customers.get(txn.customerId);
    email = customerResponse.email ?? null;
    console.log("[paddle webhook] resolved email:", email);
  } catch (err) {
    console.error("[paddle webhook] failed to fetch customer:", txn.customerId, err);
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }

  if (!email) {
    console.error("[paddle webhook] customer has no email:", txn.customerId);
    return NextResponse.json({ error: "Missing customer email" }, { status: 400 });
  }

  // Pro subscription transactions come through as transaction.completed too —
  // they have no sporting_event_id so we skip event pack logic for them.
  const proPriceIds = [
    process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_MONTHLY,
    process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_ANNUAL,
  ].filter(Boolean);
  const txnPriceId = txn.items?.[0]?.price?.id ?? "";
  if (proPriceIds.includes(txnPriceId)) {
    console.log("[paddle webhook] Pro transaction — handled by subscription events, skipping event pack logic");
    return NextResponse.json({ received: true });
  }

  if (!customData?.sporting_event_id) {
    console.error("[paddle webhook] missing sporting_event_id in customData, txn:", txn.id);
    return NextResponse.json({ error: "Missing sporting_event_id" }, { status: 400 });
  }

  const sportingEventId = customData.sporting_event_id;
  const priceTier = customData.price_tier ?? "standard";

  let sportingEvent: { id: string; slug: string } | undefined;
  try {
    [sportingEvent] = await db
      .select({ id: sportingEvents.id, slug: sportingEvents.slug })
      .from(sportingEvents)
      .where(eq(sportingEvents.id, sportingEventId))
      .limit(1);
  } catch (err) {
    console.error("[paddle webhook] DB lookup failed for sporting event:", sportingEventId, err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!sportingEvent) {
    console.error("[paddle webhook] sporting event not found:", sportingEventId);
    return NextResponse.json({ error: "Unknown sporting event" }, { status: 400 });
  }

  const paddleOrderId = txn.id;
  const paddleCustomerId = txn.customerId;
  const paddlePriceId = txn.items?.[0]?.price?.id ?? "";
  const totals = txn.details?.totals;
  const pricePaid = String(Number(totals?.total ?? 0) / 100);
  const currency = totals?.currencyCode ?? "USD";

  // Idempotent — Paddle may replay webhooks
  console.log("[paddle webhook] attempting insert — paddleOrderId:", paddleOrderId, "email:", email, "eventId:", sportingEventId);
  try {
    const inserted = await db
      .insert(purchases)
      .values({
        email,
        sportingEventId,
        paddleOrderId,
        paddleCustomerId,
        paddlePriceId,
        priceTier,
        pricePaid,
        currency,
        status: "active",
      })
      .onConflictDoNothing()
      .returning({ id: purchases.id });
    console.log("[paddle webhook] insert result:", inserted.length ? inserted[0].id : "SKIPPED (conflict)");
  } catch (err) {
    console.error("[paddle webhook] failed to insert purchase:", err);
    return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
  }

  // Pre-provision Supabase user so the magic link works immediately
  try {
    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (createError && !createError.message.includes("already been registered")) {
      console.error("[paddle webhook] failed to create Supabase user:", createError.message);
    }
  } catch (err) {
    // Non-fatal — user can still sign in via OTP which will create the account
    console.error("[paddle webhook] Supabase user provisioning error:", err);
  }

  console.log(
    `[paddle webhook] ✓ purchase recorded — email: ${email}, event: ${sportingEvent.slug}, tier: ${priceTier}`
  );

  return NextResponse.json({ received: true });
}
