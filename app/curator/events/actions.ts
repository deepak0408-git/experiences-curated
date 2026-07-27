"use server";

import { db } from "@/lib/db";
import { sportingEvents, proSubscriptions, experiences } from "@/schema/database";
import { eq, gte, asc, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { algoliasearch } from "algoliasearch";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

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

  // Apply hidden flags — batched into a single UPDATE...FROM(VALUES) instead
  // of one awaited round-trip per row. The previous per-row loop (plus the
  // matching per-row slot-assignment loop below) meant a ~14-row page paid
  // ~15-20+ sequential DB round-trips before the save could resolve —
  // measured live as a save that never finished. Same root cause and fix
  // shape as the Planner's getPlannerEvents.ts N+1 batching (26 Jul 2026).
  // activatedAt is carried per-row through the VALUES list (NULL for rows
  // that don't need it) rather than dropped, since it must only stamp for
  // events that are newly activated in this exact call.
  //
  // Only rows whose isHidden actually changed (changedEventIds, computed
  // above) go into the batch — reusing changedEventIds rather than the raw
  // `hidden` array. This is NOT just an optimization: a handful of
  // long-live events (Belgian GP, India in England, Wimbledon, The Open —
  // all activated before the DB's activation-guard trigger existed) have
  // isHidden=false with a genuinely NULL activatedAt. The guard trigger
  // rejects any statement whose NEW row has is_hidden=false AND
  // activated_at IS NULL — and it evaluates every row in the batch, not
  // just the ones that changed, so including these untouched rows made the
  // ENTIRE batched save fail with a 500 (caught live 27 Jul 2026, blocking
  // an unrelated BMW PGA homepage-slot change). Backfilling activatedAt for
  // those 4 events is a separate, deliberate follow-up — see
  // Operations Checklist. This scoping fix alone unblocks saves that don't
  // touch those events, with zero data writes and zero email risk (no
  // notifyProNewPack/newsletter-cron code path is reachable from here).
  const hiddenToUpdate = hidden.filter((h) => changedEventIds.includes(h.eventId));
  if (hiddenToUpdate.length > 0) {
    const hiddenValues = hiddenToUpdate.map(
      (h) =>
        sql`(${h.eventId}::uuid, ${h.isHidden}::boolean, ${
          newlyActivatedIds.has(h.eventId) ? new Date().toISOString() : null
        }::timestamptz)`
    );
    await db.execute(sql`
      UPDATE sporting_events AS se
      SET
        is_hidden = v.is_hidden,
        homepage_slot = CASE WHEN v.is_hidden THEN NULL ELSE se.homepage_slot END,
        activated_at = COALESCE(v.activated_at, se.activated_at)
      FROM (VALUES ${sql.join(hiddenValues, sql`, `)}) AS v(id, is_hidden, activated_at)
      WHERE se.id = v.id
    `);
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

  // Clear all slots, then set the chosen ones in a single batched UPDATE
  // (skipping hidden events — already nulled above).
  //
  // Both statements below exclude rows where is_hidden=false AND
  // activated_at IS NULL. Root cause (full RCA 27 Jul 2026): a handful of
  // events activated before the DB's guard_sporting_events_activation
  // trigger existed (Belgian GP, India in England, Wimbledon, The Open)
  // have is_hidden=false with a genuinely NULL activated_at. That trigger
  // fires on ANY UPDATE touching such a row — regardless of which columns
  // are in the SET clause, regardless of a WHERE id=X filter — because
  // Postgres row-level triggers evaluate the full NEW row. The original
  // unconditional `db.update(sportingEvents).set({ homepageSlot: null })`
  // touched every row including these 4, so the whole save 500'd even when
  // the intent was only to change an unrelated event's slot (caught live
  // 27 Jul 2026, blocking a BMW PGA Championship slot change). This WHERE
  // clause is a pure code-level workaround — it does not fix the
  // underlying data gap. Backfilling activated_at for those events is a
  // separate, deliberate follow-up (see Operations Checklist) that must
  // never set it to NOW() or anything that could make
  // newsletter-new-pack-announcement's cron treat them as freshly
  // activated.
  await db.execute(sql`
    UPDATE sporting_events
    SET homepage_slot = NULL
    WHERE NOT (is_hidden = false AND activated_at IS NULL)
  `);
  if (withSlot.length > 0) {
    const slotValues = withSlot.map((s) => sql`(${s.eventId}::uuid, ${s.slot}::int)`);
    await db.execute(sql`
      UPDATE sporting_events AS se
      SET homepage_slot = v.slot
      FROM (VALUES ${sql.join(slotValues, sql`, `)}) AS v(id, slot)
      WHERE se.id = v.id
        AND NOT (se.is_hidden = false AND se.activated_at IS NULL)
    `);
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
      // Annual Pro already has access to every pack — send a per-recipient
      // magic link straight into the authenticated pack view instead of a
      // plain URL. Without this, a logged-out subscriber who clicks the plain
      // link lands on the paid landing page (no session = no way to know
      // they're covered) and has to sign in separately, then re-find the
      // pack — 5+ steps for someone who already has access. Same
      // generateLink + /auth/confirm pattern as the post-trip-feedback cron.
      // Fixed 14 Jul 2026 after the user hit this confusion firsthand on the
      // Italian GP activation email.
      const buildHtml = (openUrl: string) => `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
          <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Pro Annual — Early Access</p>
          <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin:0 0 8px">New event pack just dropped</h1>
          <p style="font-size:16px;font-weight:900;color:#ffffff;margin:0 0 20px">${event.name}</p>
          <p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 24px">It's already in your library — your annual Pro membership includes every pack we publish. You're seeing this before anyone else.</p>
          <a href="${openUrl}" style="display:inline-block;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px">Open the pack →</a>
          <hr style="border:none;border-top:1px solid #2A2A2A;margin:32px 0 16px">
          <p style="font-size:11px;color:#6A6A6A">You're getting this because you're an annual Pro member. This link signs you in automatically.</p>
        </div>
      `;
      const subject = `New Event Pack: ${event.name} — it's in your library`;

      for (let i = 0; i < annualEmails.length; i += 50) {
        await Promise.all(
          annualEmails.slice(i, i + 50).map(async (to) => {
            const { data, error } = await supabaseAdmin.auth.admin.generateLink({
              type: "magiclink",
              email: to,
              options: { redirectTo: `${appUrl}/auth/confirm?next=/event-pack/${event.slug}` },
            });
            const openUrl = !error && data?.properties?.action_link ? data.properties.action_link : packUrl;
            if (error) console.error("[pro-notify] magic link failed for", to, error);
            await resend.emails.send({
              from: "Experiences | Curated <hello@experiences-curated.com>",
              to,
              subject,
              html: buildHtml(openUrl),
            });
          })
        );
      }
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
