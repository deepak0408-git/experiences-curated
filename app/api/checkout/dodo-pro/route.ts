import DodoPayments from "dodopayments";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: (process.env.NEXT_PUBLIC_DODO_MODE ?? "live_mode") as "live_mode" | "test_mode",
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { productId, successUrl } = await request.json();

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  try {
    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      ...(user?.email ? { customer: { email: user.email, name: "" } } : {}),
      return_url: successUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL}/pro/onboarding`,
    });

    return NextResponse.json({ checkout_url: (session as { checkout_url: string }).checkout_url });
  } catch (err) {
    console.error("[dodo checkout pro] session creation failed:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
