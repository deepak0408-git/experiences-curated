import DodoPayments from "dodopayments";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/server";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: (process.env.NEXT_PUBLIC_DODO_MODE ?? "live_mode") as "live_mode" | "test_mode",
});

export async function POST(request: NextRequest) {
  const [
    { user },
    { productId, sportingEventId, priceTier, productType, successUrl, ticketIntelligenceAnswers, posthogDistinctId, utmSource, utmMedium, utmCampaign },
  ] = await Promise.all([getAuthUser(), request.json()]);

  if (!productId || !sportingEventId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      ...(user?.email ? { customer: { email: user.email } } : {}),
      metadata: {
        sporting_event_id: sportingEventId,
        price_tier: priceTier ?? "standard",
        // Mini-packs pilot — omitted (undefined) for the full pack, so the
        // webhook's existing `?? "full_pack"` default still applies for
        // every checkout that predates this field.
        ...(productType ? { product_type: productType } : {}),
        // Ticket Intelligence only — see DodoCheckout.tsx prop comment.
        ...(ticketIntelligenceAnswers ? { ticket_intelligence_answers: ticketIntelligenceAnswers } : {}),
        // Issue 12, 20 Nov 2026 — attribution pass-through. Dodo metadata
        // values must be strings; all 4 are already strings client-side.
        ...(posthogDistinctId ? { posthog_distinct_id: posthogDistinctId } : {}),
        ...(utmSource ? { utm_source: utmSource } : {}),
        ...(utmMedium ? { utm_medium: utmMedium } : {}),
        ...(utmCampaign ? { utm_campaign: utmCampaign } : {}),
      },
      return_url: successUrl,
    });

    return NextResponse.json({ checkout_url: (session as { checkout_url: string }).checkout_url });
  } catch (err) {
    console.error("[dodo checkout] session creation failed:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
