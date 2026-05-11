import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { savedItems, users } from "@/schema/database";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

async function getDbUserId(authId: string) {
  const [dbUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, authId))
    .limit(1);
  return dbUser?.id ?? null;
}

// PATCH — set or update schedule for a saved item
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = await getDbUserId(user.id);
  if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { savedItemId, scheduledAt, durationMinutes } = await request.json();

  await db
    .update(savedItems)
    .set({ scheduledAt: new Date(scheduledAt), durationMinutes })
    .where(and(eq(savedItems.id, savedItemId), eq(savedItems.userId, userId)));

  return NextResponse.json({ ok: true });
}

// DELETE — remove schedule from a saved item
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = await getDbUserId(user.id);
  if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { savedItemId } = await request.json();

  await db
    .update(savedItems)
    .set({ scheduledAt: null, durationMinutes: null })
    .where(and(eq(savedItems.id, savedItemId), eq(savedItems.userId, userId)));

  return NextResponse.json({ ok: true });
}
