import { db } from "@/lib/db";
import { tripBoards, savedItems } from "@/schema/database";
import { eq, and, isNull, count } from "drizzle-orm";

export async function getOrCreateDefaultBoard(userId: string): Promise<string> {
  // Return existing default board if present
  const [existing] = await db
    .select({ id: tripBoards.id })
    .from(tripBoards)
    .where(eq(tripBoards.userId, userId))
    .orderBy(tripBoards.createdAt)
    .limit(1);

  if (existing) {
    // Backfill any orphaned saves (tripBoardId = NULL) to this board
    await db
      .update(savedItems)
      .set({ tripBoardId: existing.id })
      .where(and(eq(savedItems.userId, userId), isNull(savedItems.tripBoardId)));
    return existing.id;
  }

  // Create default board
  const [board] = await db
    .insert(tripBoards)
    .values({ userId, title: "My Trip Board", slug: "my-trip-board" })
    .returning({ id: tripBoards.id });

  // Backfill any existing saves
  await db
    .update(savedItems)
    .set({ tripBoardId: board.id })
    .where(and(eq(savedItems.userId, userId), isNull(savedItems.tripBoardId)));

  return board.id;
}

export async function getUserBoards(userId: string) {
  return db
    .select({
      id: tripBoards.id,
      title: tripBoards.title,
      createdAt: tripBoards.createdAt,
    })
    .from(tripBoards)
    .where(eq(tripBoards.userId, userId))
    .orderBy(tripBoards.createdAt);
}

export async function getBoardCount(userId: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(tripBoards)
    .where(eq(tripBoards.userId, userId));
  return Number(row?.count ?? 0);
}

export async function createBoard(userId: string, title: string): Promise<string> {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const [board] = await db
    .insert(tripBoards)
    .values({ userId, title: title.trim(), slug: slug || "board" })
    .returning({ id: tripBoards.id });
  return board.id;
}
