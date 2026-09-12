import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerFlightCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb"; // Sao Paulo
const SEASONAL_BAND = "nov"; // Brazilian GP 2026 event month

// Researched via planner-data-researcher skill's locked Flights methodology
// (Google Flights + Kayak, combined-dataset density-boundary outlier
// exclusion), 12 Sep 2026. Batch 1 of 2 (24 of 48 origin markets), founder-
// approved as-is (tool's computed density-boundary range used for every
// row, no overrides). Search window 1-13 Nov 2026 (event dates 6-8 Nov
// 2026, +/-5 days), round-trip, <=1 stop, economy. Manila required one
// retry (Google Flights returned 0 results on first attempt, a documented
// transient pattern) — succeeded cleanly on retry, not single-source.
const rows = [
  { city: "Amsterdam", low: 1039, high: 1558 },
  { city: "Atlanta", low: 1237, high: 1599 },
  { city: "Bangalore", low: 1839, high: 2177 },
  { city: "Barcelona", low: 1105, high: 1657 },
  { city: "Beijing", low: 1575, high: 2021 },
  { city: "Berlin", low: 1062, high: 1443 },
  { city: "Boston", low: 662, high: 1542 },
  { city: "Buenos Aires", low: 334, high: 926 },
  { city: "Cairo", low: 1066, high: 1816 },
  { city: "Casablanca", low: 1204, high: 1941 },
  { city: "Chicago", low: 1047, high: 1631 },
  { city: "Dallas", low: 997, high: 1395 },
  { city: "Doha", low: 1503, high: 2098 },
  { city: "Dubai", low: 1486, high: 2704 },
  { city: "Dublin", low: 1070, high: 1604 },
  { city: "Hong Kong", low: 1556, high: 2234 },
  { city: "Johannesburg", low: 780, high: 1691 },
  { city: "London", low: 1096, high: 1701 },
  { city: "Los Angeles", low: 944, high: 1359 },
  { city: "Madrid", low: 939, high: 1815 },
  { city: "Manchester", low: 1064, high: 1462 },
  { city: "Manila", low: 1577, high: 2228 },
  { city: "Melbourne", low: 1785, high: 2120 },
  { city: "Mexico City", low: 706, high: 1283 },
];

let inserted = 0;
for (const r of rows) {
  await db.insert(plannerFlightCost).values({
    destinationId: DESTINATION_ID,
    originMarket: r.city,
    seasonalBand: SEASONAL_BAND,
    costLow: r.low.toFixed(2),
    costHigh: r.high.toFixed(2),
    currency: "USD",
  }).onConflictDoNothing();
  inserted++;
  console.log(`Seeded: ${r.city} — $${r.low}-${r.high}`);
}

console.log(`\n✓ ${inserted} routes seeded for Sao Paulo (Brazilian GP), seasonal band "${SEASONAL_BAND}".`);
console.log("Batch 2 of 2 (24 remaining origin markets, Miami-Zurich) still to come.");

await client.end();
