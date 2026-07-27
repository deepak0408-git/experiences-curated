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

// Real replacement for MOCK_EVENTS — assembles the same shape the UI already
// expects (title, venue, dateRange, packStatus, 5 lineItems) from the real
// planner tables, so ShortlistResults/ComparisonView don't need rewriting.
//
// tripLengthDays scales Hotel (per-night), Local travel (per-day), and Food
// (per-day) — Flights and Tickets are flat, one-time costs and never scale.
export async function getPlannerEvents(tripLengthDays: number, originMarket: string): Promise<MockEvent[]> {
  try {
    return await getPlannerEventsUnsafe(tripLengthDays, originMarket);
  } catch (err) {
    // A transient DB blip (dropped connection, pooler timeout) must not crash
    // the whole /planner/results page — fail to an empty shortlist instead,
    // matching the existing empty-state UI, and still log the real error so
    // it's visible in Sentry rather than silently swallowed. Caught 20 Jul
    // 2026 via a real ECONNRESET on this exact query path.
    console.error("[getPlannerEvents] failed, returning empty shortlist", err);
    return [];
  }
}

async function getPlannerEventsUnsafe(tripLengthDays: number, originMarket: string): Promise<MockEvent[]> {
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
    .where(inArray(sportingEvents.packStatus, ["planned", "building", "built_hidden", "live"]));

  // Batch-fetch every planner_* table ONCE instead of 4 queries per event —
  // this was a serial N+1 loop (4 sequential awaits × ~17 events = 60-70+
  // round-trips to the Supabase pooler on every single Screen 2 load),
  // measured as the dominant cause of a 30-40s page load. Caught live 26
  // Jul 2026. Same matching/fallback logic as before, just done in-memory
  // against these upfront batch results instead of per-event queries.
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

    // Screen 2 assumes Moderate hotel tier and tier2 (Grandstand-equivalent)
    // ticket tier as its defaults — real, purchasable rows, not a synthetic
    // blend, confirmed 19 Jul 2026. This is what makes the Tradeoff Engine's
    // "current tier" a known fact rather than an inference.
    const hotelRow = allHotelRows
      .filter((r) => r.destinationId === event.destinationId)
      .find((r) => r.tier === "moderate");

    // Fall back through tier1→tier4 when tier2 doesn't exist for this event
    // (e.g. no real "Reserved Stand"-equivalent product at the venue) — a
    // missing default tier must never mean no price shown at all. Caught 21
    // Jul 2026 on the Australia-in-South-Africa cricket event, which only has
    // real General Admission (tier1) and Hospitality (tier3) products.
    const ticketRowsForEvent = allTicketRows.filter((r) => r.sportingEventId === event.id);
    const ticketRow =
      ticketRowsForEvent.find((r) => r.tier === "tier2") ??
      ["tier1", "tier3", "tier4"]
        .map((tier) => ticketRowsForEvent.find((r) => r.tier === tier))
        .find((r) => r !== undefined);

    const bandRow = allBandRows.find((r) => r.destinationId === event.destinationId);

    // Flight price depends on the EVENT's own calendar month (seasonalBand),
    // not the user's Screen 1 time-window pick — a route-and-season matrix
    // shared across events in the same destination/month, per design doc.
    const eventSeasonalBand = new Date(event.startDate)
      .toLocaleDateString("en-US", { month: "short" })
      .toLowerCase();

    const flightRowsForDest = allFlightRows.filter((r) => r.destinationId === event.destinationId);
    const flightRow =
      flightRowsForDest.find((r) => r.originMarket === originMarket && r.seasonalBand === eventSeasonalBand) ??
      flightRowsForDest.find((r) => r.originMarket === "unspecified" && r.seasonalBand === eventSeasonalBand);

    // Skip events with incomplete planner cost data rather than rendering a
    // broken/partial card — real gap to fill in later as more destinations
    // get seeded, not a bug to paper over with fake fallback numbers.
    if (!hotelRow || !ticketRow || !bandRow || !flightRow) continue;

    // Ground-travel caveat, appended (never replacing) the qualifier — a
    // handful of origin/destination pairs are close enough that flying isn't
    // how anyone actually travels the route, but the flight price itself is
    // still a real, correctly-priced figure. Replacing the qualifier outright
    // would let the dollar figure be misread as the driving cost; appending
    // keeps "Round-trip economy" so the number stays unambiguously a flight
    // price. Audited 26 Jul 2026: Dubai->Abu Dhabi is currently the only
    // pair in the dataset that needs this (everything else is a genuine
    // long-haul flight with no realistic ground alternative).
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

    // Multi-city tours (tourCities populated) show a clean city list instead
    // of the free-text venueName written for the main event-pack page (which
    // carries per-venue detail like "Kingsmead (Durban)" — too dense for the
    // Planner's compact card). tourCities includes the anchor destination —
    // this is the only place a multi-city tour's location renders in the
    // Planner, so it must be complete on its own.
    const venue = event.tourCities && event.tourCities.length > 0
      ? `Multiple venues — ${event.tourCities.join(", ")}`
      : [event.venueName, event.destinationName].filter(Boolean).join(", ");

    // Short city-only label — for compact layouts (Compare table) where the
    // full venue string is too long and breaks column widths. Multi-city
    // tours show "Multiple venues" rather than just the anchor city —
    // showing only "Johannesburg" for a tour that also spans Centurion,
    // Cape Town, Paarl, and Bloemfontein gives an incorrect, misleading
    // picture of the trip. Corrected 26 Jul 2026.
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
