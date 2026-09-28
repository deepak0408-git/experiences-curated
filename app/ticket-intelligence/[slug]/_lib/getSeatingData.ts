import { db } from "@/lib/db";
import { sportingEvents, circuitSeatingProfile, plannerTicketTierCost, plannerHotelTierCost, plannerFlightCost, plannerDestinationBands, experiences, sportingEventExperiences } from "@/schema/database";
import { and, eq, gte, ilike, inArray, or, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import type { Seat } from "./types";

// Ticket Intelligence data fetch — slug-driven, one event at a time (pilot:
// brazilian-grand-prix). Joins circuit_seating_profile with its priced
// tier band (nullable — some hospitality seats are ordinal-only, see
// scripts/seed-brazilian-gp-circuit-seating.mjs). Cached per-slug, same
// 1-hour revalidate pattern as getSpokeData.ts — this data changes only
// when a curator re-runs the seed script, not per-request.
const getSeatingDataCached = unstable_cache(
  async (slug: string) => getSeatingDataUncached(slug),
  ["ticket-intelligence-seating-data"],
  { revalidate: 3600 }
);

export async function getSeatingData(slug: string) {
  return getSeatingDataCached(slug);
}

async function getSeatingDataUncached(slug: string) {
  const [event] = await db
    .select({
      id: sportingEvents.id,
      slug: sportingEvents.slug,
      name: sportingEvents.name,
      heroImageUrl: sportingEvents.heroImageUrl,
      isHidden: sportingEvents.isHidden,
      // Season Pass gating (seasonPassAccess.ts) matches against this —
      // added 28 Sep 2026.
      editionYear: sportingEvents.editionYear,
      // isBuilt gating for TicketIntelligenceSidebar's "Get the event
      // guide" CTA — same formula as the Season Planner's isBuilt
      // (ShortlistResults.tsx), added 28 Sep 2026 after the sidebar was
      // found linking straight to a dead /event-pack/<slug> page for
      // planned/not-yet-activated events (Miami GP 2027, caught live).
      sport: sportingEvents.sport,
      packStatus: sportingEvents.packStatus,
      destinationId: sportingEvents.destinationId,
    })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, slug))
    .limit(1);

  if (!event) return null;

  // Experience links are only ever surfaced once the event's own pack is
  // actually activated (isHidden === false) — matches the site's existing
  // hasLivePack convention (app/experience/[slug]/page.tsx). A
  // circuit_seating_profile row can carry a real linkedExperienceId (and a
  // real, PUBLISHED experience behind it) well before the event pack goes
  // live — Ticket Intelligence's own eligibility list intentionally allows
  // packStatus "built_hidden" through for pre-launch testing (see
  // getTicketIntelligenceEventsUncached below), so without this gate a fan
  // could reach a not-yet-activated event's quiz/result page and click
  // straight through to a fully live, published experience page for an
  // event the founder hasn't activated yet. Caught before it shipped, 27
  // Sep 2026, building Japanese GP's seed script (packStatus:
  // built_hidden, isHidden: true, but all 20 of its experiences already
  // published). Suppressing at the source here (rather than only in
  // FullResult.tsx) means every consumer of this data gets the same
  // guarantee for free.
  const showExperienceLinks = event.isHidden === false;

  const rows = await db
    .select({
      id: circuitSeatingProfile.id,
      seatName: circuitSeatingProfile.seatName,
      seatType: circuitSeatingProfile.seatType,
      zoneLabel: circuitSeatingProfile.zoneLabel,
      actionTags: circuitSeatingProfile.actionTags,
      covered: circuitSeatingProfile.covered,
      minAge: circuitSeatingProfile.minAge,
      singleDayAvailable: circuitSeatingProfile.singleDayAvailable,
      reservedSeating: circuitSeatingProfile.reservedSeating,
      tier: plannerTicketTierCost.tier,
      costLow: plannerTicketTierCost.costLow,
      costHigh: plannerTicketTierCost.costHigh,
      linkedExperienceSlug: experiences.slug,
    })
    .from(circuitSeatingProfile)
    .leftJoin(plannerTicketTierCost, eq(circuitSeatingProfile.ticketTierCostId, plannerTicketTierCost.id))
    .leftJoin(experiences, eq(circuitSeatingProfile.linkedExperienceId, experiences.id))
    .where(eq(circuitSeatingProfile.sportingEventId, event.id));

  const seats: Seat[] = rows.map((r) => ({
    id: r.id,
    seatName: r.seatName,
    seatType: r.seatType,
    zoneLabel: r.zoneLabel,
    actionTags: r.actionTags,
    covered: r.covered,
    minAge: r.minAge,
    singleDayAvailable: r.singleDayAvailable,
    reservedSeating: r.reservedSeating,
    tier: r.tier,
    costLow: r.costLow ? Number(r.costLow) : null,
    costHigh: r.costHigh ? Number(r.costHigh) : null,
    linkedExperienceSlug: showExperienceLinks ? r.linkedExperienceSlug : null,
  }));

  const fallbackTicketExperienceSlug = showExperienceLinks ? await getFallbackTicketExperienceSlug(event.id) : null;

  return { event: { ...event, fallbackTicketExperienceSlug }, seats };
}

