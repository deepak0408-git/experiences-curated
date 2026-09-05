import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerFlightCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin
const SEASONAL_BAND = "oct";

// United States Grand Prix 2026 (Oct 23-25, Austin) — flight cost batch 1.
// Google Flights + Kayak, round-trip, <=1 stop, economy, Oct 18-30 2026
// window, density-boundary outlier exclusion per planner-data-researcher
// skill. Founder-reviewed 5 Sep 2026:
// - Bangalore: Google Flights returned only 1 real data point ($5,591,
//   itself excluded as a high outlier vs. Kayak's dense 46-point sample) —
//   founder approved seeding Kayak's own range alone (single-source).
// - Berlin, Manchester: founder narrowed the tool's averaged range to
//   Kayak's own low/high directly (Berlin: 859-1486 vs. tool's averaged
//   1046-1486; Manchester: 1158-1300 vs. tool's averaged 1158-1570),
//   judging the Google Flights side of the average too high on these two.
// Dallas and Moscow failed this pass (timeouts) and are excluded — to be
// retried in a follow-up batch.
const rows = [
  { originMarket: "Amsterdam", costLow: "1146.00", costHigh: "1567.00" },
  { originMarket: "Atlanta", costLow: "133.00", costHigh: "563.00" },
  { originMarket: "Bangalore", costLow: "993.00", costHigh: "1427.00" },
  { originMarket: "Barcelona", costLow: "1088.00", costHigh: "1370.00" },
  { originMarket: "Berlin", costLow: "859.00", costHigh: "1486.00" },
  { originMarket: "Boston", costLow: "423.00", costHigh: "828.00" },
  { originMarket: "Chicago", costLow: "312.00", costHigh: "686.00" },
  { originMarket: "Dublin", costLow: "1030.00", costHigh: "1357.00" },
  { originMarket: "London", costLow: "987.00", costHigh: "1560.00" },
  { originMarket: "Los Angeles", costLow: "251.00", costHigh: "728.00" },
  { originMarket: "Madrid", costLow: "1012.00", costHigh: "1237.00" },
  { originMarket: "Manchester", costLow: "1158.00", costHigh: "1300.00" },
  { originMarket: "Miami", costLow: "265.00", costHigh: "792.00" },
  { originMarket: "Milan", costLow: "1104.00", costHigh: "1496.00" },
  { originMarket: "Montreal", costLow: "632.00", costHigh: "969.00" },
  { originMarket: "Munich", costLow: "846.00", costHigh: "1069.00" },
  { originMarket: "New York City", costLow: "479.00", costHigh: "654.00" },
  { originMarket: "Paris", costLow: "1062.00", costHigh: "1347.00" },
  { originMarket: "Philadelphia", costLow: "322.00", costHigh: "776.00" },
  { originMarket: "Rome", costLow: "1184.00", costHigh: "1543.00" },
  { originMarket: "San Francisco", costLow: "267.00", costHigh: "534.00" },
  { originMarket: "Stockholm", costLow: "949.00", costHigh: "1031.00" },
  { originMarket: "Toronto", costLow: "286.00", costHigh: "1199.00" },
  { originMarket: "Vancouver", costLow: "312.00", costHigh: "661.00" },
  { originMarket: "Washington D.C.", costLow: "408.00", costHigh: "594.00" },
  { originMarket: "Zurich", costLow: "895.00", costHigh: "1243.00" },
];

if (rows.length !== 26) {
  throw new Error(`Expected 26 rows, got ${rows.length}`);
}

const inserted = await db
  .insert(plannerFlightCost)
  .values(rows.map((r) => ({
    destinationId: DESTINATION_ID,
    originMarket: r.originMarket,
    seasonalBand: SEASONAL_BAND,
    costLow: r.costLow,
    costHigh: r.costHigh,
    currency: "USD",
  })))
  .returning({ originMarket: plannerFlightCost.originMarket, costLow: plannerFlightCost.costLow, costHigh: plannerFlightCost.costHigh });

console.log(`Inserted ${inserted.length} rows:`);
inserted.forEach((r) => console.log(`  ${r.originMarket}: $${r.costLow}-${r.costHigh}`));
await client.end();
