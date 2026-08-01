import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const BELGIAN_GP_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const BELGIAN_DEST_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const days = 6;
const budgetMax = 2500;

const hotelRows = await sql`SELECT tier, cost_low, cost_high FROM planner_hotel_tier_cost WHERE destination_id = ${BELGIAN_DEST_ID}`;
const ticketRows = await sql`SELECT tier, cost_low, cost_high, event_tier_label FROM planner_ticket_tier_cost WHERE sporting_event_id = ${BELGIAN_GP_ID}`;
const band = (await sql`SELECT * FROM planner_destination_bands WHERE destination_id = ${BELGIAN_DEST_ID}`)[0];

console.log("Hotel rows:", hotelRows);
console.log("Ticket rows:", ticketRows);
console.log("Band:", band.local_travel_low, band.local_travel_high, band.food_per_day_low, band.food_per_day_high);

// We don't know exact origin used in screenshot, but let's check flight range for a few origins
const flights = await sql`SELECT origin_market, cost_low, cost_high FROM planner_flight_cost WHERE destination_id = ${BELGIAN_DEST_ID} AND seasonal_band = 'jul' AND cost_low = 650`;
console.log("\nFlight rows matching $650 low:", flights);

await sql.end();
