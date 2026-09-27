"use server";

import { db } from "@/lib/db";
import { purchases } from "@/schema/database";
import { and, eq } from "drizzle-orm";
import { getAuthUser } from "@/lib/supabase/server";
import type { QuizAnswers } from "./_lib/types";

// Updates purchases.ticketIntelligenceAnswers when an already-purchased
// buyer retakes the quiz and reaches a new teaser (see TeaserResult.tsx).
// Keeps the recovery path (confirmation email → /result with no query
// string, falling back to the stored answers) always showing the fan's
// LATEST answers rather than staying stuck on whatever they originally
// paid for. Server-verified via getAuthUser() — never trusts a client-
// supplied email — and scoped to rows this signed-in user actually owns.
export async function updateTicketIntelligenceAnswers(
  sportingEventId: string,
  answers: QuizAnswers
): Promise<void> {
  const { user } = await getAuthUser();
  if (!user?.email) return;

  await db
    .update(purchases)
    .set({ ticketIntelligenceAnswers: answers })
    .where(
      and(
        eq(purchases.email, user.email),
        eq(purchases.sportingEventId, sportingEventId),
        eq(purchases.productType, "ticket_intelligence")
      )
    );
}
