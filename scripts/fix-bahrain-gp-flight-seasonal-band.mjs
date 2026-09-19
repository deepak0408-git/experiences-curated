import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and } from "drizzle-orm";
import { plannerFlightCost } from "../schema/database.ts";

// Bahrain GP (Malaysia/Kuala Lumpur) never appeared in Planner results
// (any origin market, any filter combination) — confirmed live 19 Sep 2026.
// Root cause: all 49 planner_flight_cost rows for Kuala Lumpur were seeded
// (scripts/seed-kualalumpur-flights-batch1.mjs, seed-kualalumpur-flights-
// batch2.mjs, 29-31 Jul 2026) with seasonalBand hardcoded to "sep" — a
// mislabel baked into the seed script from the start, per its own header
// comment ("Event: Bahrain Grand Prix (Malaysia GP / Sepang), Sep 2026").
// The event's real, unedited-since-creation dates are 2-4 Oct 2026
// (sportingEvents.createdAt === updatedAt, confirmed 28 Jul 2026 — 3 days
// BEFORE the flight seed ran, so this was never a later date change). The
// actual search window used (2026-09-27 to 2026-10-09, startDate-5 to
// endDate+5 for the real Oct dates) already covers the real event window
// correctly — only the DB label was wrong, not the researched prices.
// getPlannerEvents.ts computes eventSeasonalBand from the event's real
// startDate ("oct"), so every flight row silently failed to match and the
// event was dropped by the "skip if incomplete cost data" guard.
//
// This is a pure relabel — costLow/costHigh/currency/lastUpdated are left
// untouched, since the underlying research is valid. See memory
// project_planner_cost_edition_year_migration for the unrelated edition_year
// migration this table also went through.

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "09d5f140-02e3-4e6a-bdda-f8ef2142153a"; // Kuala Lumpur

const before = await db
  .select({ id: plannerFlightCost.id, seasonalBand: plannerFlightCost.seasonalBand })
  .from(plannerFlightCost)
  .where(and(eq(plannerFlightCost.destinationId, DESTINATION_ID), eq(plannerFlightCost.seasonalBand, "sep")));

console.log(`Found ${before.length} Kuala Lumpur flight rows tagged "sep" to relabel to "oct".`);

if (before.length === 0) {
  console.log("Nothing to do — already fixed or no matching rows.");
  await client.end();
  process.exit(0);
}

const result = await db
  .update(plannerFlightCost)
  .set({ seasonalBand: "oct" })
  .where(and(eq(plannerFlightCost.destinationId, DESTINATION_ID), eq(plannerFlightCost.seasonalBand, "sep")));

console.log(`✓ Relabeled ${before.length} rows from "sep" to "oct".`);

const remaining = await db
  .select({ id: plannerFlightCost.id })
  .from(plannerFlightCost)
  .where(and(eq(plannerFlightCost.destinationId, DESTINATION_ID), eq(plannerFlightCost.seasonalBand, "sep")));
console.log(`Remaining "sep" rows for Kuala Lumpur: ${remaining.length} (should be 0).`);

await client.end();
