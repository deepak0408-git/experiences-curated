import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents, destinations, externalCalendarEvents, plannerFlightCost, plannerHotelTierCost, plannerTicketTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const event = await db.select().from(sportingEvents).where(eq(sportingEvents.id, "020c6a95-1b15-4a63-8a55-853656b1fe8d"));
console.log("EVENT:", JSON.stringify(event, null, 2));

const dest = await db.select().from(destinations).where(eq(destinations.id, "998a8774-05ac-4482-ba7a-4ca2a556b963"));
console.log("DESTINATION:", JSON.stringify(dest, null, 2));

const flights = await db.select().from(plannerFlightCost).where(eq(plannerFlightCost.destinationId, "998a8774-05ac-4482-ba7a-4ca2a556b963"));
console.log("EXISTING FLIGHT ROWS FOR SHANGHAI DEST:", flights.length);

await client.end();
