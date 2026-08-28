import DodoPayments from "dodopayments";
import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { purchases, sportingEvents, proSubscriptions, users, customItineraryOrders } from "@/schema/database";

const CUSTOM_ITINERARY_PRODUCT_ID = "pdt_0NmN6uswSvFETzX6GUQOU";

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

  // ── Custom Itinerary Planning — standalone, non-event product ─────────────
  if (productId === CUSTOM_ITINERARY_PRODUCT_ID) {
    const orderCurrency = payment.currency ?? "USD";
    const orderPricePaid = String(payment.total_amount / 100);

    try {
      const inserted = await db
        .insert(customItineraryOrders)
        .values({
          email,
          dodoPaymentId: payment.payment_id,
          dodoCustomerId: payment.customer.customer_id,
          dodoProductId: productId,
          pricePaid: orderPricePaid,
          currency: orderCurrency,
          status: "paid",
        })
        .onConflictDoNothing()
        .returning({ id: customItineraryOrders.id });

      if (inserted.length === 0) {
        console.log("[dodo webhook] custom itinerary order already recorded (conflict), skipping email");
        return NextResponse.json({ received: true });
      }
      console.log(`[dodo webhook] ✓ custom itinerary order recorded — email: ${email}`);
    } catch (err) {
      console.error("[dodo webhook] failed to insert custom itinerary order:", err);
      return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
    }

    try {
      const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({ email, email_confirm: true });
      if (error && !error.message.includes("already been registered")) {
        console.error("[dodo webhook] failed to create Supabase user:", error.message);
      }
      const authId = authData?.user?.id;
      if (authId) {
        await db.insert(users).values({ email, authId }).onConflictDoNothing();
      }
    } catch (err) {
      console.error("[dodo webhook] Supabase user provisioning error:", err);
    }

    try {
      await resend.emails.send({
        from: "Experiences | Curated <hello@experiences-curated.com>",
        to: email,
        subject: "Your Custom Itinerary Planning intake form",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
            <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
            <p style="font-size:20px;font-weight:900;color:#ffffff;margin-bottom:12px">You're in.</p>
            <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:28px">
              Thanks for your payment. Reply to this email with the details below and we'll start planning —
              consider this your intake form.
            </p>

            <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#AAFF00;margin:0 0 10px">Trip basics</p>
            <ol style="font-size:14px;color:#A3A3A3;line-height:1.8;margin:0 0 24px;padding-left:20px">
              <li>Which event(s) are you attending? (name + city, if more than one)</li>
              <li>Your travel dates — or if flexible, your preferred window and trip length</li>
              <li>Where are you flying from?</li>
              <li>How many people are traveling, and who (solo, couple, family with kids, group)?</li>
            </ol>

            <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#AAFF00;margin:0 0 10px">Budget</p>
            <ol start="5" style="font-size:14px;color:#A3A3A3;line-height:1.8;margin:0 0 24px;padding-left:20px">
              <li>Total budget for the trip (or per person) — flights, hotel, tickets, food, local transit</li>
              <li>Any part of that budget that's fixed or already spent (e.g. tickets already bought)?</li>
            </ol>

            <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#AAFF00;margin:0 0 10px">Preferences</p>
            <ol start="7" style="font-size:14px;color:#A3A3A3;line-height:1.8;margin:0 0 24px;padding-left:20px">
              <li>Ticket priority — best seats/hospitality vs. good value, if there's a tradeoff</li>
              <li>Hotel style — proximity to venue vs. staying in the city center; any brand/star-level preference</li>
              <li>Pace — packed with sightseeing, or mostly just the event with downtime</li>
              <li>Anything you already know you want (a specific hotel, restaurant, day trip)</li>
              <li>Anything you want to avoid (crowds, long transfers, a particular neighborhood, etc.)</li>
            </ol>

            <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#AAFF00;margin:0 0 10px">Logistics</p>
            <ol start="12" style="font-size:14px;color:#A3A3A3;line-height:1.8;margin:0 0 32px;padding-left:20px">
              <li>Any existing bookings we need to plan around (flights, hotel, other events)?</li>
              <li>Have you already bought one of our event packs for this trip?</li>
            </ol>

            <p style="font-size:13px;color:#6A6A6A;line-height:1.6">
              Delivery is within 5 business days of us receiving your completed details above. Questions?
              Just reply here.
            </p>
          </div>
        `,
      });
      console.log(`[dodo webhook] ✓ custom itinerary confirmation email sent to ${email}`);
    } catch (err) {
      console.error("[dodo webhook] failed to send custom itinerary confirmation email:", err);
    }

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
    const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({ email, email_confirm: true });
    if (error && !error.message.includes("already been registered")) {
      console.error("[dodo webhook] failed to create Supabase user:", error.message);
    }
    // Ensure public.users row exists — needed for user count and GDPR deletion
    const authId = authData?.user?.id;
    if (authId) {
      await db.insert(users)
        .values({ email, authId })
        .onConflictDoNothing();
    }
  } catch (err) {
    console.error("[dodo webhook] Supabase user provisioning error:", err);
  }

  console.log(`[dodo webhook] ✓ purchase recorded — email: ${email}, event: ${sportingEvent.slug}, tier: ${priceTier}`);

  // ── Send purchase confirmation email ─────────────────────────────────────
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.experiences-curated.com";
  const packUrl = `${siteUrl}/event-pack/${sportingEvent.slug}`;
  const formattedAmount = (payment.total_amount / 100).toFixed(2);
  const currencySymbol = currency === "GBP" ? "£" : currency === "USD" ? "US$" : currency === "EUR" ? "€" : currency + " ";

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
