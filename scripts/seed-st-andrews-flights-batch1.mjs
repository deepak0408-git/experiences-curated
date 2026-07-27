import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for St Andrews (Alfred Dunhill Links Championship
// 2026) -- batch 1 of 49 origins (Amsterdam through Johannesburg
// alphabetically, 17 origins). Researched 23 Jul 2026 per the
// planner-data-researcher skill's Flights methodology (2-site combined-
// dataset density-based outlier exclusion, THEN average of each site's own
// surviving low/high).
//
// Event: Alfred Dunhill Links Championship 2026, Oct 1-4 2026. Window:
// Sep 26-Oct 9 2026 (standard, event <16 days).
//
// St Andrews has no airport of its own -- nearestAirportIata set to EDI
// (Edinburgh) per explicit user decision 23 Jul 2026, over DND (Dundee,
// closer but very limited routes). Searches target "Edinburgh" broadly,
// same pattern as Virginia Water -> London.
//
// REAL BUG FOUND AND FIXED THIS BATCH -- 3rd variant of the low-outlier-
// cutoff bug (after Manchester/Munich in the Virginia Water batches):
// Amsterdam's GF data was [139, 142, 200, 200, 200, ...]. The filter was
// excluding $139/$142 purely because the jump INTO the next tier
// (142->200, 41%) crossed the 40% threshold -- even though 139/142 is a
// real, agreeing 2-point cluster, independently confirmed by Kayak's own
// floor of $142 across 50 results. Fixed per explicit user instruction:
// a low-end point/cluster is now only excluded if UNCORROBORATED -- fewer
// than 2 total data points across the COMBINED GF+Kayak dataset sit within
// $10 of it. Verified the fix against Berlin, Doha, and Dublin (all
// correctly unaffected/still-excluded where appropriate). Per explicit user
// decision, no retroactive re-audit of the 4 already-completed events
// (NYC, Johannesburg, Milan, Virginia Water) -- this corrected logic
// applies from this batch forward, to be spot-checked at each
// destination's T-60/T-30 refresh pass.
//
// Casablanca: Google Flights genuinely returned "no results" for this
// route/window (confirmed via raw page inspection -- an actual empty
// result page, not rate-limiting) -- seeded Kayak-only, single-site
// density filter.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "6672a395-f471-4b9e-9d1a-0f567441470a"; // St Andrews
const SEASONAL_BAND = "sep";

const ROUTES = [
  { origin: "Amsterdam", costLow: "141.00", costHigh: "257.00", note: "GF[139-324] KY[142-189], no exclusions (corrected low-cutoff bug -- see script header)." },
  { origin: "Atlanta", costLow: "974.00", costHigh: "1613.00", note: "GF[974-1148] KY[974-2077], excluded KY high: $2,317 (isolated)." },
  { origin: "Bangalore", costLow: "866.00", costHigh: "1098.00", note: "GF[953-1120] KY[778-1076], excluded GF high: $1,288/$1,354/$1,373." },
  { origin: "Barcelona", costLow: "157.00", costHigh: "313.00", note: "GF[192-436] KY[121-189], no exclusions." },
  { origin: "Beijing", costLow: "1429.00", costHigh: "2034.00", note: "GF[1620-2099] KY[1237-1969], excluded GF high: $2,306-$3,965 (4 values, sparse tail)." },
  { origin: "Berlin", costLow: "259.00", costHigh: "346.00", note: "GF[376-485] KY[142-206], excluded GF low: $185/$233/$254/$254 (uncorroborated by Kayak's own separate distribution)." },
  { origin: "Boston", costLow: "807.00", costHigh: "886.00", note: "GF[810-912] KY[804-859], no exclusions." },
  { origin: "Buenos Aires", costLow: "1803.00", costHigh: "2777.00", note: "GF[2210-3179] KY[1395-2374], excluded GF high: $3,453 x2." },
  { origin: "Cairo", costLow: "476.00", costHigh: "820.00", note: "GF[507-1000] KY[444-640], excluded GF high: $1,174/$1,264." },
  { origin: "Casablanca", costLow: "246.00", costHigh: "349.00", note: "KAYAK ONLY -- Google Flights genuinely returned 'no results' for this route/window (confirmed via raw page, not rate-limiting)." },
  { origin: "Chicago", costLow: "985.00", costHigh: "1171.00", note: "GF[990-1199] KY[980-1142], no exclusions." },
  { origin: "Dallas", costLow: "960.00", costHigh: "1047.00", note: "GF[965-1029] KY[954-1064], no exclusions." },
  { origin: "Doha", costLow: "917.00", costHigh: "1337.00", note: "GF[1139-1437] KY[695-1237], excluded GF low: $792 (isolated)." },
  { origin: "Dubai", costLow: "645.00", costHigh: "1004.00", note: "GF[714-981] KY[575-1027], excluded GF high: $1,324 (isolated)." },
  { origin: "Dublin", costLow: "49.00", costHigh: "189.00", note: "GF[51-275] KY[47-102], no exclusions." },
  { origin: "Hong Kong", costLow: "1086.00", costHigh: "1593.00", note: "GF[1238-1506] KY[934-1679], excluded GF high: $1,748/$1,855." },
  { origin: "Johannesburg", costLow: "1008.00", costHigh: "1434.00", note: "GF[1068-1478] KY[948-1389], excluded GF high: $2,286 (isolated)." },
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
