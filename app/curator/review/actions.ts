"use server";

import { db } from "@/lib/db";
import { experiences } from "@/schema/database";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { indexExperience, removeFromIndex } from "@/lib/algolia";

export async function getAllExperiencesForReview() {
  return db
    .select({
      id: experiences.id,
      title: experiences.title,
      slug: experiences.slug,
      status: experiences.status,
      experienceType: experiences.experienceType,
      availability: experiences.availability,
      curationTier: experiences.curationTier,
      createdAt: experiences.createdAt,
      updatedAt: experiences.updatedAt,
      publishedAt: experiences.publishedAt,
      bodyContent: experiences.bodyContent,
      whyItsSpecial: experiences.whyItsSpecial,
      reviewNotes: experiences.reviewNotes,
    })
    .from(experiences)
    .orderBy(desc(experiences.updatedAt));
}

export async function publishExperience(id: string) {
  await db
    .update(experiences)
    .set({ status: "published", publishedAt: new Date() })
    .where(eq(experiences.id, id));
  await indexExperience(id);
  revalidatePath("/curator/review");
}

export async function archiveExperience(id: string) {
  await db
    .update(experiences)
    .set({ status: "archived" })
    .where(eq(experiences.id, id));
  await removeFromIndex(id);
  revalidatePath("/curator/review");
}

export async function unpublishExperience(id: string) {
  await db
    .update(experiences)
    .set({ status: "draft", publishedAt: null, reviewNotes: null })
    .where(eq(experiences.id, id));
  await removeFromIndex(id);
  revalidatePath("/curator/review");
}

export async function returnToDraft(id: string, notes: string) {
  await db
    .update(experiences)
    .set({ status: "draft", reviewNotes: notes.trim() || null })
    .where(eq(experiences.id, id));
  revalidatePath("/curator/review");
}

export async function submitForReview(id: string) {
  await db
    .update(experiences)
    .set({ status: "in_review", reviewNotes: null })
    .where(eq(experiences.id, id));
  revalidatePath("/curator/review");
}
