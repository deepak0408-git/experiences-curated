import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents, destinations, plannerFlightCost, plannerOriginMarkets } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4"));
console.log("EVENT:", JSON.stringify(event, null, 2));

const [dest] = await db.select().from(destinations).where(eq(destinations.id, "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9"));
console.log("DEST:", JSON.stringify(dest, null, 2));

const existingFlights = await db.select().from(plannerFlightCost).where(eq(plannerFlightCost.destinationId, "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9"));
console.log("EXISTING FLIGHT ROWS:", existingFlights.length);

const origins = await db.select().from(plannerOriginMarkets);
console.log("ORIGIN MARKETS COUNT:", origins.length);
console.log(JSON.stringify(origins.map(o => ({ city: o.city, iata: o.iataCode })), null, 2));

await client.end();
