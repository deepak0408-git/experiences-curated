import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Melbourne (Australian Open 2027, "jan"
// seasonalBand) -- batch 1 of 49 origins (Amsterdam through Milan
// alphabetically, 25 origins). Researched 25 Jul 2026 per the
// planner-data-researcher skill's Flights methodology (SKILL.md section 1,
// step 2b): merge BOTH sites' prices into ONE combined sorted list, run
// the density cutoff on that MERGED list, then split back out to report
// each site's own surviving low/high, then average.
//
// Event: Australian Open 2027, Jan 17-31 2027. Window: Jan 12-24 2027
// (standard, event <16 days -- unlike the NZ tour of Australia's
// multi-city window exception on the same destination's "dec" band).
// seasonalBand="jan", verified to match sportingEvents.startDate's month
// (Jan 17).
//
// Initial pass was Kayak-only per an explicit interim instruction (large
// rate-limiting risk on GF after many consecutive requests this session).
// User then asked to also fetch GF and apply the full combined-dataset
// methodology before seeding -- done as a follow-up pass, split into 3
// smaller fetch runs (to survive tool timeouts, writing incrementally
// after each city) plus one retry pass on all "Oops" failures.
//
// 6 of 25 origins are Kayak-only (Barcelona, Cairo, Casablanca, Dubai,
// Johannesburg, Mexico City) -- each hit Google Flights' "Oops" error page
// on both the initial fetch AND a single retry. Given how many origins
// failed in the same session (consistent with rate-limiting after ~40
// consecutive GF requests rather than 6 independent route issues), these
// were accepted as genuine Kayak-only fallbacks rather than retried
// further, same precedent as Doha/Casablanca/Mexico City on prior
// destinations.
//
// Berlin ($414), Manchester ($135): isolated GF stray low prices far below
// their own real clusters -- correctly excluded by the density filter's
// own >=40% jump rule, same known scraping-artifact pattern seen across
// every prior destination.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const SEASONAL_BAND = "jan";

const ROUTES = [
  { origin: "Amsterdam", costLow: "1560.50", costHigh: "2166.00", note: "GF[1609-2069] KY[1512-2263], excluded: 2375(KY, isolated)." },
  { origin: "Atlanta", costLow: "1493.00", costHigh: "2339.00", note: "GF[1487-2374] KY[1499-2304], excluded: 2448x2(KY)." },
  { origin: "Bangalore", costLow: "832.00", costHigh: "1324.00", note: "GF[828-1316] KY[836-1332], excluded: 1533(KY)/4091x2(GF)." },
  { origin: "Barcelona", costLow: "1480.00", costHigh: "2348.00", note: "KAYAK ONLY -- GF returned 'Oops' error page (retried once, still failed). Excluded: 2423(KY, isolated)." },
  { origin: "Beijing", costLow: "945.00", costHigh: "1583.50", note: "GF[965-1455] KY[925-1712], excluded: 5227(GF, isolated)." },
  { origin: "Berlin", costLow: "1331.00", costHigh: "2084.00", note: "GF[1358-1988] KY[1304-2180], excluded low: 414(GF, isolated scraping artifact); excluded high: 2190/2213(KY)/2666/3203(GF)." },
  { origin: "Boston", costLow: "1611.00", costHigh: "2605.00", note: "GF[1546-2619] KY[1676-2591], excluded: 2784/2980/3019(KY)." },
  { origin: "Buenos Aires", costLow: "3138.00", costHigh: "4467.50", note: "GF[3531-4367] KY[2745-4568], excluded: 4745(KY)/5534(GF)/6946/7233/8436/9911/13259x2(KY), sparse extreme tail." },
  { origin: "Cairo", costLow: "1382.00", costHigh: "2534.00", note: "KAYAK ONLY -- GF returned 'Oops' error page (retried once, still failed). Excluded: 2665(KY, isolated)." },
  { origin: "Casablanca", costLow: "1687.00", costHigh: "2798.00", note: "KAYAK ONLY -- GF returned 'Oops' error page (retried once, still failed). No exclusions." },
  { origin: "Chicago", costLow: "1326.50", costHigh: "1928.00", note: "GF[1356-1860] KY[1297-1996], excluded: 2253(GF, isolated)." },
  { origin: "Dallas", costLow: "1301.00", costHigh: "1855.00", note: "GF[1407-1821] KY[1195-1889], excluded: 2107/2309/2327(GF)." },
  { origin: "Doha", costLow: "1736.50", costHigh: "2606.50", note: "GF[1825-2336] KY[1648-2877], excluded: 2947(GF, isolated)." },
  { origin: "Dubai", costLow: "1225.00", costHigh: "2168.00", note: "KAYAK ONLY -- GF returned 'Oops' error page (retried once, still failed). Excluded: 2532(KY, isolated)." },
  { origin: "Dublin", costLow: "1235.50", costHigh: "1935.00", note: "GF[1223-1891] KY[1248-1979], no exclusions." },
  { origin: "Hong Kong", costLow: "786.50", costHigh: "1351.50", note: "GF[766-1310] KY[807-1393], no exclusions." },
  { origin: "Johannesburg", costLow: "1158.00", costHigh: "2082.00", note: "KAYAK ONLY -- GF returned 'Oops' error page (retried once, still failed). Excluded: 2131(KY, isolated)." },
  { origin: "London", costLow: "1171.50", costHigh: "1841.50", note: "GF[1164-1885] KY[1179-1798], excluded: 2145/2383(GF)." },
  { origin: "Los Angeles", costLow: "1045.50", costHigh: "1675.00", note: "GF[1080-1452] KY[1011-1898], excluded: 2007/2402(KY)." },
  { origin: "Madrid", costLow: "1411.00", costHigh: "1982.00", note: "GF[1465-1902] KY[1357-2062], excluded: 2185(KY, isolated)." },
  { origin: "Manchester", costLow: "1436.50", costHigh: "2407.50", note: "GF[1481-2426] KY[1392-2389], excluded low: 135(GF, isolated scraping artifact)." },
  { origin: "Manila", costLow: "680.50", costHigh: "1410.50", note: "GF[651-1436] KY[710-1385], no exclusions." },
  { origin: "Mexico City", costLow: "1776.00", costHigh: "3162.00", note: "KAYAK ONLY -- GF returned 'Oops' error page (retried once, still failed). No exclusions." },
  { origin: "Miami", costLow: "1346.00", costHigh: "1892.00", note: "GF[1379-1931] KY[1313-1853], excluded: 2327(GF, isolated)." },
  { origin: "Milan", costLow: "1390.00", costHigh: "2163.00", note: "GF[1409-2137] KY[1371-2189], no exclusions." },
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
console.log(`\nAll Melbourne/jan flight cost rows (${rows.length} total so far, should be 25):`);
console.table(rows);

await sql.end();
