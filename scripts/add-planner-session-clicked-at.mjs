import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

await sql`ALTER TABLE planner_sessions ADD COLUMN IF NOT EXISTS clicked_at timestamp`;
console.log("✓ clicked_at column added to planner_sessions");

await sql.end();
