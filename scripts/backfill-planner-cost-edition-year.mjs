import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, isNull } from "drizzle-orm";
import {
  sportingEvents,
  plannerTicketTierCost,
  plannerHotelTierCost,
  plannerFlightCost,
} from "../schema/database.ts";

// One-off backfill for drizzle/migrations/0004_planner_cost_edition_year.sql
// — run AFTER that migration's ADD COLUMN statements (nullable) and BEFORE
// its SET NOT NULL / unique-index statements. Every decision here was
// reviewed and confirmed row-by-row with the founder (see memory
// project_planner_cost_edition_year_migration) — this is not a general
// "infer the year" heuristic to reuse elsewhere.
//
// Rule: edition_year = the sportingEvents.editionYear that was live at the
// time each cost row was actually seeded, NOT whatever editionYear the
// event shows today. For every event except Italian GP, today's
// editionYear still equals the seeded year (no rollover has happened since
// seeding) — those backfill mechanically from the event's current
// editionYear. Italian GP is the sole confirmed exception: its ticket/
// Milan hotel/Milan flight rows were seeded 20–22 Jul 2026, two months
// before its 18 Sep 2026 rollover to editionYear 2027 — so those rows
// backfill to 2026, not the row's current 2027. Wimbledon/London rows were
// seeded AFTER Wimbledon's 14 Aug 2026 rollover and confirmed by the
// founder as genuine 2027 data — they backfill to 2027, same as the
// mechanical rule (Wimbledon's editionYear was already 2027 by then).

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const ITALIAN_GP_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e";
const MILAN_DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca";
const LONDON_DESTINATION_ID = "75758888-28b9-4e09-82ba-f05681ecc904";

// Milan rows seeded before Italian GP's rollover (18 Sep 2026, but the data
// itself was all seeded by 26 Jul 2026 — this cutoff just needs to sit
// anywhere between the two) are 2026 pricing. Real 2027 Milan pricing, once
// sourced, will get edition_year=2027 explicitly at insert time by whatever
// seed script writes it — this cutoff only concerns rows already in the
// table today.
const ITALIAN_GP_2026_CUTOFF = new Date("2026-08-01T00:00:00Z");

const SEASON_MONTH = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  january: 0, february: 1, march: 2, april: 3, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

// Resolves edition_year for a destinationId+seasonalBand pair with no
// direct event link (hotel/flight rows). Most destinations map to exactly
// one event, so this is mechanical; the 3 shared destinations (Melbourne,
// Johannesburg, London) are disambiguated by matching seasonalBand against
// each candidate event's start-date month.
function resolveDestinationEditionYear(destinationId, seasonalBand, lastUpdated, events) {
  if (destinationId === MILAN_DESTINATION_ID) {
    return new Date(lastUpdated) < ITALIAN_GP_2026_CUTOFF ? 2026 : 2027;
  }
  // London/jun is a real collision — both The Ashes 2027 and Wimbledon
  // (editionYear 2027) start in June at this destination, so month-matching
  // alone can't pick one. Confirmed with the founder as genuine 2027 data
  // (seeded 15 Aug 2026, after Wimbledon's 14 Aug rollover) — both
  // candidates already agree on 2027 regardless, but this is stated
  // explicitly rather than relying on that coincidence silently.
  if (destinationId === LONDON_DESTINATION_ID && seasonalBand?.toLowerCase() === "jun") {
    return 2027;
  }
  const candidates = events.filter((e) => e.destinationId === destinationId);
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0].editionYear;

  const month = SEASON_MONTH[seasonalBand?.toLowerCase()];
  const byMonth = candidates.filter((e) => new Date(e.startDate).getUTCMonth() === month);
  if (byMonth.length === 1) return byMonth[0].editionYear;
  return null; // genuinely ambiguous — needs manual review, not a guess
}

let updatedTickets = 0;
let updatedHotels = 0;
let updatedFlights = 0;

const events = await db
  .select({ id: sportingEvents.id, slug: sportingEvents.slug, editionYear: sportingEvents.editionYear, destinationId: sportingEvents.destinationId, startDate: sportingEvents.startDate })
  .from(sportingEvents);
const eventById = new Map(events.map((e) => [e.id, e]));

// --- 1. Ticket tier cost — keyed by sportingEventId directly. ---
const ticketRows = await db.select().from(plannerTicketTierCost).where(isNull(plannerTicketTierCost.editionYear));
for (const row of ticketRows) {
  const event = eventById.get(row.sportingEventId);
  if (!event) {
    console.warn(`⚠ Skipping ticket row ${row.id} — no matching sportingEvents row for ${row.sportingEventId}`);
    continue;
  }
  const editionYear =
    row.sportingEventId === ITALIAN_GP_ID && new Date(row.lastUpdated) < ITALIAN_GP_2026_CUTOFF
      ? 2026
      : event.editionYear;
  await db.update(plannerTicketTierCost).set({ editionYear }).where(eq(plannerTicketTierCost.id, row.id));
  updatedTickets++;
}

// --- 2. Hotel tier cost — keyed by destinationId + seasonalBand. ---
const hotelRows = await db.select().from(plannerHotelTierCost).where(isNull(plannerHotelTierCost.editionYear));
for (const row of hotelRows) {
  const editionYear = resolveDestinationEditionYear(row.destinationId, row.seasonalBand, row.lastUpdated, events);
  if (editionYear == null) {
    console.warn(`⚠ Could not resolve edition_year for hotel row ${row.id} (destination ${row.destinationId}, season ${row.seasonalBand}) — left NULL, needs manual review before running the NOT NULL migration step.`);
    continue;
  }
  await db.update(plannerHotelTierCost).set({ editionYear }).where(eq(plannerHotelTierCost.id, row.id));
  updatedHotels++;
}

// --- 3. Flight cost — same destination+season resolution as hotels. ---
const flightRows = await db.select().from(plannerFlightCost).where(isNull(plannerFlightCost.editionYear));
for (const row of flightRows) {
  const editionYear = resolveDestinationEditionYear(row.destinationId, row.seasonalBand, row.lastUpdated, events);
  if (editionYear == null) {
    console.warn(`⚠ Could not resolve edition_year for flight row ${row.id} (destination ${row.destinationId}, season ${row.seasonalBand}) — left NULL, needs manual review before running the NOT NULL migration step.`);
    continue;
  }
  await db.update(plannerFlightCost).set({ editionYear }).where(eq(plannerFlightCost.id, row.id));
  updatedFlights++;
}

console.log(`✓ Backfilled ${updatedTickets} ticket rows, ${updatedHotels} hotel rows, ${updatedFlights} flight rows.`);

const remainingTickets = await db.select().from(plannerTicketTierCost).where(isNull(plannerTicketTierCost.editionYear));
const remainingHotels = await db.select().from(plannerHotelTierCost).where(isNull(plannerHotelTierCost.editionYear));
const remainingFlights = await db.select().from(plannerFlightCost).where(isNull(plannerFlightCost.editionYear));
if (remainingTickets.length || remainingHotels.length || remainingFlights.length) {
  console.error(`✗ ${remainingTickets.length + remainingHotels.length + remainingFlights.length} rows still have NULL edition_year — do NOT run the SET NOT NULL migration statements until these are resolved.`);
  process.exitCode = 1;
} else {
  console.log("✓ All rows backfilled — safe to run the SET NOT NULL / unique index statements in 0004_planner_cost_edition_year.sql.");
}

await client.end();
