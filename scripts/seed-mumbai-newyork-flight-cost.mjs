import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Mumbai -> New York, September seasonal band,
// researched 21 Jul 2026 per the planner-data-researcher skill's Flights
// methodology (v2, 2-site average + symmetric natural-gap outlier
// exclusion). Anchored to US Open 2026 (Aug 30 - Sep 13), which spans 14
// days -- under the 16-day multi-city threshold, so the STANDARD window
// applies (startDate-5 to endDate+5), not the long-tour exception.
//
// Search window: Aug 25 - Sep 18, 2026.
//
// Sites -- Google Flights and Kayak, round-trip, economy, <=1 stop, USD,
// fetched via Playwright with a realistic browser UA.
//
// Outlier exclusion -- natural gap detection, applied symmetrically (both
// high and low ends), confirmed 21 Jul 2026 on this exact route (the case
// that established the low-side rule):
//
// Google Flights (<=1 stop, USD, Aug 25 - Sep 18 2026): 84 real 1-stop/
// nonstop prices found. Sorted ascending, the only gap >=15% was a 32.3%
// jump from $2,752 to $3,640 (then $3,787, $3,794) -- those 3 high
// outliers excluded. No low-side gap found.
// Low = $1,149, High = $2,752.
//
// Kayak (<=1 stop, USD, same window, sorted by price ascending): 29 real
// prices found. Sorted ascending, the only gap >=15% was a 46.7% jump from
// $799 to $1,172 -- $799 excluded as a low-side outlier (the case that
// confirmed outlier exclusion applies symmetrically, not just to
// abnormally high fares).
// Low = $1,172, High = $1,629.
//
// costLow = average(1149, 1172) = 1160.50, rounded to whole dollars: 1161.
// costHigh = average(2752, 1629) = 2190.50, rounded to whole dollars: 2191.

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const ORIGIN_MARKET = "Mumbai";
const SEASONAL_BAND = "sep";

const result = await sql`
  INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high, refresh_pass)
  VALUES (${DESTINATION_ID}, ${ORIGIN_MARKET}, ${SEASONAL_BAND}, '1161.00', '2191.00', 'initial')
  ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
    cost_low = EXCLUDED.cost_low,
    cost_high = EXCLUDED.cost_high,
    refresh_pass = EXCLUDED.refresh_pass,
    last_updated = NOW()
  RETURNING id
`;
console.log(`✓ Mumbai -> New York (Sep) seeded, row id ${result[0].id}`);

const rows = await sql`
  SELECT destination_id, origin_market, seasonal_band, cost_low, cost_high, refresh_pass, last_updated
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID} AND origin_market = ${ORIGIN_MARKET}
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
