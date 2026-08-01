import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Hard exclusion flag for every email-sending cron that queries
// sporting_events. Any dev/test event, however production-shaped
// (is_hidden = false, activated_at backdated, etc.), must be created with
// this true so it can never satisfy a real cron's send trigger. Existing
// rows are unaffected: all are real events, so default false is correct
// for every current row. See incident 20 Jul 2026 — a fake "TEST EVENT"
// row without this flag reached 20 real newsletter subscribers.

await sql`
  ALTER TABLE sporting_events
  ADD COLUMN IF NOT EXISTS is_test_event BOOLEAN NOT NULL DEFAULT false
`;
console.log("✓ is_test_event column added to sporting_events, defaulted to false");

const rows = await sql`SELECT slug, is_hidden, is_test_event FROM sporting_events ORDER BY name`;
console.log("\nCurrent state:");
console.table(rows);

await sql.end();
