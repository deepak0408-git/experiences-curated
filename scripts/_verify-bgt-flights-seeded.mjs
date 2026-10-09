import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { plannerFlightCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const rows = await db.select().from(plannerFlightCost).where(and(
  eq(plannerFlightCost.destinationId, "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9"),
  eq(plannerFlightCost.editionYear, 2027),
  eq(plannerFlightCost.seasonalBand, "jan")
));
console.log("Total rows:", rows.length);
const india = rows.filter(r => ["Bangalore","Mumbai","New Delhi"].includes(r.originMarket));
console.log(JSON.stringify(india, null, 2));
await client.end();
