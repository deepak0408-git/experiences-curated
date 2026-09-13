import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const DEST_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";

const flights = await sql`SELECT count(*) FROM planner_flight_cost WHERE destination_id = ${DEST_ID}`;
const hotels = await sql`SELECT tier, cost_low, cost_high FROM planner_hotel_tier_cost WHERE destination_id = ${DEST_ID} ORDER BY tier`;
const tickets = await sql`SELECT tier, cost_low, cost_high FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID} ORDER BY tier`;
const bands = await sql`SELECT * FROM planner_destination_bands WHERE destination_id = ${DEST_ID}`;

console.log("FLIGHTS count:", flights[0].count);
console.log("HOTELS:", hotels.length, "rows");
console.table(hotels);
console.log("TICKETS:", tickets.length, "rows");
console.table(tickets);
console.log("DESTINATION BANDS (local travel & food):", bands.length, "rows");
console.table(bands);

await sql.end();
