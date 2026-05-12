"use server";

import { db } from "@/lib/db";
import { experiences, destinations } from "@/schema/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ExperienceFormData = {
  // Identity
  title: string;
  subtitle: string;
  experienceType: string;
  destinationId: string;
  neighborhood: string;
  address: string;
  // Editorial
  bodyContent: string;
  whyItsSpecial: string;
  insiderTips: string[];
  whatToAvoid: string;
  editorialNote: string;
  // Practical
  hours: string;
  costRange: string;
  bookingMethod: string;
  howToBook: string;
  reservationsRequired: boolean;
  website: string;
  gettingThere: string;
  // Discovery
  moodTags: string[];
  interestCategories: string[];
  pace: string;
  physicalIntensity: number;
  budgetTier: string;
  budgetCurrency: string;
  budgetMinCost: string;
  budgetMaxCost: string;
  bestSeasons: string[];
  advanceBookingRequired: boolean;
  advanceBookingDays: string;
  // Sports
  sportingEventId: string;
  availability: string;
  // Media
  heroImageUrl: string;
  heroImageAlt: string;
  heroImageCredit: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveDraft(data: ExperienceFormData) {
  const slug = slugify(data.title) + "-" + Date.now().toString(36);

  const [experience] = await db
    .insert(experiences)
    .values({
      title: data.title,
      subtitle: data.subtitle || null,
      slug,
      experienceType: data.experienceType as any,
      status: "draft",
      destinationId: data.destinationId,
      neighborhood: data.neighborhood || null,
      address: data.address || null,
      heroImageUrl: data.heroImageUrl || null,
      heroImageAlt: data.heroImageAlt || null,
      heroImageCredit: data.heroImageCredit || null,
      bodyContent: data.bodyContent || null,
      whyItsSpecial: data.whyItsSpecial || null,
      insiderTips: data.insiderTips.filter(Boolean),
      whatToAvoid: data.whatToAvoid || null,
      editorialNote: data.editorialNote || null,
      practicalInfo: {
        hours: data.hours,
        costRange: data.costRange,
        bookingMethod: data.bookingMethod,
        howToBook: data.howToBook || undefined,
        reservationsRequired: data.reservationsRequired,
        website: data.website,
      },
      gettingThere: data.gettingThere || null,
      moodTags: data.moodTags,
      interestCategories: data.interestCategories,
      pace: (data.pace as any) || null,
      physicalIntensity: data.physicalIntensity || null,
      budgetTier: (data.budgetTier as any) || null,
      budgetCurrency: data.budgetCurrency || null,
      budgetMinCost: data.budgetMinCost || null,
      budgetMaxCost: data.budgetMaxCost || null,
      bestSeasons: data.bestSeasons,
      advanceBookingRequired: data.advanceBookingRequired,
      advanceBookingDays: data.advanceBookingDays
        ? parseInt(data.advanceBookingDays)
        : null,
      sportingEventId: data.sportingEventId || null,
      availability: (data.availability as any) || "perennial",
      curationTier: "editorial",
    })
    .returning({ id: experiences.id, slug: experiences.slug });

  revalidatePath("/curator");
  return { success: true, id: experience.id, slug: experience.slug };
}

export async function updateDraft(id: string, data: ExperienceFormData) {
  await db
    .update(experiences)
    .set({
      title: data.title,
      subtitle: data.subtitle || null,
      experienceType: data.experienceType as any,
      destinationId: data.destinationId,
      neighborhood: data.neighborhood || null,
      address: data.address || null,
      heroImageUrl: data.heroImageUrl || null,
      heroImageAlt: data.heroImageAlt || null,
      heroImageCredit: data.heroImageCredit || null,
      bodyContent: data.bodyContent || null,
      whyItsSpecial: data.whyItsSpecial || null,
      insiderTips: data.insiderTips.filter(Boolean),
      whatToAvoid: data.whatToAvoid || null,
      editorialNote: data.editorialNote || null,
      practicalInfo: {
        hours: data.hours,
        costRange: data.costRange,
        bookingMethod: data.bookingMethod,
        howToBook: data.howToBook || undefined,
        reservationsRequired: data.reservationsRequired,
        website: data.website,
      },
      gettingThere: data.gettingThere || null,
      moodTags: data.moodTags,
      interestCategories: data.interestCategories,
      pace: (data.pace as any) || null,
      physicalIntensity: data.physicalIntensity || null,
      budgetTier: (data.budgetTier as any) || null,
      budgetCurrency: data.budgetCurrency || null,
      budgetMinCost: data.budgetMinCost || null,
      budgetMaxCost: data.budgetMaxCost || null,
      bestSeasons: data.bestSeasons,
      advanceBookingRequired: data.advanceBookingRequired,
      advanceBookingDays: data.advanceBookingDays ? parseInt(data.advanceBookingDays) : null,
      sportingEventId: data.sportingEventId || null,
      availability: (data.availability as any) || "perennial",
      updatedAt: new Date(),
    })
    .where(eq(experiences.id, id));

  revalidatePath("/curator/review");
  revalidatePath("/curator/submit/" + id);
  return { success: true, id };
}

export async function submitForReview(experienceId: string) {
  await db
    .update(experiences)
    .set({ status: "in_review" })
    .where(eq(experiences.id, experienceId));

  revalidatePath("/curator");
  return { success: true };
}

export async function getDestinations() {
  return db
    .select({ id: destinations.id, name: destinations.name, countryCode: destinations.countryCode })
    .from(destinations)
    .orderBy(destinations.name);
}

export async function createDestination(name: string, countryCode: string) {
  const slug = slugify(name) + "-" + countryCode.toLowerCase();
  const [dest] = await db
    .insert(destinations)
    .values({ name, slug, countryCode })
    .returning({ id: destinations.id, name: destinations.name });
  return dest;
}
