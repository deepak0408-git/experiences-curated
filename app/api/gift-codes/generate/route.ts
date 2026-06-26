import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasProSubscription } from "@/lib/pro";
import { db } from "@/lib/db";
import { giftCodes, proSubscriptions } from "@/schema/database";
import { eq, and, gte } from "drizzle-orm";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/I/1 ambiguity
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code.slice(0, 4) + "-" + code.slice(4); // format: XXXX-XXXX
}

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const isPro = await hasProSubscription(user.email);
  if (!isPro) {
    return NextResponse.json({ error: "Pro required" }, { status: 403 });
  }

  // Gift code is annual-only perk — monthly subscribers are not eligible
  const [sub] = await db
    .select({ billingCycle: proSubscriptions.billingCycle })
    .from(proSubscriptions)
    .where(and(eq(proSubscriptions.email, user.email), eq(proSubscriptions.status, "active")))
    .limit(1);

  if (!sub || sub.billingCycle !== "annual") {
    return NextResponse.json({ error: "Annual plan required" }, { status: 403 });
  }

  // One gift code per calendar year — check for existing unexpired code this year
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const existing = await db
    .select({ id: giftCodes.id, code: giftCodes.code, claimedByEmail: giftCodes.claimedByEmail, expiresAt: giftCodes.expiresAt })
    .from(giftCodes)
    .where(
      and(
        eq(giftCodes.generatedByEmail, user.email),
        gte(giftCodes.createdAt, yearStart)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ code: existing[0] });
  }

  // Generate unique code
  let code = generateCode();
  let attempts = 0;
  while (attempts < 5) {
    const clash = await db
      .select({ id: giftCodes.id })
      .from(giftCodes)
      .where(eq(giftCodes.code, code))
      .limit(1);
    if (clash.length === 0) break;
    code = generateCode();
    attempts++;
  }

  // Expires 1 year from today
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const [created] = await db
    .insert(giftCodes)
    .values({ code, generatedByEmail: user.email, expiresAt })
    .returning({ id: giftCodes.id, code: giftCodes.code, claimedByEmail: giftCodes.claimedByEmail, expiresAt: giftCodes.expiresAt });

  return NextResponse.json({ code: created });
}
