import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Johannesburg -- batch 1 of remaining 48 origins
// (Amsterdam through Hong Kong alphabetically, 16 real routes + Johannesburg's
// own same-city $0 row = 17 origins x 2 seasons = 34 rows).
// Researched 22 Jul 2026 per the planner-data-researcher skill's Flights
// methodology (2-site combined-dataset density-based outlier exclusion,
// THEN average of each site's own surviving low/high).
//
// Two distinct seasons, both exceeding the 16-day multi-city/long-tour
// threshold, so both use startDate-5/startDate+10 (not endDate+5):
// - "sep" = Australia tour of South Africa 2026 (Sep 24-Oct 31), window
//   Sep 19-Oct 4 2026.
// - "dec" = England tour of South Africa 2026-27 (Dec 17-Jan 15), window
//   Dec 12 2026-Jan 1 2027.
//
// METHODOLOGY CORRECTION 22 Jul 2026: an earlier pass on this exact batch
// wrongly took the raw min/max across the merged GF+Kayak dataset (or, on
// a second wrong attempt, a naive per-site average with NO density
// filtering at all) instead of applying the density-based outlier
// exclusion first and THEN averaging each site's own filtered low/high.
// Corrected before any seeding happened, per explicit user instruction to
// redo with "density + average" -- this is the properly-computed version.
//
// Same-city rule: Johannesburg itself is one of the 49 origin markets AND
// this destination -- seeded as a real $0/$0 row per the standing same-city
// rule (established on NYC/US Open), for both seasons.

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40"; // Johannesburg

