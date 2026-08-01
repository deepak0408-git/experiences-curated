import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// packStatus is richer than the existing boolean is_hidden — it adds a
// state for "event is calendared but no pack has been built yet"
// (planned/building), which today has no representation at all. Existing
// rows are unaffected: every current row becomes packStatus = 'live',
// matching the fact that all 9 existing sporting_events rows already have
// is_hidden = false (confirmed via backup export 17 Jul 2026 — see
// docs/sporting_events_backup_2026-07-17.sql for the full pre-migration
// snapshot).
//
// Enum values:
//   planned      — calendared (e.g. on the Content Calendar), no pack built yet
//   building     — pack actively being researched/seeded
//   built_hidden — pack built, not yet activated (today's is_hidden = true state)
//   live         — pack built and activated (today's is_hidden = false state)

await sql`
  DO $$ BEGIN
    CREATE TYPE pack_status AS ENUM ('planned', 'building', 'built_hidden', 'live');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
`;
console.log("✓ pack_status enum created (or already existed)");

await sql`
  ALTER TABLE sporting_events
  ADD COLUMN IF NOT EXISTS pack_status pack_status NOT NULL DEFAULT 'live'
`;
console.log("✓ pack_status column added to sporting_events, defaulted to 'live'");

// Explicit backfill, not just relying on the column default — makes the
// existing-row state an intentional, verified fact rather than an
// accidental side effect of the DEFAULT clause.
const result = await sql`
  UPDATE sporting_events
  SET pack_status = (CASE WHEN is_hidden THEN 'built_hidden' ELSE 'live' END)::pack_status
  WHERE pack_status IS DISTINCT FROM (CASE WHEN is_hidden THEN 'built_hidden' ELSE 'live' END)::pack_status
`;
console.log(`✓ Backfilled pack_status for existing rows based on is_hidden (${result.count} row(s) updated)`);

const rows = await sql`SELECT slug, is_hidden, pack_status FROM sporting_events ORDER BY name`;
console.log("\nCurrent state:");
console.table(rows);

await sql.end();
