import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Applies drizzle/migrations/0004_planner_cost_edition_year.sql in three
// guarded phases against DATABASE_URL (transaction pooler) — db:generate/
// db:migrate require a TTY this environment doesn't have (see memory
// feedback_db_migration.md), so this replaces them for this one migration.
//
// Phase 1: ADD COLUMN (nullable) — safe, non-destructive.
// Phase 2: run scripts/backfill-planner-cost-edition-year.mjs as a SEPARATE
//          step (not here) to populate every row.
// Phase 3 (this script, run again with --finalize): SET NOT NULL + swap the
//          3 unique indexes — refuses to run if any row is still NULL.
//
// Usage:
//   node --experimental-strip-types scripts/apply-planner-cost-edition-year-migration.mjs --add-columns
//   node --experimental-strip-types scripts/backfill-planner-cost-edition-year.mjs
//   node --experimental-strip-types scripts/apply-planner-cost-edition-year-migration.mjs --finalize

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const mode = process.argv[2];
if (mode !== "--add-columns" && mode !== "--finalize") {
  console.error("Usage: node apply-planner-cost-edition-year-migration.mjs --add-columns | --finalize");
  process.exit(1);
}

if (mode === "--add-columns") {
  await client`ALTER TABLE "planner_ticket_tier_cost" ADD COLUMN IF NOT EXISTS "edition_year" smallint`;
  await client`ALTER TABLE "planner_hotel_tier_cost" ADD COLUMN IF NOT EXISTS "edition_year" smallint`;
  await client`ALTER TABLE "planner_flight_cost" ADD COLUMN IF NOT EXISTS "edition_year" smallint`;
  console.log("✓ edition_year columns added (nullable) to all 3 tables.");
  console.log("Next: run scripts/backfill-planner-cost-edition-year.mjs, then this script with --finalize.");
}

if (mode === "--finalize") {
  const [{ count: nullTickets }] = await client`select count(*)::int from planner_ticket_tier_cost where edition_year is null`;
  const [{ count: nullHotels }] = await client`select count(*)::int from planner_hotel_tier_cost where edition_year is null`;
  const [{ count: nullFlights }] = await client`select count(*)::int from planner_flight_cost where edition_year is null`;
  if (nullTickets || nullHotels || nullFlights) {
    console.error(`✗ Refusing to finalize — ${nullTickets + nullHotels + nullFlights} rows still have NULL edition_year (tickets: ${nullTickets}, hotels: ${nullHotels}, flights: ${nullFlights}). Run the backfill script first.`);
    process.exit(1);
  }

  await client`ALTER TABLE "planner_ticket_tier_cost" ALTER COLUMN "edition_year" SET NOT NULL`;
  await client`ALTER TABLE "planner_hotel_tier_cost" ALTER COLUMN "edition_year" SET NOT NULL`;
  await client`ALTER TABLE "planner_flight_cost" ALTER COLUMN "edition_year" SET NOT NULL`;

  // The original unique indexes were created as table CONSTRAINTs (Drizzle's
  // uniqueIndex still backs a real constraint here), so DROP INDEX alone
  // fails with "requires it" — DROP CONSTRAINT removes both the constraint
  // and its backing index in one statement.
  await client`ALTER TABLE "planner_ticket_tier_cost" DROP CONSTRAINT "planner_ticket_tier_cost_event_tier_unique"`;
  await client`CREATE UNIQUE INDEX "planner_ticket_tier_cost_event_tier_edition_unique" ON "planner_ticket_tier_cost" USING btree ("sporting_event_id","tier","edition_year")`;

  await client`ALTER TABLE "planner_hotel_tier_cost" DROP CONSTRAINT "planner_hotel_tier_cost_dest_tier_season_unique"`;
  await client`CREATE UNIQUE INDEX "planner_hotel_tier_cost_dest_tier_season_edition_unique" ON "planner_hotel_tier_cost" USING btree ("destination_id","tier","seasonal_band","edition_year")`;

  await client`ALTER TABLE "planner_flight_cost" DROP CONSTRAINT "planner_flight_cost_route_season_unique"`;
  await client`CREATE UNIQUE INDEX "planner_flight_cost_route_season_edition_unique" ON "planner_flight_cost" USING btree ("destination_id","origin_market","seasonal_band","edition_year")`;

  console.log("✓ edition_year set NOT NULL and unique indexes swapped on all 3 tables. Migration complete.");
}

await client.end();