const ROUTES = [
  // origin, seasonalBand, costLow, costHigh, note
  { origin: "Amsterdam", band: "sep", costLow: "679.00", costHigh: "1078.00", note: "GF[672-1122] KY[685-1034], no exclusions." },
  { origin: "Amsterdam", band: "dec", costLow: "951.00", costHigh: "1632.00", note: "GF[820-1620] KY[1082-1643], excluded high: $1,941x2/$1,957/$2,040 (sparse tail)." },
  { origin: "Atlanta", band: "sep", costLow: "1233.00", costHigh: "2270.00", note: "GF[1233-2309] KY[1233-2231], excluded low: $435x2 (scraping artifact); high: $2,441 (isolated)." },
  { origin: "Atlanta", band: "dec", costLow: "1868.00", costHigh: "3099.00", note: "GF[1457-3096] KY[2278-3101], excluded low: $435x2; high: $3,306/$3,606x3 (sparse tail)." },
  { origin: "Bangalore", band: "sep", costLow: "1089.00", costHigh: "1783.00", note: "GF[1068-1673] KY[1110-1893], excluded low: $756 (isolated); high: $2,187 (isolated)." },
  { origin: "Bangalore", band: "dec", costLow: "1128.00", costHigh: "1890.00", note: "GF[1132-1857] KY[1123-1922], excluded high: $3,285/$7,897 (sparse tail)." },
  { origin: "Barcelona", band: "sep", costLow: "603.00", costHigh: "1041.00", note: "GF[605-1119] KY[600-963], excluded low: $117 (scraping artifact); high: $1,315 (isolated)." },
  { origin: "Barcelona", band: "dec", costLow: "1200.00", costHigh: "1520.00", note: "GF[1302-1614] KY[1097-1425], excluded low: $759/$779x7 (dense low cluster below main body); high: $1,629-$2,502 (6 values, sparse tail)." },
  { origin: "Beijing", band: "sep", costLow: "1343.00", costHigh: "1774.00", note: "GF[1361-1773] KY[1325-1775], excluded high: $2,008-$8,532 (7 values, sparse premium tail)." },
  { origin: "Beijing", band: "dec", costLow: "1203.00", costHigh: "1767.00", note: "GF[1047-1726] KY[1359-1807], excluded high: $2,069 (isolated)." },
  { origin: "Berlin", band: "sep", costLow: "662.00", costHigh: "1055.00", note: "GF[673-1040] KY[650-1069], excluded high: $1,276/$1,807 (isolated)." },
  { origin: "Berlin", band: "dec", costLow: "1116.00", costHigh: "1879.00", note: "GF[1122-1900] KY[1109-1858], excluded high: $2,069/$2,075 (isolated)." },
  { origin: "Boston", band: "sep", costLow: "1199.00", costHigh: "1662.00", note: "GF[1210-1630] KY[1187-1694], excluded low: $435x2; high: $2,119 (isolated)." },
  { origin: "Boston", band: "dec", costLow: "1945.00", costHigh: "3204.00", note: "GF[1278-3197] KY[2612-3211], excluded low: $435x2; high: $4,577/$12,015x3 (sparse premium tail)." },
  { origin: "Buenos Aires", band: "sep", costLow: "1491.00", costHigh: "2542.00", note: "GF[1458-2590] KY[1523-2493], excluded high: $2,925/$3,034 (isolated)." },
  { origin: "Buenos Aires", band: "dec", costLow: "1415.00", costHigh: "1733.00", note: "GF[1597-1700] KY[1232-1765], excluded high: $2,141-$3,222 (6 values, sparse tail)." },
  { origin: "Cairo", band: "sep", costLow: "586.00", costHigh: "925.00", note: "GF[608-899] KY[563-951], excluded high: $1,190 (isolated)." },
  { origin: "Cairo", band: "dec", costLow: "679.00", costHigh: "802.00", note: "GF[686-779] KY[672-824], excluded high: $1,034x2/$1,173x2 (sparse tail)." },
  { origin: "Casablanca", band: "sep", costLow: "1098.00", costHigh: "1284.00", note: "GF[1103-1331] KY[1093-1236], excluded high: $1,602-$2,274 (6 values, sparse tail)." },
  { origin: "Casablanca", band: "dec", costLow: "1144.00", costHigh: "1597.00", note: "GF[1144-1659] KY[1143-1534], excluded high: $2,145-$2,887 (5 values, sparse tail)." },
  { origin: "Chicago", band: "sep", costLow: "1044.00", costHigh: "2162.00", note: "GF[1052-2224] KY[1036-2100], excluded low: $435x2." },
  { origin: "Chicago", band: "dec", costLow: "1465.00", costHigh: "2928.00", note: "GF[1299-2875] KY[1630-2981], excluded low: $435x2; high: $3,356-$5,464 (7 values, sparse tail)." },
  { origin: "Dallas", band: "sep", costLow: "1273.00", costHigh: "2111.00", note: "GF[1398-2060] KY[1147-2161], excluded low: $435x2; high: $2,190/$2,440/$3,584 (isolated)." },
  { origin: "Dallas", band: "dec", costLow: "1550.00", costHigh: "3260.00", note: "GF[1318-3349] KY[1782-3170], excluded low: $435x2; high: $3,495x2 (isolated)." },
  { origin: "Doha", band: "sep", costLow: "628.00", costHigh: "1463.00", note: "GF[658-1458] KY[598-1468], no exclusions." },
  { origin: "Doha", band: "dec", costLow: "752.00", costHigh: "1426.00", note: "GF[703-1436] KY[800-1415], excluded high: $1,631/$1,893 (isolated)." },
  { origin: "Dubai", band: "sep", costLow: "522.00", costHigh: "982.00", note: "GF[531-894] KY[512-1070], excluded high: $1,903 (isolated)." },
  { origin: "Dubai", band: "dec", costLow: "669.00", costHigh: "1137.00", note: "GF[747-1019] KY[590-1254], excluded high: $1,329x3 (isolated)." },
  { origin: "Dublin", band: "sep", costLow: "734.00", costHigh: "1035.00", note: "GF[746-1071] KY[722-998], excluded high: $1,202/$1,216/$2,008x3 (sparse tail)." },
  { origin: "Dublin", band: "dec", costLow: "1039.00", costHigh: "1525.00", note: "GF[1047-1579] KY[1031-1470], excluded low: $646 (isolated); high: $1,960-$3,612 (7 values, sparse tail)." },
  { origin: "Hong Kong", band: "sep", costLow: "1119.00", costHigh: "2009.00", note: "GF[1063-1725] KY[1175-2292], excluded high: $2,530 (isolated)." },
  { origin: "Hong Kong", band: "dec", costLow: "1070.00", costHigh: "1370.00", note: "GF[1067-1356] KY[1072-1383], no exclusions." },
  { origin: "Johannesburg", band: "sep", costLow: "0.00", costHigh: "0.00", note: "Same-city origin/destination -- Johannesburg is both this destination and one of the 49 origin markets. Seeded as a real $0 'no flight needed' row per the standing same-city rule." },
  { origin: "Johannesburg", band: "dec", costLow: "0.00", costHigh: "0.00", note: "Same-city, dec season. Same reasoning as sep." },
];

for (const r of ROUTES) {
  const result = await sql`
    INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high, refresh_pass)
    VALUES (${DESTINATION_ID}, ${r.origin}, ${r.band}, ${r.costLow}, ${r.costHigh}, 'initial')
    ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      refresh_pass = EXCLUDED.refresh_pass,
      last_updated = NOW()
    RETURNING id
  `;
  console.log(`✓ ${r.origin} (${r.band}) -> Johannesburg seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market, seasonal_band
`;
console.log(`\nAll Johannesburg flight cost rows (${rows.length} total):`);
console.table(rows);

await sql.end();
