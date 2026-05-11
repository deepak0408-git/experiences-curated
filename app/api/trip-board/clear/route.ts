import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { savedItems, users } from "@/schema/database";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { boardId } = await request.json();
  if (!boardId) {
    return NextResponse.json({ error: "boardId required" }, { status: 400 });
  }

  const [dbUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, authUser.id))
    .limit(1);

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await db
    .delete(savedItems)
    .where(and(eq(savedItems.userId, dbUser.id), eq(savedItems.tripBoardId, boardId)));

  return NextResponse.json({ cleared: true });
}
