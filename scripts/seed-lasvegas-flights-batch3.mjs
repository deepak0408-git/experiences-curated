import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Las Vegas (Formula 1 Las Vegas Grand Prix
// 2026) -- batch 3 (FINAL BATCH) of 49 origins (Philadelphia through
// Zurich alphabetically, 14 real origins + Las Vegas itself as the
// same-city $0/$0 row). Completes all 49 origin markets for Las Vegas.
// Researched 24 Jul 2026 per the planner-data-researcher skill's Flights
// methodology (SKILL.md section 1, step 2b): merge BOTH sites' prices
// into ONE combined sorted list, run the density cutoff on that MERGED
// list, then split back out to report each site's own surviving low/high,
// then average.
//
// Event: Formula 1 Las Vegas Grand Prix 2026, Nov 19-21 2026. Window:
// Nov 14-26 2026. seasonalBand="nov", verified to match
// sportingEvents.startDate's month (Nov 19).
//
// Rome: Kayak's raw data included some extreme outlier fares up to
// $23,337 -- confirmed these are real result-card prices (not extraction
// artifacts, passed the "Select button within 4 lines" validity check),
// but genuinely absurd for the route. The density filter correctly
// excluded the entire sparse tail from $1,599 upward, same as intended --
// no manual override needed, filter worked as designed.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409"; // Las Vegas
const SEASONAL_BAND = "nov";

const ROUTES = [
  { origin: "Philadelphia", costLow: "415.00", costHigh: "702.00", note: "GF[407-502] KY[423-901], excluded: 1029/1061 (both KY)." },
  { origin: "Rio de Janeiro", costLow: "775.00", costHigh: "969.00", note: "GF[775-1147] KY[775-790], excluded: 1300/1335 (both GF)." },
  { origin: "Rome", costLow: "990.00", costHigh: "1072.00", note: "GF[954-1097] KY[1026-1046], excluded: 1599x2/1610/1876/2119/2148/2705/3322x2/23089/23091/23335/23337 (all KY, sparse tail -- includes some extreme outlier fares, correctly excluded by density filter, not a data bug)." },
  { origin: "San Francisco", costLow: "143.00", costHigh: "207.00", note: "GF[146-216] KY[139-197], no exclusions." },
  { origin: "Sao Paulo", costLow: "851.00", costHigh: "1038.00", note: "GF[851-975] KY[851-1100], excluded: 1415 (GF, isolated)." },
  { origin: "Seoul", costLow: "1073.00", costHigh: "1373.00", note: "GF[987-1314] KY[1158-1431], excluded: 1653x2 (GF)." },
  { origin: "Shanghai", costLow: "962.00", costHigh: "1766.00", note: "GF[960-1172] KY[963-2359], excluded: 3058 (GF, isolated)." },
  { origin: "Singapore", costLow: "1028.00", costHigh: "1430.00", note: "GF[966-1481] KY[1089-1379], no exclusions." },
  { origin: "Stockholm", costLow: "587.00", costHigh: "728.00", note: "GF[588-792] KY[585-664], no exclusions." },
  { origin: "Sydney", costLow: "1027.00", costHigh: "1558.00", note: "GF[1012-1320] KY[1041-1796], no exclusions." },
  { origin: "Tokyo", costLow: "1036.00", costHigh: "1378.00", note: "GF[1157-1428] KY[914-1328], excluded: 1655/1807 (both GF)." },
  { origin: "Toronto", costLow: "256.00", costHigh: "312.00", note: "GF[263-334] KY[249-290], no exclusions." },
  { origin: "Vancouver", costLow: "178.00", costHigh: "253.00", note: "GF[195-290] KY[161-215], no exclusions." },
  { origin: "Washington D.C.", costLow: "271.00", costHigh: "388.00", note: "GF[249-427] KY[293-348], no exclusions." },
  { origin: "Zurich", costLow: "664.00", costHigh: "786.00", note: "GF[680-809] KY[648-762], no exclusions." },
];
// NOTE: Las Vegas is NOT one of the 49 origin markets (planner_origin_markets),
// unlike New York/Milan/Johannesburg where the destination city IS also a
// selectable origin. A same-city $0/$0 "Las Vegas -> Las Vegas" row was
// mistakenly seeded here on 24 Jul 2026, then deleted the same day once
// caught -- it had no real lookup path since "Las Vegas" is never a
// selectable origin market. Full 49 origins above is the correct, complete
// count.

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
  console.log(`✓ ${r.origin} -> Las Vegas seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log(`\nAll Las Vegas flight cost rows (${rows.length} total, should be 49):`);
console.table(rows);

await sql.end();
