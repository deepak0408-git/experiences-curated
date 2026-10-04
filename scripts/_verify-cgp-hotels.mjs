import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { plannerHotelTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const rows = await db.select().from(plannerHotelTierCost).where(and(eq(plannerHotelTierCost.destinationId, "998a8774-05ac-4482-ba7a-4ca2a556b963"), eq(plannerHotelTierCost.seasonalBand, "apr")));
console.log(rows);
await client.end();
