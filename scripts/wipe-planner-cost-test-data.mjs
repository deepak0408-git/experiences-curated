import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Wipes all rows from the 4 planner cost tables — every row in them was
// confirmed test/placeholder data (18 Jul 2026 test-data confirmation,
// reconfirmed 20 Jul 2026 before real seeding begins). Does NOT touch
// sportingEvents, destinations, planner_origin_markets, or
// planner_ticket_tier_sport_label — those are identity/reference data,
// not cost data. User instruction: "wipe it off" — 20 Jul 2026, before
// starting real methodology-driven seeding via planner-data-researcher skill.

const TABLES = [
  "planner_destination_bands",
  "planner_flight_cost",
  "planner_hotel_tier_cost",
  "planner_ticket_tier_cost",
];

for (const table of TABLES) {
  const before = await sql.unsafe(`SELECT count(*) FROM ${table}`);
  await sql.unsafe(`DELETE FROM ${table}`);
  const after = await sql.unsafe(`SELECT count(*) FROM ${table}`);
  console.log(`${table}: ${before[0].count} -> ${after[0].count} rows`);
}

await sql.end();
