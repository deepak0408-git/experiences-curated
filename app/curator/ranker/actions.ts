"use server";

import { db } from "@/lib/db";
import { sportingEvents, sportingEventExperiences, experiences } from "@/schema/database";
import { eq, and, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getEventsForRanker() {
  return db
    .select({ id: sportingEvents.id, name: sportingEvents.name, slug: sportingEvents.slug })
    .from(sportingEvents)
    .orderBy(asc(sportingEvents.startDate));
}

export async function getExperiencesForEvent(eventId: string) {
  const rows = await db
    .select({
      id: experiences.id,
      title: experiences.title,
      experienceType: experiences.experienceType,
      packRank: sportingEventExperiences.packRank,
      joinId: sportingEventExperiences.id,
    })
    .from(sportingEventExperiences)
    .innerJoin(experiences, eq(experiences.id, sportingEventExperiences.experienceId))
    .where(eq(sportingEventExperiences.sportingEventId, eventId))
    .orderBy(asc(sportingEventExperiences.packRank));

  return rows;
}

export type RankerExperience = Awaited<ReturnType<typeof getExperiencesForEvent>>[number];

export async function saveRanks(
  eventId: string,
  ranks: { experienceId: string; rank: string }[]
): Promise<{ success: true } | { error: string }> {
  // Filter to only rows where a rank was entered
  const withRank = ranks
    .filter((r) => r.rank.trim() !== "")
    .map((r) => ({ experienceId: r.experienceId, rank: parseInt(r.rank, 10) }))
    .filter((r) => !isNaN(r.rank));

  // Hard duplicate check
  const rankValues = withRank.map((r) => r.rank);
  const duplicates = rankValues.filter((v, i) => rankValues.indexOf(v) !== i);
  if (duplicates.length > 0) {
    return { error: `Duplicate rank${duplicates.length > 1 ? "s" : ""}: ${[...new Set(duplicates)].join(", ")}. Each experience must have a unique rank.` };
  }

  // Upsert ranks for experiences that have one
  for (const { experienceId, rank } of withRank) {
    await db
      .update(sportingEventExperiences)
      .set({ packRank: rank })
      .where(
        and(
          eq(sportingEventExperiences.sportingEventId, eventId),
          eq(sportingEventExperiences.experienceId, experienceId)
        )
      );
  }

  // Clear ranks for experiences where rank was left blank
  const withoutRank = ranks.filter((r) => r.rank.trim() === "");
  for (const { experienceId } of withoutRank) {
    await db
      .update(sportingEventExperiences)
      .set({ packRank: null })
      .where(
        and(
          eq(sportingEventExperiences.sportingEventId, eventId),
          eq(sportingEventExperiences.experienceId, experienceId)
        )
      );
  }

  revalidatePath("/curator/ranker");
  return { success: true };
}
