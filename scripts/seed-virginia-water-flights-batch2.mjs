import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Virginia Water (BMW PGA Championship 2026) --
// batch 2 of 49 origins (Los Angeles through Philadelphia alphabetically,
// 17 origins). Researched 22-23 Jul 2026 per the planner-data-researcher
// skill's Flights methodology (2-site combined-dataset density-based
// outlier exclusion, THEN average of each site's own surviving low/high).
//
// Event: BMW PGA Championship 2026, window Sep 12-25 2026. Destination
// target: London (all airports), same as batch 1.
//
// BUG FOUND AND FIXED THIS BATCH: initial Kayak scrapes for 7 origins
// (Los Angeles, Madrid, Manchester, Manila, Melbourne, Mexico City, Miami)
// picked up sponsored/ad-card prices inline with real fares (e.g. Miami's
// real cheapest was $647 but contaminated extraction returned $1,284+).
// Root cause: the regex matched prices inside long ad-copy paragraphs
// ("...This is a paid placement... $1,001 View Deal"), not just real
// flight-result cards. Fixed by only accepting prices on their own
// line/short line AND not within 3 lines of "View Deal"/"paid placement"
// markers. Re-fetched all 7 affected origins before this seed.
//
// SECOND BUG FOUND AND FIXED (Manchester range flagged by user as too
// broad for a domestic UK route): the low-outlier-cutoff scan stopped at
// the FIRST qualifying >=40% jump instead of continuing to scan the full
// low window, so it caught the $30x4 stray but missed $47 (a 98% jump to
// the real $93 floor) sitting right after it. Fixed by scanning the full
// low window and taking the LAST qualifying cutoff point, not the first.
// This also corrected Munich (real floor is $225, not $133) -- the same
// class of bug, just not flagged until Manchester's manual review caught it.
// Re-verified all other 15 origins in this batch were unaffected by either fix.
//
// Moscow: Kayak blocks the route (government restrictions/sanctions),
// same as every prior destination. Google Flights only, single-site
// density filter.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7"; // Virginia Water
const SEASONAL_BAND = "sep";

const ROUTES = [
  { origin: "Los Angeles", costLow: "729.00", costHigh: "1030.00", note: "GF[824-1005] KY[633-1055], excluded high: $1,912 (isolated). Re-fetched after ad-contamination fix." },
  { origin: "Madrid", costLow: "75.00", costHigh: "247.00", note: "GF[73-234] KY[76-259], no exclusions. Re-fetched after ad-contamination fix (numbers held up unchanged)." },
  { origin: "Manchester", costLow: "124.00", costHigh: "537.00", note: "GF[154-607] KY[93-467], excluded low: $30x4/$47 (isolated cluster + its own 98% jump to the real floor -- corrected after low-cutoff scan bug found via user review); high: $5,470 (isolated). Real floor is $93 (Kayak), not $47 or $30 -- domestic UK route, appropriately tight range now." },
  { origin: "Manila", costLow: "806.00", costHigh: "1228.00", note: "GF[839-1335] KY[773-1120], excluded high: $1,377/$1,386/$1,612/$9,180x2. Re-fetched after ad-contamination fix." },
  { origin: "Melbourne", costLow: "1193.00", costHigh: "1678.00", note: "GF[1077-1882] KY[1308-1474], excluded high: $2,375/$9,022/$12,802x2 (sparse premium tail). Re-fetched after ad-contamination fix." },
  { origin: "Mexico City", costLow: "1128.00", costHigh: "1503.00", note: "GF[1363-1512] KY[893-1493], excluded high: $1,741/$1,762/$1,919. Re-fetched after ad-contamination fix." },
  { origin: "Miami", costLow: "699.00", costHigh: "1029.00", note: "GF[750-1006] KY[647-1051], no exclusions. Re-fetched after ad-contamination fix -- this was the origin that surfaced the bug (real cheapest $647 vs contaminated $1,284+)." },
  { origin: "Milan", costLow: "51.00", costHigh: "341.00", note: "GF[52-335] KY[49-346], no exclusions." },
  { origin: "Montreal", costLow: "522.00", costHigh: "911.00", note: "GF[524-956] KY[519-865], no exclusions." },
  { origin: "Moscow", costLow: "617.00", costHigh: "1024.00", note: "GOOGLE FLIGHTS ONLY -- Kayak blocked (government restrictions/sanctions). Single-site density filter, excluded high: $1,199/$1,204/$1,313/$2,053 (sparse tail)." },
  { origin: "Mumbai", costLow: "596.00", costHigh: "1032.00", note: "GF[596-1009] KY[595-1055], excluded high: $1,207 (isolated)." },
  { origin: "Munich", costLow: "231.00", costHigh: "430.00", note: "GF[225-384] KY[236-475], excluded low: $63/$133x2/$134 (isolated cluster, corrected via the same low-cutoff scan fix as Manchester). Real floor is $225, a genuine dense cluster start." },
  { origin: "Nairobi", costLow: "757.00", costHigh: "1189.00", note: "GF[757-1209] KY[757-1169], excluded high: $1,309 (isolated)." },
  { origin: "New Delhi", costLow: "606.00", costHigh: "908.00", note: "GF[610-948] KY[601-867], excluded high: $1,090/$1,206/$2,093." },
  { origin: "New York City", costLow: "574.00", costHigh: "807.00", note: "GF[574-793] KY[574-820], excluded high: $1,714/$2,799/$3,520 (sparse tail)." },
  { origin: "Paris", costLow: "95.00", costHigh: "376.00", note: "GF[86-286] KY[104-466], no exclusions." },
  { origin: "Philadelphia", costLow: "973.00", costHigh: "1187.00", note: "GF[911-1077] KY[1035-1296], excluded low: $574 (isolated)." },
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
