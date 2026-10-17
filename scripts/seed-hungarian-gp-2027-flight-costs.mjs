import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerFlightCost } from "../schema/database.ts";

// Hungarian GP 2027 (Budapest) — full 49-origin flight cost research,
// planner-data-researcher skill methodology (Google Flights + Kayak,
// round-trip, <=1 stop, economy, combined-dataset density-boundary outlier
// exclusion). Window: 25 Jul - 6 Aug 2027 (event dates 30 Jul - 1 Aug 2027,
// +/-5 days). Presented to founder as a consolidated artifact, 16 Oct 2026.
//
// Paris corrected post-presentation: the tool's Google Flights fetch had no
// explicit economy-class filter, which silently pulled in a real but
// disconnected premium-cabin cluster ($745-1440) alongside the real economy
// dense body (which tops out at $634). Founder caught this live by asking
// for the raw data points. Fixed value used here: $220-634. The underlying
// tool (_flight-research-tool.mjs) has been patched to explicitly select
// the Economy cabin-class filter going forward — not yet re-verified against
// a live fetch, so every other route's range here is accepted as-is per
// founder instruction ("seed everything else as in the artifact"), not
// re-audited for the same contamination.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BUDAPEST_DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const SEASONAL_BAND = "jul";
const EDITION_YEAR = 2027;

const ROWS = [
  { originMarket: "Amsterdam", costLow: 226, costHigh: 552 },
  { originMarket: "Atlanta", costLow: 983, costHigh: 1103 },
  { originMarket: "Bangalore", costLow: 699, costHigh: 822 },
  { originMarket: "Barcelona", costLow: 132, costHigh: 502 },
  { originMarket: "Beijing", costLow: 982, costHigh: 1395 },
  { originMarket: "Berlin", costLow: 125, costHigh: 368 },
  { originMarket: "Boston", costLow: 867, costHigh: 993 },
  { originMarket: "Buenos Aires", costLow: 1287, costHigh: 1849 },
  { originMarket: "Cairo", costLow: 478, costHigh: 525 },
  { originMarket: "Casablanca", costLow: 327, costHigh: 427 },
  { originMarket: "Chicago", costLow: 883, costHigh: 1066 },
  { originMarket: "Dallas", costLow: 1006, costHigh: 1076 },
  { originMarket: "Doha", costLow: 808, costHigh: 1086 },
  { originMarket: "Dubai", costLow: 654, costHigh: 858 },
  { originMarket: "Dublin", costLow: 231, costHigh: 606 },
  { originMarket: "Hong Kong", costLow: 895, costHigh: 1414 },
  { originMarket: "Johannesburg", costLow: 908, costHigh: 1176 },
  { originMarket: "London", costLow: 242, costHigh: 580 },
  { originMarket: "Los Angeles", costLow: 968, costHigh: 1382 },
  { originMarket: "Madrid", costLow: 198, costHigh: 520 },
  { originMarket: "Manchester", costLow: 337, costHigh: 626 },
  { originMarket: "Manila", costLow: 996, costHigh: 1033 },
  { originMarket: "Melbourne", costLow: 1112, costHigh: 1629 },
  { originMarket: "Mexico City", costLow: 1073, costHigh: 1424 },
  { originMarket: "Miami", costLow: 884, costHigh: 917 },
  { originMarket: "Milan", costLow: 83, costHigh: 446 },
  { originMarket: "Montreal", costLow: 1035, costHigh: 1181 },
  { originMarket: "Moscow", costLow: 1558, costHigh: 1686 },
  { originMarket: "Mumbai", costLow: 712, costHigh: 1052 },
  { originMarket: "Munich", costLow: 270, costHigh: 292 },
  { originMarket: "Nairobi", costLow: 1009, costHigh: 1294 },
  { originMarket: "New Delhi", costLow: 565, costHigh: 712 },
  { originMarket: "New York City", costLow: 838, costHigh: 1096 },
  { originMarket: "Paris", costLow: 220, costHigh: 634 }, // founder-corrected, see header
  { originMarket: "Philadelphia", costLow: 854, costHigh: 1051 },
  { originMarket: "Rio de Janeiro", costLow: 1409, costHigh: 1658 },
  { originMarket: "Rome", costLow: 123, costHigh: 414 },
  { originMarket: "San Francisco", costLow: 998, costHigh: 1266 },
  { originMarket: "Sao Paulo", costLow: 1216, costHigh: 1400 },
  { originMarket: "Seoul", costLow: 910, costHigh: 1424 },
  { originMarket: "Shanghai", costLow: 1012, costHigh: 1146 },
  { originMarket: "Singapore", costLow: 759, costHigh: 947 },
  { originMarket: "Stockholm", costLow: 199, costHigh: 364 },
  { originMarket: "Sydney", costLow: 1133, costHigh: 1563 },
  { originMarket: "Tokyo", costLow: 1286, costHigh: 1783 },
  { originMarket: "Toronto", costLow: 935, costHigh: 1166 },
  { originMarket: "Vancouver", costLow: 1087, costHigh: 1360 },
  { originMarket: "Washington D.C.", costLow: 963, costHigh: 1045 },
  { originMarket: "Zurich", costLow: 257, costHigh: 488 },
];

for (const r of ROWS) {
  const [row] = await db
    .insert(plannerFlightCost)
    .values({
      destinationId: BUDAPEST_DESTINATION_ID,
      originMarket: r.originMarket,
      seasonalBand: SEASONAL_BAND,
      editionYear: EDITION_YEAR,
      costLow: r.costLow.toFixed(2),
      costHigh: r.costHigh.toFixed(2),
      currency: "USD",
    })
    .onConflictDoUpdate({
      target: [
        plannerFlightCost.destinationId,
        plannerFlightCost.originMarket,
        plannerFlightCost.seasonalBand,
        plannerFlightCost.editionYear,
      ],
      set: {
        costLow: r.costLow.toFixed(2),
        costHigh: r.costHigh.toFixed(2),
        currency: "USD",
        lastUpdated: new Date(),
      },
    })
    .returning({ originMarket: plannerFlightCost.originMarket, costLow: plannerFlightCost.costLow, costHigh: plannerFlightCost.costHigh });
  console.log(`✓ ${row.originMarket}: $${row.costLow}-${row.costHigh}`);
}

console.log(`\nSeeded ${ROWS.length} origin markets for Budapest (Hungarian GP 2027, jul).`);

await client.end();
