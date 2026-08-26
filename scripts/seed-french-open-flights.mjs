import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerFlightCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "488adb47-5327-43e2-8206-d40480301962"; // Paris
const SEASONAL_BAND = "may";

// French Open 2027 flight cost data — approved by founder 26 Aug 2026.
// Milan, Seoul, Tokyo, Sao Paulo use revised high cutoffs per founder
// instruction to also exclude one additional near-boundary price each
// (1102, 1675, 2337, 2075 respectively) beyond the tool's own density cutoff.
const rows = [
  { originMarket: "Atlanta", costLow: "1102.00", costHigh: "1891.00" },
  { originMarket: "Boston", costLow: "922.00", costHigh: "1382.00" },
  { originMarket: "Chicago", costLow: "811.00", costHigh: "1220.00" },
  { originMarket: "Dallas", costLow: "920.00", costHigh: "1331.00" },
  { originMarket: "Los Angeles", costLow: "887.00", costHigh: "1899.00" },
  { originMarket: "Miami", costLow: "783.00", costHigh: "1542.00" },
  { originMarket: "Montreal", costLow: "605.00", costHigh: "923.00" },
  { originMarket: "New York City", costLow: "675.00", costHigh: "1108.00" },
  { originMarket: "Philadelphia", costLow: "933.00", costHigh: "1203.00" },
  { originMarket: "San Francisco", costLow: "888.00", costHigh: "1958.00" },
  { originMarket: "Toronto", costLow: "697.00", costHigh: "1094.00" },
  { originMarket: "Vancouver", costLow: "769.00", costHigh: "1164.00" },
  { originMarket: "Washington D.C.", costLow: "973.00", costHigh: "1640.00" },
  { originMarket: "Amsterdam", costLow: "218.00", costHigh: "417.00" },
  { originMarket: "Barcelona", costLow: "140.00", costHigh: "625.00" },
  { originMarket: "Berlin", costLow: "189.00", costHigh: "468.00" },
  { originMarket: "Dublin", costLow: "199.00", costHigh: "434.00" },
  { originMarket: "Madrid", costLow: "146.00", costHigh: "488.00" },
  { originMarket: "Manchester", costLow: "149.00", costHigh: "428.00" },
  { originMarket: "Milan", costLow: "135.00", costHigh: "662.00" },
  { originMarket: "Munich", costLow: "264.00", costHigh: "347.00" },
  { originMarket: "Stockholm", costLow: "177.00", costHigh: "197.00" },
  { originMarket: "Zurich", costLow: "285.00", costHigh: "387.00" },
  { originMarket: "Bangalore", costLow: "570.00", costHigh: "1038.00" },
  { originMarket: "Beijing", costLow: "793.00", costHigh: "1419.00" },
  { originMarket: "Doha", costLow: "670.00", costHigh: "963.00" },
  { originMarket: "Dubai", costLow: "470.00", costHigh: "977.00" },
  { originMarket: "Hong Kong", costLow: "574.00", costHigh: "1446.00" },
  { originMarket: "Manila", costLow: "800.00", costHigh: "1160.00" },
  { originMarket: "Melbourne", costLow: "1055.00", costHigh: "1728.00" },
  { originMarket: "Mumbai", costLow: "463.00", costHigh: "1149.00" },
  { originMarket: "New Delhi", costLow: "517.00", costHigh: "1236.00" },
  { originMarket: "Seoul", costLow: "762.00", costHigh: "1259.00" },
  { originMarket: "Shanghai", costLow: "890.00", costHigh: "1015.00" },
  { originMarket: "Singapore", costLow: "698.00", costHigh: "1039.00" },
  { originMarket: "Sydney", costLow: "937.00", costHigh: "1840.00" },
  { originMarket: "Tokyo", costLow: "945.00", costHigh: "1751.00" },
  { originMarket: "Buenos Aires", costLow: "1286.00", costHigh: "2015.00" },
  { originMarket: "Mexico City", costLow: "987.00", costHigh: "1345.00" },
  { originMarket: "Rio de Janeiro", costLow: "1057.00", costHigh: "1361.00" },
  { originMarket: "Sao Paulo", costLow: "996.00", costHigh: "1689.00" },
  { originMarket: "Cairo", costLow: "342.00", costHigh: "755.00" },
  { originMarket: "Casablanca", costLow: "235.00", costHigh: "658.00" },
  { originMarket: "Johannesburg", costLow: "817.00", costHigh: "1089.00" },
  { originMarket: "Nairobi", costLow: "833.00", costHigh: "1269.00" },
  // London and Rome: Google Flights' own high ($905/$977) read as premium-
  // cabin outliers on two of the shortest, cheapest routes in the batch —
  // founder judged the averaged figure too high and asked to use Kayak's
  // own real range alone instead (single-source, by explicit choice, not a
  // data gap). 26 Aug 2026.
  { originMarket: "London", costLow: "155.00", costHigh: "323.00" },
  { originMarket: "Rome", costLow: "192.00", costHigh: "247.00" },
];

if (rows.length !== 47) {
  throw new Error(`Expected 47 rows, got ${rows.length}`);
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
