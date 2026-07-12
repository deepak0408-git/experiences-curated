"use server";

import { db } from "@/lib/db";
import { sportingEvents, proSubscriptions, experiences } from "@/schema/database";
import { eq, gte, asc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { algoliasearch } from "algoliasearch";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getEventsForSlotEditor() {
  const today = new Date().toISOString().split("T")[0];
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const sixMonthsAgoStr = sixMonthsAgo.toISOString().split("T")[0];

  // Includes events ended up to 6 months ago — they stay visible with a
  // locked "Deactivated" state (see isEditable in SlotEditorForm) rather
  // than disappearing the moment they end.
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
    .where(gte(sportingEvents.endDate, sixMonthsAgoStr))
    .orderBy(asc(sportingEvents.startDate));

  // Live/upcoming events float to top (soonest first); expired events sort
  // to the bottom, most-recently-ended first.
  return rows.sort((a, b) => {
    const aExpired = a.endDate < today;
    const bExpired = b.endDate < today;
    if (aExpired !== bExpired) return aExpired ? 1 : -1;
    if (aExpired && bExpired) return b.endDate.localeCompare(a.endDate);
    return a.startDate.localeCompare(b.startDate);
  });
}

export async function saveHomepageSlots(
  slots: { eventId: string; slot: string }[],
  hidden: { eventId: string; isHidden: boolean }[]
): Promise<{ success: true } | { error: string }> {
  // Detect newly-activated events (isHidden flipping false) before updating
  const currentStates = await db
    .select({ id: sportingEvents.id, isHidden: sportingEvents.isHidden, name: sportingEvents.name, slug: sportingEvents.slug })
    .from(sportingEvents)
    .where(eq(sportingEvents.isHidden, true));

  const currentlyHiddenIds = new Set(currentStates.map((e) => e.id));
  const newlyActivated = hidden
    .filter((h) => !h.isHidden && currentlyHiddenIds.has(h.eventId))
    .map((h) => currentStates.find((e) => e.id === h.eventId)!)
    .filter(Boolean);

  const newlyActivatedIds = new Set(newlyActivated.map((e) => e.id));

  // Any event whose isHidden flag actually changed (either direction) needs
  // its experiences' eventIsHidden facet updated in Algolia — otherwise search
  // keeps showing/hiding experiences based on stale state from the last full
  // sync-algolia.mjs run, independent of what /curator/events actually did.
  const changedEventIds = hidden
    .filter((h) => currentlyHiddenIds.has(h.eventId) !== h.isHidden)
    .map((h) => h.eventId);

  // Apply hidden flags first — hidden events cannot hold a slot
  for (const { eventId, isHidden } of hidden) {
    await db
      .update(sportingEvents)
      .set({
        isHidden,
        homepageSlot: isHidden ? null : undefined,
        // Stamp activation time — anchors the 2-day-later newsletter announcement
        ...(newlyActivatedIds.has(eventId) ? { activatedAt: new Date() } : {}),
      })
      .where(eq(sportingEvents.id, eventId));
  }

  const hiddenIds = new Set(hidden.filter((h) => h.isHidden).map((h) => h.eventId));

  const VALID_SLOTS = ["1", "2", "3", "4"];
  const withSlot = slots
    .filter((s) => VALID_SLOTS.includes(s.slot) && !hiddenIds.has(s.eventId))
    .map((s) => ({ eventId: s.eventId, slot: parseInt(s.slot, 10) as 1 | 2 | 3 | 4 }));

  for (const slotNum of [1, 2, 3, 4] as const) {
    const assigned = withSlot.filter((s) => s.slot === slotNum);
    if (assigned.length > 1) return { error: `More than one event assigned to slot ${slotNum}.` };
  }

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

  // Notify annual Pro subscribers about newly activated events — fire and forget
  if (newlyActivated.length > 0) {
    notifyProNewPack(newlyActivated).catch((e) => console.error("[pro-notify]", e));
  }

  // Keep Algolia's eventIsHidden facet in sync with the isHidden flag we just
  // set, so search reflects the new activation state immediately rather than
  // waiting for the next manual sync-algolia.mjs run.
  if (changedEventIds.length > 0) {
    syncAlgoliaEventVisibility(changedEventIds, hidden).catch((e) =>
      console.error("[algolia-visibility-sync]", e)
    );
  }

  return { success: true };
}

async function syncAlgoliaEventVisibility(
  changedEventIds: string[],
  hidden: { eventId: string; isHidden: boolean }[]
) {
  if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY || !process.env.ALGOLIA_EXPERIENCES_INDEX) {
    return;
  }

  const algolia = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
  const isHiddenByEventId = new Map(hidden.map((h) => [h.eventId, h.isHidden]));

  for (const eventId of changedEventIds) {
    const isHidden = isHiddenByEventId.get(eventId);
    if (isHidden === undefined) continue;

    const linkedExperiences = await db
      .select({ id: experiences.id })
      .from(experiences)
      .where(and(eq(experiences.sportingEventId, eventId), eq(experiences.status, "published")));

    if (linkedExperiences.length === 0) continue;

    await algolia.partialUpdateObjects({
      indexName: process.env.ALGOLIA_EXPERIENCES_INDEX!,
      objects: linkedExperiences.map((e) => ({ objectID: e.id, eventIsHidden: isHidden })),
    });
  }
}

