import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

const [row] = await sql`
  UPDATE sporting_events
  SET pre_trip_brief_live_at = NULL,
      pre_trip_brief_updated_at = NOW()
  WHERE slug = 'open-championship-2026'
  RETURNING slug, pre_trip_brief_live_at
`;

console.log("✓ Deactivated pre-trip brief for:", row.slug);
console.log("  pre_trip_brief_live_at:", row.pre_trip_brief_live_at);
console.log("  Cron will activate ~9 Jul (7 days before 16 Jul start)");

await sql.end();
