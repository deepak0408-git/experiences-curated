import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Abu Dhabi (Formula 1 Abu Dhabi Grand Prix 2026)
// -- batch 3 (FINAL BATCH) of 49 origins (Philadelphia through Zurich
// alphabetically, 15 origins). Completes all 49 origin markets for Abu
// Dhabi. Researched 24 Jul 2026 per the planner-data-researcher skill's
// Flights methodology (SKILL.md section 1, step 2b): merge BOTH sites'
// prices into ONE combined sorted list, run the density cutoff on that
// MERGED list, then split back out to report each site's own surviving
// low/high, then average.
//
// Event: Abu Dhabi Grand Prix 2026, Dec 4-6 2026. Window: Nov 29-Dec 11
// 2026. seasonalBand="dec", verified to match sportingEvents.startDate's
// month (Dec 4).
//
// Rio de Janeiro ($75), Rome ($113), Toronto ($148), Washington D.C.
// ($141): each had one isolated GF stray low price far below its own real
// cluster -- correctly excluded by the density filter's own >=40% jump
// rule, same known scraping-artifact pattern documented across every prior
// destination's research (NYC, Turin, Las Vegas, batch 1 of this
// destination). No manual override needed.
//
// No same-city row: Abu Dhabi is NOT one of the 49 origin markets
// (confirmed against planner_origin_markets), per the Turin/Las Vegas
// correction (24 Jul 2026) -- a same-city row is only valid when the
// destination city is itself a selectable origin market (NYC, Milan,
// Johannesburg), never applied as a blanket rule.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "d4d2ed49-0217-441d-8d1f-38c9b03db2ca"; // Abu Dhabi
const SEASONAL_BAND = "dec";

const ROUTES = [
  { origin: "Philadelphia", costLow: "1042.00", costHigh: "1371.00", note: "GF[1063-1376] KY[1021-1366], excluded high: 2471/2493/4722/7821/7826(GF), sparse tail." },
  { origin: "Rio de Janeiro", costLow: "1067.00", costHigh: "2271.50", note: "GF[1058-2154] KY[1076-2389], excluded low: 75(GF, isolated scraping artifact)." },
  { origin: "Rome", costLow: "316.00", costHigh: "926.00", note: "GF[341-935] KY[291-917], excluded low: 113(GF, isolated scraping artifact); excluded high: 1556(GF)." },
  { origin: "San Francisco", costLow: "846.00", costHigh: "1872.00", note: "GF[850-1671] KY[842-2073], excluded high: 5900/12251(GF), sparse tail." },
  { origin: "Sao Paulo", costLow: "977.50", costHigh: "2114.00", note: "GF[1011-2028] KY[944-2200], excluded: 3159(GF, isolated)." },
  { origin: "Seoul", costLow: "675.00", costHigh: "1605.00", note: "GF[825-1611] KY[525-1599], excluded: 1843/2127(GF)." },
  { origin: "Shanghai", costLow: "526.50", costHigh: "1487.50", note: "GF[550-1403] KY[503-1572], excluded: 1700/1705/1725/2052(GF)." },
  { origin: "Singapore", costLow: "571.50", costHigh: "1156.50", note: "GF[575-1143] KY[568-1170], excluded: 2252(GF, isolated)." },
  { origin: "Stockholm", costLow: "357.50", costHigh: "1007.00", note: "GF[400-992] KY[315-1022], excluded: 1214(GF, isolated)." },
  { origin: "Sydney", costLow: "1213.50", costHigh: "2164.50", note: "GF[1341-2182] KY[1086-2147], excluded: 4584/4925(GF)." },
  { origin: "Tokyo", costLow: "851.00", costHigh: "1728.00", note: "GF[1035-1773] KY[667-1683], excluded: 1796(KY, isolated)." },
  { origin: "Toronto", costLow: "931.50", costHigh: "1812.00", note: "GF[917-1833] KY[946-1791], excluded low: 148(GF, isolated scraping artifact); excluded high: 2038/2117/2281(KY)." },
  { origin: "Vancouver", costLow: "1335.00", costHigh: "2707.00", note: "GF[1088-2556] KY[1582-2858], excluded: 3043(KY)/3573(GF)." },
  { origin: "Washington D.C.", costLow: "700.00", costHigh: "1642.50", note: "GF[700-1679] KY[700-1606], excluded low: 141(GF, isolated scraping artifact); excluded high: 1866x2(KY)." },
  { origin: "Zurich", costLow: "389.00", costHigh: "1429.00", note: "GF[389-1393] KY[389-1465], excluded: 1643(GF, isolated)." },
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
console.log(`\nAll Abu Dhabi flight cost rows (${rows.length} total, should be 49):`);
console.table(rows);

await sql.end();