// A seat with no linkedExperienceId falls back to this event's general
// "Ticket Guide" / "Where to Sit" experience, found by title pattern within
// this event's linked experiences — never hardcoded per event, since not
// every event has one yet (e.g. US GP has none as of 27 Sep 2026, while
// Brazilian GP has "Ticket Guide — Which Grandstand to Buy"). Returns null
// when no such experience exists — FullResult shows no link in that case
// rather than a broken/misleading one.
//
// "%ticket decision%" added 27 Sep 2026 — Singapore GP's real experience
// title is "Grandstand or Walkabout — the real ticket decision", which
// matched neither of the original two patterns, so the fallback silently
// returned null for a real, published, findable experience. Kept as a
// pattern match (not a hardcoded per-event slug) so any future event using
// similar phrasing is covered too, same reasoning as the other two.
//
// ORDER BY added 27 Sep 2026 — Mexico City GP has TWO matching experiences
// ("Mexico City GP Ticket Guide" and "Where to Sit — Grandstand
// Comparison"), and with no explicit ordering, which one LIMIT 1 returned
// was arbitrary/DB-dependent. Founder direction: prefer a "where to sit"
// write-up over a generic "ticket guide" one when both exist for the same
// event, since it's the more detailed, seat-specific comparison — this is
// a general preference (not a Mexico-City-only special case), so it's
// expressed as a priority ordering, never a hardcoded per-event slug.
async function getFallbackTicketExperienceSlug(sportingEventId: string): Promise<string | null> {
  const [row] = await db
    .select({ slug: experiences.slug })
    .from(experiences)
    .innerJoin(sportingEventExperiences, eq(sportingEventExperiences.experienceId, experiences.id))
    .where(
      and(
        eq(sportingEventExperiences.sportingEventId, sportingEventId),
        or(
          ilike(experiences.title, "%ticket guide%"),
          ilike(experiences.title, "%where to sit%"),
          ilike(experiences.title, "%ticket decision%")
        )
      )
    )
    .orderBy(sql`CASE WHEN ${ilike(experiences.title, "%where to sit%")} THEN 0 ELSE 1 END`)
    .limit(1);
  return row?.slug ?? null;
}

// Lightweight existence check — does this event have ANY circuit_seating_profile
// rows at all? Used by the event pack hub page to decide whether to show the
// Ticket Intelligence card, replacing a hardcoded per-slug Set (see
// TICKET_INTELLIGENCE_EVENTS' removal, 26 Sep 2026 — hardcoded per-entity
// lookups don't scale past one pilot event, per
// feedback_avoid_hardcoded_per_entity_tables memory). A new event lights up
// automatically the moment its seed script runs, no code change/deploy
// needed. Cached the same way and for the same reason as getSeatingData.
const hasTicketIntelligenceCached = unstable_cache(
  async (eventId: string) => {
    const [row] = await db
      .select({ id: circuitSeatingProfile.id })
      .from(circuitSeatingProfile)
      .where(eq(circuitSeatingProfile.sportingEventId, eventId))
      .limit(1);
    return !!row;
  },
  ["ticket-intelligence-has-seats"],
  { revalidate: 3600 }
);

// Real, row-existence check across ALL FIVE Season Planner cost categories
// for this event's edition — flights, hotels, tickets, and destination
// bands (which cover both food and local travel in one row). Used to gate
// TicketIntelligenceSidebar's "Budget your trip" / Price Radar link.
//
// Deliberately stricter than Calendar's existing canPlanCosts()
// (lib/queries/calendar.ts), which only checks planner_ticket_tier_cost —
// founder executive decision, 28 Sep 2026, scoped to Ticket Intelligence
// only for now: Price Radar's own getSpokeData() never blocks rendering on
// missing cost rows (it only 404s if the event itself doesn't exist), so a
// partially-seeded event like Miami GP 2027 (4 ticket tiers, zero
// flights/hotels/bands) would otherwise link to a Price Radar page that
// renders but shows an essentially empty table — a bad experience, caught
// live on Miami GP 2027's Ticket Intelligence result page. Calendar's own
// canPlanCosts is intentionally NOT touched here — same gap, different
// surface, left for a separate pass.
const hasFullPlannerCostDataCached = unstable_cache(
  async (eventId: string, destinationId: string | null, editionYear: number) => {
    if (!destinationId) return false;
    const [tickets, hotels, flights, bands] = await Promise.all([
      db
        .select({ id: plannerTicketTierCost.id })
        .from(plannerTicketTierCost)
        .where(and(eq(plannerTicketTierCost.sportingEventId, eventId), eq(plannerTicketTierCost.editionYear, editionYear)))
        .limit(1),
      db
        .select({ id: plannerHotelTierCost.id })
        .from(plannerHotelTierCost)
        .where(and(eq(plannerHotelTierCost.destinationId, destinationId), eq(plannerHotelTierCost.editionYear, editionYear)))
        .limit(1),
      db
        .select({ id: plannerFlightCost.id })
        .from(plannerFlightCost)
        .where(and(eq(plannerFlightCost.destinationId, destinationId), eq(plannerFlightCost.editionYear, editionYear)))
        .limit(1),
      db
        .select({ id: plannerDestinationBands.id })
        .from(plannerDestinationBands)
        .where(eq(plannerDestinationBands.destinationId, destinationId))
        .limit(1),
    ]);
    return tickets.length > 0 && hotels.length > 0 && flights.length > 0 && bands.length > 0;
  },
  ["ticket-intelligence-has-full-planner-cost-data"],
  { revalidate: 3600 }
);

