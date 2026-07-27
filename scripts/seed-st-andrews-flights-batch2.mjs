import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for St Andrews (Alfred Dunhill Links Championship
// 2026) -- batch 2 of 49 origins (London through Paris alphabetically, 17
// origins). Researched 23 Jul 2026 per the planner-data-researcher skill's
// Flights methodology (2-site combined-dataset density-based outlier
// exclusion, THEN average of each site's own surviving low/high).
//
// Event: Alfred Dunhill Links Championship 2026, Oct 1-4 2026. Window:
// Sep 26-Oct 9 2026.
//
// STRICT original documented outlier logic only this batch -- first >=40%
// jump within the scan window sets the low cutoff, highest point with >=4
// neighbors within $200 sets the high cutoff. No additional corroboration-
// band logic (that was self-invented mid-session on 23 Jul 2026, not
// authorized, and has been dropped per explicit user instruction -- see
// memory feedback_no_unauthorized_business_logic_decisions.md).
//
// MOSCOW: user explicitly reviewed the raw 9-point GF-only dataset
// (Kayak sanctions-blocks this route, same as every destination) and
// decided the full raw range applies with NO exclusions: costLow=1039,
// costHigh=3088. This is a manual user decision, not a filter output --
// do not silently "correct" this row on a future refresh pass without
// re-confirming with the user first.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "6672a395-f471-4b9e-9d1a-0f567441470a"; // St Andrews
const SEASONAL_BAND = "sep";

const ROUTES = [
  { origin: "London", costLow: "54.00", costHigh: "189.00", note: "GF[53-296] KY[54-82], no exclusions." },
  { origin: "Los Angeles", costLow: "910.00", costHigh: "997.00", note: "GF[924-1026] KY[895-967], no exclusions." },
  { origin: "Madrid", costLow: "192.00", costHigh: "377.00", note: "GF[218-549] KY[165-204], no exclusions." },
  { origin: "Manchester", costLow: "214.00", costHigh: "353.00", note: "GF[302-507] KY[125-198], excluded GF high: $582/$876/$1,022x2/$3,749/$5,615." },
  { origin: "Manila", costLow: "1017.00", costHigh: "1518.00", note: "GF[1034-1153] KY[999-1883], excluded GF high: $1,341/$1,413/$1,618/$1,662/$1,704." },
  { origin: "Melbourne", costLow: "1709.00", costHigh: "2306.00", note: "GF[1787-2269] KY[1630-2342], excluded GF high: $2,334/$2,405x2/$2,627/$2,631/$2,685. (Note: an earlier GF fetch returned nonsense 6-figure prices, a transient non-USD render glitch -- re-fetched clean before this result.)" },
  { origin: "Mexico City", costLow: "1235.00", costHigh: "1517.00", note: "GF[1318-1566] KY[1151-1467], excluded GF high: $1,611/$1,950." },
  { origin: "Miami", costLow: "878.00", costHigh: "991.00", note: "GF[960-1002] KY[795-980], no exclusions." },
  { origin: "Milan", costLow: "162.00", costHigh: "279.00", note: "GF[201-339] KY[123-218], no exclusions." },
  { origin: "Montreal", costLow: "730.00", costHigh: "963.00", note: "GF[772-978] KY[687-947], no exclusions." },
  { origin: "Moscow", costLow: "1039.00", costHigh: "3088.00", note: "USER-DECIDED, not filter output. GOOGLE FLIGHTS ONLY (Kayak sanctions-blocked, same pattern as every destination). Raw 9-point dataset [1039,1269,1269,1304,1347,1347,2197,2629,3088] presented to user with no filtering; user reviewed and chose the full raw range as costLow/costHigh." },
  { origin: "Mumbai", costLow: "843.00", costHigh: "1108.00", note: "GF[891-1245] KY[795-971], excluded GF high: $1,368." },
  { origin: "Munich", costLow: "310.00", costHigh: "436.00", note: "GF[337-527] KY[283-344], excluded GF high: $633." },
  { origin: "Nairobi", costLow: "1029.00", costHigh: "1334.00", note: "GF[1060-1322] KY[997-1345], excluded GF high: $1,541/$1,726/$2,015." },
  { origin: "New Delhi", costLow: "766.00", costHigh: "1029.00", note: "GF[772-1005] KY[760-1053], excluded GF high: $1,431/$1,433/$1,458." },
  { origin: "New York City", costLow: "681.00", costHigh: "869.00", note: "GF[766-941] KY[596-796], no exclusions." },
  { origin: "Paris", costLow: "133.00", costHigh: "285.00", note: "GF[175-354] KY[91-216], excluded GF high: $549/$560." },
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
console.log(`\nAll St Andrews flight cost rows (${rows.length} total so far):`);
console.table(rows);

await sql.end();
