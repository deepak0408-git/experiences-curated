import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { plannerFlightCost, plannerOriginMarkets } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const rows = await db.select({ origin: plannerFlightCost.originMarket, region: plannerOriginMarkets.region, low: plannerFlightCost.costLow, high: plannerFlightCost.costHigh })
  .from(plannerFlightCost)
  .innerJoin(plannerOriginMarkets, eq(plannerOriginMarkets.city, plannerFlightCost.originMarket))
  .where(and(eq(plannerFlightCost.destinationId, "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9"), eq(plannerFlightCost.editionYear, 2027), eq(plannerFlightCost.seasonalBand, "jan")));

const byRegion = {};
for (const r of rows) {
  byRegion[r.region] = byRegion[r.region] || [];
  byRegion[r.region].push(r);
}
for (const [region, items] of Object.entries(byRegion)) {
  console.log(region, items.length, items.map(i => i.origin).join(", "));
}
await client.end();
