import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { plannerFlightCost } from "../schema/database.ts";

// Belgian GP 2027 flight cost seeding — planner-data-researcher skill.
// 49 origin markets, round-trip economy, <=1 stop, search window 18-30 Jul
// 2027 (event 23-25 Jul 2027, +/-5 days). Sources: Google Flights + Kayak,
// combined-dataset density-boundary outlier exclusion. Founder-approved
// 12 Oct 2026 after reviewing the full 49-row artifact
// (https://claude.ai/artifact/LNGprpkZTYoUcrXAu2LbrB).
//
// 3 single-source routes (flagged in the artifact, not silently normal):
// - Moscow: Kayak has no inventory (standing documented pattern, confirmed
//   across multiple prior events -- EU airspace closure to Russian
//   carriers). Google Flights' own 5-point sample was too thin for the
//   standard density test; manually read as a 2-point economy cluster vs.
//   a 3-point sparse premium-cabin tail.
// - New Delhi, Philadelphia: Google Flights returned only 1 point each
//   after retries, correctly excluded as a high outlier against Kayak's
//   real, dense cluster -- effectively Kayak-only.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "101b815a-ba64-4484-aad6-63721a44ed85"; // Belgian Ardennes
const EDITION_YEAR = 2027;
const SEASONAL_BAND = "jul";
const CURRENCY = "USD";

const ROWS = [
  { originMarket: "Amsterdam", costLow: 278, costHigh: 555 },
  { originMarket: "Atlanta", costLow: 1374, costHigh: 1421 },
  { originMarket: "Bangalore", costLow: 708, costHigh: 1113 },
  { originMarket: "Barcelona", costLow: 102, costHigh: 507 },
  { originMarket: "Beijing", costLow: 1214, costHigh: 1585 },
  { originMarket: "Berlin", costLow: 202, costHigh: 376 },
  { originMarket: "Boston", costLow: 872, costHigh: 1136 },
  { originMarket: "Buenos Aires", costLow: 1758, costHigh: 1914 },
  { originMarket: "Cairo", costLow: 416, costHigh: 725 },
  { originMarket: "Casablanca", costLow: 300, costHigh: 883 },
  { originMarket: "Chicago", costLow: 1103, costHigh: 1543 },
  { originMarket: "Dallas", costLow: 1136, costHigh: 1177 },
  { originMarket: "Doha", costLow: 899, costHigh: 1270 },
  { originMarket: "Dubai", costLow: 600, costHigh: 733 },
  { originMarket: "Dublin", costLow: 140, costHigh: 575 },
  { originMarket: "Hong Kong", costLow: 926, costHigh: 1088 },
  { originMarket: "Johannesburg", costLow: 851, costHigh: 1118 },
  { originMarket: "London", costLow: 152, costHigh: 593 },
  { originMarket: "Los Angeles", costLow: 906, costHigh: 1353 },
  { originMarket: "Madrid", costLow: 264, costHigh: 444 },
  { originMarket: "Manchester", costLow: 247, costHigh: 519 },
  { originMarket: "Manila", costLow: 1072, costHigh: 1600 },
  { originMarket: "Melbourne", costLow: 1549, costHigh: 2017 },
  { originMarket: "Mexico City", costLow: 1138, costHigh: 1512 },
  { originMarket: "Miami", costLow: 1031, costHigh: 1221 },
  { originMarket: "Milan", costLow: 221, costHigh: 293 },
  { originMarket: "Montreal", costLow: 896, costHigh: 1225 },
  { originMarket: "Moscow", costLow: 1044, costHigh: 1238 },
  { originMarket: "Mumbai", costLow: 727, costHigh: 1117 },
  { originMarket: "Munich", costLow: 200, costHigh: 200 },
  { originMarket: "Nairobi", costLow: 1031, costHigh: 1684 },
  { originMarket: "New Delhi", costLow: 530, costHigh: 808 },
  { originMarket: "New York City", costLow: 796, costHigh: 949 },
  { originMarket: "Paris", costLow: 315, costHigh: 469 },
  { originMarket: "Philadelphia", costLow: 920, costHigh: 962 },
  { originMarket: "Rio de Janeiro", costLow: 1274, costHigh: 1591 },
  { originMarket: "Rome", costLow: 120, costHigh: 291 },
  { originMarket: "San Francisco", costLow: 1019, costHigh: 1056 },
  { originMarket: "Sao Paulo", costLow: 1200, costHigh: 1769 },
  { originMarket: "Seoul", costLow: 1138, costHigh: 1409 },
  { originMarket: "Shanghai", costLow: 995, costHigh: 1342 },
  { originMarket: "Singapore", costLow: 918, costHigh: 1406 },
  { originMarket: "Stockholm", costLow: 296, costHigh: 461 },
  { originMarket: "Sydney", costLow: 1437, costHigh: 1700 },
  { originMarket: "Tokyo", costLow: 1504, costHigh: 2207 },
  { originMarket: "Toronto", costLow: 878, costHigh: 1229 },
  { originMarket: "Vancouver", costLow: 978, costHigh: 1207 },
  { originMarket: "Washington D.C.", costLow: 1057, costHigh: 1964 },
  { originMarket: "Zurich", costLow: 273, costHigh: 522 },
];

if (ROWS.length !== 49) throw new Error(`Expected 49 rows, got ${ROWS.length}`);

const values = ROWS.map((r) => ({
  destinationId: DESTINATION_ID,
  originMarket: r.originMarket,
  seasonalBand: SEASONAL_BAND,
  editionYear: EDITION_YEAR,
  costLow: String(r.costLow),
  costHigh: String(r.costHigh),
  currency: CURRENCY,
  refreshPass: "initial",
}));

const inserted = await db
  .insert(plannerFlightCost)
  .values(values)
  .onConflictDoUpdate({
    target: [plannerFlightCost.destinationId, plannerFlightCost.originMarket, plannerFlightCost.seasonalBand, plannerFlightCost.editionYear],
    set: {
      costLow: sql`excluded.cost_low`,
      costHigh: sql`excluded.cost_high`,
      currency: sql`excluded.currency`,
      lastUpdated: new Date(),
    },
  })
  .returning({ originMarket: plannerFlightCost.originMarket });

console.log(`✓ Seeded ${inserted.length} flight cost rows for Belgian Ardennes (edition ${EDITION_YEAR}, band ${SEASONAL_BAND})`);
await client.end();
