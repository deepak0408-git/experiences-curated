import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Melbourne (Australian Grand Prix 2027,
// seasonalBand "apr"), all 49 planner_origin_markets. Researched 19-20 Sep
// 2026 per the planner-data-researcher skill's Flights methodology
// (Google Flights + Kayak, combined-dataset density-boundary outlier
// exclusion, average of both sites' in-range low/high).
//
// Event: Australian Grand Prix 2027, 2-4 Apr 2027. Search window (standard
// -- event <16 days): 2027-03-28 to 2027-04-09. seasonalBand="apr".
//
// Melbourne itself (MEL) is a same-city origin -- seeded as costLow=
// costHigh=0.00 per the skill's standing same-city-origin rule, not
// researched.
//
// 4 single-source rows (Google Flights returned 0 results on Buenos Aires
// and Rio de Janeiro across repeated attempts; Kayak returned 0 on Moscow,
// a known recurring SVO gap; Google Flights returned only 1 real fare on
// Mexico City which then fell above Kayak's dense cluster as a high
// outlier) -- each flagged in its own note below with the real reasoning,
// per the skill's "never let single-source look identical to a normal row"
// rule. Full per-route GF/Kayak raw ranges + sample counts + exclusion
// reasoning presented to and approved by the curator before this script
// was written -- see the published research artifact for the full table.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const SEASONAL_BAND = "apr";
const EDITION_YEAR = 2027;

const ROUTES = [
  { origin: "Amsterdam", costLow: "1503.00", costHigh: "2012.00", note: "GF[1731-2349] KY[1275-2592], 3 high outliers excluded (sparse tail above 2097, up to 2592)." },
  { origin: "Atlanta", costLow: "1424.00", costHigh: "1780.00", note: "GF[1487-2880] KY[1361-3178], 3 high outliers excluded (sparse tail above 1799, up to 3178)." },
  { origin: "Bangalore", costLow: "768.00", costHigh: "1001.00", note: "GF[841-5693] KY[694-843], 8 high outliers excluded (sparse tail above 1158, up to 5693)." },
  { origin: "Barcelona", costLow: "1316.00", costHigh: "1867.00", note: "GF[1333-1875] KY[1298-2171], 1 high outlier excluded (sparse tail above 1875, up to 2171)." },
  { origin: "Beijing", costLow: "745.00", costHigh: "961.00", note: "GF[811-1607] KY[678-861], 2 high outliers excluded (sparse tail above 1061, up to 1607)." },
  { origin: "Berlin", costLow: "1697.00", costHigh: "1892.00", note: "GF[1769-1935] KY[1624-1848], no exclusions -- full continuous dense run." },
  { origin: "Boston", costLow: "1446.00", costHigh: "1990.00", note: "GF[1495-2349] KY[1396-5075], 3 high outliers excluded (sparse tail above 2046, up to 5075)." },
  { origin: "Buenos Aires", costLow: "1761.00", costHigh: "3220.00", note: "SINGLE-SOURCE (KAYAK ONLY) -- Google Flights returned 0 results across 2 attempts. Kayak fetched twice (live fares varied run-to-run: 2339-9715 then 1761-1895), combined and de-duplicated; 1 high outlier excluded (9715, a 202% jump). Small combined sample (9 points) -- lower-confidence." },
  { origin: "Cairo", costLow: "884.00", costHigh: "1045.00", note: "GF[885-1431] KY[883-1205], 3 high outliers excluded (sparse tail above 1205, up to 1431)." },
  { origin: "Casablanca", costLow: "1712.00", costHigh: "1783.00", note: "GF[1715-3110] KY[1708-2086], 2 high outliers excluded (sparse tail above 1818, up to 3110)." },
  { origin: "Chicago", costLow: "1251.00", costHigh: "1356.00", note: "GF[1266-2883] KY[1235-3167], 11 high outliers excluded (sparse tail above 1382, up to 3167)." },
  { origin: "Dallas", costLow: "1438.00", costHigh: "2134.00", note: "GF[1704-3204] KY[1172-2106], 4 high outliers excluded (sparse tail above 2161, up to 3204)." },
  { origin: "Doha", costLow: "1382.00", costHigh: "1917.00", note: "GF[1507-2186] KY[1257-1648], no exclusions -- full continuous dense run." },
  { origin: "Dubai", costLow: "1161.00", costHigh: "2097.00", note: "GF[1201-2165] KY[1121-2029], no exclusions -- full continuous dense run." },
  { origin: "Dublin", costLow: "1270.00", costHigh: "1722.00", note: "GF[1274-1610] KY[1265-2014], 1 high outlier excluded (sparse tail above 1833, up to 2014)." },
  { origin: "Hong Kong", costLow: "684.00", costHigh: "1082.00", note: "GF[684-4135] KY[684-893], 9 high outliers excluded (sparse tail above 1270, up to 4135)." },
  { origin: "Johannesburg", costLow: "1091.00", costHigh: "1385.00", note: "GF[1230-1358] KY[952-1412], no exclusions -- full continuous dense run." },
  { origin: "London", costLow: "1534.00", costHigh: "2596.00", note: "GF[1817-3400] KY[1250-2512], 6 high outliers excluded (sparse tail above 2680, up to 3400)." },
  { origin: "Los Angeles", costLow: "861.00", costHigh: "1518.00", note: "GF[906-2802] KY[816-1209], 3 high outliers excluded (sparse tail above 1826, up to 2802)." },
  { origin: "Madrid", costLow: "1279.00", costHigh: "1554.00", note: "GF[1435-1826] KY[1122-1887], 3 high outliers excluded (sparse tail above 1554, up to 1887)." },
  { origin: "Manchester", costLow: "1672.00", costHigh: "1926.00", note: "GF[1867-2887] KY[1476-2668], 5 high outliers excluded (sparse tail above 1927, up to 2887)." },
  { origin: "Manila", costLow: "444.00", costHigh: "1232.00", note: "GF[444-3614] KY[444-811], 1 high outlier excluded (sparse tail above 1653, up to 3614)." },
  { origin: "Melbourne", costLow: "0.00", costHigh: "0.00", note: "Same-city origin -- no flight needed, per the skill's standing same-city-origin rule." },
  { origin: "Mexico City", costLow: "1684.00", costHigh: "2243.00", note: "SINGLE-SOURCE (KAYAK-DOMINANT) -- Google Flights returned only 1 real <=1-stop economy fare ($2560, confirmed on 2 separate fetches), which fell above Kayak's dense 25-point cluster and was excluded as a high outlier. Final range is Kayak-only." },
  { origin: "Miami", costLow: "1343.00", costHigh: "2048.00", note: "GF[1324-2956] KY[1361-3195], 4 high outliers excluded (sparse tail above 2116, up to 3195)." },
  { origin: "Milan", costLow: "1649.00", costHigh: "2055.00", note: "GF[1627-2079] KY[1670-2030], no exclusions -- full continuous dense run." },
  { origin: "Montreal", costLow: "1202.00", costHigh: "1246.00", note: "GF[1192-2438] KY[1211-3921], 4 high outliers excluded (sparse tail above 1246, up to 3921)." },
  { origin: "Moscow", costLow: "1372.00", costHigh: "2419.00", note: "SINGLE-SOURCE (GOOGLE FLIGHTS ONLY) -- Kayak returned 0 results, known recurring SVO gap, confirmed via retry. GF raw range used directly, no outliers (largest step 28%, below the 40% threshold)." },
  { origin: "Mumbai", costLow: "788.00", costHigh: "1109.00", note: "GF[834-1755] KY[742-1002], 3 high outliers excluded (sparse tail above 1215, up to 1755)." },
  { origin: "Munich", costLow: "1451.00", costHigh: "1752.00", note: "GF[1523-2457] KY[1379-1819], 6 high outliers excluded (sparse tail above 1819, up to 2457)." },
  { origin: "Nairobi", costLow: "1082.00", costHigh: "1149.00", note: "GF[1152-1675] KY[1011-1145], 1 high outlier excluded (sparse tail above 1152, up to 1675)." },
  { origin: "New Delhi", costLow: "808.00", costHigh: "1112.00", note: "GF[898-1978] KY[717-954], 3 high outliers excluded (sparse tail above 1269, up to 1978)." },
  { origin: "New York City", costLow: "1330.00", costHigh: "1973.00", note: "GF[1389-9066] KY[1270-3011], 6 high outliers excluded (sparse tail above 2113, up to 9066)." },
  { origin: "Paris", costLow: "1163.00", costHigh: "2216.00", note: "GF[1213-10533] KY[1113-1996], 2 high outliers excluded (sparse tail above 2436, up to 10533)." },
  { origin: "Philadelphia", costLow: "1227.00", costHigh: "1402.00", note: "GF[1247-2591] KY[1207-2116], 7 high outliers excluded (sparse tail above 1432, up to 2591)." },
  { origin: "Rio de Janeiro", costLow: "2144.00", costHigh: "2903.00", note: "SINGLE-SOURCE (KAYAK ONLY) -- Google Flights returned 0 results, same pattern as Buenos Aires. Kayak's 15-point sample is dense and continuous -- no outliers (largest step 8.6%)." },
  { origin: "Rome", costLow: "1465.00", costHigh: "1768.00", note: "GF[1650-1886] KY[1279-2089], 2 high outliers excluded (sparse tail above 1768, up to 2089)." },
  { origin: "San Francisco", costLow: "1265.00", costHigh: "1914.00", note: "GF[1423-2788] KY[1107-1671], 1 high outlier excluded (sparse tail above 2156, up to 2788)." },
  { origin: "Sao Paulo", costLow: "1916.00", costHigh: "2014.00", note: "GF[2010-4389] KY[1821-3515], 3 high outliers excluded (sparse tail above 2158, up to 4389)." },
  { origin: "Seoul", costLow: "638.00", costHigh: "1089.00", note: "GF[673-5161] KY[602-793], 11 high outliers excluded (sparse tail above 1385, up to 5161)." },
  { origin: "Shanghai", costLow: "695.00", costHigh: "1452.00", note: "GF[712-3147] KY[678-908], 4 high outliers excluded (sparse tail above 1996, up to 3147)." },
  { origin: "Singapore", costLow: "334.00", costHigh: "1117.00", note: "GF[338-4670] KY[329-518], 3 high outliers excluded (sparse tail above 1715, up to 4670)." },
  { origin: "Stockholm", costLow: "1109.00", costHigh: "1530.00", note: "GF[1129-1637] KY[1088-2722], 2 high outliers excluded (sparse tail above 1596, up to 2722)." },
  { origin: "Sydney", costLow: "125.00", costHigh: "327.00", note: "GF[126-643] KY[124-224], 1 high outlier excluded (sparse tail above 429, up to 643)." },
  { origin: "Tokyo", costLow: "777.00", costHigh: "1697.00", note: "GF[771-5916] KY[782-1181], 11 high outliers excluded (sparse tail above 2212, up to 5916)." },
  { origin: "Toronto", costLow: "1372.00", costHigh: "1683.00", note: "GF[1455-4039] KY[1288-2584], 5 high outliers excluded (sparse tail above 1953, up to 4039)." },
  { origin: "Vancouver", costLow: "1085.00", costHigh: "1144.00", note: "GF[1092-2177] KY[1077-1077], 8 high outliers excluded (sparse tail above 1211, up to 2177)." },
  { origin: "Washington D.C.", costLow: "1606.00", costHigh: "2094.00", note: "GF[1919-2097] KY[1292-5063], 1 high outlier excluded (sparse tail above 2097, up to 5063)." },
  { origin: "Zurich", costLow: "1292.00", costHigh: "2305.00", note: "GF[1468-17543] KY[1115-2131], 3 high outliers excluded (sparse tail above 2479, up to 17543)." },
];

for (const r of ROUTES) {
  const result = await sql`
    INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, edition_year, cost_low, cost_high, currency, refresh_pass)
    VALUES (${DESTINATION_ID}, ${r.origin}, ${SEASONAL_BAND}, ${EDITION_YEAR}, ${r.costLow}, ${r.costHigh}, 'USD', 'initial')
    ON CONFLICT (destination_id, origin_market, seasonal_band, edition_year) DO UPDATE SET
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      currency = EXCLUDED.currency,
      refresh_pass = EXCLUDED.refresh_pass,
      last_updated = NOW()
    RETURNING id
  `;
  console.log(`✓ ${r.origin} -> Melbourne (apr 2027) seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, edition_year, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID} AND seasonal_band = ${SEASONAL_BAND} AND edition_year = ${EDITION_YEAR}
  ORDER BY origin_market
`;
console.log(`\nAll Melbourne/apr/2027 flight cost rows (${rows.length} total, should be 49):`);
console.table(rows);

await sql.end();
