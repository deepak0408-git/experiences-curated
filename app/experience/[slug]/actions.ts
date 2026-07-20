"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users, savedItems } from "@/schema/database";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getOrCreateDefaultBoard } from "@/lib/trip-boards";

async function getOrCreateDbUser(authId: string, email: string) {
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, authId))
    .limit(1);
  if (existing) return existing;

  // Race condition fix (20 Jul 2026): rapid-clicking "Save" across multiple
  // experience cards fires this concurrently per click, colliding on
  // users_email_unique before any insert commits. onConflictDoNothing
  // absorbs the loser inserts; the follow-up select recovers the row that
  // actually won. Same fix applied to app/trip-board/actions.ts.
  await db.insert(users).values({ email, authId }).onConflictDoNothing();

  const [created] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, authId))
    .limit(1);
  return created;
}

export async function saveExperience(experienceId: string, slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const dbUser = await getOrCreateDbUser(user.id, user.email!);
  const tripBoardId = await getOrCreateDefaultBoard(dbUser.id);
  await db
    .insert(savedItems)
    .values({ userId: dbUser.id, experienceId, tripBoardId })
    .onConflictDoNothing();

  revalidatePath(`/experience/${slug}`);
  return { success: true };
}

export async function unsaveExperience(experienceId: string, slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const [dbUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);
  if (!dbUser) return { error: "User not found" };

  await db
    .delete(savedItems)
    .where(
      and(
        eq(savedItems.userId, dbUser.id),
        eq(savedItems.experienceId, experienceId)
      )
    );

  revalidatePath(`/experience/${slug}`);
  return { success: true };
}
