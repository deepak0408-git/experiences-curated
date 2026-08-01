import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const BELGIAN_GP_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const BELGIAN_DEST_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const days = 3;
const budgetMax = 1000;

const flight = (await sql`SELECT cost_low, cost_high FROM planner_flight_cost WHERE destination_id = ${BELGIAN_DEST_ID} AND origin_market = 'Tokyo' AND seasonal_band = 'jul'`)[0];
const band = (await sql`SELECT * FROM planner_destination_bands WHERE destination_id = ${BELGIAN_DEST_ID}`)[0];
const hotelModerate = (await sql`SELECT cost_low, cost_high FROM planner_hotel_tier_cost WHERE destination_id = ${BELGIAN_DEST_ID} AND tier = 'moderate'`)[0];
const hotelBudget = (await sql`SELECT cost_low, cost_high FROM planner_hotel_tier_cost WHERE destination_id = ${BELGIAN_DEST_ID} AND tier = 'budget'`)[0];
const ticketTier2 = (await sql`SELECT cost_low, cost_high, event_tier_label FROM planner_ticket_tier_cost WHERE sporting_event_id = ${BELGIAN_GP_ID} AND tier = 'tier2'`)[0];
const ticketTier1 = (await sql`SELECT cost_low, cost_high, event_tier_label FROM planner_ticket_tier_cost WHERE sporting_event_id = ${BELGIAN_GP_ID} AND tier = 'tier1'`)[0];

const restHigh = Number(flight.cost_high) + Number(band.local_travel_high) * days + Number(band.food_per_day_high) * days;
const currentTotalHigh = restHigh + Number(hotelModerate.cost_high) * days + Number(ticketTier2.cost_high);
const currentTotalLow = Number(flight.cost_low) + Number(band.local_travel_low) * days + Number(band.food_per_day_low) * days + Number(hotelModerate.cost_low) * days + Number(ticketTier2.cost_low);

console.log("Current total (Screen 2):", currentTotalLow, "-", currentTotalHigh);
console.log("Overage vs $1000 budget:", currentTotalHigh - budgetMax);

// Hotel-only green scenario (moderate -> budget, 1 step)
const hotelGreenTotalHigh = restHigh + Number(hotelBudget.cost_high) * days + Number(ticketTier2.cost_high);
console.log("\nHotel-green scenario new total high:", hotelGreenTotalHigh, "fits budget?", hotelGreenTotalHigh <= budgetMax);

// Ticket-only green scenario (tier2 -> tier1, 1 step)
const ticketGreenTotalHigh = restHigh + Number(hotelModerate.cost_high) * days + Number(ticketTier1.cost_high);
console.log("Ticket-green scenario (", ticketTier1.event_tier_label, ") new total high:", ticketGreenTotalHigh, "fits budget?", ticketGreenTotalHigh <= budgetMax);

// Both together
const bothTotalHigh = restHigh + Number(hotelBudget.cost_high) * days + Number(ticketTier1.cost_high);
console.log("Both-levers scenario new total high:", bothTotalHigh, "fits budget?", bothTotalHigh <= budgetMax);

await sql.end();
