import { db } from "@/lib/db";
import {
  sportingEvents,
  plannerHotelTierCost,
  plannerTicketTierCost,
} from "@/schema/database";
import { eq } from "drizzle-orm";

// Real per-tier data for one event, fetched on demand when a user expands
// "See how to make this fit" on Screen 2 — deliberately separate from
// getPlannerEvents() (which reads only the "moderate"/"tier2" default rows
// for every event's shortlist card) so Screen 2 stays fast and this only
// runs for the one event a user is actually looking at.

const HOTEL_TIER_ORDER = ["budget", "moderate", "splurge", "luxury"] as const;
const TICKET_TIER_ORDER = ["tier1", "tier2", "tier3", "tier4"] as const;

// Screen 2's fixed defaults — real tiers, not a synthetic blend, confirmed
// 19 Jul 2026 (this is what fixed the Belgian GP math-mismatch bug: "current
// tier" is now a known fact, not an inferred closest-match guess).
const HOTEL_DEFAULT_TIER = "moderate";
const TICKET_DEFAULT_TIER = "tier2";

export type TierOption = {
  tier: string;
  label: string;
  costLow: number;
  costHigh: number;
  stepsFromCurrent: number; // 1 = adjacent tier, 2 = two tiers down, etc.
};

export type TradeoffOptions = {
  hotel: { current: TierOption | null; cheaperOptions: TierOption[] };
  tickets: { current: TierOption | null; cheaperOptions: TierOption[] };
};

const EMPTY_TRADEOFF_OPTIONS: TradeoffOptions = {
  hotel: { current: null, cheaperOptions: [] },
  tickets: { current: null, cheaperOptions: [] },
};

export async function getTradeoffOptions(eventId: string, tripLengthDays: number): Promise<TradeoffOptions> {
  try {
    return await getTradeoffOptionsUnsafe(eventId, tripLengthDays);
  } catch (err) {
    // Same defensive pattern as getPlannerEvents.ts (20 Jul 2026) — a
    // transient DB blip must not crash the Tradeoff Engine panel, just
    // leave it showing no options rather than throwing to the client.
    console.error("[getTradeoffOptions] failed, returning empty options", err);
    return EMPTY_TRADEOFF_OPTIONS;
  }
}

async function getTradeoffOptionsUnsafe(eventId: string, tripLengthDays: number): Promise<TradeoffOptions> {
  const days = Math.max(1, tripLengthDays || 1);

  const [event] = await db
    .select({ destinationId: sportingEvents.destinationId, sport: sportingEvents.sport })
    .from(sportingEvents)
    .where(eq(sportingEvents.id, eventId));

  if (!event || !event.destinationId) {
    return { hotel: { current: null, cheaperOptions: [] }, tickets: { current: null, cheaperOptions: [] } };
  }

  // Hotel — keyed by destination, all 4 real tiers
  const hotelRows = await db
    .select()
    .from(plannerHotelTierCost)
    .where(eq(plannerHotelTierCost.destinationId, event.destinationId));

  const hotelCurrentRow = hotelRows.find((r) => r.tier === HOTEL_DEFAULT_TIER);
  const hotelCurrentIndex = hotelCurrentRow ? HOTEL_TIER_ORDER.indexOf(hotelCurrentRow.tier) : -1;

  const hotelCheaperOptions: TierOption[] = hotelCurrentIndex > 0
    ? hotelRows
        .filter((r) => HOTEL_TIER_ORDER.indexOf(r.tier) >= 0 && HOTEL_TIER_ORDER.indexOf(r.tier) < hotelCurrentIndex)
        .map((r) => ({
          tier: r.tier,
          label: r.tier.charAt(0).toUpperCase() + r.tier.slice(1),
          costLow: Number(r.costLow) * days,
          costHigh: Number(r.costHigh) * days,
          stepsFromCurrent: hotelCurrentIndex - HOTEL_TIER_ORDER.indexOf(r.tier),
        }))
        .sort((a, b) => a.stepsFromCurrent - b.stepsFromCurrent)
    : [];

  // Tickets — keyed by event, all 4 real tiers. Every real tier already has
  // a mandatory eventTierLabel per the hard data governance rule (no NULL
  // labels ever seeded) — no sport-default fallback needed or wanted here.
  const ticketRows = await db
    .select()
    .from(plannerTicketTierCost)
    .where(eq(plannerTicketTierCost.sportingEventId, eventId));

  // Fall back through the tier order when tier2 doesn't exist for this event
  // (e.g. no real "Reserved Stand"-equivalent product at the venue) — must
  // match the same fallback in getPlannerEvents.ts so Screen 2's displayed
  // "current" tier and the Tradeoff Engine's "current" tier never disagree.
  const ticketCurrentRow =
    ticketRows.find((r) => r.tier === TICKET_DEFAULT_TIER) ??
    TICKET_TIER_ORDER
      .filter((t) => t !== TICKET_DEFAULT_TIER)
      .map((tier) => ticketRows.find((r) => r.tier === tier))
      .find((r) => r !== undefined);
  const ticketCurrentIndex = ticketCurrentRow ? TICKET_TIER_ORDER.indexOf(ticketCurrentRow.tier) : -1;

  const ticketCheaperOptions: TierOption[] = ticketCurrentIndex > 0
    ? ticketRows
        .filter((r) => TICKET_TIER_ORDER.indexOf(r.tier) >= 0 && TICKET_TIER_ORDER.indexOf(r.tier) < ticketCurrentIndex && r.eventTierLabel !== null)
        .map((r) => ({
          tier: r.tier,
          label: r.eventTierLabel!,
          costLow: Number(r.costLow),
          costHigh: Number(r.costHigh),
          stepsFromCurrent: ticketCurrentIndex - TICKET_TIER_ORDER.indexOf(r.tier),
        }))
        .sort((a, b) => a.stepsFromCurrent - b.stepsFromCurrent)
    : [];

  return {
    hotel: {
      current: hotelCurrentRow
        ? {
            tier: hotelCurrentRow.tier,
            label: hotelCurrentRow.tier.charAt(0).toUpperCase() + hotelCurrentRow.tier.slice(1),
            costLow: Number(hotelCurrentRow.costLow) * days,
            costHigh: Number(hotelCurrentRow.costHigh) * days,
            stepsFromCurrent: 0,
          }
        : null,
      cheaperOptions: hotelCheaperOptions,
    },
    tickets: {
      current: ticketCurrentRow
        ? {
            tier: ticketCurrentRow.tier,
            label: ticketCurrentRow.eventTierLabel ?? ticketCurrentRow.tier,
            costLow: Number(ticketCurrentRow.costLow),
            costHigh: Number(ticketCurrentRow.costHigh),
            stepsFromCurrent: 0,
          }
        : null,
      cheaperOptions: ticketCheaperOptions,
    },
  };
}
