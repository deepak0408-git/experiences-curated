import { db } from "@/lib/db";
import { externalCalendarEvents, sportingEvents, plannerTicketTierCost, plannerHotelTierCost, plannerFlightCost, plannerDestinationBands } from "@/schema/database";
import { and, asc, eq, inArray, or, sql, type SQL } from "drizzle-orm";

const SEASONAL_BAND_BY_MONTH = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Master data source for the Sports Calendar page family (/calendar,
// /calendar/[sport]) — see docs/Sports Calendar - Design Document.txt.
// externalCalendarEvents is the full, real season calendar per sport,
// independent of what we've built a pack for; sportingEvents (joined here)
// is only the curated subset we cover. A row with matchedSportingEventId
// null is a genuine "real event, not covered yet" fact, not a data gap.
//
// years: multi-select year filter (e.g. [2026] or [2026, 2027]) — filters
// on startDate's year, since the design doc's "any event starting in the
// window" rule (confirmed 8 Aug 2026) already uses startDate as the
// authoritative anchor for which year an event belongs to. Empty/undefined
// = no year filter (show all), matching the sport filter's "All" behavior.
export async function getCalendarEvents(sport?: string, years?: number[]) {
  const conditions: (SQL | undefined)[] = [];
  if (sport) {
    conditions.push(eq(externalCalendarEvents.sport, sport as "tennis" | "cricket" | "football" | "rugby" | "golf" | "formula_one" | "cycling" | "athletics" | "other"));
  }
  if (years && years.length > 0) {
    conditions.push(or(...years.map((y) => sql`extract(year from ${externalCalendarEvents.startDate}) = ${y}`)));
  }

  const rows = await db
    .select({
      id: externalCalendarEvents.id,
      sport: externalCalendarEvents.sport,
      name: externalCalendarEvents.name,
      venueOrCity: externalCalendarEvents.venueOrCity,
      startDate: externalCalendarEvents.startDate,
      endDate: externalCalendarEvents.endDate,
      isProvisional: externalCalendarEvents.isProvisional,
      matchedEventSlug: sportingEvents.slug,
      matchedEventName: sportingEvents.name,
      packStatus: sportingEvents.packStatus,
      isHidden: sportingEvents.isHidden,
      matchedEventId: sportingEvents.id,
      matchedEventEditionYear: sportingEvents.editionYear,
      // Added 25 Sep 2026 for canPlanCosts()'s Price Radar gate — a classic-
      // format event can have real ticket-cost rows (hasRealCostData true)
      // but no /price-radar page at all, since that route depends on
      // getSpokeData, which only exists for hub_and_spoke events. Without
      // this, canPlanCosts would send classic events (e.g. US Open, Belgian
      // GP) to a 404.
      matchedEventPackFormat: sportingEvents.packFormat,
      matchedEventDestinationId: sportingEvents.destinationId,
    })
    .from(externalCalendarEvents)
    .leftJoin(sportingEvents, eq(externalCalendarEvents.matchedSportingEventId, sportingEvents.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(externalCalendarEvents.startDate));

  // Real, row-existence-based check for "Plan costs for this trip" — added
  // 19-20 Sep 2026 after canPlanCosts()'s packStatus-only heuristic kept
  // showing the link for Italian GP's 2027 row even though its only real
  // cost data is 2026 pricing (see project_planner_cost_edition_year_migration
  // memory). packStatus alone can never express "cost data exists for the
  // edition currently displayed" — only a real query against the cost
  // tables, filtered by edition_year, can. Batched into one query (same
  // pattern as getPlannerEvents.ts) rather than N+1 per row.
  //
  // Checks ALL FOUR planner cost tables, not just tickets — fixed 1 Oct 2026
  // after the founder caught British Grand Prix 2027 showing "Plan costs for
  // this trip" with only 4 ticket-tier rows seeded and zero hotel/flight/
  // destination-band rows, landing on a Price Radar page missing 3 of its 4
  // cost columns. The original comment here assumed "every event seeded so
  // far has all 3 [sic] categories seeded together in the same pass" — false
  // for British GP, and nothing enforced that assumption going forward.
  // Ticket-tier cost is keyed by sportingEventId directly; hotel/flight/
  // destination-band rows are keyed by destinationId (a destination is
  // shared across events) plus editionYear + seasonalBand for hotel/flight
  // (same pattern as getSpokeData.ts) — destinationBand has no
  // edition/season split, it's one row per destination.
  const matchedEventIds = [...new Set(rows.map((r) => r.matchedEventId).filter((id): id is string => id !== null))];
  const ticketRows = matchedEventIds.length > 0
    ? await db
        .select({ sportingEventId: plannerTicketTierCost.sportingEventId, editionYear: plannerTicketTierCost.editionYear })
        .from(plannerTicketTierCost)
        .where(inArray(plannerTicketTierCost.sportingEventId, matchedEventIds))
    : [];
  const ticketEditionsByEvent = new Map<string, Set<number>>();
  for (const c of ticketRows) {
    if (!ticketEditionsByEvent.has(c.sportingEventId)) ticketEditionsByEvent.set(c.sportingEventId, new Set());
    ticketEditionsByEvent.get(c.sportingEventId)!.add(c.editionYear);
  }

  const destinationIds = [...new Set(rows.map((r) => r.matchedEventDestinationId).filter((id): id is string => id !== null))];
  const [hotelRows, flightRows, bandRows] = destinationIds.length > 0
    ? await Promise.all([
        db.select({ destinationId: plannerHotelTierCost.destinationId, editionYear: plannerHotelTierCost.editionYear, seasonalBand: plannerHotelTierCost.seasonalBand })
          .from(plannerHotelTierCost)
          .where(inArray(plannerHotelTierCost.destinationId, destinationIds)),
        db.select({ destinationId: plannerFlightCost.destinationId, editionYear: plannerFlightCost.editionYear, seasonalBand: plannerFlightCost.seasonalBand })
          .from(plannerFlightCost)
          .where(inArray(plannerFlightCost.destinationId, destinationIds)),
        db.select({ destinationId: plannerDestinationBands.destinationId })
          .from(plannerDestinationBands)
          .where(inArray(plannerDestinationBands.destinationId, destinationIds)),
      ])
    : [[], [], []];
  const hotelKeys = new Set(hotelRows.map((h) => `${h.destinationId}|${h.editionYear}|${h.seasonalBand}`));
  const flightKeys = new Set(flightRows.map((f) => `${f.destinationId}|${f.editionYear}|${f.seasonalBand}`));
  const bandDestinationIds = new Set(bandRows.map((b) => b.destinationId));

  return rows.map((r) => {
    const hasTicketData = !!r.matchedEventId && !!r.matchedEventEditionYear && (ticketEditionsByEvent.get(r.matchedEventId)?.has(r.matchedEventEditionYear) ?? false);
    if (!hasTicketData || !r.matchedEventDestinationId) {
      return { ...r, hasRealCostData: false };
    }
    const seasonalBand = SEASONAL_BAND_BY_MONTH[new Date(r.startDate).getUTCMonth()];
    const key = `${r.matchedEventDestinationId}|${r.matchedEventEditionYear}|${seasonalBand}`;
    const hasHotelData = hotelKeys.has(key);
    const hasFlightData = flightKeys.has(key);
    const hasBandData = bandDestinationIds.has(r.matchedEventDestinationId);
    return { ...r, hasRealCostData: hasHotelData && hasFlightData && hasBandData };
  });
}

// Three real CTA states, exactly per the design doc — computed here so
// every page (master + per-sport) derives it identically.
export type CalendarCtaState =
  | { type: "live_guide"; href: string }
  | { type: "guide_coming" }
  | { type: "not_covered" };

export function getCtaState(row: Awaited<ReturnType<typeof getCalendarEvents>>[number]): CalendarCtaState {
  if (!row.matchedEventSlug) return { type: "not_covered" };

  const hasPack = row.packStatus === "live" || row.packStatus === "built_hidden";
  if (!hasPack) return { type: "guide_coming" };

  // isHidden normally gates public visibility for UPCOMING events (an
  // unactivated pack shouldn't be linked from a public page before its
  // curator turns it on via /curator/events — same rule as search/homepage).
  // But a PAST event's guide is often deliberately deactivated post-event
  // (removed from homepage/search rotation) while the guide itself still
  // exists and is still useful as a reference — the calendar's job here
  // differs from a discovery surface. So: for a past event, a live pack
  // always shows the guide link regardless of isHidden; for an upcoming
  // event, isHidden still gates it.
  const isPast = row.endDate < new Date().toISOString().slice(0, 10);
  if (isPast || row.isHidden === false) {
    return { type: "live_guide", href: `/event-pack/${row.matchedEventSlug}` };
  }
  return { type: "guide_coming" };
}

// The "Plan costs for this trip" link only makes sense for an event that
// ACTUALLY has real Planner cost data for the edition currently displayed —
// not just one whose packStatus makes that plausible. Originally a
// packStatus-only heuristic (excluding "planned", the DB default for a row
// with no real build work yet — confirmed live 16 Aug 2026: Border-Gavaskar
// Trophy 2027 and The Ashes 2027 both sat at "planned" with zero real
// ticket-cost rows yet showed this link). That heuristic broke again 19-20
// Sep 2026: Italian GP's row is "live" (packStatus alone says yes) but its
// editionYear had rolled to 2027 while its only real cost rows are still
// 2026's — packStatus can never express "for THIS edition," only a real
// row-existence check can. hasRealCostData is computed in getCalendarEvents()
// via a real query against planner_ticket_tier_cost, filtered by
// edition_year — see that function's comment and
// project_planner_cost_edition_year_migration memory.
//
// packFormat check added 25 Sep 2026 — hasRealCostData alone doesn't
// distinguish classic (no /price-radar page, since that route depends on
// getSpokeData which is hub_and_spoke only) from hub_and_spoke. A classic
// event with real ticket data (e.g. US Open, Belgian GP) would otherwise
// send this link to a 404.
export function canPlanCosts(row: Awaited<ReturnType<typeof getCalendarEvents>>[number]): boolean {
  return row.hasRealCostData && row.matchedEventPackFormat === "hub_and_spoke";
}
