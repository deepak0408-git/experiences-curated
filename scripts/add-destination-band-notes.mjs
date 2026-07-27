import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

await sql`ALTER TABLE planner_destination_bands ADD COLUMN IF NOT EXISTS local_travel_note TEXT`;
console.log("✓ Added local_travel_note column");

await sql`ALTER TABLE planner_destination_bands ADD COLUMN IF NOT EXISTS food_note TEXT`;
console.log("✓ Added food_note column");

await sql.end();
