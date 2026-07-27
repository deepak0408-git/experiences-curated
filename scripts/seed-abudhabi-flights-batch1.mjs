import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Abu Dhabi (Formula 1 Abu Dhabi Grand Prix 2026)
// -- batch 1 of 49 origins (Amsterdam through Johannesburg alphabetically,
// 17 origins). Researched 24 Jul 2026 per the planner-data-researcher
// skill's Flights methodology (SKILL.md section 1, step 2b): merge BOTH
// sites' prices into ONE combined sorted list, run the density cutoff on
// that MERGED list, then split back out to report each site's own
// surviving low/high, then average.
//
// Event: Abu Dhabi Grand Prix 2026, Dec 4-6 2026. Window: Nov 29-Dec 11
// 2026 (standard, event <16 days). seasonalBand="dec", verified to match
// sportingEvents.startDate's month (Dec 4).
//
// Abu Dhabi is a genuine standalone destination with its own major airport
// -- nearestAirportIata already set to AUH, no airport-scope decision
// needed. NOT one of the 49 origin markets itself (confirmed against
// planner_origin_markets) -- no same-city row seeded, per the
// Turin/Las Vegas correction (24 Jul 2026): a same-city row is only valid
// when the destination city is itself a selectable origin market (NYC,
// Milan, Johannesburg), never applied as a blanket rule.
//
// Barcelona and Dubai: Google Flights failed (Oops error page / 0 results
// respectively) -- Kayak-only fallback, same precedent as Doha/Casablanca/
// Mexico City on prior destinations.
//
// Boston ($85), Chicago ($239), Dallas ($323): each had one isolated GF
// stray low price far below its own real cluster -- correctly excluded by
// the density filter's own >=40% jump rule, same known scraping-artifact
// pattern already documented on NYC's research. No manual override needed.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "d4d2ed49-0217-441d-8d1f-38c9b03db2ca"; // Abu Dhabi
const SEASONAL_BAND = "dec";

const ROUTES = [
  { origin: "Amsterdam", costLow: "465.50", costHigh: "991.50", note: "GF[467-979] KY[464-1004], excluded: 1231/1235/1274(KY)/1296/1518/3940(GF)." },
  { origin: "Atlanta", costLow: "746.50", costHigh: "1916.50", note: "GF[750-1847] KY[743-1986], no exclusions." },
  { origin: "Bangalore", costLow: "388.00", costHigh: "633.50", note: "GF[397-554] KY[379-713], no exclusions." },
  { origin: "Barcelona", costLow: "278.00", costHigh: "1153.00", note: "KAYAK ONLY -- GF returned 'Oops' error page, no usable GF data." },
  { origin: "Beijing", costLow: "563.00", costHigh: "597.00", note: "GF[569-569] KY[557-625], excluded: 824/1395/1930/2188/2348/2383/2636/2685(GF)/1251/1457/1634/1927/2721/3717/6146(KY) -- sparse GF, single low cluster survives." },
  { origin: "Berlin", costLow: "345.00", costHigh: "1091.00", note: "GF[379-1099] KY[311-1083], excluded: 1559(GF, isolated)." },
  { origin: "Boston", costLow: "776.50", costHigh: "1454.50", note: "GF[780-1429] KY[773-1480], excluded low: 85(GF, isolated scraping artifact); excluded high: 1701(KY)/14870(GF)." },
  { origin: "Buenos Aires", costLow: "1493.00", costHigh: "2390.50", note: "GF[1535-2262] KY[1451-2519], excluded: 2552/2806(KY)/2883/2901/2911/3319/3484/3660/3950/5871(GF) -- sparse high tail." },
  { origin: "Cairo", costLow: "332.00", costHigh: "551.50", note: "GF[352-501] KY[312-602], excluded: 897(GF, isolated)." },
  { origin: "Casablanca", costLow: "477.50", costHigh: "1145.00", note: "GF[433-1155] KY[522-1135], no exclusions." },
  { origin: "Chicago", costLow: "696.50", costHigh: "1522.50", note: "GF[700-1369] KY[693-1676], excluded low: 239(GF, isolated scraping artifact); excluded high: 1695/1703/2039/4173(GF)." },
  { origin: "Dallas", costLow: "771.50", costHigh: "1425.50", note: "GF[739-1522] KY[804-1329], excluded low: 323(GF, isolated scraping artifact); excluded high: 1636/1690(GF)." },
  { origin: "Doha", costLow: "374.50", costHigh: "534.00", note: "GF[386-441] KY[363-627], no exclusions." },
  { origin: "Dubai", costLow: "338.00", costHigh: "702.00", note: "KAYAK ONLY -- GF returned 0 results, no usable GF data." },
  { origin: "Dublin", costLow: "393.50", costHigh: "1124.50", note: "GF[435-1065] KY[352-1184], excluded: 2514(GF, isolated)." },
  { origin: "Hong Kong", costLow: "595.50", costHigh: "1743.00", note: "GF[604-1750] KY[587-1736], no exclusions." },
  { origin: "Johannesburg", costLow: "609.00", costHigh: "1150.50", note: "GF[629-958] KY[589-1343], excluded: 1500(KY, isolated)." },
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
console.log(`\nAll Abu Dhabi flight cost rows (${rows.length} total so far, should be 17):`);
console.table(rows);

await sql.end();
