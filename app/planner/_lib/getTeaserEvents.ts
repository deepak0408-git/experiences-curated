import { db } from "@/lib/db";
import {
  sportingEvents,
  destinations,
  plannerHotelTierCost,
  plannerTicketTierCost,
  plannerDestinationBands,
  plannerFlightCost,
} from "@/schema/database";
import { eq, inArray } from "drizzle-orm";
import { formatMoneyRange, type CostLineItem, type MockEvent } from "./mockEvents";

// Dedicated data fetch for the homepage PlannerTeaser only — deliberately
// separate from getPlannerEvents.ts (Screen 2's query), which filters on
// packStatus. The teaser shows two fixed, hardcoded example events (Italian
// GP fits the budget, Singapore GP doesn't) and must keep showing them
// regardless of any future packStatus/isHidden change to either event —
// per the founder's explicit instruction 4 Aug 2026: this is a fixed demo,
// not a live "pick any current event" widget, so it must never depend on
// operational status fields that change for unrelated reasons. Looks events
// up directly by slug, no status filter of any kind.
export async function getTeaserEvents(
  slugs: string[],
  tripLengthDays: number,
  originMarket: string
): Promise<MockEvent[]> {
  try {
    return await getTeaserEventsUnsafe(slugs, tripLengthDays, originMarket);
  } catch (err) {
    console.error("[getTeaserEvents] failed, returning empty list", err);
    return [];
  }
}

async function getTeaserEventsUnsafe(
  slugs: string[],
  tripLengthDays: number,
  originMarket: string
): Promise<MockEvent[]> {
  const days = Math.max(1, tripLengthDays || 1);
  const events = await db
    .select({
      id: sportingEvents.id,
      slug: sportingEvents.slug,
      sport: sportingEvents.sport,
      name: sportingEvents.name,
      venueName: sportingEvents.venueName,
      tourCities: sportingEvents.tourCities,
      startDate: sportingEvents.startDate,
      endDate: sportingEvents.endDate,
      packStatus: sportingEvents.packStatus,
      destinationId: sportingEvents.destinationId,
      destinationName: destinations.name,
      heroImageUrl: sportingEvents.heroImageUrl,
    })
    .from(sportingEvents)
    .leftJoin(destinations, eq(sportingEvents.destinationId, destinations.id))
    .where(inArray(sportingEvents.slug, slugs));

  const eventIds = events.map((e) => e.id);
  const destinationIds = [...new Set(events.map((e) => e.destinationId).filter((id): id is string => id !== null))];

  const [allHotelRows, allTicketRows, allBandRows, allFlightRows] = await Promise.all([
    destinationIds.length > 0
      ? db.select().from(plannerHotelTierCost).where(inArray(plannerHotelTierCost.destinationId, destinationIds))
      : Promise.resolve([]),
    eventIds.length > 0
      ? db.select().from(plannerTicketTierCost).where(inArray(plannerTicketTierCost.sportingEventId, eventIds))
      : Promise.resolve([]),
    destinationIds.length > 0
      ? db.select().from(plannerDestinationBands).where(inArray(plannerDestinationBands.destinationId, destinationIds))
      : Promise.resolve([]),
    destinationIds.length > 0
      ? db.select().from(plannerFlightCost).where(inArray(plannerFlightCost.destinationId, destinationIds))
      : Promise.resolve([]),
  ]);

  const result: MockEvent[] = [];

  for (const event of events) {
    if (!event.destinationId) continue;

    const hotelRow = allHotelRows
      .filter((r) => r.destinationId === event.destinationId)
      .find((r) => r.tier === "moderate");

    const ticketRowsForEvent = allTicketRows.filter((r) => r.sportingEventId === event.id);
    const ticketRow =
      ticketRowsForEvent.find((r) => r.tier === "tier2") ??
      ["tier1", "tier3", "tier4"]
        .map((tier) => ticketRowsForEvent.find((r) => r.tier === tier))
        .find((r) => r !== undefined);

    const bandRow = allBandRows.find((r) => r.destinationId === event.destinationId);

    const eventSeasonalBand = new Date(event.startDate)
      .toLocaleDateString("en-US", { month: "short" })
      .toLowerCase();

    const flightRowsForDest = allFlightRows.filter((r) => r.destinationId === event.destinationId);
    const flightRow =
      flightRowsForDest.find((r) => r.originMarket === originMarket && r.seasonalBand === eventSeasonalBand) ??
      flightRowsForDest.find((r) => r.originMarket === "unspecified" && r.seasonalBand === eventSeasonalBand);

    if (!hotelRow || !ticketRow || !bandRow || !flightRow) continue;

    const groundTravelNote = originMarket === "Dubai" && event.destinationName === "Abu Dhabi"
      ? " — ~1.5hr drive, flying isn't realistic for this route"
      : "";

    const lineItems: CostLineItem[] = [
      { label: "Flights", low: Math.round(Number(flightRow.costLow)), high: Math.round(Number(flightRow.costHigh)), qualifier: `Round-trip economy${groundTravelNote}` },
      { label: "Hotel", low: Math.round(Number(hotelRow.costLow) * days), high: Math.round(Number(hotelRow.costHigh) * days), qualifier: `Moderate tier · ${days} night${days === 1 ? "" : "s"}` },
      { label: "Tickets", low: Math.round(Number(ticketRow.costLow)), high: Math.round(Number(ticketRow.costHigh)), qualifier: ticketRow.eventTierLabel ?? undefined },
      { label: "Local travel", low: Math.round(Number(bandRow.localTravelLow) * days), high: Math.round(Number(bandRow.localTravelHigh) * days), qualifier: `Mix of taxis and public transport, ~${formatMoneyRange(Number(bandRow.localTravelLow), Number(bandRow.localTravelHigh))}/day` },
      { label: "Food", low: Math.round(Number(bandRow.foodPerDayLow) * days), high: Math.round(Number(bandRow.foodPerDayHigh) * days), qualifier: `~${formatMoneyRange(Number(bandRow.foodPerDayLow), Number(bandRow.foodPerDayHigh))}/person/day` },
    ];

    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const dateRange = `${start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}–${end.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;

    const venue = event.tourCities && event.tourCities.length > 0
      ? `Multiple venues — ${event.tourCities.join(", ")}`
      : [event.venueName, event.destinationName].filter(Boolean).join(", ");

    const city = event.tourCities && event.tourCities.length > 0
      ? "Multiple venues"
      : event.destinationName ?? "";

    result.push({
      id: event.id,
      slug: event.slug,
      sport: event.sport,
      name: event.name,
      venue,
      city,
      dateRange,
      startDate: event.startDate,
      packStatus: event.packStatus,
      lineItems,
      heroImageUrl: event.heroImageUrl,
    });
  }

  return result;
}
