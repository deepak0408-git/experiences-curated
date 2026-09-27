import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { plannerFlightCost, sportingEvents, plannerOriginMarkets } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select().from(sportingEvents).where(eq(sportingEvents.slug, "qatar-grand-prix"));

const rows = await db
  .select({
    originMarket: plannerFlightCost.originMarket,
    region: plannerOriginMarkets.region,
    low: plannerFlightCost.costLow,
    high: plannerFlightCost.costHigh,
  })
  .from(plannerFlightCost)
  .leftJoin(plannerOriginMarkets, eq(plannerFlightCost.originMarket, plannerOriginMarkets.city))
  .where(eq(plannerFlightCost.destinationId, event.destinationId));

for (const r of rows) {
  console.log(r.region ?? "NO_REGION", "|", r.originMarket, r.low, r.high);
}
await client.end();
