import { db } from "@/lib/db";
import { externalCalendarEvents, sportingEvents } from "@/schema/database";
import { and, asc, eq, or, sql, type SQL } from "drizzle-orm";

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
    })
    .from(externalCalendarEvents)
    .leftJoin(sportingEvents, eq(externalCalendarEvents.matchedSportingEventId, sportingEvents.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(externalCalendarEvents.startDate));

  return rows;
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
// could plausibly have real Planner cost data. "planned" is deliberately
// EXCLUDED here even though getPlannerEvents.ts's own filter includes it
// (app/planner/_lib/getPlannerEvents.ts) — "planned" is the DB default for
// a sportingEvents row that's been created but has no real build work done
// yet, meaning zero chance of real planner_ticket_tier_cost/hotel_tier_cost
// rows existing. Confirmed live 16 Aug 2026: Border-Gavaskar Trophy 2027 and
// The Ashes 2027 both sat at packStatus "planned" with zero real ticket-cost
// rows, yet the calendar showed "Plan costs for this trip" for both — the
// getPlannerEvents.ts filter is a genuinely different, looser check (used to
// decide which events appear in the Planner's own event picker at all,
// including ones a curator is actively scoping) and was never meant to be
// reused as the stricter "does real cost data plausibly exist" gate this
// function needs. "building" is kept since scoping/research work may already
// be seeding real planner tables even before packStatus advances further.
const PLANNER_ELIGIBLE_STATUSES = new Set(["building", "built_hidden", "live"]);

export function canPlanCosts(row: Awaited<ReturnType<typeof getCalendarEvents>>[number]): boolean {
  return !!row.matchedEventSlug && PLANNER_ELIGIBLE_STATUSES.has(row.packStatus ?? "");
}
