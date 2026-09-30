// Japanese GP 2027 (Suzuka) — Season Planner flight cost data, initial
// seeding pass. Methodology: planner-data-researcher skill, Flights
// section (locked). Google Flights + Kayak, round-trip economy <=1 stop,
// 2027-04-04 - 2027-04-16 window (event dates 9-11 Apr +/- 5 days),
// combined-dataset density-boundary outlier exclusion. All 49 origin
// markets researched 22 Sep 2026.
//
// Destination airport used for search: NRT (Tokyo Narita), per explicit
// founder direction — Suzuka's own destinations.nearestAirportIata stays
// NGO (Chubu Centrair, the geographically closer airport), used elsewhere
// for getting-there copy. NRT was chosen because most international fans
// fly into Tokyo and take the Shinkansen, not fly directly into regional
// NGO. This is a research-only substitution, not a DB field change.
//
// Tokyo is itself one of the 49 origin markets and shares the NRT airport
// used as the destination — same-city rule applies, seeded as $0/$0 (no
// flight needed), not researched.
//
// 2 founder decisions on single-source/anomalous routes (22 Sep 2026):
// - Doha: Google Flights returned 0 results (site-side issue, not a real
//   route gap); Kayak's own 28-point sample formed one clean dense cluster
//   with zero exclusions. Founder approved the single-source Kayak range
//   as-is: $1156-1399.
// - Moscow: Kayak returned 0 (recurring EU-airspace-closure gap, consistent
//   with prior events per skill). Google Flights' own 23 points split into
//   two disconnected dense clusters — a low one ($1183-1579) and a denser,
//   larger one ($2191-2538) that the density-boundary algorithm excluded
//   as "not contiguous with the low cluster." Founder reviewed both and
//   chose the low cluster: $1183-1579.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerFlightCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SUZUKA_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const SEASONAL_BAND = "apr";
const EDITION_YEAR = 2027;

const ROUTES = [
  ["Atlanta", 1532, 2729],
  ["Boston", 1288, 2541],
  ["Chicago", 1185, 1932],
  ["Dallas", 1089, 1288],
  ["Los Angeles", 929, 1790],
  ["Miami", 1390, 2951],
  ["Montreal", 1365, 1907],
  ["New York City", 1160, 2015],
  ["Philadelphia", 1238, 2147],
  ["San Francisco", 945, 1814],
  ["Toronto", 1360, 2184],
  ["Vancouver", 919, 1806],
  ["Washington D.C.", 1112, 2258],
  ["Amsterdam", 1154, 2698],
  ["Barcelona", 1243, 2869],
  ["Berlin", 1239, 2096],
  ["Dublin", 1473, 2239],
  ["London", 1415, 2786],
  ["Madrid", 1173, 1973],
  ["Manchester", 1574, 2411],
  ["Milan", 1177, 2127],
  ["Moscow", 1183, 1579], // FOUNDER DECISION — single-source (GF only), low cluster chosen
  ["Munich", 1255, 2789],
  ["Paris", 1363, 2564],
  ["Rome", 1282, 2271],
  ["Stockholm", 1153, 1861],
  ["Zurich", 1371, 2169],
  ["Bangalore", 797, 1419],
  ["Beijing", 456, 1108],
  ["Doha", 1156, 1399], // FOUNDER DECISION — single-source (Kayak only), approved as-is
  ["Dubai", 989, 2208],
  ["Hong Kong", 327, 955],
  ["Manila", 255, 884],
  ["Melbourne", 819, 2099],
  ["Mumbai", 663, 1295],
  ["New Delhi", 656, 1744],
  ["Seoul", 329, 748],
  ["Shanghai", 422, 986],
  ["Singapore", 451, 928],
  ["Sydney", 821, 1584],
  ["Tokyo", 0, 0], // same-city rule — NRT is Tokyo's own airport, no flight needed
  ["Buenos Aires", 2851, 3729],
  ["Mexico City", 1513, 2356],
  ["Rio de Janeiro", 1731, 2046],
  ["Sao Paulo", 1448, 2430],
  ["Cairo", 1122, 1522],
  ["Casablanca", 1535, 2267],
  ["Johannesburg", 968, 1866],
  ["Nairobi", 1312, 1402],
];

async function main() {
  let inserted = 0;
  for (const [originMarket, costLow, costHigh] of ROUTES) {
    await db.insert(plannerFlightCost).values({
      destinationId: SUZUKA_ID,
      originMarket,
      seasonalBand: SEASONAL_BAND,
      editionYear: EDITION_YEAR,
      costLow: costLow.toFixed(2),
      costHigh: costHigh.toFixed(2),
      currency: "USD",
      refreshPass: "initial",
    }).onConflictDoNothing();
    inserted++;
  }
  console.log(`Seeded ${inserted} flight cost rows for Suzuka/Japanese GP 2027 (${SEASONAL_BAND} ${EDITION_YEAR}).`);
}

main().then(() => client.end()).catch(async (err) => {
  console.error(err);
  await client.end();
  process.exit(1);
});
