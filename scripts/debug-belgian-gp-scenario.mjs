import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const BELGIAN_GP_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const BELGIAN_DEST_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const days = 6;
const budgetMax = 2500;

const hotelModerate = (await sql`SELECT cost_low, cost_high FROM planner_hotel_tier_cost WHERE destination_id = ${BELGIAN_DEST_ID} AND tier = 'moderate'`)[0];
const hotelBudget = (await sql`SELECT cost_low, cost_high FROM planner_hotel_tier_cost WHERE destination_id = ${BELGIAN_DEST_ID} AND tier = 'budget'`)[0];
console.log("Hotel moderate (per night):", hotelModerate, "-> x6 days:", Number(hotelModerate.cost_low)*days, Number(hotelModerate.cost_high)*days);
console.log("Hotel budget (per night):", hotelBudget, "-> x6 days:", Number(hotelBudget.cost_low)*days, Number(hotelBudget.cost_high)*days);

const flight = (await sql`SELECT cost_low, cost_high FROM planner_flight_cost WHERE destination_id = ${BELGIAN_DEST_ID} AND seasonal_band = 'jul' LIMIT 1`)[0];
const band = (await sql`SELECT * FROM planner_destination_bands WHERE destination_id = ${BELGIAN_DEST_ID}`)[0];
const ticketSilver = (await sql`SELECT cost_low, cost_high FROM planner_ticket_tier_cost WHERE sporting_event_id = ${BELGIAN_GP_ID} AND tier = 'tier2'`)[0];

const restHigh = Number(flight.cost_high) + Number(band.local_travel_high)*days + Number(band.food_per_day_high)*days;
const restLow = Number(flight.cost_low) + Number(band.local_travel_low)*days + Number(band.food_per_day_low)*days;
console.log("\nRest of trip (flights+local+food) low-high:", restLow, restHigh);

const currentTotalHigh = restHigh + Number(hotelModerate.cost_high)*days + Number(ticketSilver.cost_high);
console.log("Current total high:", currentTotalHigh, "budget:", budgetMax, "overage:", currentTotalHigh - budgetMax);

// Hotel-only scenario (moderate -> budget)
const hotelOnlyTotalHigh = restHigh + Number(hotelBudget.cost_high)*days + Number(ticketSilver.cost_high);
console.log("\nHotel-only new total HIGH:", hotelOnlyTotalHigh, "fits budget?", hotelOnlyTotalHigh <= budgetMax);
const hotelOnlyTotalLow = restLow + Number(hotelBudget.cost_low)*days + Number(ticketSilver.cost_low);
console.log("Hotel-only new total LOW:", hotelOnlyTotalLow);

await sql.end();