async function notifyProNewPack(events: { id: string; name: string; slug: string }[]) {
  const subs = await db
    .select({ email: proSubscriptions.email, billingCycle: proSubscriptions.billingCycle })
    .from(proSubscriptions)
    .where(eq(proSubscriptions.status, "active"));

  if (subs.length === 0) return;

  const annualEmails = subs.filter((s) => s.billingCycle === "annual").map((s) => s.email);
  const monthlyEmails = subs.filter((s) => s.billingCycle === "monthly").map((s) => s.email);

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://experiences-curated.com";

  const sendBatch = async (emails: string[], html: string, subject: string) => {
    for (let i = 0; i < emails.length; i += 50) {
      await Promise.all(
        emails.slice(i, i + 50).map((to) =>
          resend.emails.send({
            from: "Experiences | Curated <hello@experiences-curated.com>",
            to,
            subject,
            html,
          })
        )
      );
    }
  };

  for (const event of events) {
    const packUrl = `${appUrl}/event-pack/${event.slug}`;
    const proUrl = `${appUrl}/pro`;

    if (annualEmails.length > 0) {
      const html = `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
          <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Pro Annual — Early Access</p>
          <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin:0 0 8px">New event pack just dropped</h1>
          <p style="font-size:16px;font-weight:900;color:#ffffff;margin:0 0 20px">${event.name}</p>
          <p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 24px">It's already in your library — your annual Pro membership includes every pack we publish. You're seeing this before anyone else.</p>
          <a href="${packUrl}" style="display:inline-block;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px">Open the pack →</a>
          <hr style="border:none;border-top:1px solid #2A2A2A;margin:32px 0 16px">
          <p style="font-size:11px;color:#6A6A6A">You're getting this because you're an annual Pro member.</p>
        </div>
      `;
      await sendBatch(annualEmails, html, `New Event Pack: ${event.name} — it's in your library`);
    }

    if (monthlyEmails.length > 0) {
      const html = `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
          <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Pro — New Pack</p>
          <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin:0 0 8px">New event pack just dropped</h1>
          <p style="font-size:16px;font-weight:900;color:#ffffff;margin:0 0 20px">${event.name}</p>
          <p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 16px">You can buy this pack now, or upgrade to an annual plan and get every pack we publish included — no separate purchase needed.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px">
            <a href="${packUrl}" style="display:inline-block;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px">Buy the pack →</a>
            <a href="${proUrl}" style="display:inline-block;padding:10px 20px;background:#1A1A1A;color:#AAFF00;font-size:13px;font-weight:700;text-decoration:none;border-radius:2px;border:1px solid #2A2A2A">Upgrade to annual →</a>
          </div>
          <hr style="border:none;border-top:1px solid #2A2A2A;margin:32px 0 16px">
          <p style="font-size:11px;color:#6A6A6A">You're getting this because you're a Pro member.</p>
        </div>
      `;
      await sendBatch(monthlyEmails, html, `New Event Pack: ${event.name} — buy it or upgrade`);
    }
  }
}
