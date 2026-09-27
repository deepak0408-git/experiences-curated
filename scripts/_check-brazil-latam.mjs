import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { plannerFlightCost, sportingEvents, plannerOriginMarkets } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select().from(sportingEvents).where(eq(sportingEvents.slug, "brazilian-grand-prix"));

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

const latam = rows.filter((r) => r.region === "Latin America");
for (const r of latam) console.log(r.originMarket, r.low, r.high);
await client.end();
