"use server";

import { db } from "@/lib/db";
import { travelLogs, users, experiences } from "@/schema/database";
import { and, eq, ilike, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getDbUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const [dbUser] = await db.select({ id: users.id }).from(users).where(eq(users.authId, user.id)).limit(1);
  return dbUser ?? null;
}

export async function logVisit(data: {
  experienceId: string;
  visitedAt: string;
  rating: number;
  moodTags: string[];
}) {
  const dbUser = await getDbUser();
  if (!dbUser) return { error: "Not authenticated" };

  await db
    .insert(travelLogs)
    .values({
      userId: dbUser.id,
      experienceId: data.experienceId,
      visitedAt: data.visitedAt,
      rating: data.rating,
      moodTags: data.moodTags,
    })
    .onConflictDoUpdate({
      target: [travelLogs.userId, travelLogs.experienceId],
      set: {
        visitedAt: data.visitedAt,
        rating: data.rating,
        moodTags: data.moodTags,
        updatedAt: new Date(),
      },
    });

  // Return the full entry (with experience details) for optimistic update
  const [entry] = await db
    .select({
      id: travelLogs.id,
      experienceId: travelLogs.experienceId,
      visitedAt: travelLogs.visitedAt,
      rating: travelLogs.rating,
      moodTags: travelLogs.moodTags,
      title: experiences.title,
      slug: experiences.slug,
      heroImageUrl: experiences.heroImageUrl,
      experienceType: experiences.experienceType,
    })
    .from(travelLogs)
    .innerJoin(experiences, eq(travelLogs.experienceId, experiences.id))
    .where(and(eq(travelLogs.userId, dbUser.id), eq(travelLogs.experienceId, data.experienceId)))
    .limit(1);

  revalidatePath("/my-travels");
  revalidatePath(`/experience`);
  return { success: true, entry: { ...entry, visitedAt: entry.visitedAt.toString() } };
}

export async function deleteLog(experienceId: string) {
  const dbUser = await getDbUser();
  if (!dbUser) return { error: "Not authenticated" };

  await db
    .delete(travelLogs)
    .where(and(eq(travelLogs.userId, dbUser.id), eq(travelLogs.experienceId, experienceId)));

  revalidatePath("/my-travels");
  return { success: true };
}

export async function searchExperiences(query: string) {
  if (!query.trim()) return [];
  const results = await db
    .select({ id: experiences.id, title: experiences.title, experienceType: experiences.experienceType, slug: experiences.slug })
    .from(experiences)
    .where(and(eq(experiences.status, "published"), ilike(experiences.title, `%${query}%`)))
    .limit(8);
  return results;
}
