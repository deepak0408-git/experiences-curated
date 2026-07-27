import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Milan (Italian GP 2026) -- batch 1 of 49 origins
// (Amsterdam through Johannesburg alphabetically, 16 real routes + Milan's
// own same-city $0 row = 17 origins). Researched 22 Jul 2026 per the
// planner-data-researcher skill's Flights methodology (2-site
// combined-dataset density-based outlier exclusion, THEN average of each
// site's own surviving low/high).
//
// Event: Italian Grand Prix 2026, Sep 4-6 2026. Standard window (not
// multi-city exception, event is <16 days): startDate-5 to endDate+5 =
// Aug 30 - Sep 11 2026.
//
// currency column: planner_flight_cost has a NOT NULL currency column
// (default 'USD'). Explicitly tagging currency: "USD" on every row per the
// updated skill pre-flight checklist.

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const SEASONAL_BAND = "sep";

const ROUTES = [
  { origin: "Amsterdam", costLow: "224.00", costHigh: "564.00", note: "GF[231-581] KY[216-547], excluded low: $139 (isolated); high: $887x2/$1,064 (sparse tail)." },
  { origin: "Atlanta", costLow: "823.00", costHigh: "1218.00", note: "GF[823-1266] KY[823-1170], excluded low: $500x2 (scraping artifact)." },
  { origin: "Bangalore", costLow: "880.00", costHigh: "2093.00", note: "GF[864-1710] KY[896-2476], no exclusions -- dataset is continuously dense all the way to $2,476." },
  { origin: "Barcelona", costLow: "108.00", costHigh: "252.00", note: "GF[87-219] KY[129-285], excluded low: $45 (isolated); high: $472/$673 (sparse)." },
  { origin: "Beijing", costLow: "1042.00", costHigh: "1924.00", note: "GF[904-1839] KY[1179-2009], excluded high: $2,076-$2,700 (5 values, sparse tail)." },
  { origin: "Berlin", costLow: "166.00", costHigh: "337.00", note: "GF[150-307] KY[182-367], excluded high: $529/$582/$657." },
  { origin: "Boston", costLow: "580.00", costHigh: "990.00", note: "GF[580-979] KY[580-1000], excluded high: $1,407/$1,831." },
  { origin: "Buenos Aires", costLow: "1676.00", costHigh: "2493.00", note: "GF[1755-2491] KY[1597-2495], excluded high: $2,841/$3,032." },
  { origin: "Cairo", costLow: "448.00", costHigh: "1057.00", note: "GF[410-1028] KY[486-1085], excluded high: $1,466/$1,954." },
  { origin: "Casablanca", costLow: "474.00", costHigh: "1136.00", note: "GF[479-1086] KY[468-1186], excluded high: $1,315/$4,728." },
  { origin: "Chicago", costLow: "555.00", costHigh: "1189.00", note: "GF[609-1149] KY[500-1228], excluded low: $110 (scraping artifact)." },
  { origin: "Dallas", costLow: "898.00", costHigh: "1387.00", note: "GF[869-1352] KY[926-1421], excluded low: $500x2 (scraping artifact)." },
  { origin: "Doha", costLow: "633.00", costHigh: "1263.00", note: "GF[637-1320] KY[629-1206], excluded high: $1,840 (isolated)." },
  { origin: "Dubai", costLow: "560.00", costHigh: "1714.00", note: "GF[502-1235] KY[618-2192], no exclusions." },
  { origin: "Dublin", costLow: "175.00", costHigh: "325.00", note: "GF[169-399] KY[181-251], excluded low: $119x2 (isolated); high: $621x2/$2,277x2 (sparse tail)." },
  { origin: "Hong Kong", costLow: "731.00", costHigh: "1530.00", note: "GF[731-1530] KY[731-1530], no exclusions." },
  { origin: "Johannesburg", costLow: "784.00", costHigh: "1368.00", note: "GF[661-1449] KY[907-1286], excluded high: $1,548 (isolated)." },
  { origin: "Milan", costLow: "0.00", costHigh: "0.00", note: "Same-city origin/destination -- Milan is both this event's destination and one of the 49 origin markets. Seeded as a real $0 'no flight needed' row per the standing same-city rule." },
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
  console.log(`✓ ${r.origin} -> Milan seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log(`\nAll Milan flight cost rows (${rows.length} total):`);
console.table(rows);

await sql.end();
