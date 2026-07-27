import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Singapore (Formula 1 Singapore Grand Prix 2026)
// -- batch 3 (FINAL BATCH) of 49 origins (Philadelphia through Zurich
// alphabetically, 14 real origins + Singapore itself as the same-city
// $0/$0 row). Completes all 49 origin markets for Singapore. Researched
// 23 Jul 2026 per the planner-data-researcher skill's Flights methodology
// (SKILL.md section 1, step 2b): merge BOTH sites' prices into ONE
// combined sorted list, run the density cutoff on that MERGED list, then
// split back out to report each site's own surviving low/high, then
// average.
//
// Event: Formula 1 Singapore GP 2026, Oct 9-11 2026. Window: Oct 4-16 2026.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10"; // Singapore
const SEASONAL_BAND = "oct";

const ROUTES = [
  { origin: "Philadelphia", costLow: "1084.00", costHigh: "1440.00", note: "GF[1031-1457] KY[1137-1423], excluded: 1630/2993x2/3164x2 (all GF)." },
  { origin: "Rio de Janeiro", costLow: "1804.00", costHigh: "2331.00", note: "GF[1890-2390] KY[1717-2272], excluded: 2506/3818/4389 (all GF)." },
  { origin: "Rome", costLow: "770.00", costHigh: "1039.00", note: "GF[780-1070] KY[760-1007], no exclusions." },
  { origin: "San Francisco", costLow: "696.00", costHigh: "1059.00", note: "GF[696-1083] KY[696-1035], excluded: 1375/1401 (both GF)." },
  { origin: "Sao Paulo", costLow: "1566.00", costHigh: "2188.00", note: "GF[1611-2259] KY[1521-2116], excluded: 2360/3833/4437 (all GF)." },
  { origin: "Seoul", costLow: "272.00", costHigh: "554.00", note: "GF[295-673] KY[249-434], no exclusions." },
  { origin: "Shanghai", costLow: "278.00", costHigh: "389.00", note: "GF[313-379] KY[243-399], no exclusions." },
  { origin: "Singapore", costLow: "0.00", costHigh: "0.00", note: "Same-city -- no flight needed, standard rule applied across all destinations." },
  { origin: "Stockholm", costLow: "701.00", costHigh: "960.00", note: "GF[716-983] KY[686-937], excluded: 1263/2440 (both GF)." },
  { origin: "Sydney", costLow: "498.00", costHigh: "710.00", note: "GF[502-650] KY[493-770], excluded: 1016x2/1281x4/1515 (all GF)." },
  { origin: "Tokyo", costLow: "295.00", costHigh: "946.00", note: "GF[287-1365] KY[303-527], no exclusions." },
  { origin: "Toronto", costLow: "1151.00", costHigh: "1555.00", note: "GF[1205-1681] KY[1097-1428], excluded: 1737 (GF, isolated)." },
  { origin: "Vancouver", costLow: "851.00", costHigh: "1156.00", note: "GF[859-1171] KY[842-1141], excluded: 1863 (GF, isolated)." },
  { origin: "Washington D.C.", costLow: "949.00", costHigh: "1395.00", note: "GF[949-1431] KY[949-1358], excluded: 1927/2316/2777 (all GF)." },
  { origin: "Zurich", costLow: "839.00", costHigh: "1644.00", note: "GF[860-1729] KY[818-1558], excluded: 2171 (GF, isolated)." },
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
  console.log(`✓ ${r.origin} -> Singapore seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log(`\nAll Singapore flight cost rows (${rows.length} total, should be 49):`);
console.table(rows);

await sql.end();
