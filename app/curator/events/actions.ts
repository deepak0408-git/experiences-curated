"use server";

import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";
import { eq, gte, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getEventsForSlotEditor() {
  return db
    .select({
      id: sportingEvents.id,
      name: sportingEvents.name,
      slug: sportingEvents.slug,
      sport: sportingEvents.sport,
      startDate: sportingEvents.startDate,
      endDate: sportingEvents.endDate,
      homepageSlot: sportingEvents.homepageSlot,
    })
    .from(sportingEvents)
    .where(gte(sportingEvents.endDate, new Date().toISOString().split("T")[0]))
    .orderBy(asc(sportingEvents.startDate));
}

export async function saveHomepageSlots(
  slots: { eventId: string; slot: string }[]
): Promise<{ success: true } | { error: string }> {
  const withSlot = slots
    .filter((s) => s.slot === "1" || s.slot === "2")
    .map((s) => ({ eventId: s.eventId, slot: parseInt(s.slot, 10) as 1 | 2 }));

  const slot1 = withSlot.filter((s) => s.slot === 1);
  const slot2 = withSlot.filter((s) => s.slot === 2);
  if (slot1.length > 1) return { error: "More than one event assigned to slot 1." };
  if (slot2.length > 1) return { error: "More than one event assigned to slot 2." };

  // Clear all slots then set chosen ones
  await db.update(sportingEvents).set({ homepageSlot: null });
  for (const { eventId, slot } of withSlot) {
    await db
      .update(sportingEvents)
      .set({ homepageSlot: slot })
      .where(eq(sportingEvents.id, eventId));
  }

  revalidatePath("/curator/events");
  revalidatePath("/");
  return { success: true };
}
