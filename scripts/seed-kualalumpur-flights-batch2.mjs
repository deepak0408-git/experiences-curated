import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Kuala Lumpur (Bahrain GP / Malaysia GP 2026) --
// batch 2 of 49 origins (Milan through Zurich alphabetically, 23 real
// routes + Moscow + Mexico City, both single-source with user-reviewed
// overrides). Researched 31 Jul 2026 per the planner-data-researcher
// skill's Flights methodology.
//
// costLow/costHigh = the pooled density-filtered range: every real fare
// from GF + Kayak merged into one sorted list, then outlier-trimmed (low
// cutoff on a >=40% jump near the bottom; high cutoff at the last price
// with >=4 other prices within $200 of it), taking the min/max of what
// survives. Approved by the user 31 Jul 2026.
//
// Event: Bahrain Grand Prix (Malaysia GP / Sepang), Sep 2026. Standard
// window: 2026-09-27 to 2026-10-09 (startDate-5 to endDate+5).
//
// Moscow: Kayak returned 0 "Select" results for this route (verified via
// debug HTML -- genuinely no bookable Kayak inventory, not an extraction
// bug). GF-only, n=11, density-filtered to $742-$999.
//
// Mexico City: GF returned a genuine "No results returned" for this
// route/date window (confirmed via direct page-text inspection, 2nd
// confirmation after the same result in Batch 1). Kayak-only, n=8: 2555,
// 2760, 3137, 3344, 3419, 3527, 3575, 8229. The standard density filter's
// small-sample path let $8,229 slip through uncaught (130% jump from
// $3,575, zero neighbors within $200 -- should have been excluded).
// User caught this 31 Jul 2026 and directed the fix: drop $8,229 as an
// isolated outlier, use $2,555-$3,575 (the real dense cluster of the
// other 7 points).
//
// currency column: planner_flight_cost has a NOT NULL currency column
// (default 'USD'). Explicitly tagging currency: "USD" on every row per the
// skill's pre-flight checklist.

const DESTINATION_ID = "09d5f140-02e3-4e6a-bdda-f8ef2142153a"; // Kuala Lumpur
const SEASONAL_BAND = "sep";

const ROUTES = [
  { origin: "Milan", costLow: "626.00", costHigh: "848.00", note: "GF[663-825] KY[626-848], pooled n=39, excluded 0." },
  { origin: "Montreal", costLow: "1212.00", costHigh: "2593.00", note: "GF[1221-3131] KY[1212-2779], pooled n=36, excluded 3." },
  { origin: "Moscow", costLow: "742.00", costHigh: "999.00", note: "GF[742-1228] KY[none -- 0 Select results, genuine], pooled n=11, excluded 1. GF-only." },
  { origin: "Mumbai", costLow: "308.00", costHigh: "577.00", note: "GF[308-1849] KY[334-433], pooled n=40, excluded 2." },
  { origin: "Munich", costLow: "644.00", costHigh: "1003.00", note: "GF[680-1232] KY[644-872], pooled n=32, excluded 2." },
  { origin: "Nairobi", costLow: "598.00", costHigh: "1022.00", note: "GF[601-1488] KY[598-1022], pooled n=29, excluded 2." },
  { origin: "New Delhi", costLow: "344.00", costHigh: "514.00", note: "GF[344-514] KY[354-442], pooled n=32, excluded 0." },
  { origin: "New York City", costLow: "982.00", costHigh: "1113.00", note: "GF[983-1593] KY[982-1101], pooled n=23, excluded 2." },
  { origin: "Paris", costLow: "616.00", costHigh: "998.00", note: "GF[671-1306] KY[616-825], pooled n=41, excluded 2." },
  { origin: "Philadelphia", costLow: "1057.00", costHigh: "2171.00", note: "GF[1079-2054] KY[1057-11992], pooled n=24, excluded 6." },
  { origin: "Rio de Janeiro", costLow: "2028.00", costHigh: "2627.00", note: "GF[2142-2627] KY[2028-2081], pooled n=4, excluded 0." },
  { origin: "Rome", costLow: "668.00", costHigh: "1036.00", note: "GF[685-1499] KY[668-1008], pooled n=48, excluded 1." },
  { origin: "San Francisco", costLow: "882.00", costHigh: "1169.00", note: "GF[981-1892] KY[882-1169], pooled n=35, excluded 1." },
  { origin: "Sao Paulo", costLow: "1477.00", costHigh: "2885.00", note: "GF[1495-2256] KY[1477-3268], pooled n=44, excluded 4." },
  { origin: "Seoul", costLow: "294.00", costHigh: "481.00", note: "GF[303-720] KY[294-376], pooled n=30, excluded 1." },
  { origin: "Shanghai", costLow: "335.00", costHigh: "642.00", note: "GF[341-831] KY[335-377], pooled n=20, excluded 2." },
  { origin: "Singapore", costLow: "101.00", costHigh: "335.00", note: "GF[105-335] KY[101-116], pooled n=29, excluded 0. Kayak count fixed 31 Jul 2026 (lowercase 'nonstop' label bug in v2 extractor was silently zeroing this route -- v3 fix applied)." },
  { origin: "Stockholm", costLow: "730.00", costHigh: "1318.00", note: "GF[864-1318] KY[730-1229], pooled n=43, excluded 0." },
  { origin: "Sydney", costLow: "601.00", costHigh: "1139.00", note: "GF[708-1139] KY[601-1078], pooled n=46, excluded 0." },
  { origin: "Tokyo", costLow: "373.00", costHigh: "1056.00", note: "GF[373-1056] KY[384-622], pooled n=54, excluded 0." },
  { origin: "Toronto", costLow: "1136.00", costHigh: "1866.00", note: "GF[1144-2618] KY[1136-1866], pooled n=41, excluded 1." },
  { origin: "Vancouver", costLow: "728.00", costHigh: "1369.00", note: "GF[738-6011] KY[728-1369], pooled n=41, excluded 2." },
  { origin: "Washington D.C.", costLow: "945.00", costHigh: "1531.00", note: "GF[982-1984] KY[945-1531], pooled n=31, excluded 1." },
  { origin: "Zurich", costLow: "683.00", costHigh: "1286.00", note: "GF[700-2592] KY[683-1080], pooled n=53, excluded 3." },
  { origin: "Mexico City", costLow: "2555.00", costHigh: "3575.00", note: "GF[none -- 'No results returned', genuine, confirmed twice] KY[2555,2760,3137,3344,3419,3527,3575,8229]. User directed 31 Jul 2026: drop $8,229 as an isolated outlier missed by the small-sample density path, use $2,555-$3,575 (real dense cluster of the other 7)." },
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
  console.log(`✓ ${r.origin} -> Kuala Lumpur seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log(`\nAll Kuala Lumpur flight cost rows (${rows.length} total):`);
console.table(rows);

await sql.end();
