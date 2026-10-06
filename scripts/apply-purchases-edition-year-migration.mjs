import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Applies drizzle/migrations/0009_purchases_edition_year.sql in three
// guarded phases against DATABASE_URL (transaction pooler) — db:generate/
// db:migrate require a TTY this environment doesn't have (see memory
// feedback_db_migration.md), so this replaces them for this one migration.
//
// Phase 1: ADD COLUMN (nullable) — safe, non-destructive.
// Phase 2: run scripts/backfill-purchases-edition-year.mjs as a SEPARATE
//          step (not here) to populate every row.
// Phase 3 (this script, run again with --finalize): SET NOT NULL + swap the
//          unique index — refuses to run if any row is still NULL.
//
// Usage:
//   node --experimental-strip-types scripts/apply-purchases-edition-year-migration.mjs --add-columns
//   node --experimental-strip-types scripts/backfill-purchases-edition-year.mjs
//   node --experimental-strip-types scripts/apply-purchases-edition-year-migration.mjs --finalize

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const mode = process.argv[2];
if (mode !== "--add-columns" && mode !== "--finalize") {
  console.error("Usage: node apply-purchases-edition-year-migration.mjs --add-columns | --finalize");
  process.exit(1);
}

if (mode === "--add-columns") {
  await client`ALTER TABLE "purchases" ADD COLUMN IF NOT EXISTS "edition_year" smallint`;
  console.log("✓ edition_year column added (nullable) to purchases.");
  console.log("Next: run scripts/backfill-purchases-edition-year.mjs, then this script with --finalize.");
}

if (mode === "--finalize") {
  const [{ count: nullPurchases }] = await client`select count(*)::int from purchases where edition_year is null`;
  if (nullPurchases) {
    console.error(`✗ Refusing to finalize — ${nullPurchases} purchases rows still have NULL edition_year. Run the backfill script first.`);
    process.exit(1);
  }

  await client`ALTER TABLE "purchases" ALTER COLUMN "edition_year" SET NOT NULL`;

  // Unlike the planner-cost tables this migration was modeled on,
  // purchases_email_event_unique is a plain CREATE UNIQUE INDEX on this DB,
  // not a table CONSTRAINT (confirmed via pg_indexes/pg_constraint before
  // writing this) — DROP INDEX, not DROP CONSTRAINT.
  await client`DROP INDEX "purchases_email_event_unique"`;
  await client`CREATE UNIQUE INDEX "purchases_email_event_edition_unique" ON "purchases" USING btree ("email","sporting_event_id","product_type","edition_year")`;

  console.log("✓ edition_year set NOT NULL and unique index swapped on purchases. Migration complete.");
}

await client.end();
