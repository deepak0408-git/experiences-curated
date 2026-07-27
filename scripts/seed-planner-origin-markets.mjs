import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// 48 origin cities with real IATA codes — researched and confirmed with user
// 19 Jul 2026 (2 genuine judgment calls resolved: Belgian Ardennes -> BRU
// over LGG for fare-data reliability; Tokyo -> NRT over HND). Replaces the
// ORIGIN_MARKETS TS const as the source of truth — Screen 1's dropdown now
// reads from this table.

const CITIES = [
  // North America
  { city: "Atlanta", region: "North America", iata: "ATL" },
  { city: "Boston", region: "North America", iata: "BOS" },
  { city: "Chicago", region: "North America", iata: "ORD" },
  { city: "Dallas", region: "North America", iata: "DFW" },
  { city: "Los Angeles", region: "North America", iata: "LAX" },
  { city: "Miami", region: "North America", iata: "MIA" },
  { city: "Montreal", region: "North America", iata: "YUL" },
  { city: "New York City", region: "North America", iata: "JFK" },
  { city: "Philadelphia", region: "North America", iata: "PHL" },
  { city: "San Francisco", region: "North America", iata: "SFO" },
  { city: "Toronto", region: "North America", iata: "YYZ" },
  { city: "Vancouver", region: "North America", iata: "YVR" },
  { city: "Washington D.C.", region: "North America", iata: "IAD" },
  // Europe
  { city: "Amsterdam", region: "Europe", iata: "AMS" },
  { city: "Barcelona", region: "Europe", iata: "BCN" },
  { city: "Berlin", region: "Europe", iata: "BER" },
  { city: "Dublin", region: "Europe", iata: "DUB" },
  { city: "London", region: "Europe", iata: "LHR" },
  { city: "Madrid", region: "Europe", iata: "MAD" },
  { city: "Manchester", region: "Europe", iata: "MAN" },
  { city: "Milan", region: "Europe", iata: "MXP" },
  { city: "Moscow", region: "Europe", iata: "SVO" },
  { city: "Munich", region: "Europe", iata: "MUC" },
  { city: "Paris", region: "Europe", iata: "CDG" },
  { city: "Rome", region: "Europe", iata: "FCO" },
  { city: "Stockholm", region: "Europe", iata: "ARN" },
  { city: "Zurich", region: "Europe", iata: "ZRH" },
  // Asia-Pacific
  { city: "Bangalore", region: "Asia-Pacific", iata: "BLR" },
  { city: "Beijing", region: "Asia-Pacific", iata: "PEK" },
  { city: "Doha", region: "Asia-Pacific", iata: "DOH" },
  { city: "Dubai", region: "Asia-Pacific", iata: "DXB" },
  { city: "Hong Kong", region: "Asia-Pacific", iata: "HKG" },
  { city: "Manila", region: "Asia-Pacific", iata: "MNL" },
  { city: "Melbourne", region: "Asia-Pacific", iata: "MEL" },
  { city: "Mumbai", region: "Asia-Pacific", iata: "BOM" },
  { city: "New Delhi", region: "Asia-Pacific", iata: "DEL" },
  { city: "Seoul", region: "Asia-Pacific", iata: "ICN" },
  { city: "Shanghai", region: "Asia-Pacific", iata: "PVG" },
  { city: "Singapore", region: "Asia-Pacific", iata: "SIN" },
  { city: "Sydney", region: "Asia-Pacific", iata: "SYD" },
  { city: "Tokyo", region: "Asia-Pacific", iata: "NRT" },
  // Latin America
  { city: "Buenos Aires", region: "Latin America", iata: "EZE" },
  { city: "Mexico City", region: "Latin America", iata: "MEX" },
  { city: "Rio de Janeiro", region: "Latin America", iata: "GIG" },
  { city: "Sao Paulo", region: "Latin America", iata: "GRU" },
  // Africa
  { city: "Cairo", region: "Africa", iata: "CAI" },
  { city: "Casablanca", region: "Africa", iata: "CMN" },
  { city: "Johannesburg", region: "Africa", iata: "JNB" },
  { city: "Nairobi", region: "Africa", iata: "NBO" },
];

for (const c of CITIES) {
  await sql`
    INSERT INTO planner_origin_markets (city, region, iata_code)
    VALUES (${c.city}, ${c.region}, ${c.iata})
    ON CONFLICT (city) DO UPDATE SET region = ${c.region}, iata_code = ${c.iata}
  `;
}

console.log(`✓ Seeded ${CITIES.length} planner_origin_markets rows`);
await sql.end();
