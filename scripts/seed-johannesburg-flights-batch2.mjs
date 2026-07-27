import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Johannesburg -- batch 2 of remaining origins
// (London through Paris alphabetically, 17 origins x 2 seasons = 34 rows).
// Researched 22 Jul 2026 per the planner-data-researcher skill's Flights
// methodology (2-site combined-dataset density-based outlier exclusion,
// THEN average of each site's own surviving low/high).
//
// Same 2 seasons as batch 1:
// - "sep" = Australia tour of South Africa 2026 window, Sep 19-Oct 4 2026.
// - "dec" = England tour of South Africa 2026-27 window, Dec 12 2026-Jan 1 2027.
//
// Moscow: Kayak blocks this route ("Restricted destination -- government
// restrictions"), same sanctions pattern confirmed on the NYC batch --
// Google Flights only, single-site density filter applied (same low/high
// cutoff rules, just on one site's own sorted dataset instead of a merged
// 2-site set).

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40"; // Johannesburg

const ROUTES = [
  { origin: "London", band: "sep", costLow: "763.00", costHigh: "1349.00", note: "GF[761-1249] KY[764-1449], excluded high: $1,546/$1,548/$1,940." },
  { origin: "London", band: "dec", costLow: "1417.00", costHigh: "1819.00", note: "GF[1316-1870] KY[1517-1768], excluded low: $727; high: $2,010-$2,863 (8 values)." },
  { origin: "Los Angeles", band: "sep", costLow: "1272.00", costHigh: "2249.00", note: "GF[1272-2306] KY[1272-2191], excluded low: $435x2; high: $2,401." },
  { origin: "Los Angeles", band: "dec", costLow: "1595.00", costHigh: "2811.00", note: "GF[1595-2896] KY[1595-2725], excluded low: $435x2; high: $3,005-$4,956 (7 values)." },
  { origin: "Madrid", band: "sep", costLow: "798.00", costHigh: "1034.00", note: "GF[818-1086] KY[777-981], excluded high: $1,232-$2,591 (5 values)." },
  { origin: "Madrid", band: "dec", costLow: "859.00", costHigh: "1982.00", note: "GF[784-1959] KY[934-2004], excluded high: $2,193x2/$4,391." },
  { origin: "Manchester", band: "sep", costLow: "838.00", costHigh: "1189.00", note: "GF[811-1239] KY[865-1139], excluded high: $1,398/$1,456." },
  { origin: "Manchester", band: "dec", costLow: "1238.00", costHigh: "1663.00", note: "GF[1209-1681] KY[1267-1644], excluded high: $2,088-$2,552 (5 values)." },
  { origin: "Manila", band: "sep", costLow: "986.00", costHigh: "1476.00", note: "GF[879-1476] KY[1092-1476], excluded high: $1,998/$2,130/$2,204/$2,678." },
  { origin: "Manila", band: "dec", costLow: "1186.00", costHigh: "1487.00", note: "GF[1355-1498] KY[1016-1476], excluded high: $1,823/$1,850/$2,530." },
  { origin: "Melbourne", band: "sep", costLow: "1629.00", costHigh: "2474.00", note: "GF[1556-2476] KY[1701-2471], excluded low: $1,033; high: $2,646-$12,257 (6 values, sparse premium tail)." },
  { origin: "Melbourne", band: "dec", costLow: "2122.00", costHigh: "2557.00", note: "GF[1871-2567] KY[2373-2546], excluded high: $2,770-$10,807 (10 values, sparse premium tail)." },
  { origin: "Mexico City", band: "sep", costLow: "1214.00", costHigh: "2004.00", note: "GF[1217-2019] KY[1211-1989], excluded low: $305; high: $2,489/$3,296." },
  { origin: "Mexico City", band: "dec", costLow: "2179.00", costHigh: "2594.00", note: "GF[1912-2269] KY[2445-2919], excluded high: $13,506 (isolated)." },
  { origin: "Miami", band: "sep", costLow: "1364.00", costHigh: "1906.00", note: "GF[1364-1909] KY[1364-1902], excluded low: $435x2; high: $2,169/$2,250/$2,386x2." },
  { origin: "Miami", band: "dec", costLow: "1715.00", costHigh: "2751.00", note: "GF[1289-2778] KY[2141-2723], excluded low: $435x2; high: $3,017/$3,847/$4,484." },
  { origin: "Milan", band: "sep", costLow: "747.00", costHigh: "1100.00", note: "GF[788-1076] KY[706-1123], no exclusions." },
  { origin: "Milan", band: "dec", costLow: "995.00", costHigh: "1506.00", note: "GF[1018-1415] KY[972-1597], excluded low: $639; high: $1,941." },
  { origin: "Montreal", band: "sep", costLow: "1133.00", costHigh: "1578.00", note: "GF[1208-1553] KY[1058-1603], excluded high: $1,941." },
  { origin: "Montreal", band: "dec", costLow: "1791.00", costHigh: "2257.00", note: "GF[1801-2292] KY[1781-2221], excluded high: $2,318-$3,932 (6 values, sparse tail)." },
  { origin: "Moscow", band: "sep", costLow: "600.00", costHigh: "1056.00", note: "GOOGLE FLIGHTS ONLY -- Kayak blocked (government restrictions/sanctions), same as NYC batch. Single-site density filter, excluded high: $1,203-$2,180 (4 values, sparse tail)." },
  { origin: "Moscow", band: "dec", costLow: "733.00", costHigh: "1199.00", note: "GOOGLE FLIGHTS ONLY, same reason. Excluded low: $318 (isolated); high: $1,413-$1,638 (3 values, sparse tail)." },
  { origin: "Mumbai", band: "sep", costLow: "486.00", costHigh: "836.00", note: "GF[482-874] KY[489-797], excluded high: $1,180-$1,807 (5 values, sparse tail)." },
  { origin: "Mumbai", band: "dec", costLow: "569.00", costHigh: "935.00", note: "GF[569-882] KY[568-987], excluded high: $1,188-$1,378 (4 values, sparse tail)." },
  { origin: "Munich", band: "sep", costLow: "694.00", costHigh: "1199.00", note: "GF[697-1186] KY[690-1212], excluded high: $1,519/$1,651." },
  { origin: "Munich", band: "dec", costLow: "967.00", costHigh: "1789.00", note: "GF[819-1761] KY[1115-1816], excluded high: $1,979/$2,071." },
  { origin: "Nairobi", band: "sep", costLow: "521.00", costHigh: "744.00", note: "GF[446-746] KY[596-741], excluded high: $1,423 (isolated)." },
  { origin: "Nairobi", band: "dec", costLow: "510.00", costHigh: "798.00", note: "GF[446-746] KY[573-850], excluded high: $1,003/$1,202 (isolated)." },
  { origin: "New Delhi", band: "sep", costLow: "657.00", costHigh: "1192.00", note: "GF[647-1255] KY[666-1129], excluded high: $1,629/$1,908/$2,059/$2,080." },
  { origin: "New Delhi", band: "dec", costLow: "735.00", costHigh: "1413.00", note: "GF[721-1451] KY[748-1375], excluded high: $2,892/$2,917/$8,562." },
  { origin: "New York City", band: "sep", costLow: "1190.00", costHigh: "1891.00", note: "GF[1193-1861] KY[1187-1920], excluded low: $435x2; high: $2,217 (isolated)." },
  { origin: "New York City", band: "dec", costLow: "1782.00", costHigh: "2675.00", note: "GF[1409-2739] KY[2155-2610], excluded low: $435x2; high: $2,949-$6,444 (4 values, sparse tail)." },
  { origin: "Paris", band: "sep", costLow: "672.00", costHigh: "1071.00", note: "GF[674-1101] KY[670-1040], excluded high: $1,241/$1,275." },
  { origin: "Paris", band: "dec", costLow: "1356.00", costHigh: "1713.00", note: "GF[1341-1719] KY[1371-1707], excluded low: $931x2 (isolated)." },
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
