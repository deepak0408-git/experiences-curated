import { db } from "@/lib/db";
import { destinations } from "@/schema/database";
import { eq } from "drizzle-orm";

// Flights lever — sequencing advisory, never a dollar saving (redesigned
// 19 Jul 2026, see design doc "Flights lever" section). Branches on the
// user's own Screen 1 timeWindow — no new input needed. THIS IS A
// MUST-DO, NON-NEGOTIABLE REQUIREMENT: every branch carries the legal
// caveat visibly, not buried in a separate page.

export type TimeWindow = "next_3mo" | "next_6mo" | "next_9mo" | "flexible";

export type FlightsAdvisory = {
  sequencingAdvice: string;
  alternateAirport: { iata: string; note: string } | null;
  legalCaveat: string;
};

const LEGAL_CAVEAT =
  "This is general guidance based on typical patterns, not a quote or guarantee for your specific route or dates. Always verify current prices and ticket availability directly with airlines and official ticketing channels before booking.";

function sequencingAdviceFor(timeWindow: TimeWindow): string {
  switch (timeWindow) {
    case "next_3mo":
      return "You're inside the typical ticket sell-out window for popular events — if you haven't secured tickets yet, prioritize that first. Book flights alongside them rather than waiting for a fare dip; at this range, availability usually matters more than price.";
    case "next_6mo":
    case "next_9mo":
      return "Consider securing event tickets first (these often sell out 4-6 months ahead), then book flights — fares are typically most competitive a few weeks before departure, but don't hold off on flights if it risks losing your tickets.";
    case "flexible":
    default:
      return "Since you're flexible on timing, you have room to watch both ticket availability and fares as the event approaches.";
  }
}

export async function getFlightsAdvisory(destinationId: string, timeWindow: string): Promise<FlightsAdvisory> {
  const tw: TimeWindow =
    timeWindow === "next_3mo" || timeWindow === "next_6mo" || timeWindow === "next_9mo" ? timeWindow : "flexible";

  let alternateAirport: FlightsAdvisory["alternateAirport"] = null;
  try {
    const [dest] = await db
      .select({
        budgetAlternateAirportIata: destinations.budgetAlternateAirportIata,
        alternateAirportNote: destinations.alternateAirportNote,
      })
      .from(destinations)
      .where(eq(destinations.id, destinationId));

    if (dest?.budgetAlternateAirportIata && dest.alternateAirportNote) {
      alternateAirport = { iata: dest.budgetAlternateAirportIata, note: dest.alternateAirportNote };
    }
  } catch (err) {
    // Same defensive pattern as getTradeoffOptions.ts / getTripCommentary.ts
    // — a transient DB blip must not crash the panel. The alternate-airport
    // tip is optional; sequencingAdvice below never depended on the DB at
    // all, so it's unaffected either way.
    console.error("[getFlightsAdvisory] failed to fetch alternate airport, omitting it", err);
  }

  return {
    sequencingAdvice: sequencingAdviceFor(tw),
    alternateAirport,
    legalCaveat: LEGAL_CAVEAT,
  };
}