export async function hasFullPlannerCostData(
  eventId: string,
  destinationId: string | null,
  editionYear: number
): Promise<boolean> {
  return hasFullPlannerCostDataCached(eventId, destinationId, editionYear);
}

export async function hasTicketIntelligence(eventId: string): Promise<boolean> {
  return hasTicketIntelligenceCached(eventId);
}

export interface TicketIntelligenceEventSummary {
  id: string;
  slug: string;
  name: string;
  venueName: string | null;
  startDate: string;
  endDate: string;
  heroImageUrl: string | null;
}

// Listing for /ticket-intelligence — every event a fan can run the quiz
// for. Same eligibility filter as the Season Planner (per founder
// direction, 27 Sep 2026: "all events that have plan costs will eventually
// have ticket intelligence" — packStatus IN planned/building/built_hidden/
// live), PLUS three additional filters this product actually needs on top
// of that. Final, permanent state confirmed live 27 Sep 2026 after a round
// of testing with each filter temporarily loosened one at a time — as of
// this pass, that leaves exactly Brazilian GP + US GP showing:
// 1. startDate >= today — the packStatus filter ALONE isn't the planner's
//    real behavior. getPlannerEvents.ts has no date filter either; the
//    "never shows a past event" guarantee actually lives downstream in
//    ShortlistResults.tsx (`eventStart >= now`). Missed on the first pass
//    here — caught live 27 Sep 2026 when a leftJoin test surfaced Belgian
//    GP 2026 (packStatus: live, but ended 19 Jul 2026, well before today).
//    Matching the planner's real behavior, not just its query file.
// 2. Real planner_ticket_tier_cost rows must exist (EXISTS subquery) —
//    packStatus + date alone isn't a real "has plan costs" signal either;
//    caught live 27 Sep 2026 when a test with the seat-data filter off
//    surfaced The Ashes 2027 / Border-Gavaskar Trophy 2027 (packStatus
//    eligible, zero cost rows).
// 3. Real circuit_seating_profile rows must exist (innerJoin + having count
//    > 0) — a planned/building event with no seeded seating yet (i.e. most
//    events, until their own ticket-intelligence-researcher pass is done)
//    correctly does not appear here — never show a card that 404s or lands
//    on an empty quiz.
const getTicketIntelligenceEventsCached = unstable_cache(
  async () => getTicketIntelligenceEventsUncached(),
  ["ticket-intelligence-events-list"],
  { revalidate: 3600 }
);

export async function getTicketIntelligenceEvents(): Promise<TicketIntelligenceEventSummary[]> {
  return getTicketIntelligenceEventsCached();
}

async function getTicketIntelligenceEventsUncached(): Promise<TicketIntelligenceEventSummary[]> {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await db
    .select({
      id: sportingEvents.id,
      slug: sportingEvents.slug,
      name: sportingEvents.name,
      venueName: sportingEvents.venueName,
      startDate: sportingEvents.startDate,
      endDate: sportingEvents.endDate,
      heroImageUrl: sportingEvents.heroImageUrl,
      seatCount: sql<number>`count(${circuitSeatingProfile.id})`,
    })
    .from(sportingEvents)
    .innerJoin(circuitSeatingProfile, eq(circuitSeatingProfile.sportingEventId, sportingEvents.id))
    .where(
      and(
        inArray(sportingEvents.packStatus, ["planned", "building", "built_hidden", "live"]),
        gte(sportingEvents.startDate, today),
        // "Has plan costs" check — added 27 Sep 2026 after the founder
        // caught The Ashes 2027 / Border-Gavaskar Trophy 2027 (packStatus
        // eligible, but zero planner_ticket_tier_cost rows) leaking into
        // this list during testing with the seat-data filter temporarily
        // off. packStatus + date alone isn't a real "has plan costs"
        // signal — this EXISTS check is.
        sql`exists (select 1 from planner_ticket_tier_cost pttc where pttc.sporting_event_id = ${sportingEvents.id})`
      )
    )
    .groupBy(
      sportingEvents.id,
      sportingEvents.slug,
      sportingEvents.name,
      sportingEvents.venueName,
      sportingEvents.startDate,
      sportingEvents.endDate,
      sportingEvents.heroImageUrl
    )
    .having(sql`count(${circuitSeatingProfile.id}) > 0`)
    .orderBy(sportingEvents.startDate);

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    venueName: r.venueName,
    startDate: r.startDate,
    endDate: r.endDate,
    heroImageUrl: r.heroImageUrl,
  }));
}
