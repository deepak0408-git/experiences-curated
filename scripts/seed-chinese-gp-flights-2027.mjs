import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerFlightCost } from "../schema/database.ts";

// Chinese Grand Prix 2027 (Shanghai International Circuit, Apr 16-18 2027)
// Flight cost research — Google Flights + Kayak, round-trip, <=1 stop, economy,
// search window Apr 11-23 2027. Combined-dataset density-boundary outlier
// exclusion per planner-data-researcher skill. Researched 23 Sep 2026.
// Reviewed and approved by curator via Artifact table before this script ran.
//
// Single-source rows (documented, not silently thin data):
//   Bangalore    - Google Flights returned only 1 point ($903), excluded as a
//                  high outlier vs Kayak's dense 62-point cluster -> Kayak-only.
//   Buenos Aires - Google Flights returned 0 results -> Kayak-only.
//   Moscow       - Kayak returned 0 results, the established recurring SVO gap
//                  documented in the skill -> Google Flights-only.
// Shanghai is the event's own destination (same-city origin) -> $0/$0 per the
// skill's standing same-city rule, no research needed.

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963"; // Shanghai
const EDITION_YEAR = 2027;
const SEASONAL_BAND = "apr";

const rows = [
  { originMarket: "Amsterdam", costLow: 836, costHigh: 1279 },
  { originMarket: "Atlanta", costLow: 988, costHigh: 1775 },
  { originMarket: "Bangalore", costLow: 460, costHigh: 652 },
  { originMarket: "Barcelona", costLow: 708, costHigh: 1268 },
  { originMarket: "Beijing", costLow: 507, costHigh: 711 },
  { originMarket: "Berlin", costLow: 759, costHigh: 1470 },
  { originMarket: "Boston", costLow: 936, costHigh: 1913 },
  { originMarket: "Buenos Aires", costLow: 1892, costHigh: 2344 },
  { originMarket: "Cairo", costLow: 696, costHigh: 977 },
  { originMarket: "Casablanca", costLow: 753, costHigh: 1250 },
  { originMarket: "Chicago", costLow: 989, costHigh: 1708 },
  { originMarket: "Dallas", costLow: 943, costHigh: 1479 },
  { originMarket: "Doha", costLow: 764, costHigh: 1033 },
  { originMarket: "Dubai", costLow: 802, costHigh: 979 },
  { originMarket: "Dublin", costLow: 817, costHigh: 1211 },
  { originMarket: "Hong Kong", costLow: 395, costHigh: 509 },
  { originMarket: "Johannesburg", costLow: 945, costHigh: 1220 },
  { originMarket: "London", costLow: 768, costHigh: 1691 },
  { originMarket: "Los Angeles", costLow: 891, costHigh: 1724 },
  { originMarket: "Madrid", costLow: 715, costHigh: 1251 },
  { originMarket: "Manchester", costLow: 788, costHigh: 1574 },
  { originMarket: "Manila", costLow: 304, costHigh: 463 },
  { originMarket: "Melbourne", costLow: 612, costHigh: 1138 },
  { originMarket: "Mexico City", costLow: 1325, costHigh: 2221 },
  { originMarket: "Miami", costLow: 1190, costHigh: 1770 },
  { originMarket: "Milan", costLow: 667, costHigh: 2059 },
  { originMarket: "Montreal", costLow: 1079, costHigh: 1640 },
  { originMarket: "Moscow", costLow: 695, costHigh: 2144 },
  { originMarket: "Mumbai", costLow: 511, costHigh: 782 },
  { originMarket: "Munich", costLow: 775, costHigh: 1576 },
  { originMarket: "Nairobi", costLow: 877, costHigh: 1171 },
  { originMarket: "New Delhi", costLow: 418, costHigh: 854 },
  { originMarket: "New York City", costLow: 935, costHigh: 2033 },
  { originMarket: "Paris", costLow: 738, costHigh: 1938 },
  { originMarket: "Philadelphia", costLow: 935, costHigh: 1373 },
  { originMarket: "Rio de Janeiro", costLow: 1741, costHigh: 1929 },
  { originMarket: "Rome", costLow: 748, costHigh: 1041 },
  { originMarket: "San Francisco", costLow: 939, costHigh: 1715 },
  { originMarket: "Sao Paulo", costLow: 1700, costHigh: 2039 },
  { originMarket: "Seoul", costLow: 254, costHigh: 1229 },
  { originMarket: "Shanghai", costLow: 0, costHigh: 0 }, // same-city origin
  { originMarket: "Singapore", costLow: 308, costHigh: 707 },
  { originMarket: "Stockholm", costLow: 715, costHigh: 1140 },
  { originMarket: "Sydney", costLow: 686, costHigh: 1584 },
  { originMarket: "Tokyo", costLow: 411, costHigh: 1468 },
  { originMarket: "Toronto", costLow: 1042, costHigh: 1676 },
  { originMarket: "Vancouver", costLow: 771, costHigh: 1834 },
  { originMarket: "Washington D.C.", costLow: 994, costHigh: 1704 },
  { originMarket: "Zurich", costLow: 851, costHigh: 2040 },
];

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const values = rows.map((r) => ({
  destinationId: DESTINATION_ID,
  originMarket: r.originMarket,
  seasonalBand: SEASONAL_BAND,
  editionYear: EDITION_YEAR,
  costLow: r.costLow.toFixed(2),
  costHigh: r.costHigh.toFixed(2),
  currency: "USD",
  refreshPass: "initial",
}));

await db.insert(plannerFlightCost).values(values).onConflictDoNothing();

console.log(`Seeded ${values.length} planner_flight_cost rows for Chinese GP 2027 (Shanghai, ${SEASONAL_BAND} ${EDITION_YEAR}).`);
await client.end();
