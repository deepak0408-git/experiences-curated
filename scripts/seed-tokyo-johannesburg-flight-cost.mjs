import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Tokyo -> Johannesburg, September seasonal band,
// researched 21 Jul 2026 per the planner-data-researcher skill's Flights
// methodology (v2, 2-site average + natural-gap outlier exclusion).
//
// This is the first flight route seeded — a deliberate single-route test
// before scaling to the full 49-origin x 12-event coverage, per the user's
// explicit instruction 21 Jul 2026.
//
// Search window — multi-city/long-tour exception applied: this route is
// anchored to the Australia-in-South-Africa cricket tour (Sep 24 - Oct 31
// 2026, a 37-day span), which exceeds the 16-day threshold. Per the
// exception rule, the window is startDate-5 to startDate+10, NOT
// endDate+5: Sep 19 - Oct 4, 2026 (not Sep 19 - Nov 5).
//
// Sites — 2, not 3 (Skyscanner excluded, confirmed bot-detection wall that
// held even against a hardened Playwright context). Round-trip, economy,
// <=1 stop, USD, fetched via Playwright with a realistic browser UA.
//
// Outlier exclusion — natural gap detection: sort each site's real <=1-stop
// prices ascending; the high is the last price before the first >~40-50%
// jump to the next price. This is NOT a flat multiplier (a 3x-low cutoff
// was tested and rejected, since it cut off real cluster prices the user
// judged as legitimate).
//
// Google Flights (<=1 stop, USD, Sep 19 - Oct 4 2026): sorted prices ran
// $1,388 (x3) ... $4,111, $4,202, then jumped 46% to $6,151, $14,393.
// Low = $1,388, High = $4,202 (last value before the jump).
//
// Kayak (<=1 stop, USD, same window): sorted prices ran $1,317 ... $2,678,
// no jump anywhere in the dataset exceeded the 40-50% threshold - no
// outliers found, full range stands. Low = $1,317, High = $2,678.
//
// costLow = average(1388, 1317) = 1352.5, rounded to whole dollars: 1353.
// costHigh = average(4202, 2678) = 3440.0, already whole: 3440.

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40"; // Johannesburg
const ORIGIN_MARKET = "Tokyo";
const SEASONAL_BAND = "sep";

const result = await sql`
  INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high, refresh_pass)
  VALUES (${DESTINATION_ID}, ${ORIGIN_MARKET}, ${SEASONAL_BAND}, '1353.00', '3440.00', 'initial')
  ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
    cost_low = EXCLUDED.cost_low,
    cost_high = EXCLUDED.cost_high,
    refresh_pass = EXCLUDED.refresh_pass,
    last_updated = NOW()
  RETURNING id
`;
console.log(`✓ Tokyo -> Johannesburg (Sep) seeded, row id ${result[0].id}`);

const rows = await sql`
  SELECT destination_id, origin_market, seasonal_band, cost_low, cost_high, refresh_pass, last_updated
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID} AND origin_market = ${ORIGIN_MARKET}
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
