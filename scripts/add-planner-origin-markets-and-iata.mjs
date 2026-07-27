import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Migration: planner_origin_markets table + destinations.nearest_airport_iata
// column. Confirmed with user 19 Jul 2026 — real DB columns, not TS constants,
// per the standing rule against hardcoded per-entity Record<string,> tables.

await sql`
  CREATE TABLE IF NOT EXISTS planner_origin_markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city VARCHAR(100) NOT NULL UNIQUE,
    region VARCHAR(50) NOT NULL,
    iata_code VARCHAR(3) NOT NULL
  )
`;
console.log("✓ planner_origin_markets table created");

await sql`
  ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS nearest_airport_iata VARCHAR(3)
`;
console.log("✓ destinations.nearest_airport_iata column added");

await sql.end();
