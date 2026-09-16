import DodoPayments from "dodopayments";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/server";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: (process.env.NEXT_PUBLIC_DODO_MODE ?? "live_mode") as "live_mode" | "test_mode",
});

export async function POST(request: NextRequest) {
  const [{ user }, { productId, sportingEventId, priceTier, productType, successUrl }] = await Promise.all([
    getAuthUser(),
    request.json(),
  ]);

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
      },
      return_url: successUrl,
    });

    return NextResponse.json({ checkout_url: (session as { checkout_url: string }).checkout_url });
  } catch (err) {
    console.error("[dodo checkout] session creation failed:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
