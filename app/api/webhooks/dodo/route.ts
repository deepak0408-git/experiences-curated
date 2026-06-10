import DodoPayments from "dodopayments";
import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { purchases, sportingEvents, proSubscriptions } from "@/schema/database";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    product_cart: { product_id: string; quantity: number }[];
    currency: string;
    total_amount: number;
    customer: { customer_id: string; email: string };
    metadata?: { sporting_event_id?: string; price_tier?: string };
  };

  const productId = payment.product_cart?.[0]?.product_id ?? null;

  const email = payment.customer?.email;
  if (!email) {
    console.error("[dodo webhook] missing email on payment:", payment.payment_id);
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  if (!productId) {
    console.error("[dodo webhook] missing product_id in product_cart, payment:", payment.payment_id);
    return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
  }

  // Skip pro transactions — handled by subscription events
  if (PRO_PRODUCT_IDS.includes(productId)) {
    console.log("[dodo webhook] Pro payment — handled by subscription events, skipping");
    return NextResponse.json({ received: true });
  }

  const sportingEventId = payment.metadata?.sporting_event_id;
  if (!sportingEventId) {
    console.error("[dodo webhook] missing sporting_event_id in metadata, payment:", payment.payment_id);
    return NextResponse.json({ error: "Missing sporting_event_id" }, { status: 400 });
  }

  let sportingEvent: { id: string; slug: string; name: string } | undefined;
  try {
    [sportingEvent] = await db
      .select({ id: sportingEvents.id, slug: sportingEvents.slug, name: sportingEvents.name })
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
        paddlePriceId: productId,
        priceTier,
        pricePaid,
        currency,
        status: "active",
      })
      .onConflictDoNothing()
      .returning({ id: purchases.id });
    if (inserted.length === 0) {
      console.log("[dodo webhook] purchase already recorded (conflict), skipping email");
      return NextResponse.json({ received: true });
    }
    console.log("[dodo webhook] insert result:", inserted[0].id);
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

  // ── Send purchase confirmation email ─────────────────────────────────────
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://experiences-curated.com";
  const packUrl = `${siteUrl}/event-pack/${sportingEvent.slug}`;
  const formattedAmount = (payment.total_amount / 100).toFixed(2);
  const currencySymbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : currency === "EUR" ? "€" : currency + " ";

  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: email,
      subject: `Your ${sportingEvent.name} pack is ready`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
          <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated</p>
          <h1 style="font-size:22px;font-weight:700;margin-bottom:12px">Your pack is ready</h1>
          <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:32px">
            Thanks for your purchase. Your ${sportingEvent.name} event pack is now unlocked — click below to access it.
          </p>
          <a href="${packUrl}"
             style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:600;margin-bottom:40px">
            Open your pack
          </a>
          <table style="width:100%;border-top:1px solid #e5e5e5;padding-top:24px;font-size:13px;color:#525252;border-collapse:collapse">
            <tr>
              <td style="padding:6px 0">Order</td>
              <td style="padding:6px 0;text-align:right;color:#171717;font-family:monospace;font-size:12px">${payment.payment_id}</td>
            </tr>
            <tr>
              <td style="padding:6px 0">Pack</td>
              <td style="padding:6px 0;text-align:right;color:#171717">${sportingEvent.name}</td>
            </tr>
            <tr>
              <td style="padding:6px 0">Amount paid</td>
              <td style="padding:6px 0;text-align:right;color:#171717;font-weight:600">${currencySymbol}${formattedAmount}</td>
            </tr>
          </table>
          <p style="font-size:12px;color:#a3a3a3;margin-top:32px;line-height:1.6">
            If you have any questions, reply to this email.<br>
            Sent to ${email}.
          </p>
        </div>
      `,
    });
    console.log(`[dodo webhook] ✓ confirmation email sent to ${email}`);
  } catch (err) {
    console.error("[dodo webhook] failed to send confirmation email:", err);
    // Non-fatal — purchase is already recorded
  }

  return NextResponse.json({ received: true });
}
