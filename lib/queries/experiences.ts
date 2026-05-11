import { db } from "@/lib/db";
import { experiences, destinations, curators } from "@/schema/database";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function getExperienceBySlug(slug: string) {
  const results = await db
    .select({
      // Experience
      id: experiences.id,
      title: experiences.title,
      subtitle: experiences.subtitle,
      slug: experiences.slug,
      experienceType: experiences.experienceType,
      status: experiences.status,
      neighborhood: experiences.neighborhood,
      address: experiences.address,
      heroImageUrl: experiences.heroImageUrl,
      heroImageAlt: experiences.heroImageAlt,
      heroImageCredit: experiences.heroImageCredit,
      bodyContent: experiences.bodyContent,
      whyItsSpecial: experiences.whyItsSpecial,
      insiderTips: experiences.insiderTips,
      whatToAvoid: experiences.whatToAvoid,
      editorialNote: experiences.editorialNote,
      practicalInfo: experiences.practicalInfo,
      gettingThere: experiences.gettingThere,
      moodTags: experiences.moodTags,
      interestCategories: experiences.interestCategories,
      pace: experiences.pace,
      physicalIntensity: experiences.physicalIntensity,
      budgetTier: experiences.budgetTier,
      budgetCurrency: experiences.budgetCurrency,
      budgetMinCost: experiences.budgetMinCost,
      budgetMaxCost: experiences.budgetMaxCost,
      bestSeasons: experiences.bestSeasons,
      advanceBookingRequired: experiences.advanceBookingRequired,
      bookingLinks: experiences.bookingLinks,
      sportingEventId: experiences.sportingEventId,
      availability: experiences.availability,
      curationTier: experiences.curationTier,
      saveCount: experiences.saveCount,
      publishedAt: experiences.publishedAt,
      // Destination
      destinationId: destinations.id,
      destinationName: destinations.name,
      destinationCountry: destinations.countryCode,
      // Curator
      curatorId: curators.id,
      curatorName: curators.name,
      curatorSlug: curators.slug,
      curatorBio: curators.bio,
      curatorImage: curators.profileImageUrl,
    })
    .from(experiences)
    .innerJoin(destinations, eq(experiences.destinationId, destinations.id))
    .leftJoin(curators, eq(experiences.primaryCuratorId, curators.id))
    .where(eq(experiences.slug, slug))
    .limit(1);

  if (!results.length) notFound();
  return results[0];
}

export type ExperienceDetail = Awaited<ReturnType<typeof getExperienceBySlug>>;

export async function getExperienceForEdit(id: string) {
  const results = await db
    .select({
      id: experiences.id,
      title: experiences.title,
      subtitle: experiences.subtitle,
      slug: experiences.slug,
      status: experiences.status,
      experienceType: experiences.experienceType,
      destinationId: experiences.destinationId,
      neighborhood: experiences.neighborhood,
      address: experiences.address,
      heroImageUrl: experiences.heroImageUrl,
      heroImageAlt: experiences.heroImageAlt,
      heroImageCredit: experiences.heroImageCredit,
      bodyContent: experiences.bodyContent,
      whyItsSpecial: experiences.whyItsSpecial,
      insiderTips: experiences.insiderTips,
      whatToAvoid: experiences.whatToAvoid,
      editorialNote: experiences.editorialNote,
      practicalInfo: experiences.practicalInfo,
      gettingThere: experiences.gettingThere,
      moodTags: experiences.moodTags,
      interestCategories: experiences.interestCategories,
      pace: experiences.pace,
      physicalIntensity: experiences.physicalIntensity,
      budgetTier: experiences.budgetTier,
      budgetCurrency: experiences.budgetCurrency,
      budgetMinCost: experiences.budgetMinCost,
      budgetMaxCost: experiences.budgetMaxCost,
      bestSeasons: experiences.bestSeasons,
      advanceBookingRequired: experiences.advanceBookingRequired,
      advanceBookingDays: experiences.advanceBookingDays,
      sportingEventId: experiences.sportingEventId,
      availability: experiences.availability,
    })
    .from(experiences)
    .where(eq(experiences.id, id))
    .limit(1);

  if (!results.length) notFound();
  return results[0];
}

export type ExperienceForEdit = Awaited<ReturnType<typeof getExperienceForEdit>>;
