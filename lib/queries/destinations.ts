import { db } from "@/lib/db";
import { destinations, experiences } from "@/schema/database";
import { eq, and, desc } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function getDestinationBySlug(slug: string) {
  const results = await db
    .select()
    .from(destinations)
    .where(eq(destinations.slug, slug))
    .limit(1);

  if (!results.length) notFound();
  return results[0];
}

export type DestinationDetail = Awaited<ReturnType<typeof getDestinationBySlug>>;

export async function getDestinationExperiences(destinationId: string) {
  return db
    .select({
      id: experiences.id,
      slug: experiences.slug,
      title: experiences.title,
      subtitle: experiences.subtitle,
      experienceType: experiences.experienceType,
      budgetTier: experiences.budgetTier,
      heroImageUrl: experiences.heroImageUrl,
      heroImageAlt: experiences.heroImageAlt,
      pace: experiences.pace,
      neighborhood: experiences.neighborhood,
      availability: experiences.availability,
    })
    .from(experiences)
    .where(
      and(
        eq(experiences.destinationId, destinationId),
        eq(experiences.status, "published")
      )
    )
    .orderBy(desc(experiences.publishedAt));
}

export type DestinationExperience = Awaited<ReturnType<typeof getDestinationExperiences>>[number];
