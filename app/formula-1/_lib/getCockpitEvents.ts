import "server-only";
import { db } from "@/lib/db";
import { sportingEvents, circuitSeatingProfile } from "@/schema/database";
import { eq, and, gte, asc, inArray } from "drizzle-orm";

export type CockpitEvent = {
  id: string;
  slug: string;
  name: string;
  startDate: string;
  endDate: string;
  venueName: string | null;
  heroImageUrl: string | null;
  // Event Guide is "available" (linkable) once packStatus is built_hidden/
  // live and isHidden is false — same eligibility rule the homepage "On the
  // Calendar" section and getCalendarEvents() already use (app/page.tsx
  // lines 109-119). Unpurchased is NOT the same as unavailable: an eligible
  // guide always routes to its existing preview/purchase flow.
  eventGuideAvailable: boolean;
  ticketIntelligenceAvailable: boolean;
};

// Shared source for every Cockpit surface that needs "the current list of
// real F1 events" (GP selector modal, Next on the Calendar section) — never
// a static/hardcoded GP list, per spec. Reuses the exact eligibility rule
// already proven on the homepage rather than inventing a second one.
export async function getCockpitF1Events(): Promise<CockpitEvent[]> {
  const today = new Date().toISOString().split("T")[0];

  const rows = await db
    .select({
      id: sportingEvents.id,
      slug: sportingEvents.slug,
      name: sportingEvents.name,
      startDate: sportingEvents.startDate,
      endDate: sportingEvents.endDate,
      venueName: sportingEvents.venueName,
      heroImageUrl: sportingEvents.heroImageUrl,
      packStatus: sportingEvents.packStatus,
      isHidden: sportingEvents.isHidden,
    })
    .from(sportingEvents)
    .where(and(eq(sportingEvents.sport, "formula_one"), gte(sportingEvents.endDate, today)))
    .orderBy(asc(sportingEvents.startDate));

  const eventIds = rows.map((r) => r.id);
  const tiRows = eventIds.length > 0
    ? await db
        .selectDistinct({ eventId: circuitSeatingProfile.sportingEventId })
        .from(circuitSeatingProfile)
        .where(inArray(circuitSeatingProfile.sportingEventId, eventIds))
    : [];
  const tiEventIds = new Set(tiRows.map((r) => r.eventId));

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    startDate: r.startDate,
    endDate: r.endDate,
    venueName: r.venueName,
    heroImageUrl: r.heroImageUrl,
    eventGuideAvailable: r.packStatus === "built_hidden" || r.packStatus === "live" ? !r.isHidden : false,
    ticketIntelligenceAvailable: tiEventIds.has(r.id),
  }));
}

// "Next on the Calendar" shows the next 4 events in chronological order,
// already filtered to end-date-in-future by getCockpitF1Events()'s query —
// matching the homepage's own "On the Calendar" rule (app/page.tsx lines
// 109-119). The GP selector modal (Card 3/Card 4) uses the full unsliced
// list from getCockpitF1Events() directly, since a visitor there may want to
// find or request notification for any upcoming GP, not just the next 4.
export function getNextFourF1Events(events: CockpitEvent[]): CockpitEvent[] {
  return events.slice(0, 4);
}
