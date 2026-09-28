import { db } from "@/lib/db";
import { ticketIntelligenceSeasonPasses } from "@/schema/database";
import { and, eq, sql } from "drizzle-orm";

// Shared season-pass access check — used everywhere Ticket Intelligence
// currently checks `purchases` for a per-event `ticket_intelligence` row
// (quiz start page, result page). A fan with an active season pass covering
// this event's editionYear skips the per-event purchase entirely; this is
// purely additive — the existing purchases check is untouched and checked
// first (cheaper query, and the common case for most fans).
//
// editionYear is matched via `= ANY(edition_season)` against the int array
// column, per founder direction 28 Sep 2026 — no date-range logic, just a
// direct year membership check. A newly created event with editionYear 2027
// is automatically covered by any pass whose editionSeason includes 2027,
// with no backfill needed.
export async function hasActiveSeasonPass(email: string, editionYear: number): Promise<boolean> {
  const [row] = await db
    .select({ id: ticketIntelligenceSeasonPasses.id })
    .from(ticketIntelligenceSeasonPasses)
    .where(
      and(
        eq(ticketIntelligenceSeasonPasses.email, email),
        eq(ticketIntelligenceSeasonPasses.status, "active"),
        sql`${ticketIntelligenceSeasonPasses.editionSeason} @> ARRAY[${editionYear}]::smallint[]`
      )
    )
    .limit(1);
  return !!row;
}

// No-event-in-context version — used on /ticket-intelligence (the picker
// page), which has no single editionYear to check against. Checks the
// CURRENT calendar year against editionSeason, not just status = "active" —
// a 2026/27 pass row stays "active" forever unless someone manually flips
// it (refunds are handled manually, no auto-expiry job), so without this
// year check the picker would keep showing "Season Pass active" to a 2026/27
// buyer in, say, 2028 — a season they never paid for. Founder direction 28
// Sep 2026: "edition_season should cover today's date." Gap found live the
// same day: the picker page's own ownership check originally had no year
// check at all.
export async function hasAnyActiveSeasonPass(email: string): Promise<boolean> {
  const currentYear = new Date().getFullYear();
  const [row] = await db
    .select({ id: ticketIntelligenceSeasonPasses.id })
    .from(ticketIntelligenceSeasonPasses)
    .where(
      and(
        eq(ticketIntelligenceSeasonPasses.email, email),
        eq(ticketIntelligenceSeasonPasses.status, "active"),
        sql`${ticketIntelligenceSeasonPasses.editionSeason} @> ARRAY[${currentYear}]::smallint[]`
      )
    )
    .limit(1);
  return !!row;
}
