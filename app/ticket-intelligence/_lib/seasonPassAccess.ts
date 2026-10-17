import { db } from "@/lib/db";
import { ticketIntelligenceSeasonPasses } from "@/schema/database";
import { and, eq, sql } from "drizzle-orm";
import { getProDetails } from "@/lib/pro";

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

// Annual Pro (28 Oct 2026) — an Annual Pro subscriber gets free Ticket
// Intelligence access for any F1 event whose START date falls before their
// subscription's currentPeriodEnd, with no separate purchase or Season
// Pass needed. Monthly Pro gets no special treatment here — same
// annual-only asymmetry as the event-pack gate
// (event-pack/[slug]/page.tsx's isAnnualProActive).
//
// Checked against startDate, not endDate — founder correction, 17 Oct
// 2026: a multi-day event (e.g. Miami GP 2027, 30 Apr-2 May) that STARTS
// on the exact day a subscriber's Pro expires should still unlock, since
// the subscriber was still active when the event began. An endDate check
// failed this case (endDate May 2 fell after a currentPeriodEnd of Apr
// 30), even though the subscriber was clearly covered on race weekend.
// Compared start-of-day UTC (not end-of-day, unlike the `isEventPast`
// idiom elsewhere) against currentPeriodEnd so a start date equal to the
// expiry date still passes.
export async function hasActiveAnnualProForEvent(email: string, eventStartDate: string): Promise<boolean> {
  const { isAnnual, currentPeriodEnd } = await getProDetails(email);
  if (!isAnnual || !currentPeriodEnd) return false;
  return new Date(`${eventStartDate}T00:00:00Z`) <= currentPeriodEnd;
}
