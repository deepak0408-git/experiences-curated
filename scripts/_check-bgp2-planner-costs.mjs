import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const eventId = '07e23597-720b-41e1-b8ff-419e004307ee';

const flights = await sql`SELECT * FROM planner_flight_cost WHERE sporting_event_id = ${eventId}`;
console.log("FLIGHTS:", flights.length, flights);

const hotels = await sql`SELECT * FROM planner_hotel_tier_cost WHERE sporting_event_id = ${eventId}`;
console.log("HOTELS:", hotels.length, hotels);

const tickets = await sql`SELECT * FROM planner_ticket_tier_cost WHERE sporting_event_id = ${eventId}`;
console.log("TICKETS:", tickets.length, tickets);

const bands = await sql`SELECT * FROM planner_destination_bands WHERE sporting_event_id = ${eventId}`;
console.log("BANDS:", bands.length, bands);

await sql.end();
