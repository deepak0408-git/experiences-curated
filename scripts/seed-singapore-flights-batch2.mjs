import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Singapore (Formula 1 Singapore Grand Prix 2026)
// -- batch 2 of 49 origins (London through Paris alphabetically, 17
// origins). Researched 23 Jul 2026 per the planner-data-researcher skill's
// Flights methodology (SKILL.md section 1, step 2b): merge BOTH sites'
// prices into ONE combined sorted list, run the low/high density cutoff
// on that MERGED list, then split back out to report each site's own
// surviving low/high, then average.
//
// Event: Formula 1 Singapore GP 2026, Oct 9-11 2026. Window: Oct 4-16 2026.
//
// Mexico City: Google Flights genuinely returned "no results" for this
// route/window (confirmed via raw page inspection -- an actual empty
// result page, not rate-limiting), same pattern as Casablanca->Edinburgh
// on St Andrews. Seeded Kayak-only, single-site density filter.
//
// Moscow: Kayak sanctions-blocks this route (same pattern as every other
// destination researched this project). Google-Flights-only, single-site
// density filter.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10"; // Singapore
const SEASONAL_BAND = "oct";

const ROUTES = [
  { origin: "London", costLow: "734.00", costHigh: "1090.00", note: "GF[711-1241] KY[756-939], excluded: 1792 (GF, isolated)." },
  { origin: "Los Angeles", costLow: "773.00", costHigh: "994.00", note: "GF[773-977] KY[773-1010], excluded: 1267 (GF, isolated)." },
  { origin: "Madrid", costLow: "785.00", costHigh: "967.00", note: "GF[799-989] KY[771-944], excluded: 1193/1562/1600/1713 (all GF)." },
  { origin: "Manchester", costLow: "777.00", costHigh: "1034.00", note: "GF[792-1006] KY[761-1061], excluded: 1475 (GF, isolated)." },
  { origin: "Manila", costLow: "151.00", costHigh: "486.00", note: "GF[152-698] KY[149-273], no exclusions." },
  { origin: "Melbourne", costLow: "397.00", costHigh: "910.00", note: "GF[392-1070] KY[401-750], excluded: 1147/3565 (both GF)." },
  { origin: "Mexico City", costLow: "1336.00", costHigh: "1865.00", note: "KAYAK ONLY -- GF genuinely returned 'no results' for this route/window (confirmed via raw page, not rate-limiting)." },
  { origin: "Miami", costLow: "999.00", costHigh: "1597.00", note: "GF[999-1610] KY[999-1583], excluded: 2046/2245/2687/3194 (all GF)." },
  { origin: "Milan", costLow: "742.00", costHigh: "916.00", note: "GF[770-914] KY[714-918], excluded: 2275 (GF, isolated)." },
  { origin: "Montreal", costLow: "1171.00", costHigh: "1673.00", note: "GF[1190-1716] KY[1151-1630], excluded: 1865/2318/3313 (all GF)." },
  { origin: "Moscow", costLow: "672.00", costHigh: "1010.00", note: "GOOGLE FLIGHTS ONLY -- Kayak sanctions-blocked (same pattern as every destination). Excluded: 1257 (isolated)." },
  { origin: "Mumbai", costLow: "265.00", costHigh: "475.00", note: "GF[280-548] KY[250-401], no exclusions." },
  { origin: "Munich", costLow: "771.00", costHigh: "1040.00", note: "GF[772-1112] KY[770-968], excluded: 1275/1389/2528 (all GF)." },
  { origin: "Nairobi", costLow: "818.00", costHigh: "1203.00", note: "GF[826-1189] KY[809-1217], excluded: 3700 (GF, isolated)." },
  { origin: "New Delhi", costLow: "319.00", costHigh: "459.00", note: "GF[323-493] KY[315-424], no exclusions." },
  { origin: "New York City", costLow: "949.00", costHigh: "1289.00", note: "GF[949-1410] KY[949-1168], no exclusions." },
  { origin: "Paris", costLow: "660.00", costHigh: "929.00", note: "GF[668-944] KY[651-914], excluded: 1312/1390/1396 (all GF)." },
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
  console.log(`✓ ${r.origin} -> Singapore seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log(`\nAll Singapore flight cost rows (${rows.length} total so far):`);
console.table(rows);

await sql.end();
