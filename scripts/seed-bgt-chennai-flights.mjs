import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import fs from "fs";
import path from "path";
import { plannerFlightCost } from "../schema/database.ts";

// Seeds whatever real, successfully-researched flight routes exist in
// scratchpad/bgt-flights/*.json into Chennai's plannerFlightCost. Run
// immediately with partial data (some routes errored and will be retried
// separately) rather than block the Price Radar page on 100% completion —
// Price Radar reads this table live and shows "No matching city" until
// real rows exist, confirmed live on production 9 Oct 2026.

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9"; // Chennai
const EDITION_YEAR = 2027;
const SEASONAL_BAND = "jan";

const dir = "scratchpad/bgt-flights";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "_batch-log.txt");

const rows = [];
const skipped = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(dir, file), "utf-8");
  const data = JSON.parse(raw);
  if (!data.finalCostLow || !data.finalCostHigh || !data.origin) {
    skipped.push(file);
    continue;
  }
  rows.push({
    destinationId: DESTINATION_ID,
    originMarket: data.origin,
    seasonalBand: SEASONAL_BAND,
    editionYear: EDITION_YEAR,
    costLow: String(data.finalCostLow),
    costHigh: String(data.finalCostHigh),
    currency: "USD",
    refreshPass: "initial",
  });
}

console.log(`${rows.length} real routes to seed, ${skipped.length} skipped (incomplete/errored):`, skipped);

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

if (rows.length > 0) {
  await db.insert(plannerFlightCost).values(rows).onConflictDoNothing();
}

console.log(`Seeded ${rows.length} planner_flight_cost rows for Border-Gavaskar Trophy 2027 (Chennai, ${SEASONAL_BAND} ${EDITION_YEAR}).`);
await client.end();
