import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { giftCodes, purchases, sportingEvents } from "@/schema/database";
import { eq, and, isNull, gte } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Sign in first to redeem a gift code." }, { status: 401 });
  }

  const body = await request.json();
  const { code, sportingEventId } = body;

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Missing code." }, { status: 400 });
  }
  if (!sportingEventId || typeof sportingEventId !== "string") {
    return NextResponse.json({ error: "Choose an event to redeem this gift for." }, { status: 400 });
  }

  const normalised = code.trim().toUpperCase();

  // Validate gift code — must exist, unclaimed, unexpired
  const [gift] = await db
    .select()
    .from(giftCodes)
    .where(
      and(
        eq(giftCodes.code, normalised),
        isNull(giftCodes.claimedByEmail),
        gte(giftCodes.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!gift) {
    return NextResponse.json({ error: "Invalid, already used, or expired code." }, { status: 400 });
  }

  // Can't use your own gift code
  if (gift.generatedByEmail === user.email) {
    return NextResponse.json({ error: "You can't redeem your own gift code." }, { status: 400 });
  }

  // Validate the chosen event exists and is live
  const [event] = await db
    .select({ id: sportingEvents.id, name: sportingEvents.name, slug: sportingEvents.slug })
    .from(sportingEvents)
    .where(
      and(
        eq(sportingEvents.id, sportingEventId),
        eq(sportingEvents.isHidden, false)
      )
    )
    .limit(1);

  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  // Check they don't already have this pack
  const [alreadyOwned] = await db
    .select({ id: purchases.id })
    .from(purchases)
    .where(
      and(
        eq(purchases.email, user.email),
        eq(purchases.sportingEventId, sportingEventId)
      )
    )
    .limit(1);

  if (alreadyOwned) {
    return NextResponse.json({ error: "You already have access to this pack.", slug: event.slug }, { status: 409 });
  }

  // Mark gift code as claimed
  await db
    .update(giftCodes)
    .set({ claimedByEmail: user.email, claimedAt: new Date(), sportingEventId })
    .where(eq(giftCodes.id, gift.id));

  // Create purchase record (gift sentinel values for payment fields)
  await db
    .insert(purchases)
    .values({
      email: user.email,
      sportingEventId,
      paddleOrderId: `gift-${gift.id}`,
      paddleCustomerId: null,
      paddlePriceId: "gift",
      priceTier: "gift",
      pricePaid: "0.00",
      currency: "GBP",
      status: "active",
    })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true, slug: event.slug, eventName: event.name });
}
