import { db } from "@/lib/db";
import {
  sportingEvents,
  tennisTicketIntelligenceOptions,
  tennisTicketIntelligenceEditionStatus,
} from "@/schema/database";
import { and, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import type { TicketOption } from "./types";

// Tennis Ticket Intelligence data fetch — self-contained from F1's
// getSeatingData.ts (no shared import). Same 1-hour cache pattern as the
// rest of this app's Ticket Intelligence/Trip Intelligence data readers.
const getTennisDataCached = unstable_cache(
  async (slug: string) => getTennisDataUncached(slug),
  ["tennis-ticket-intelligence-data"],
  { revalidate: 3600 }
);

export async function getTennisOptionsData(slug: string) {
  return getTennisDataCached(slug);
}

async function getTennisDataUncached(slug: string) {
  const [event] = await db
    .select({
      id: sportingEvents.id,
      slug: sportingEvents.slug,
      name: sportingEvents.name,
      heroImageUrl: sportingEvents.heroImageUrl,
      sport: sportingEvents.sport,
      editionYear: sportingEvents.editionYear,
      packStatus: sportingEvents.packStatus,
      isHidden: sportingEvents.isHidden,
      destinationId: sportingEvents.destinationId,
      startDate: sportingEvents.startDate,
      endDate: sportingEvents.endDate,
    })
    .from(sportingEvents)
    .where(and(eq(sportingEvents.slug, slug), eq(sportingEvents.sport, "tennis")))
    .limit(1);

  if (!event) return null;

  const [editionStatus] = await db
    .select()
    .from(tennisTicketIntelligenceEditionStatus)
    .where(eq(tennisTicketIntelligenceEditionStatus.sportingEventId, event.id))
    .limit(1);

  // Fail-closed, per Stage 1/2 spec: both the edition match AND activation
  // AND catalogue ratification must hold before this is considered
  // publicly available. A caller (the page component) uses this flag to
  // decide whether to render results or a safe "not yet available" state
  // — never served based on data presence alone.
  const isPubliclyAvailable =
    !!editionStatus &&
    editionStatus.reviewedEditionYear === event.editionYear &&
    editionStatus.activatedAt !== null &&
    editionStatus.catalogueRatified === true;

  const rows = await db
    .select()
    .from(tennisTicketIntelligenceOptions)
    .where(eq(tennisTicketIntelligenceOptions.sportingEventId, event.id));

  const options: TicketOption[] = rows
    .map((r) => ({
      id: r.id,
      optionNumber: r.optionNumber,
      arenaCode: r.arenaCode,
      arenaName: r.arenaName,
      stageCode: r.stageCode,
      stageLabel: r.stageLabel,
      roundsLabel: r.roundsLabel,
      sessionCode: r.sessionCode,
      sessionLabel: r.sessionLabel,
      seatingCode: r.seatingCode,
      seatingLabel: r.seatingLabel,
      costIndex: Number(r.costIndex),
      costStars: r.costStars,
      descriptionText: r.descriptionText,
      heroImage: r.heroImage,
      stand: r.stand,
      eligibleFrom: r.eligibleFrom,
      eligibleTo: r.eligibleTo,
      c1LotsOfTennis: r.c1LotsOfTennis === null ? null : Number(r.c1LotsOfTennis),
      c1BigStadium: r.c1BigStadium === null ? null : Number(r.c1BigStadium),
      c1CloseUpCourts: r.c1CloseUpCourts === null ? null : Number(r.c1CloseUpCourts),
      c1BalancedExperience: r.c1BalancedExperience === null ? null : Number(r.c1BalancedExperience),
      c5CloseToAction: r.c5CloseToAction === null ? null : Number(r.c5CloseToAction),
      c5BalancedView: r.c5BalancedView === null ? null : Number(r.c5BalancedView),
      c5NoPreference: r.c5NoPreference === null ? null : Number(r.c5NoPreference),
      c5FlexibleExplore: r.c5FlexibleExplore === null ? null : Number(r.c5FlexibleExplore),
    }))
    .sort((a, b) => a.optionNumber - b.optionNumber);

  return { event, options, isPubliclyAvailable };
}

// Hub page's "Find your seat" card gate — mirrors isPubliclyAvailable above
// exactly (options exist AND activated AND ratified AND edition-year
// matched), but keyed by eventId directly since HubPage.tsx already has
// event.id/editionYear from getSpokeData and has no reason to re-look-up
// the event by slug. Fail-closed for the same reason as the quiz page
// itself: an event mid-build (seeded but not yet ratified/activated) must
// never surface a card that links to "Not available yet". Not a hardcoded
// per-slug Set — any tennis event lights this up automatically once its
// options are seeded and its edition is activated, same pattern as F1's
// hasTicketIntelligence (circuit_seating_profile row-existence), just with
// tennis's extra activation/ratification gate layered on top.
const hasTennisTicketIntelligenceCached = unstable_cache(
  async (eventId: string, editionYear: number) => {
    const [editionStatus] = await db
      .select()
      .from(tennisTicketIntelligenceEditionStatus)
      .where(eq(tennisTicketIntelligenceEditionStatus.sportingEventId, eventId))
      .limit(1);

    const isPubliclyAvailable =
      !!editionStatus &&
      editionStatus.reviewedEditionYear === editionYear &&
      editionStatus.activatedAt !== null &&
      editionStatus.catalogueRatified === true;

    if (!isPubliclyAvailable) return false;

    const [row] = await db
      .select({ id: tennisTicketIntelligenceOptions.id })
      .from(tennisTicketIntelligenceOptions)
      .where(eq(tennisTicketIntelligenceOptions.sportingEventId, eventId))
      .limit(1);

    return !!row;
  },
  ["tennis-ticket-intelligence-has-options"],
  { revalidate: 3600 }
);

export async function hasTennisTicketIntelligence(eventId: string, editionYear: number): Promise<boolean> {
  return hasTennisTicketIntelligenceCached(eventId, editionYear);
}
