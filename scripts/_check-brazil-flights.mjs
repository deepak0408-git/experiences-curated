import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { plannerFlightCost, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select().from(sportingEvents).where(eq(sportingEvents.slug, "brazilian-grand-prix"));
console.log("event", event?.id, "destinationId", event?.destinationId);

if (event) {
  const rows = await db.select().from(plannerFlightCost).where(eq(plannerFlightCost.destinationId, event.destinationId));
  console.log("flight rows for this destinationId:", rows.length);
  for (const r of rows.slice(0, 5)) console.log(r.originMarket, r.costLow, r.costHigh);
}
await client.end();
