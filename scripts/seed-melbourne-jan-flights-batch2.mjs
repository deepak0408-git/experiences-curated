import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Melbourne (Australian Open 2027, "jan"
// seasonalBand) -- batch 2 (FINAL BATCH) of 49 origins (Montreal through
// Zurich alphabetically, 23 origins) + Melbourne same-city row. Completes
// all 49 origin markets for Melbourne/jan. Researched 25 Jul 2026 per the
// planner-data-researcher skill's Flights methodology (SKILL.md section 1,
// step 2b): merge BOTH sites' prices into ONE combined sorted list, run
// the density cutoff on that MERGED list, then split back out to report
// each site's own surviving low/high, then average.
//
// Window: Jan 12-24 2027 (standard, event <16 days).
//
// Melbourne itself IS one of the 49 origin markets (confirmed against
// planner_origin_markets 25 Jul 2026, correcting an earlier wrong
// assumption on this same destination's "dec" band) -- same-city $0/$0 row
// seeded, same rule as NYC/Milan/Johannesburg.
//
// MOSCOW: unlike the "dec" seasonalBand on this same destination (where
// Moscow is a genuine unseeded gap), GF recovered on retry here (14 real
// prices) -- Kayak remains sanctions-blocked (0 results, same pattern as
// every destination), so this is a GF-ONLY result, not a gap. Sparse high
// tail (jumps to $8,863/$9,437) correctly excluded by the filter, leaving
// a clean, tight surviving range.
//
// Seoul: Kayak-only -- GF errored "Oops" on both the initial fetch and one
// retry.
//
// Montreal ($275), Munich ($404), Stockholm ($277), Zurich ($328): each an
// isolated GF stray low price far below its own real cluster -- correctly
// excluded by the density filter's own >=40% jump rule, same known
// scraping-artifact pattern seen across every prior destination.
//
// Sydney ($107.50-$224.00): genuine dense, cheap domestic-route result,
// same pattern already confirmed on this destination's "dec" band.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const SEASONAL_BAND = "jan";

const ROUTES = [
  { origin: "Montreal", costLow: "1305.50", costHigh: "2975.00", note: "GF[1292-3036] KY[1319-2914], excluded low: 275(GF, isolated scraping artifact); excluded high: 5846(GF)." },
  { origin: "Moscow", costLow: "1472.00", costHigh: "1622.00", note: "GOOGLE FLIGHTS ONLY -- Kayak sanctions-blocked (0 results, same pattern as every destination). GF recovered on retry (14 real prices), unlike this destination's 'dec' band where GF failed twice. Excluded sparse high tail: 2181x2/2301/2698/8863/9437(GF)." },
  { origin: "Mumbai", costLow: "962.50", costHigh: "1437.00", note: "GF[970-1367] KY[955-1507], excluded: 1694(KY)/3903(GF)." },
  { origin: "Munich", costLow: "1288.50", costHigh: "2057.00", note: "GF[1295-1957] KY[1282-2157], excluded low: 404(GF, isolated scraping artifact); excluded high: 2651/2771(GF)." },
  { origin: "Nairobi", costLow: "1350.50", costHigh: "2141.50", note: "GF[1346-2185] KY[1355-2098], excluded: 6735(GF, isolated)." },
  { origin: "New Delhi", costLow: "899.50", costHigh: "1431.50", note: "GF[1012-1346] KY[787-1517], excluded: 3904(GF, isolated)." },
  { origin: "New York City", costLow: "1324.00", costHigh: "2203.00", note: "GF[1351-2287] KY[1297-2119], excluded: 2466(GF, isolated)." },
  { origin: "Paris", costLow: "1440.00", costHigh: "1938.00", note: "GF[1438-1928] KY[1442-1948], no exclusions." },
  { origin: "Philadelphia", costLow: "1382.50", costHigh: "1795.00", note: "GF[1337-1739] KY[1428-1851], excluded: 2051/2162(GF)." },
  { origin: "Rio de Janeiro", costLow: "2468.50", costHigh: "3548.50", note: "GF[2632-3284] KY[2305-3813], excluded: 3966(KY, isolated)." },
  { origin: "Rome", costLow: "1418.00", costHigh: "1955.00", note: "GF[1590-1884] KY[1246-2026], excluded: 2055(GF, isolated)." },
  { origin: "San Francisco", costLow: "1384.50", costHigh: "1857.00", note: "GF[1442-1848] KY[1327-1866], no exclusions." },
  { origin: "Sao Paulo", costLow: "2139.00", costHigh: "3723.50", note: "GF[2129-3559] KY[2149-3888], excluded: 4188/4240(KY)." },
  { origin: "Seoul", costLow: "807.00", costHigh: "1256.00", note: "KAYAK ONLY -- GF returned 'Oops' error page (retried once, still failed). No exclusions." },
  { origin: "Shanghai", costLow: "887.50", costHigh: "1424.00", note: "GF[935-1213] KY[840-1635], excluded: 4910(GF, isolated)." },
  { origin: "Singapore", costLow: "615.50", costHigh: "1362.00", note: "GF[600-1603] KY[631-1121], no exclusions." },
  { origin: "Stockholm", costLow: "1197.50", costHigh: "1899.50", note: "GF[1244-1847] KY[1151-1952], excluded low: 277(GF, isolated scraping artifact); excluded high: 2145/2244(GF)." },
  { origin: "Sydney", costLow: "107.50", costHigh: "224.00", note: "GF[104-303] KY[111-145], no exclusions. Genuine dense/cheap domestic route, same pattern as this destination's 'dec' band." },
  { origin: "Tokyo", costLow: "825.00", costHigh: "1558.00", note: "GF[868-1442] KY[782-1674], no exclusions." },
  { origin: "Toronto", costLow: "1780.00", costHigh: "2980.50", note: "GF[1769-2891] KY[1791-3070], excluded: 3167/3184(KY)." },
  { origin: "Vancouver", costLow: "1583.50", costHigh: "2330.00", note: "GF[1715-2161] KY[1452-2499], excluded: 2688x2/2760/3409(GF)." },
  { origin: "Washington D.C.", costLow: "1320.00", costHigh: "1754.50", note: "GF[1345-1717] KY[1295-1792], no exclusions." },
  { origin: "Zurich", costLow: "1238.00", costHigh: "2086.00", note: "GF[1244-1955] KY[1232-2217], excluded low: 328(GF, isolated scraping artifact); excluded high: 2493/2505x2(GF)." },
  { origin: "Melbourne", costLow: "0.00", costHigh: "0.00", note: "Same-city -- Melbourne IS one of the 49 origin markets (confirmed 25 Jul 2026), standard rule applied same as NYC/Milan/Johannesburg." },
];

for (const r of ROUTES) {
  const result = await sql`
    INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass)
    VALUES (${DESTINATION_ID}, ${r.origin}, ${SEASONAL_BAND}, ${r.costLow}, ${r.costHigh}, 'USD', 'initial')
    ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      currency = EXCLUDED.currency,
      refresh_pass = EXCLUDED.refresh_pass,
      last_updated = NOW()
    RETURNING id
  `;
  console.log(`✓ ${r.origin} -> Melbourne (jan) seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID} AND seasonal_band = ${SEASONAL_BAND}
  ORDER BY origin_market
`;
console.log(`\nAll Melbourne/jan flight cost rows (${rows.length} total, should be 49):`);
console.table(rows);

await sql.end();
