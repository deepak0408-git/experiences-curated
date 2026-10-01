"use server";

import { db } from "@/lib/db";
import { destinations } from "@/schema/database";
import { eq, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createDestination(formData: FormData) {
  const name = formData.get("name") as string;
  const countryCode = (formData.get("countryCode") as string).toUpperCase();
  const region = formData.get("region") as string;
  const destinationType = formData.get("destinationType") as string;
  const currency = formData.get("currency") as string;
  const language = formData.get("language") as string;
  const editorialOverview = formData.get("editorialOverview") as string;
  const timezone = formData.get("timezone") as string;

  const slug = slugify(name) + "-" + countryCode.toLowerCase();

  await db.insert(destinations).values({
    name,
    slug,
    countryCode,
    region: region || null,
    destinationType: (destinationType as any) || "city",
    currency: currency || null,
    language: language || null,
    timezone: timezone || null,
    editorialOverview: editorialOverview || null,
  });

  redirect("/curator/destinations");
}

export async function getAllDestinations() {
  return db
    .select({
      id: destinations.id,
      name: destinations.name,
      countryCode: destinations.countryCode,
      region: destinations.region,
      destinationType: destinations.destinationType,
      currency: destinations.currency,
    })
    .from(destinations)
    .orderBy(destinations.name);
}

// Homepage "Browse by Destination" slot editor — mirrors the shape of
// sportingEvents.homepageSlot / saveHomepageSlots in app/curator/events,
// but without that action's isHidden/packStatus complexity, since
// destinations have no equivalent lifecycle gate.
export async function getDestinationsForSlotEditor() {
  return db
    .select({
      id: destinations.id,
      name: destinations.name,
      countryCode: destinations.countryCode,
      homepageSlot: destinations.homepageSlot,
    })
    .from(destinations)
    .orderBy(asc(destinations.name));
}

export async function saveDestinationHomepageSlots(
  slots: { destinationId: string; slot: string }[]
): Promise<{ success: true } | { error: string }> {
  const bySlot = new Map<string, string[]>();
  for (const { destinationId, slot } of slots) {
    if (!slot) continue;
    if (!bySlot.has(slot)) bySlot.set(slot, []);
    bySlot.get(slot)!.push(destinationId);
  }
  for (const [slot, ids] of bySlot) {
    if (ids.length > 1) {
      return { error: `Slot ${slot} is assigned to more than one destination.` };
    }
  }

  for (const { destinationId, slot } of slots) {
    await db
      .update(destinations)
      .set({ homepageSlot: slot ? Number(slot) : null, updatedAt: new Date() })
      .where(eq(destinations.id, destinationId));
  }

  revalidatePath("/");
  revalidatePath("/curator/destinations");
  return { success: true };
}
