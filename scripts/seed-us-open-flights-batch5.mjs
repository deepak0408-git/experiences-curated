import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for US Open 2026 -- batch 5 of 5, FINAL BATCH.
// Singapore through Zurich alphabetically -- completes all 49 origin
// markets for New York (US Open). Researched 22 Jul 2026 per the
// planner-data-researcher skill's Flights methodology (2-site average +
// combined-dataset, density-based outlier exclusion).
//
// Search window: Aug 25 - Sep 18 2026 (standard startDate-5/endDate+5).
// Destination: New York. Sites: Google Flights + Kayak, round-trip,
// economy, <=1 stop, USD. Same explicit-date query fix as batch 4 (dates
// pinned in the query string, confirmed via "Track prices" readout).
//
// Same recurring stray ultra-low price artifact seen in batch 4 ($315,
// $139) appeared again in 2 of 8 origins here -- treated the same way,
// isolated-value exclusion, not a real fare.

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const SEASONAL_BAND = "sep";

const ROUTES = [
  {
    origin: "Singapore",
    costLow: "1132.00",
    costHigh: "1710.00",
    note: "GF+KY combined, excluded $315x2 (scraping artifact), $2,350 (isolated tail).",
  },
  {
    origin: "Stockholm",
    costLow: "564.00",
    costHigh: "673.00",
    note: "GF+KY combined, excluded $941/$1,270x2/$1,361 (sparse tail).",
  },
  {
    origin: "Sydney",
    costLow: "1110.00",
    costHigh: "1952.00",
    note: "GF+KY combined, excluded $4,176 (isolated, huge gap to rest of cluster).",
  },
  {
    origin: "Tokyo",
    costLow: "1375.00",
    costHigh: "2343.00",
    note: "GF+KY combined, excluded $315x2 (scraping artifact), $3,867 (isolated).",
  },
  {
    origin: "Toronto",
    costLow: "266.00",
    costHigh: "438.00",
    note: "GF+KY combined, excluded $965/$1,099/$2,996x5 (clearly isolated premium-cabin tail).",
  },
  {
    origin: "Vancouver",
    costLow: "411.00",
    costHigh: "724.00",
    note: "GF+KY combined, excluded $979 (isolated).",
  },
  {
    origin: "Washington D.C.",
    costLow: "209.00",
    costHigh: "433.00",
    note: "GF+KY combined, excluded $139 (isolated low, scraping-artifact pattern), $2,938 (isolated high).",
  },
  {
    origin: "Zurich",
    costLow: "611.00",
    costHigh: "776.00",
    note: "GF+KY combined, no exclusions needed -- fully continuous dataset.",
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
console.log(`\nAll New York flight cost rows (${rows.length} total, should be 49):`);
console.table(rows);

await sql.end();
