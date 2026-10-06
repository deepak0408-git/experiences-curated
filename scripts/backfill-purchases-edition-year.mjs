import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// One-off backfill for the edition_year column added by
// scripts/apply-purchases-edition-year-migration.mjs --add-columns.
//
// Founder confirmed (6 Oct 2026): it is still 2026, and every existing
// purchases row — including US Open's, bought before its rollover to the
// 2027 edition — was purchased for the 2026 edition. No per-event or
// per-date branching needed: every existing row backfills to editionYear
// 2026 flat. This script is NOT a reusable pattern for a future rollover's
// backfill — it is correct only because no evergreen event has a second
// edition's purchase in the table yet. See memory
// project_evergreen_purchase_edition_gap for the full incident.
//
// Usage:
//   node --experimental-strip-types scripts/backfill-purchases-edition-year.mjs

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const [{ count: beforeCount }] = await client`select count(*)::int from purchases where edition_year is null`;
console.log(`Rows with NULL edition_year before backfill: ${beforeCount}`);

const result = await client`update purchases set edition_year = 2026 where edition_year is null`;
console.log(`✓ Backfilled ${result.count} rows to edition_year = 2026.`);

const [{ count: afterCount }] = await client`select count(*)::int from purchases where edition_year is null`;
console.log(`Rows with NULL edition_year after backfill: ${afterCount}`);

await client.end();
