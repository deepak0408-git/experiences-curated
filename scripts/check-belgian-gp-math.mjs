import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const BELGIAN_GP_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const BELGIAN_DEST_ID = "101b815a-ba64-4484-aad6-63721a44ed85";

const hotel = await sql`SELECT tier, cost_low, cost_high FROM planner_hotel_tier_cost WHERE destination_id = ${BELGIAN_DEST_ID} ORDER BY tier`;
console.log("Hotel (per night, x3 days shown on screen):", hotel);

const tickets = await sql`SELECT tier, event_tier_label, cost_low, cost_high FROM planner_ticket_tier_cost WHERE sporting_event_id = ${BELGIAN_GP_ID} ORDER BY tier`;
console.log("\nTickets:", tickets);

await sql.end();
