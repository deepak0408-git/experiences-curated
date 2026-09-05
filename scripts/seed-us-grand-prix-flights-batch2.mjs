import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerFlightCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin
const SEASONAL_BAND = "oct";

// United States Grand Prix 2026 (Oct 23-25, Austin) — flight cost batch 2.
// Same methodology as batch 1. Founder-reviewed 5 Sep 2026:
// - Doha: founder narrowed to Kayak's own range (1287-1820) vs. the tool's
//   averaged 1621-1917.
// - Mexico City: founder set 616-1056 — keeps the tool's averaged low
//   (616) but caps the high at Kayak's own high (1056) instead of the
//   averaged 1145.
// - Mumbai, Cairo, Casablanca, Dubai, Manila, Nairobi, Beijing: Google
//   Flights returned only 1-5 raw fares on each of these routes, all
//   priced well above Kayak's dense cluster, so the density-boundary rule
//   excluded 100% of GF's points as outliers — nothing left to average.
//   Founder approved Kayak's own range alone for all seven (single-source,
//   same fallback already used for Bangalore in batch 1).
// - Dallas: Kayak returned 0 results across 2 separate attempts. Google
//   Flights alone gave a clean, dense 61-point sample (one obvious junk
//   value, $20,131, excluded). Density boundary on GF alone -> 217-700.
// Moscow excluded from this event entirely — both Google Flights and
// Kayak returned zero results across 3 separate attempts (unlike the
// documented Moscow/Kayak-only gap seen on other events, where Google
// Flights normally still surfaces routings). Austin is not a major
// international gateway; likely no genuinely bookable Moscow itinerary
// exists in either tool for this route. Left unseeded as an honest gap,
// not fabricated.
const rows = [
  { originMarket: "New Delhi", costLow: "1303.00", costHigh: "1424.00" },
  { originMarket: "Doha", costLow: "1287.00", costHigh: "1820.00" },
  { originMarket: "Buenos Aires", costLow: "1034.00", costHigh: "1535.00" },
  { originMarket: "Rio de Janeiro", costLow: "943.00", costHigh: "1494.00" },
  { originMarket: "Sao Paulo", costLow: "872.00", costHigh: "1218.00" },
  { originMarket: "Hong Kong", costLow: "1011.00", costHigh: "1321.00" },
  { originMarket: "Seoul", costLow: "1351.00", costHigh: "2063.00" },
  { originMarket: "Johannesburg", costLow: "1209.00", costHigh: "1590.00" },
  { originMarket: "Melbourne", costLow: "1653.00", costHigh: "1671.00" },
  { originMarket: "Mexico City", costLow: "616.00", costHigh: "1056.00" },
  { originMarket: "Tokyo", costLow: "1400.00", costHigh: "2279.00" },
  { originMarket: "Shanghai", costLow: "1153.00", costHigh: "1776.00" },
  { originMarket: "Singapore", costLow: "1092.00", costHigh: "1125.00" },
  { originMarket: "Sydney", costLow: "1196.00", costHigh: "1372.00" },
  { originMarket: "Mumbai", costLow: "1016.00", costHigh: "1391.00" },
  { originMarket: "Cairo", costLow: "915.00", costHigh: "1253.00" },
  { originMarket: "Casablanca", costLow: "1173.00", costHigh: "1271.00" },
  { originMarket: "Dubai", costLow: "1003.00", costHigh: "1133.00" },
  { originMarket: "Manila", costLow: "943.00", costHigh: "1262.00" },
  { originMarket: "Nairobi", costLow: "1320.00", costHigh: "1433.00" },
  { originMarket: "Beijing", costLow: "959.00", costHigh: "1461.00" },
  { originMarket: "Dallas", costLow: "217.00", costHigh: "700.00" },
];

if (rows.length !== 22) {
  throw new Error(`Expected 22 rows, got ${rows.length}`);
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
