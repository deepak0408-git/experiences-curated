import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Adds destinations.nearest_major_city -- see schema/database.ts comment
// for full reasoning. Local Travel/Food cost-research proxy, added 23 Jul
// 2026 per user decision.
await sql`
  ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS nearest_major_city VARCHAR(100)
`;

const check = await sql`
  SELECT column_name, data_type, character_maximum_length
  FROM information_schema.columns
  WHERE table_name = 'destinations' AND column_name = 'nearest_major_city'
`;
console.table(check);
await sql.end();
