import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Drops the synthetic "general" tier entirely — confirmed with user 19 Jul
// 2026. Screen 2 now reads real "moderate" (hotel) and "tier2" (ticket)
// rows directly instead of a blended average, so the Tradeoff Engine's
// "current tier" is a known fact, not an inference (this was the root
// cause of the Belgian GP math-mismatch bug found during testing).

// 1. Delete all "general" rows from both tables.
const deletedHotel = await sql`DELETE FROM planner_hotel_tier_cost WHERE tier = 'general' RETURNING id`;
console.log(`✓ Deleted ${deletedHotel.length} planner_hotel_tier_cost 'general' rows`);

const deletedTicket = await sql`DELETE FROM planner_ticket_tier_cost WHERE tier = 'general' RETURNING id`;
console.log(`✓ Deleted ${deletedTicket.length} planner_ticket_tier_cost 'general' rows`);

// 2. Rebuild planner_tier enum without 'general'.
await sql`ALTER TABLE planner_hotel_tier_cost ALTER COLUMN tier TYPE text`;
await sql`DROP TYPE planner_tier`;
await sql`CREATE TYPE planner_tier AS ENUM ('budget', 'moderate', 'splurge', 'luxury')`;
await sql`ALTER TABLE planner_hotel_tier_cost ALTER COLUMN tier TYPE planner_tier USING tier::planner_tier`;
console.log("✓ Rebuilt planner_tier enum without 'general'");

// 3. Rebuild planner_ticket_tier enum without 'general'.
await sql`ALTER TABLE planner_ticket_tier_cost ALTER COLUMN tier TYPE text`;
await sql`DROP TYPE planner_ticket_tier`;
await sql`CREATE TYPE planner_ticket_tier AS ENUM ('tier1', 'tier2', 'tier3', 'tier4')`;
await sql`ALTER TABLE planner_ticket_tier_cost ALTER COLUMN tier TYPE planner_ticket_tier USING tier::planner_ticket_tier`;
await sql`ALTER TABLE planner_ticket_tier_sport_label ALTER COLUMN tier_key TYPE text`;
await sql`ALTER TABLE planner_ticket_tier_sport_label ALTER COLUMN tier_key TYPE planner_ticket_tier USING tier_key::planner_ticket_tier`;
console.log("✓ Rebuilt planner_ticket_tier enum without 'general'");

await sql.end();
