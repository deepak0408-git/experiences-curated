import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Milan (Italian GP 2026) -- batch 3 (FINAL BATCH),
// remaining 14 origins. Completes all 49 origin markets for Milan.
// Researched 22 Jul 2026 per the planner-data-researcher skill's Flights
// methodology (2-site combined-dataset density-based outlier exclusion,
// THEN average of each site's own surviving low/high).
//
// Event: Italian Grand Prix 2026, Sep 4-6 2026. Window: Aug 30 - Sep 11 2026.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const SEASONAL_BAND = "sep";

const ROUTES = [
  { origin: "Rio de Janeiro", costLow: "1378.00", costHigh: "2037.00", note: "GF[1361-2089] KY[1394-1985], excluded high: $2,217/$2,271." },
  { origin: "Rome", costLow: "145.00", costHigh: "664.00", note: "GF[112-651] KY[178-676], excluded high: $1,291x2." },
  { origin: "San Francisco", costLow: "788.00", costHigh: "1133.00", note: "GF[788-1195] KY[788-1070], excluded high: $2,282 (isolated)." },
  { origin: "Sao Paulo", costLow: "1299.00", costHigh: "1605.00", note: "GF[1206-1652] KY[1392-1558], excluded high: $1,890x2-$2,878 (6 values, sparse tail)." },
  { origin: "Seoul", costLow: "1016.00", costHigh: "1945.00", note: "GF[1021-2039] KY[1011-1850], excluded high: $2,130x2 (isolated)." },
  { origin: "Shanghai", costLow: "1033.00", costHigh: "1714.00", note: "GF[1028-1797] KY[1037-1630], excluded high: $2,020 (isolated)." },
  { origin: "Singapore", costLow: "662.00", costHigh: "1111.00", note: "GF[671-1124] KY[653-1098], excluded high: $1,327-$2,490x2 (5 values, sparse tail)." },
  { origin: "Stockholm", costLow: "154.00", costHigh: "426.00", note: "GF[161-404] KY[146-447], excluded low: $86 (isolated)." },
  { origin: "Sydney", costLow: "1413.00", costHigh: "1854.00", note: "GF[1326-1890] KY[1499-1818], excluded high: $2,028-$4,162 (4 values, sparse tail)." },
  { origin: "Tokyo", costLow: "1073.00", costHigh: "1977.00", note: "GF[988-2060] KY[1158-1894], excluded high: $2,106-$3,021 (6 values, sparse premium tail)." },
  { origin: "Toronto", costLow: "689.00", costHigh: "1192.00", note: "GF[702-1192] KY[675-1192], excluded high: $1,824/$2,649." },
  { origin: "Vancouver", costLow: "888.00", costHigh: "1463.00", note: "GF[785-1399] KY[990-1526], no exclusions." },
  { origin: "Washington D.C.", costLow: "760.00", costHigh: "1161.00", note: "GF[732-1126] KY[788-1195], excluded high: $1,367/$1,915." },
  { origin: "Zurich", costLow: "168.00", costHigh: "406.00", note: "GF[166-374] KY[170-438], excluded low: $84 (isolated); high: $722/$922." },
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
  console.log(`✓ ${r.origin} -> Milan seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log(`\nAll Milan flight cost rows (${rows.length} total, should be 49):`);
console.table(rows);

await sql.end();
