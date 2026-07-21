"use server";

import { db } from "@/lib/db";
import { savedItems, users, tripBoards } from "@/schema/database";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateDefaultBoard, createBoard, getBoardCount } from "@/lib/trip-boards";
import { hasProSubscription } from "@/lib/pro";

export async function removeSavedItem(savedItemId: string, experienceSlug: string) {
  await db.delete(savedItems).where(eq(savedItems.id, savedItemId));
  revalidatePath("/trip-board");
  revalidatePath(`/experience/${experienceSlug}`);
}

export async function updateSavedItemStatus(
  savedItemId: string,
  status: "to_do" | "booked" | "done"
) {
  await db.update(savedItems).set({ status }).where(eq(savedItems.id, savedItemId));
  revalidatePath("/trip-board");
}

export async function updateSavedItemNotes(savedItemId: string, notes: string) {
  await db
    .update(savedItems)
    .set({ notes: notes.trim() || null })
    .where(eq(savedItems.id, savedItemId));
  revalidatePath("/trip-board");
}

export async function removeSavedItemByExperienceId(experienceId: string) {
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
    .where(and(eq(savedItems.userId, dbUser.id), eq(savedItems.experienceId, experienceId)));

  revalidatePath("/trip-board");
  return { success: true };
}

export async function addExperiencesToBoard(experienceIds: string[], boardId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  let [dbUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);

  if (!dbUser) {
    // Race condition fix (20 Jul 2026): rapid-clicking "Save to Trip Board"
    // across multiple experience cards fires this action concurrently per
    // click. Multiple invocations can all pass the SELECT above before any
    // INSERT commits, then collide on users_email_unique. onConflictDoNothing
    // absorbs the loser inserts; the follow-up SELECT recovers the row that
    // actually won, same pattern already used for savedItems below.
    await db
      .insert(users)
      .values({ email: user.email!, authId: user.id })
      .onConflictDoNothing();

    [dbUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.authId, user.id))
      .limit(1);

    if (!dbUser) {
      // Fix (21 Jul 2026): the conflict above can also come from a row
      // created earlier by email alone (e.g. grantFreeAccess or a webhook)
      // with authId still NULL — onConflictDoNothing no-ops on the email
      // collision, so the authId-based SELECT above finds nothing. Recover
      // by email instead and backfill authId now that this person has
      // actually signed in.
      [dbUser] = await db
        .update(users)
        .set({ authId: user.id })
        .where(eq(users.email, user.email!))
        .returning({ id: users.id });
    }
  }

  const tripBoardId = boardId ?? await getOrCreateDefaultBoard(dbUser.id);

  for (const experienceId of experienceIds) {
    await db
      .insert(savedItems)
      .values({ userId: dbUser.id, experienceId, tripBoardId })
      .onConflictDoNothing();
  }

  revalidatePath("/trip-board");
  return { success: true, count: experienceIds.length };
}

export async function renameBoard(boardId: string, title: string) {
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
    .update(tripBoards)
    .set({ title: title.trim() })
    .where(and(eq(tripBoards.id, boardId), eq(tripBoards.userId, dbUser.id)));

  revalidatePath("/trip-board");
  return { success: true };
}

export async function moveItemToBoard(savedItemId: string, targetBoardId: string) {
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
    .update(savedItems)
    .set({ tripBoardId: targetBoardId })
    .where(and(eq(savedItems.id, savedItemId), eq(savedItems.userId, dbUser.id)));

  revalidatePath("/trip-board");
  return { success: true };
}

export async function deleteBoard(boardId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const [dbUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);
  if (!dbUser) return { error: "User not found" };

  // Verify the board belongs to this user and is not their only board
  const userBoards = await db
    .select({ id: tripBoards.id })
    .from(tripBoards)
    .where(eq(tripBoards.userId, dbUser.id));

  if (userBoards.length <= 1) return { error: "Cannot delete your only board" };
  if (!userBoards.find((b) => b.id === boardId)) return { error: "Board not found" };

  // Delete saved items on this board, then the board itself
  await db.delete(savedItems).where(eq(savedItems.tripBoardId, boardId));
  await db.delete(tripBoards).where(eq(tripBoards.id, boardId));

  revalidatePath("/trip-board");
  return { success: true };
}

export async function createNewBoard(title: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const [dbUser] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);
  if (!dbUser) return { error: "User not found" };

  const isPro = dbUser.email ? await hasProSubscription(dbUser.email) : false;
  if (!isPro) {
    const count = await getBoardCount(dbUser.id);
    if (count >= 1) return { error: "upgrade_required" };
  }

  const boardId = await createBoard(dbUser.id, title.trim());
  revalidatePath("/trip-board");
  return { success: true, boardId };
}
