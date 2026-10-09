import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { plannerFlightCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select().from(plannerFlightCost).where(eq(plannerFlightCost.destinationId, "fb782de2-bbe6-410f-b466-2a4e628cda10"));
const r2027 = rows.filter(r => r.editionYear === 2027);
for (const r of r2027) console.log(r.originMarket.padEnd(20), r.region);
process.exit(0);
