import DodoPayments from "dodopayments";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/server";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: (process.env.NEXT_PUBLIC_DODO_MODE ?? "live_mode") as "live_mode" | "test_mode",
});

export async function POST(request: NextRequest) {
  const { user } = await getAuthUser();

  const { productId, successUrl, posthogDistinctId, utmSource, utmMedium, utmCampaign } = await request.json();

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  try {
    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      ...(user?.email ? { customer: { email: user.email } } : {}),
      return_url: successUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL}/pro/onboarding`,
      // Issue 12, 20 Nov 2026 — attribution pass-through. Confirmed via
      // dodopayments SDK type definitions that this metadata survives onto
      // the subscription object itself (read in the webhook's
      // subscription.active/updated branch as sub.metadata), not just
      // one-time payment.succeeded events.
      metadata: {
        ...(posthogDistinctId ? { posthog_distinct_id: posthogDistinctId } : {}),
        ...(utmSource ? { utm_source: utmSource } : {}),
        ...(utmMedium ? { utm_medium: utmMedium } : {}),
        ...(utmCampaign ? { utm_campaign: utmCampaign } : {}),
      },
    });

    return NextResponse.json({ checkout_url: (session as { checkout_url: string }).checkout_url });
  } catch (err) {
    console.error("[dodo checkout pro] session creation failed:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
