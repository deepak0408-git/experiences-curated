import DodoPayments from "dodopayments";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/server";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: (process.env.NEXT_PUBLIC_DODO_MODE ?? "live_mode") as "live_mode" | "test_mode",
});

const CUSTOM_ITINERARY_PRODUCT_ID = "pdt_0NmN6uswSvFETzX6GUQOU";

export async function POST(request: NextRequest) {
  const { user } = await getAuthUser();
  const { successUrl } = await request.json();

  try {
    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: CUSTOM_ITINERARY_PRODUCT_ID, quantity: 1 }],
      ...(user?.email ? { customer: { email: user.email } } : {}),
      metadata: { product: "custom_itinerary_planning" },
      return_url: successUrl,
    });

    return NextResponse.json({ checkout_url: (session as { checkout_url: string }).checkout_url });
  } catch (err) {
    console.error("[dodo checkout] custom itinerary session creation failed:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
