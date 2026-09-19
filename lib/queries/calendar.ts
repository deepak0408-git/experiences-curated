import { db } from "@/lib/db";
import { externalCalendarEvents, sportingEvents, plannerTicketTierCost } from "@/schema/database";
import { and, asc, eq, inArray, or, sql, type SQL } from "drizzle-orm";

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
  // pattern as getPlannerEvents.ts) rather than N+1 per row. Checking
  // ticket-tier cost alone as the proxy for "has real planner data" is
  // sufficient — every event seeded so far has all 3 categories seeded
  // together in the same pass (see planner-data-researcher skill).
  const matchedEventIds = [...new Set(rows.map((r) => r.matchedEventId).filter((id): id is string => id !== null))];
  const costRows = matchedEventIds.length > 0
    ? await db
        .select({ sportingEventId: plannerTicketTierCost.sportingEventId, editionYear: plannerTicketTierCost.editionYear })
        .from(plannerTicketTierCost)
        .where(inArray(plannerTicketTierCost.sportingEventId, matchedEventIds))
    : [];
  const costEditionsByEvent = new Map<string, Set<number>>();
  for (const c of costRows) {
    if (!costEditionsByEvent.has(c.sportingEventId)) costEditionsByEvent.set(c.sportingEventId, new Set());
    costEditionsByEvent.get(c.sportingEventId)!.add(c.editionYear);
  }

  return rows.map((r) => ({
    ...r,
    hasRealCostData: !!r.matchedEventId && !!r.matchedEventEditionYear && (costEditionsByEvent.get(r.matchedEventId)?.has(r.matchedEventEditionYear) ?? false),
  }));
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
export function canPlanCosts(row: Awaited<ReturnType<typeof getCalendarEvents>>[number]): boolean {
  return row.hasRealCostData;
}
