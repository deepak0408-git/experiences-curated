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
// exclusion), 12 Sep 2026. Batch 2 of 2 (24 remaining origin markets,
// Miami-Zurich), founder-approved as-is. Search window 1-13 Nov 2026 (event
// dates 6-8 Nov 2026, +/-5 days), round-trip, <=1 stop, economy.
// Moscow is single-source: Kayak returned zero results, a documented,
// recurring, event-independent gap for this origin (SVO effectively cut
// off from EU routing since the 2022 airspace closure) — treated as
// single-source after 1 confirming attempt per the skill's standing rule,
// not retried 3x. Its narrower range is a real output of the algorithm on
// a thin single-site sample (n=24), not a data error.
const rows = [
  { city: "Miami", low: 648, high: 1331 },
  { city: "Milan", low: 965, high: 1499 },
  { city: "Montreal", low: 907, high: 1481 },
  { city: "Moscow", low: 1674, high: 1877 }, // single-source: Google Flights only, Kayak returned 0 results
  { city: "Mumbai", low: 1551, high: 1954 },
  { city: "Munich", low: 1120, high: 1683 },
  { city: "Nairobi", low: 1761, high: 2065 },
  { city: "New Delhi", low: 1393, high: 2336 },
  { city: "New York City", low: 857, high: 1354 },
  { city: "Paris", low: 1040, high: 1702 },
  { city: "Philadelphia", low: 1145, high: 1401 },
  { city: "Rio de Janeiro", low: 126, high: 516 },
  { city: "Rome", low: 993, high: 1529 },
  { city: "San Francisco", low: 863, high: 1390 },
  { city: "Seoul", low: 2030, high: 2441 },
  { city: "Shanghai", low: 1438, high: 1899 },
  { city: "Singapore", low: 1676, high: 2243 },
  { city: "Stockholm", low: 1064, high: 1492 },
  { city: "Sydney", low: 1985, high: 2432 },
  { city: "Tokyo", low: 1916, high: 3088 },
  { city: "Toronto", low: 730, high: 1193 },
  { city: "Vancouver", low: 945, high: 1015 },
  { city: "Washington D.C.", low: 844, high: 1331 },
  { city: "Zurich", low: 994, high: 1542 },
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

// Same-city origin — Sao Paulo IS the destination, per the skill's standing
// rule: seed 0.00-0.00 directly, no research needed.
await db.insert(plannerFlightCost).values({
  destinationId: DESTINATION_ID,
  originMarket: "Sao Paulo",
  seasonalBand: SEASONAL_BAND,
  costLow: "0.00",
  costHigh: "0.00",
  currency: "USD",
}).onConflictDoNothing();
inserted++;
console.log("Seeded: Sao Paulo — $0-0 (same-city origin)");

console.log(`\n✓ ${inserted} routes seeded for Sao Paulo (Brazilian GP), seasonal band "${SEASONAL_BAND}".`);
console.log("Flight cost research complete: all 49 origin markets now seeded (48 researched + 1 same-city).");

await client.end();
