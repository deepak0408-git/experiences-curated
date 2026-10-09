import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { plannerHotelTierCost, plannerFlightCost, plannerDestinationBands, plannerTicketTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10";
const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";

const hotels = await db.select().from(plannerHotelTierCost).where(eq(plannerHotelTierCost.destinationId, DESTINATION_ID));
const flights = await db.select().from(plannerFlightCost).where(eq(plannerFlightCost.destinationId, DESTINATION_ID));
const band = await db.select().from(plannerDestinationBands).where(eq(plannerDestinationBands.destinationId, DESTINATION_ID));
const tickets = await db.select().from(plannerTicketTierCost).where(eq(plannerTicketTierCost.sportingEventId, EVENT_ID));

console.log("hotels:", hotels.length);
console.log("flights:", flights.length);
console.log("bands:", band.length);
console.log("tickets:", tickets.length);
if (tickets.length) console.log("ticket editionYears:", [...new Set(tickets.map(t => t.editionYear))]);
process.exit(0);
