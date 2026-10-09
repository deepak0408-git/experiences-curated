import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const eventId = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const destinationId = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";

console.log("=== sporting_events row (destination, dates) ===");
console.log(await db.execute(sql`select id, slug, destination_id, start_date, end_date from sporting_events where id = ${eventId}`));

console.log("\n=== destinations row ===");
console.log(await db.execute(sql`select * from destinations where id = ${destinationId}`));

console.log("\n=== planner_destination_bands (by destination_id) ===");
console.log(await db.execute(sql`select * from planner_destination_bands where destination_id = ${destinationId}`));

console.log("\n=== planner_flight_cost (by destination_id) ===");
console.log(await db.execute(sql`select * from planner_flight_cost where destination_id = ${destinationId}`));

console.log("\n=== planner_hotel_tier_cost (by destination_id) ===");
console.log(await db.execute(sql`select * from planner_hotel_tier_cost where destination_id = ${destinationId}`));

console.log("\n=== planner_ticket_tier_cost (by sporting_event_id) ===");
console.log(await db.execute(sql`select * from planner_ticket_tier_cost where sporting_event_id = ${eventId}`));

await client.end();
