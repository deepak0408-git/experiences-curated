import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Virginia Water (BMW PGA Championship 2026) --
// batch 3 of 49 origins (FINAL BATCH: Rio de Janeiro through Zurich
// alphabetically, 14 origins). Completes all 49 origin markets for
// Virginia Water. Researched 23 Jul 2026 per the planner-data-researcher
// skill's Flights methodology (2-site combined-dataset density-based
// outlier exclusion, THEN average of each site's own surviving low/high).
//
// Event: BMW PGA Championship 2026, window Sep 12-25 2026. Destination
// target: London (all airports), same as batches 1 and 2.
//
// TWO REAL BUGS FOUND AND FIXED THIS BATCH (before any table was built):
// 1. Google Flights was silently rendering fares in INR, not USD --
//    Playwright's browser context had no explicit currency/region set, so
//    Google defaulted based on some other signal (likely IP geolocation).
//    The price-extraction regex only matched "$", so it silently returned
//    zero prices for every origin instead of erroring. Fixed by forcing
//    curr=USD&gl=US&hl=en on every Google Flights request URL. Verified by
//    inspecting Rio de Janeiro's raw page text before and after the fix.
// 2. Kayak's page structure had shifted since the prior batch -- sidebar
//    filter/breakdown prices (per-airport, per-airline, per-alliance price
//    chips) and ad-card prices were being swept into the same flat-line
//    price regex as real result-card fares, and a rendering artifact glued
//    adjacent prices together with no separator (e.g. "13581457" instead of
//    1358 and 1457 on separate lines). Fixed by requiring a bare "$X" line
//    to be followed by a "Select" button within 4 lines (the real
//    result-card pattern) before accepting it as a genuine fare, and
//    rejecting anything within 3 lines of "View Deal"/"paid
//    placement"/"Sponsored". Cross-checked against Kayak's own "Cheapest $X"
//    summary line -- matched exactly on Rio de Janeiro ($1,333 both ways).
//
// KAYAK BOT-DETECTION BLOCK (Vancouver, Washington D.C., Zurich): after
// ~14 consecutive automated Kayak requests in this session, Kayak served a
// "Security Check: Please confirm that you are a real KAYAK user" CAPTCHA
// wall instead of real results -- confirmed by inspecting the raw page
// HTML, not a parsing bug. These 3 origins fall back to Google-Flights-only
// with the single-site density filter, same precedent as Moscow across
// every prior destination (Kayak sanctions-blocks Moscow on every route).
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7"; // Virginia Water
const SEASONAL_BAND = "sep";

const ROUTES = [
  { origin: "Rio de Janeiro", costLow: "1223.00", costHigh: "1558.00", note: "GF[1113-1631] KY[1333-1485], no exclusions." },
  { origin: "Rome", costLow: "66.00", costHigh: "294.00", note: "GF[69-476] KY[63-112], excluded GF high: $579 (isolated)." },
  { origin: "San Francisco", costLow: "829.00", costHigh: "998.00", note: "GF[846-1047] KY[812-949], no exclusions." },
  { origin: "Sao Paulo", costLow: "1104.00", costHigh: "1561.00", note: "GF[1105-1667] KY[1102-1455], excluded GF high: $1,696/$1,807." },
  { origin: "Seoul", costLow: "800.00", costHigh: "1053.00", note: "GF[938-1344] KY[661-761], excluded GF high: $1,492/$1,747/$1,751." },
  { origin: "Shanghai", costLow: "752.00", costHigh: "936.00", note: "GF[878-1120] KY[625-752], excluded GF high: $1,329 (isolated)." },
  { origin: "Singapore", costLow: "680.00", costHigh: "809.00", note: "GF[705-861] KY[655-756], excluded GF high: $1,098-$2,230 (8 values, sparse tail)." },
  { origin: "Stockholm", costLow: "137.00", costHigh: "182.00", note: "GF[193-245] KY[80-119], excluded GF low: $49/$53/$133 (isolated cluster); KY low: $52/$53/$55/$57 (isolated cluster)." },
  { origin: "Sydney", costLow: "1307.00", costHigh: "1672.00", note: "GF[1427-1920] KY[1186-1423], excluded GF high: $1,994 (isolated)." },
  { origin: "Tokyo", costLow: "1100.00", costHigh: "1641.00", note: "GF[1207-1736] KY[993-1546], excluded GF high: $2,572-$3,401 (5 values, sparse tail)." },
  { origin: "Toronto", costLow: "535.00", costHigh: "714.00", note: "GF[540-789] KY[529-638], no exclusions." },
  { origin: "Vancouver", costLow: "689.00", costHigh: "1112.00", note: "GOOGLE FLIGHTS ONLY -- Kayak bot-detection CAPTCHA block (confirmed via raw page inspection, not a parsing bug). Excluded high: $1,272 (isolated)." },
  { origin: "Washington D.C.", costLow: "739.00", costHigh: "1001.00", note: "GOOGLE FLIGHTS ONLY -- Kayak bot-detection CAPTCHA block. No exclusions." },
  { origin: "Zurich", costLow: "141.00", costHigh: "286.00", note: "GOOGLE FLIGHTS ONLY -- Kayak bot-detection CAPTCHA block. No exclusions." },
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
console.log(`\nAll Virginia Water flight cost rows (${rows.length} total, should be 49):`);
console.table(rows);

await sql.end();
