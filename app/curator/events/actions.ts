"use server";

import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";
import { eq, gte, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getEventsForSlotEditor() {
  const today = new Date().toISOString().split("T")[0];

  const rows = await db
    .select({
      id: sportingEvents.id,
      name: sportingEvents.name,
      slug: sportingEvents.slug,
      sport: sportingEvents.sport,
      startDate: sportingEvents.startDate,
      endDate: sportingEvents.endDate,
      homepageSlot: sportingEvents.homepageSlot,
      isHidden: sportingEvents.isHidden,
    })
    .from(sportingEvents)
    .where(gte(sportingEvents.endDate, today))
    .orderBy(asc(sportingEvents.startDate));

  // Live events (started, not yet ended) float to top; upcoming sorted by start date below
  return rows.sort((a, b) => {
    const aLive = a.startDate <= today ? 0 : 1;
    const bLive = b.startDate <= today ? 0 : 1;
    if (aLive !== bLive) return aLive - bLive;
    return a.startDate.localeCompare(b.startDate);
  });
}

export async function saveHomepageSlots(
  slots: { eventId: string; slot: string }[],
  hidden: { eventId: string; isHidden: boolean }[]
): Promise<{ success: true } | { error: string }> {
  // Apply hidden flags first — hidden events cannot hold a slot
  for (const { eventId, isHidden } of hidden) {
    await db
      .update(sportingEvents)
      .set({ isHidden, homepageSlot: isHidden ? null : undefined })
      .where(eq(sportingEvents.id, eventId));
  }

  const hiddenIds = new Set(hidden.filter((h) => h.isHidden).map((h) => h.eventId));

  const withSlot = slots
    .filter((s) => (s.slot === "1" || s.slot === "2") && !hiddenIds.has(s.eventId))
    .map((s) => ({ eventId: s.eventId, slot: parseInt(s.slot, 10) as 1 | 2 }));

  const slot1 = withSlot.filter((s) => s.slot === 1);
  const slot2 = withSlot.filter((s) => s.slot === 2);
  if (slot1.length > 1) return { error: "More than one event assigned to slot 1." };
  if (slot2.length > 1) return { error: "More than one event assigned to slot 2." };

  // Clear all slots then set chosen ones (skipping hidden events — already nulled above)
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
