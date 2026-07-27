import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Virginia Water (BMW PGA Championship 2026) --
// batch 1 of 49 origins (Amsterdam through Johannesburg alphabetically, 17
// origins). Researched 22 Jul 2026 per the planner-data-researcher skill's
// Flights methodology (2-site combined-dataset density-based outlier
// exclusion, THEN average of each site's own surviving low/high).
//
// Event: BMW PGA Championship 2026, Sep 17-20 2026. Standard window
// (event <16 days): startDate-5 to endDate+5 = Sep 12-25 2026.
//
// Virginia Water has no airport of its own -- Wentworth Club is genuinely
// close to London/Heathrow. Per explicit user instruction 22 Jul 2026,
// destinations.nearestAirportIata set to LHR, and flight searches target
// "London" (all airports) rather than the town name literally. Kayak
// initially searched LHR-only, which produced artificially high fares vs
// Google Flights' broader "London" search (e.g. Dublin: $362+ LHR-only vs
// $43 real cheapest across all London airports) -- corrected to use
// Kayak's LON (all-airports) code for consistency with GF's own scope, per
// explicit user decision.
//
// No same-city case here -- Virginia Water is not one of the 49 origin
// markets, so all 49 origins are real routes to research (none skipped).
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7"; // Virginia Water
const SEASONAL_BAND = "sep";

const ROUTES = [
  { origin: "Amsterdam", costLow: "136.00", costHigh: "357.00", note: "GF[137-399] KY[135-314], no exclusions." },
  { origin: "Atlanta", costLow: "863.00", costHigh: "1065.00", note: "GF[861-1059] KY[864-1070], excluded low: $500 (scraping artifact); high: $1,316 (isolated)." },
  { origin: "Bangalore", costLow: "598.00", costHigh: "1102.00", note: "GF[608-1101] KY[587-1103], excluded high: $1,236 (isolated)." },
  { origin: "Barcelona", costLow: "57.00", costHigh: "311.00", note: "GF[48-278] KY[66-344], no exclusions." },
  { origin: "Beijing", costLow: "783.00", costHigh: "1431.00", note: "GF[794-1425] KY[771-1437], no exclusions." },
  { origin: "Berlin", costLow: "181.00", costHigh: "516.00", note: "GF[226-585] KY[135-447], excluded low: $75 (isolated)." },
  { origin: "Boston", costLow: "639.00", costHigh: "835.00", note: "GF[685-870] KY[592-800], excluded high: $2,519 (isolated)." },
  { origin: "Buenos Aires", costLow: "1451.00", costHigh: "2468.00", note: "GF[1456-2713] KY[1445-2222], excluded high: $2,829 (isolated)." },
  { origin: "Cairo", costLow: "391.00", costHigh: "772.00", note: "GF[481-767] KY[300-777], excluded high: $983 (isolated)." },
  { origin: "Casablanca", costLow: "231.00", costHigh: "622.00", note: "GF[246-606] KY[216-637], excluded low: $72 (isolated); high: $708 (isolated)." },
  { origin: "Chicago", costLow: "813.00", costHigh: "1005.00", note: "GF[814-1005] KY[812-1005], excluded high: $1,224/$1,400x2." },
  { origin: "Dallas", costLow: "917.00", costHigh: "1126.00", note: "GF[886-1119] KY[948-1133], no exclusions." },
  { origin: "Doha", costLow: "580.00", costHigh: "1114.00", note: "GF[622-1094] KY[537-1133], no exclusions." },
  { origin: "Dubai", costLow: "469.00", costHigh: "1000.00", note: "GF[470-1016] KY[468-983], excluded low: $327 (isolated)." },
  { origin: "Dublin", costLow: "43.00", costHigh: "263.00", note: "GF[43-163] KY[43-362], corrected from an initial LHR-only Kayak search that wrongly showed $362-$1,585 -- re-run with LON (all London airports) per user decision, now consistent with GF's own range." },
  { origin: "Hong Kong", costLow: "712.00", costHigh: "1344.00", note: "GF[712-1344] KY[712-1344], no exclusions." },
  { origin: "Johannesburg", costLow: "730.00", costHigh: "986.00", note: "GF[741-876] KY[718-1096], excluded high: $1,104-$4,477x3 (10 values, sparse premium tail)." },
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
  console.log(`✓ ${r.origin} -> Virginia Water seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log(`\nAll Virginia Water flight cost rows (${rows.length} total):`);
console.table(rows);

await sql.end();
