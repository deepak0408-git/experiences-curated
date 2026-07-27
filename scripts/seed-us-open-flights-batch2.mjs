import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for US Open 2026 -- batch 2 of 10 origins, plus a
// correction to Atlanta (batch 1) after the outlier-exclusion methodology
// was upgraded from "40-50% jump detection" to "local density on the
// combined dataset" mid-session, 21 Jul 2026. See planner-data-researcher
// skill section 2b and the design doc's Flights section for the full
// rationale (Cairo/Casablanca proved jump-only detection misses real
// gradual premium-cabin clusters; density catches them).
//
// Search window: Aug 25 - Sep 18 2026 (standard startDate-5/endDate+5).
// Destination: New York. Sites: Google Flights + Kayak, round-trip,
// economy, <=1 stop, USD. Outlier exclusion: combined-dataset, density-based
// (last price with >=4 other prices within $200 of it marks the real
// cluster's high boundary; low cutoff is the first >=40% jump near the
// bottom of the combined list).

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const SEASONAL_BAND = "sep";

const ROUTES = [
  {
    origin: "Atlanta",
    costLow: "176.00",
    costHigh: "544.00",
    note: "CORRECTION to batch 1 (was 176-799 under the old jump-based rule). GF 177-700 (no exclusion); KY 175-388 (density excludes the single isolated $898 point -- no other price within $200 of it). User explicitly adopted density as the standing rule 21 Jul 2026, accepting this known tradeoff (had manually cross-checked $898 as real under the old rule).",
  },
  {
    origin: "Berlin",
    costLow: "487.00",
    costHigh: "1364.00",
    note: "GF 507-1795 (density caps the real cluster below a sparse tail); KY 467-933 ($199 excluded as low outlier).",
  },
  {
    origin: "Boston",
    costLow: "186.00",
    costHigh: "807.00",
    note: "GF 191-797 (no exclusions); KY 181-816 (no exclusions).",
  },
  {
    origin: "Buenos Aires",
    costLow: "966.00",
    costHigh: "2604.00",
    note: "GF 997-4119 (density caps at $4,119, excluding a sparse tail to $5,053); KY 934-1088 ($75 excluded as low outlier, 1145% jump).",
  },
  {
    origin: "Cairo",
    costLow: "1064.00",
    costHigh: "2655.00",
    note: "GF 977-2784 (density caps well below the raw $8,671 high -- a real but sparse premium-cabin tail with no single large jump, only caught by density); KY 1150-2525 ($349 excluded as low outlier).",
  },
  {
    origin: "Casablanca",
    costLow: "856.00",
    costHigh: "1513.00",
    note: "GF 856-1719 (density caps well below the raw $14,940 high -- same sparse-tail pattern as Cairo); KY 856-1306 ($349 excluded as low outlier).",
  },
  {
    origin: "Chicago",
    costLow: "216.00",
    costHigh: "617.00",
    note: "GF 217-897 (density caps below a sparse tail to $1,227); KY 215-337 (no exclusions).",
  },
  {
    origin: "Dallas",
    costLow: "260.00",
    costHigh: "917.00",
    note: "GF 233-1089 (density caps below $1,140); KY 286-745 ($1,832 excluded as high outlier).",
  },
  {
    origin: "Doha",
    costLow: "1126.00",
    costHigh: "2170.00",
    note: "GF 1151-2534 (density caps below $2,668); KY 1100-1805 ($349 excluded as low outlier).",
  },
  {
    origin: "Dubai",
    costLow: "1001.00",
    costHigh: "3381.00",
    note: "GF 940-4722 (density caps below a sparse tail starting ~$7,222); KY 1061-2040 ($349 excluded as low outlier).",
  },
  {
    origin: "Dublin",
    costLow: "585.00",
    costHigh: "1325.00",
    note: "GF 520-1320 (density caps below $1,646); KY 650-1330 ($199 excluded as low outlier).",
  },
];

for (const r of ROUTES) {
  const result = await sql`
    INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high, refresh_pass)
    VALUES (${DESTINATION_ID}, ${r.origin}, ${SEASONAL_BAND}, ${r.costLow}, ${r.costHigh}, 'initial')
    ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      refresh_pass = EXCLUDED.refresh_pass,
      last_updated = NOW()
    RETURNING id
  `;
  console.log(`✓ ${r.origin} -> New York (Sep) seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log("\nAll New York flight cost rows so far:");
console.table(rows);

await sql.end();
