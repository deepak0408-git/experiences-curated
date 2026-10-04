import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const destCount = await sql`SELECT count(*) FROM destinations`;
const destWithLatLng = await sql`SELECT count(*) FROM destinations WHERE lat IS NOT NULL AND lng IS NOT NULL`;
const destWithAirport = await sql`SELECT count(*) FROM destinations WHERE nearest_airport_iata IS NOT NULL`;
const destWithHotelLink = await sql`SELECT count(*) FROM destinations WHERE next_closest_hotel_destination_id IS NOT NULL`;

const eventCount = await sql`SELECT count(*) FROM sporting_events`;
const eventWithLatLng = await sql`SELECT count(*) FROM sporting_events WHERE venue_lat IS NOT NULL AND venue_lng IS NOT NULL`;
const eventWithDest = await sql`SELECT count(*) FROM sporting_events WHERE destination_id IS NOT NULL`;

console.log("destinations total:", destCount[0].count);
console.log("destinations with lat/lng:", destWithLatLng[0].count);
console.log("destinations with nearest_airport_iata:", destWithAirport[0].count);
console.log("destinations with next_closest_hotel_destination_id:", destWithHotelLink[0].count);
console.log("---");
console.log("sporting_events total:", eventCount[0].count);
console.log("sporting_events with venue lat/lng:", eventWithLatLng[0].count);
console.log("sporting_events with destination_id:", eventWithDest[0].count);

await sql.end();
