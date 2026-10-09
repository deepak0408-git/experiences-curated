import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents, plannerHotelTierCost, plannerFlightCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [r] = await db.select({ editionYear: sportingEvents.editionYear, seasonYear: sportingEvents.seasonYear }).from(sportingEvents).where(eq(sportingEvents.id, "91f298a3-ca22-49c3-9c8e-5a200f0026c9"));
console.log("event:", r);

const hotelYears = await db.select({ editionYear: plannerHotelTierCost.editionYear }).from(plannerHotelTierCost).where(eq(plannerHotelTierCost.destinationId, "fb782de2-bbe6-410f-b466-2a4e628cda10"));
console.log("hotel editionYears:", [...new Set(hotelYears.map(h => h.editionYear))]);

const flightYears = await db.select({ editionYear: plannerFlightCost.editionYear }).from(plannerFlightCost).where(eq(plannerFlightCost.destinationId, "fb782de2-bbe6-410f-b466-2a4e628cda10"));
console.log("flight editionYears:", [...new Set(flightYears.map(f => f.editionYear))]);
process.exit(0);
