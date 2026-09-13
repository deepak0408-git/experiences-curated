// Qatar GP 2026 — Season Planner flight cost data, initial seeding pass.
// Methodology: planner-data-researcher skill, Flights section (locked).
// Google Flights + Kayak, round-trip economy <=1 stop, 22 Nov - 4 Dec 2026
// window (event dates 27-29 Nov +/- 5 days), combined-dataset density-
// boundary outlier exclusion. All 49 origin markets researched 13 Sep 2026.
//
// 3 founder overrides after reviewing the researcher's proposed ranges
// (13 Sep 2026) — all real observed values from the raw data, not invented:
// - Buenos Aires: $1651-1912 (Kayak's own range; the combined-dataset test
//   found no cluster meeting the density threshold at all for this route —
//   GF $2379-8831 vs Kayak $1651-1912 never overlapped — so the founder
//   chose Kayak's internally-consistent range over an unreliable computed one)
// - Hong Kong: $436-960 (wider low end than the computed $744-960, pulling
//   in more of Kayak's own observed low range)
// - Milan: $336-1181 (average low $336, but Kayak's raw high $1181 instead
//   of the computed final's $1369)
//
// Doha is itself one of the 49 origin markets — same-city rule applies,
// seeded as $0/$0 (no flight needed), not researched.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerFlightCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const SEASONAL_BAND = "nov";

const ROUTES = [
  ["Cairo", 348, 756],
  ["Casablanca", 545, 984],
  ["Johannesburg", 567, 918],
  ["Nairobi", 374, 779],
  ["Bangalore", 348, 909],
  ["Beijing", 644, 1256],
  ["Doha", 0, 0], // same-city rule — no flight needed
  ["Dubai", 297, 811],
  ["Hong Kong", 436, 960], // FOUNDER OVERRIDE
  ["Manila", 616, 1348],
  ["Melbourne", 1128, 1935],
  ["Mumbai", 299, 710],
  ["New Delhi", 341, 853],
  ["Seoul", 892, 1236],
  ["Shanghai", 527, 863],
  ["Singapore", 501, 836],
  ["Sydney", 1248, 1804],
  ["Tokyo", 1114, 1758],
  ["Amsterdam", 431, 1056],
  ["Barcelona", 597, 1028],
  ["Berlin", 418, 885],
  ["Dublin", 541, 1030],
  ["London", 604, 1094],
  ["Madrid", 493, 1032],
  ["Manchester", 633, 1020],
  ["Milan", 336, 1181], // FOUNDER OVERRIDE
  ["Moscow", 694, 1343], // single-source, Google Flights only
  ["Munich", 383, 944],
  ["Paris", 480, 1247],
  ["Rome", 336, 1318],
  ["Stockholm", 416, 641],
  ["Zurich", 465, 1190],
  ["Buenos Aires", 1651, 1912], // FOUNDER OVERRIDE
  ["Mexico City", 1649, 1799],
  ["Rio de Janeiro", 1392, 1926],
  ["Sao Paulo", 1439, 1754],
  ["Atlanta", 985, 1845],
  ["Boston", 942, 1201],
  ["Chicago", 880, 1509],
  ["Dallas", 914, 1444],
  ["Los Angeles", 1203, 1474],
  ["Miami", 861, 1779],
  ["Montreal", 925, 1741],
  ["New York City", 932, 1598],
  ["Philadelphia", 1049, 1446],
  ["San Francisco", 1149, 1286],
  ["Toronto", 997, 1577],
  ["Vancouver", 1231, 1571],
  ["Washington D.C.", 954, 1527],
];

async function main() {
  let inserted = 0;
  for (const [originMarket, costLow, costHigh] of ROUTES) {
    await db.insert(plannerFlightCost).values({
      destinationId: DOHA_ID,
      originMarket,
      seasonalBand: SEASONAL_BAND,
      costLow: costLow.toFixed(2),
      costHigh: costHigh.toFixed(2),
      currency: "USD",
      refreshPass: "initial",
    }).onConflictDoNothing();
    inserted++;
  }
  console.log(`Seeded ${inserted} flight cost rows for Doha (${SEASONAL_BAND}).`);
}

main().then(() => client.end()).catch(async (err) => {
  console.error(err);
  await client.end();
  process.exit(1);
});
