import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for US Open 2026 -- batch 3 of 10 origins.
// Researched 21 Jul 2026 per the planner-data-researcher skill's Flights
// methodology (2-site average + combined-dataset, density-based outlier
// exclusion).
//
// Search window: Aug 25 - Sep 18 2026 (standard startDate-5/endDate+5).
// Destination: New York. Sites: Google Flights + Kayak, round-trip,
// economy, <=1 stop, USD.

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const SEASONAL_BAND = "sep";

const ROUTES = [
  {
    origin: "Hong Kong",
    costLow: "1074.00",
    costHigh: "3651.00",
    note: "GF 1057-4552 in bounds ($5,428 sparse-tail excluded); KY 1091-2749 in bounds ($315 low outlier excluded).",
  },
  {
    origin: "Johannesburg",
    costLow: "1193.00",
    costHigh: "1930.00",
    note: "GF 1224-2240 in bounds; KY 1162-1619 in bounds ($435 low outlier excluded; $2,404-$3,970 sparse tail excluded).",
  },
  {
    origin: "London",
    costLow: "628.00",
    costHigh: "927.00",
    note: "GF 656-1009 (no exclusion); KY 600-845 ($199 low outlier excluded).",
  },
  {
    origin: "Los Angeles",
    costLow: "326.00",
    costHigh: "806.00",
    note: "GF 334-925 (no exclusion); KY 317-687 (no exclusion).",
  },
  {
    origin: "Madrid",
    costLow: "596.00",
    costHigh: "1254.00",
    note: "GF 618-1660 (no exclusion); KY 574-847 in bounds ($199 low outlier excluded; $2,773 sparse tail excluded).",
  },
  {
    origin: "Manchester",
    costLow: "690.00",
    costHigh: "1289.00",
    note: "GF 734-1702 in bounds ($1,863-$6,297 sparse tail excluded); KY 645-875 in bounds ($199 low outlier excluded).",
  },
  {
    origin: "Manila",
    costLow: "846.00",
    costHigh: "2253.00",
    note: "GF 972-2478 in bounds ($2,670-$6,419 sparse tail, 8 values, excluded); KY 720-2027 in bounds ($405 low outlier excluded).",
  },
  {
    origin: "Melbourne",
    costLow: "1139.00",
    costHigh: "2754.00",
    note: "GF 1013-2802 in bounds ($2,917-$10,310 sparse tail excluded); KY 1264-2705 in bounds (no exclusion).",
  },
  {
    origin: "Mexico City",
    costLow: "308.00",
    costHigh: "954.00",
    note: "GF 317-1122 in bounds ($1,322-$4,117 sparse tail, 7 values, excluded); KY 299-786 in bounds ($75 low outlier excluded).",
  },
  {
    origin: "Miami",
    costLow: "241.00",
    costHigh: "450.00",
    note: "GF 212-573 (no exclusion); KY 270-326 in bounds ($883/$1,018 sparse tail excluded).",
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
