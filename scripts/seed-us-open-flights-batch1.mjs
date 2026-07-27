import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for US Open 2026 -- batch 1 of 5 origins (of 48
// remaining after Mumbai, which was already seeded as the methodology test
// route). Researched 21 Jul 2026 per the planner-data-researcher skill's
// Flights methodology (2-site average + COMBINED-DATASET natural-gap
// outlier exclusion, corrected same day after the per-site version wrongly
// excluded a real Amsterdam/Kayak price).
//
// Search window: Aug 25 - Sep 18 2026 (standard startDate-5/endDate+5,
// since US Open's 14-day span is under the 16-day multi-city threshold).
// Destination: New York. Sites: Google Flights + Kayak, round-trip,
// economy, <=1 stop, USD.
//
// Outlier exclusion method: both sites' real <=1-stop prices merged into
// one sorted list; gaps >=40% in that MERGED list determine exclusions on
// either end. Each site's own individual low/high (reported below) is that
// site's real min/max price remaining WITHIN the combined-dataset bounds.

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const SEASONAL_BAND = "sep";

const ROUTES = [
  {
    origin: "Amsterdam",
    costLow: "632.00",
    costHigh: "1593.00",
    note: "GF 641-1761 (no exclusion); KY 622-1424 ($199 excluded, 213% jump from combined low; $1,424 retained after combined test -- comparable to GF's own range).",
  },
  {
    origin: "Atlanta",
    costLow: "176.00",
    costHigh: "799.00",
    note: "GF 177-700 (no exclusion); KY 175-898 (no exclusion -- $898 retained, no real gap exists once merged with GF's range). User cross-checked and confirmed accurate 21 Jul 2026.",
  },
  {
    origin: "Bangalore",
    costLow: "1218.00",
    costHigh: "2892.00",
    note: "GF 1186-2826 (no exclusion); KY 1250-2957 ($799 excluded, 48% jump from combined low; high unaffected).",
  },
  {
    origin: "Barcelona",
    costLow: "679.00",
    costHigh: "1627.00",
    note: "GF 647-1725 ($3,343 excluded, 46% jump from combined high); KY 710-1528 ($199 excluded, 225% jump from combined low).",
  },
  {
    origin: "Beijing",
    costLow: "1297.00",
    costHigh: "2746.00",
    note: "GF 1309-2731 (a real premium/first-class cluster $3,954-13,460 excluded, 43% jump from the combined economy cluster); KY 1284-2761 ($315 excluded, 308% jump from combined low).",
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
