import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const result = await sql`
  UPDATE sporting_events
  SET
    start_date = '2026-08-30',
    end_date   = '2026-09-13',
    updated_at = now()
  WHERE slug = 'us-open-2026'
  RETURNING id, name, start_date, end_date
`;

if (result.length) {
  const r = result[0];
  console.log(`✓ ${r.name}`);
  console.log(`  ${r.start_date} → ${r.end_date}`);
} else {
  console.log("⚠  No row matched slug 'us-open-2026'");
}

await sql.end();
