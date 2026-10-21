import "server-only";
import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";
import { eq, and, gte, asc } from "drizzle-orm";
import { hasTennisTicketIntelligence } from "@/app/ticket-intelligence/tennis/[slug]/_lib/getTennisOptionsData";

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
  // Calendar" section and F1's getCockpitEvents.ts already use.
  eventGuideAvailable: boolean;
  // Unlike F1 (a bare circuit_seating_profile existence check), tennis
  // Ticket Intelligence is fail-closed behind an edition-activation +
  // editorial-ratification gate (tennisTicketIntelligenceEditionStatus).
  // Reuses hasTennisTicketIntelligence() directly rather than
  // re-implementing that gate here — skipping it would let an unratified/
  // un-activated event's quiz surface as "available" from the Cockpit,
  // bypassing the gate the Ticket Intelligence route itself enforces.
  ticketIntelligenceAvailable: boolean;
};

// Shared source for every Cockpit surface that needs "the current list of
// real tennis events" (event selector modal, Next on the Calendar section)
// — never a static/hardcoded list.
export async function getCockpitTennisEvents(): Promise<CockpitEvent[]> {
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
      editionYear: sportingEvents.editionYear,
    })
    .from(sportingEvents)
    .where(and(eq(sportingEvents.sport, "tennis"), gte(sportingEvents.endDate, today)))
    .orderBy(asc(sportingEvents.startDate));

  const withTi = await Promise.all(
    rows.map(async (r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      startDate: r.startDate,
      endDate: r.endDate,
      venueName: r.venueName,
      heroImageUrl: r.heroImageUrl,
      eventGuideAvailable: r.packStatus === "built_hidden" || r.packStatus === "live" ? !r.isHidden : false,
      ticketIntelligenceAvailable: await hasTennisTicketIntelligence(r.id, r.editionYear),
    }))
  );

  return withTi;
}

// "Next on the Calendar" shows the next 4 events in chronological order,
// already filtered to end-date-in-future by getCockpitTennisEvents()'s
// query. The event selector modal uses the full unsliced list directly.
export function getNextFourTennisEvents(events: CockpitEvent[]): CockpitEvent[] {
  return events.slice(0, 4);
}
