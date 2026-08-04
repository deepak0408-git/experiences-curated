"use server";

import { db } from "@/lib/db";
import { purchases, users, sportingEvents, savedEventPacks, eventPackFeedback } from "@/schema/database";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/supabase/server";

// currency is looked up from sportingEvents.packCurrency (the real
// Dodo/Paddle currency for this event's pack) rather than hardcoded --
// fixed 1 Aug 2026 after every free-access grant was silently writing
// "GBP" regardless of the event's actual currency (Hungarian GP/Italian GP
// are EUR, US Open/Bahrain GP are USD, etc.), corrupting purchases.currency
// for every non-GBP free event. Falls back to "GBP" only when an event
// genuinely has no packCurrency set yet (an honest gap, not a guess).
export async function grantFreeAccess(email: string, sportingEventId: string): Promise<void> {
  await db
    .insert(users)
    .values({ email })
    .onConflictDoNothing();

  const [event] = await db
    .select({ packCurrency: sportingEvents.packCurrency })
    .from(sportingEvents)
    .where(eq(sportingEvents.id, sportingEventId))
    .limit(1);

  await db
    .insert(purchases)
    .values({
      email,
      sportingEventId,
      paddleOrderId: `free-${email}-${sportingEventId}`,
      paddleCustomerId: "free_access",
      paddlePriceId: "free",
      priceTier: "early_bird",
      pricePaid: "0",
      currency: event?.packCurrency ?? "GBP",
      status: "active",
    })
    .onConflictDoNothing();
}

// Whole-pack favoriting, per beta feedback 4 Aug 2026 ("Save/Favorite ...
// functionality"). Same auth/user-resolution pattern as
// app/experience/[slug]/actions.ts's saveExperience/unsaveExperience —
// duplicated here rather than shared, matching this codebase's existing
// convention of a small per-file getOrCreateDbUser helper.
async function getOrCreateDbUser(authId: string, email: string) {
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, authId))
    .limit(1);
  if (existing) return existing;

  await db.insert(users).values({ email, authId }).onConflictDoNothing();

  const [created] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, authId))
    .limit(1);
  if (created) return created;

  const [backfilled] = await db
    .update(users)
    .set({ authId })
    .where(eq(users.email, email))
    .returning({ id: users.id });
  return backfilled;
}

export async function saveEventPack(sportingEventId: string, slug: string) {
  const { user } = await getAuthUser();
  if (!user) return { error: "Not authenticated" };

  const dbUser = await getOrCreateDbUser(user.id, user.email!);
  await db
    .insert(savedEventPacks)
    .values({ userId: dbUser.id, sportingEventId })
    .onConflictDoNothing();

  revalidatePath(`/event-pack/${slug}`);
  revalidatePath("/profile");
  return { success: true };
}

export async function unsaveEventPack(sportingEventId: string, slug: string) {
  const { user } = await getAuthUser();
  if (!user) return { error: "Not authenticated" };

  const [dbUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);
  if (!dbUser) return { error: "User not found" };

  await db
    .delete(savedEventPacks)
    .where(
      and(
        eq(savedEventPacks.userId, dbUser.id),
        eq(savedEventPacks.sportingEventId, sportingEventId)
      )
    );

  revalidatePath(`/event-pack/${slug}`);
  revalidatePath("/profile");
  return { success: true };
}

// In-app "Rate Guide" widget, next to Share Guide — reuses the same
// event_pack_feedback table the post-trip email flow writes to (single
// rating per user per event, upserted). Unlike the email flow's
// /api/pack-feedback route, this never sends a curator notification —
// that email exists to flag comments/testimonials for review, and this
// widget collects stars only, no comment field.
export async function rateEventPack(sportingEventId: string, slug: string, rating: number) {
  const { user } = await getAuthUser();
  if (!user?.email) return { error: "Not authenticated" };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Invalid rating" };
  }

  await db
    .insert(eventPackFeedback)
    .values({ email: user.email, sportingEventId, rating })
    .onConflictDoUpdate({
      target: [eventPackFeedback.email, eventPackFeedback.sportingEventId],
      set: { rating, updatedAt: new Date() },
    });

  revalidatePath(`/event-pack/${slug}`);
  return { success: true };
}

export async function getMyEventPackRating(sportingEventId: string): Promise<number | null> {
  const { user } = await getAuthUser();
  if (!user?.email) return null;

  const [row] = await db
    .select({ rating: eventPackFeedback.rating })
    .from(eventPackFeedback)
    .where(and(eq(eventPackFeedback.email, user.email), eq(eventPackFeedback.sportingEventId, sportingEventId)))
    .limit(1);
  return row?.rating ?? null;
}

export async function isEventPackSaved(sportingEventId: string): Promise<boolean> {
  const { user } = await getAuthUser();
  if (!user) return false;

  const [dbUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);
  if (!dbUser) return false;

  const [row] = await db
    .select({ id: savedEventPacks.id })
    .from(savedEventPacks)
    .where(
      and(
        eq(savedEventPacks.userId, dbUser.id),
        eq(savedEventPacks.sportingEventId, sportingEventId)
      )
    )
    .limit(1);
  return !!row;
}
