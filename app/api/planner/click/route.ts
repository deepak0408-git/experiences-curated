import { NextRequest, NextResponse } from "next/server";
import { eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { plannerSessions } from "@/schema/database";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://experiences-curated.com";

// Tracked redirect used by every Post-Planner Drip email link. Marks the
// PlannerSession as clicked (stopping the saved/compared drip sequences
// immediately, per design doc) then forwards to the real destination.
export async function GET(request: NextRequest) {
  const session = request.nextUrl.searchParams.get("session");
  const redirect = request.nextUrl.searchParams.get("redirect");

  const fallback = NextResponse.redirect(SITE_URL);
  if (!redirect || !redirect.startsWith("/")) return fallback;

  const destination = new URL(redirect, SITE_URL);

  if (session) {
    await db
      .update(plannerSessions)
      .set({ clickedAt: new Date() })
      .where(eq(plannerSessions.id, session));
  }

  return NextResponse.redirect(destination);
}
