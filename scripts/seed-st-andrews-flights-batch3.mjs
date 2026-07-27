import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for St Andrews (Alfred Dunhill Links Championship
// 2026) -- batch 3 (FINAL BATCH) of 49 origins (Philadelphia through
// Zurich alphabetically, 15 origins). Completes all 49 origin markets for
// St Andrews. Researched 23 Jul 2026 per the planner-data-researcher
// skill's Flights methodology (2-site combined-dataset density-based
// outlier exclusion, THEN average of each site's own surviving low/high).
//
// Event: Alfred Dunhill Links Championship 2026, Oct 1-4 2026. Window:
// Sep 26-Oct 9 2026.
//
// STRICT original documented outlier logic only (per explicit user
// instruction 23 Jul 2026) -- first >=40% jump within the scan window sets
// the low cutoff, highest point with >=4 neighbors within $200 sets the
// high cutoff. No corroboration-band or other self-invented logic --
// see memory feedback_no_unauthorized_business_logic_decisions.md.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "6672a395-f471-4b9e-9d1a-0f567441470a"; // St Andrews
const SEASONAL_BAND = "sep";

const ROUTES = [
  { origin: "Philadelphia", costLow: "940.00", costHigh: "1053.00", note: "GF[945-1050] KY[935-1056], no exclusions." },
  { origin: "Rio de Janeiro", costLow: "1248.00", costHigh: "1576.00", note: "GF[1269-1601] KY[1226-1551], excluded GF high: $1,803/$1,887/$2,154/$2,231." },
  { origin: "Rome", costLow: "229.00", costHigh: "413.00", note: "GF[293-544] KY[164-281], no exclusions." },
  { origin: "San Francisco", costLow: "1005.00", costHigh: "1143.00", note: "GF[1016-1133] KY[994-1153], excluded GF high: $3,897 (isolated)." },
  { origin: "Sao Paulo", costLow: "1091.00", costHigh: "1508.00", note: "GF[1035-1572] KY[1146-1444], excluded GF high: $1,730/$2,155." },
  { origin: "Seoul", costLow: "1451.00", costHigh: "1813.00", note: "GF[1484-1829] KY[1417-1796], excluded GF high: $2,137/$2,771." },
  { origin: "Shanghai", costLow: "1259.00", costHigh: "2339.00", note: "GF[1363-2808] KY[1154-1869], no exclusions." },
  { origin: "Singapore", costLow: "944.00", costHigh: "1232.00", note: "GF[984-1202] KY[904-1262], excluded GF high: $1,475x2/$1,522." },
  { origin: "Stockholm", costLow: "208.00", costHigh: "337.00", note: "GF[235-445] KY[181-228], no exclusions." },
  { origin: "Sydney", costLow: "1990.00", costHigh: "2522.00", note: "GF[2081-2413] KY[1899-2631], excluded GF high: $2,890/$2,964/$3,204x3/$3,801." },
  { origin: "Tokyo", costLow: "1521.00", costHigh: "2099.00", note: "GF[1556-2032] KY[1485-2166], excluded GF high: $2,166/$2,398/$2,555." },
  { origin: "Toronto", costLow: "584.00", costHigh: "919.00", note: "GF[625-1015] KY[543-823], excluded GF high: $1,103/$1,483." },
  { origin: "Vancouver", costLow: "930.00", costHigh: "1245.00", note: "GF[1038-1251] KY[821-1239], excluded GF high: $1,419/$1,773." },
  { origin: "Washington D.C.", costLow: "902.00", costHigh: "1043.00", note: "GF[914-1043] KY[890-1043], excluded GF high: $1,375 (isolated)." },
  { origin: "Zurich", costLow: "232.00", costHigh: "432.00", note: "GF[231-464] KY[233-400], excluded GF high: $708 (isolated)." },
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
  console.log(`✓ ${r.origin} -> St Andrews seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log(`\nAll St Andrews flight cost rows (${rows.length} total, should be 49):`);
console.table(rows);

await sql.end();
