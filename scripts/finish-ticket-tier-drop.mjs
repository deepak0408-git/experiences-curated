import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Completes the migration left partial by drop-general-tier.mjs's failure —
// planner_ticket_tier_cost.tier is currently text (already cast), but
// planner_ticket_tier_sport_label.tier_key still depends on the old enum
// type, which is why DROP TYPE failed. Cast that column to text FIRST,
// then drop and recreate the type, then cast both columns back.

await sql`ALTER TABLE planner_ticket_tier_sport_label ALTER COLUMN tier_key TYPE text`;
console.log("✓ Cast tier_key to text");

await sql`DROP TYPE planner_ticket_tier`;
await sql`CREATE TYPE planner_ticket_tier AS ENUM ('tier1', 'tier2', 'tier3', 'tier4')`;
console.log("✓ Rebuilt planner_ticket_tier enum without 'general'");

await sql`ALTER TABLE planner_ticket_tier_cost ALTER COLUMN tier TYPE planner_ticket_tier USING tier::planner_ticket_tier`;
await sql`ALTER TABLE planner_ticket_tier_sport_label ALTER COLUMN tier_key TYPE planner_ticket_tier USING tier_key::planner_ticket_tier`;
console.log("✓ Cast both columns back to the enum type");

await sql.end();
