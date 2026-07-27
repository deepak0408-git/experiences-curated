import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Adds a NOT NULL currency column (default 'USD') to all 4 planner cost
// tables, per standing rule: all planner cost data is USD-only, no
// exceptions. Using a DEFAULT means existing rows backfill automatically
// on ADD COLUMN, and all future INSERTs get USD unless explicitly
// overridden (which should never happen per the standing rule).

await sql`ALTER TABLE planner_flight_cost ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'USD'`;
console.log("✓ planner_flight_cost.currency added");

await sql`ALTER TABLE planner_hotel_tier_cost ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'USD'`;
console.log("✓ planner_hotel_tier_cost.currency added");

await sql`ALTER TABLE planner_ticket_tier_cost ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'USD'`;
console.log("✓ planner_ticket_tier_cost.currency added");

await sql`ALTER TABLE planner_destination_bands ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'USD'`;
console.log("✓ planner_destination_bands.currency added");

// Verify: counts + distinct currency values per table
const tables = ["planner_flight_cost", "planner_hotel_tier_cost", "planner_ticket_tier_cost", "planner_destination_bands"];
for (const tbl of tables) {
  const rows = await sql.unsafe(`SELECT currency, COUNT(*) FROM ${tbl} GROUP BY currency`);
  console.log(`\n${tbl}:`, rows);
}

await sql.end();
