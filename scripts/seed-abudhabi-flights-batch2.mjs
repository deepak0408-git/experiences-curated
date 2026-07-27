import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Abu Dhabi (Formula 1 Abu Dhabi Grand Prix 2026)
// -- batch 2 of 49 origins (London through Paris alphabetically, 17
// origins). Researched 24 Jul 2026 per the planner-data-researcher skill's
// Flights methodology (SKILL.md section 1, step 2b): merge BOTH sites'
// prices into ONE combined sorted list, run the density cutoff on that
// MERGED list, then split back out to report each site's own surviving
// low/high, then average.
//
// Event: Abu Dhabi Grand Prix 2026, Dec 4-6 2026. Window: Nov 29-Dec 11
// 2026.
//
// Montreal, Nairobi: Google Flights errored ("Oops" page) -- Kayak-only
// fallback, same precedent as Doha/Casablanca/Mexico City.
//
// Moscow: Kayak sanctions-blocked (0 results, same pattern as every
// destination) -- Google-Flights-only. One isolated GF stray low ($67)
// excluded by the density filter, same known scraping-artifact pattern.
//
// Miami: one isolated GF stray low ($187) excluded by the filter, same
// known artifact pattern already seen on Boston/Chicago/Dallas (batch 1).
//
// Los Angeles: costHigh ($4,602) is genuinely wide, NOT a filter miss --
// verified against raw data: Kayak has a real dense cluster continuing up
// to $4,307-4,523 (5+ points each within $200 of neighbors) and GF's own
// $3,490 sits in that same tail. Long-haul LA-AUH route with a real spread
// of fare classes, correctly kept by the >=4-neighbors-within-$200 rule.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "d4d2ed49-0217-441d-8d1f-38c9b03db2ca"; // Abu Dhabi
const SEASONAL_BAND = "dec";

const ROUTES = [
  { origin: "London", costLow: "499.00", costHigh: "1110.50", note: "GF[495-801] KY[503-1420], excluded: 2506/3320(GF)." },
  { origin: "Los Angeles", costLow: "828.00", costHigh: "4602.00", note: "GF[850-3490] KY[806-5714], excluded: 5890x2(KY) -- genuine wide spread, verified real dense cluster at high end, not a stray." },
  { origin: "Madrid", costLow: "374.00", costHigh: "1185.50", note: "GF[381-1202] KY[367-1169], no exclusions." },
  { origin: "Manchester", costLow: "460.50", costHigh: "1053.00", note: "GF[585-971] KY[336-1135], excluded: 2610(GF, isolated)." },
  { origin: "Manila", costLow: "708.00", costHigh: "1378.00", note: "GF[625-1283] KY[791-1473], excluded: 2301(GF, isolated)." },
  { origin: "Melbourne", costLow: "1266.00", costHigh: "2234.00", note: "GF[1382-2010] KY[1150-2458], excluded: 2515/2546(KY)/4531(GF)." },
  { origin: "Mexico City", costLow: "1442.50", costHigh: "2330.00", note: "GF[1454-2307] KY[1431-2353], excluded: 2598x2(GF)/2744(KY)." },
  { origin: "Miami", costLow: "762.50", costHigh: "1863.00", note: "GF[775-1862] KY[750-1864], excluded low: 187(GF, isolated scraping artifact)." },
  { origin: "Milan", costLow: "302.00", costHigh: "829.00", note: "GF[351-852] KY[253-806], no exclusions." },
  { origin: "Montreal", costLow: "1155.00", costHigh: "2033.00", note: "KAYAK ONLY -- GF returned 'Oops' error page." },
  { origin: "Moscow", costLow: "519.00", costHigh: "753.00", note: "GOOGLE FLIGHTS ONLY -- Kayak sanctions-blocked (0 results, same pattern as every destination). Excluded low: 67(GF, isolated scraping artifact)." },
  { origin: "Mumbai", costLow: "381.00", costHigh: "612.00", note: "GF[391-573] KY[371-651], no exclusions." },
  { origin: "Munich", costLow: "444.50", costHigh: "1100.00", note: "GF[455-1088] KY[434-1112], excluded: 1367/1463(KY)." },
  { origin: "Nairobi", costLow: "514.00", costHigh: "915.00", note: "KAYAK ONLY -- GF returned 'Oops' error page. Excluded high: 1080(KY, isolated)." },
  { origin: "New Delhi", costLow: "410.00", costHigh: "739.50", note: "GF[411-727] KY[409-752], no exclusions." },
  { origin: "New York City", costLow: "791.00", costHigh: "1454.50", note: "GF[782-1413] KY[800-1496], no exclusions." },
  { origin: "Paris", costLow: "327.00", costHigh: "991.50", note: "GF[358-1076] KY[296-907], no exclusions." },
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
  console.log(`✓ ${r.origin} -> Abu Dhabi seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log(`\nAll Abu Dhabi flight cost rows (${rows.length} total so far, should be 34):`);
console.table(rows);

await sql.end();
