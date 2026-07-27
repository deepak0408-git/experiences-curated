import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Las Vegas (Formula 1 Las Vegas Grand Prix
// 2026) -- batch 1 of 49 origins (Amsterdam through Johannesburg
// alphabetically, 17 origins). Researched 24 Jul 2026 per the
// planner-data-researcher skill's Flights methodology (SKILL.md section 1,
// step 2b): merge BOTH sites' prices into ONE combined sorted list, run
// the density cutoff on that MERGED list, then split back out to report
// each site's own surviving low/high, then average.
//
// Event: Formula 1 Las Vegas Grand Prix 2026, Nov 19-21 2026. Window:
// Nov 14-26 2026 (standard, event <16 days). seasonalBand="nov", verified
// to match sportingEvents.startDate's month (Nov 19) -- checked explicitly
// per the standing rule added after the US Open seasonalBand bug.
//
// Doha: Google Flights returned only 5 results, all clustered $1,953-2,347
// -- far above Kayak's entire 50-point range ($1,239-1,665). The combined-
// dataset filter excluded ALL 5 GF points (none had >=4 neighbors within
// $200 of the combined set), leaving no real GF-side value to average.
// User's explicit decision: fall back to Kayak-only for Doha, same
// precedent as Casablanca/Mexico City on prior destinations.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409"; // Las Vegas
const SEASONAL_BAND = "nov";

const ROUTES = [
  { origin: "Amsterdam", costLow: "881.00", costHigh: "1154.00", note: "GF[880-1154] KY[882-1153], no exclusions." },
  { origin: "Atlanta", costLow: "259.00", costHigh: "299.00", note: "GF[249-309] KY[269-288], no exclusions." },
  { origin: "Bangalore", costLow: "1068.00", costHigh: "1397.00", note: "GF[1111-1371] KY[1024-1423], excluded: 1669/2433 (both GF)." },
  { origin: "Barcelona", costLow: "868.00", costHigh: "1002.00", note: "GF[863-1068] KY[872-936], no exclusions." },
  { origin: "Beijing", costLow: "993.00", costHigh: "1393.00", note: "GF[993-1341] KY[992-1445], excluded: 1647 (GF, isolated)." },
  { origin: "Berlin", costLow: "697.00", costHigh: "737.00", note: "GF[698-759] KY[695-715], excluded: 1028 (GF, isolated)." },
  { origin: "Boston", costLow: "299.00", costHigh: "393.00", note: "GF[279-428] KY[318-358], no exclusions." },
  { origin: "Buenos Aires", costLow: "790.00", costHigh: "1181.00", note: "GF[790-1290] KY[790-1072], excluded: 1518 (GF, isolated)." },
  { origin: "Cairo", costLow: "880.00", costHigh: "1127.00", note: "GF[845-1077] KY[915-1177], excluded: 1533/1750 (both GF)." },
  { origin: "Casablanca", costLow: "1118.00", costHigh: "1197.00", note: "GF[1129-1137] KY[1106-1256], excluded: 1660 (GF, isolated)." },
  { origin: "Chicago", costLow: "253.00", costHigh: "316.00", note: "GF[235-344] KY[271-287], no exclusions." },
  { origin: "Dallas", costLow: "198.00", costHigh: "325.00", note: "GF[198-352] KY[198-297], no exclusions." },
  { origin: "Doha", costLow: "1239.00", costHigh: "1665.00", note: "KAYAK ONLY -- GF returned only 5 results, all clustered $1,953-2,347, far above Kayak's entire range; combined-dataset filter excluded all 5 GF points entirely (no real GF value to average). User's explicit decision: Kayak-only fallback." },
  { origin: "Dubai", costLow: "996.00", costHigh: "1388.00", note: "GF[1043-1563] KY[949-1212], no exclusions." },
  { origin: "Dublin", costLow: "658.00", costHigh: "712.00", note: "GF[657-726] KY[659-698], excluded: 1009 (GF, isolated)." },
  { origin: "Hong Kong", costLow: "745.00", costHigh: "1025.00", note: "GF[745-1094] KY[745-955], excluded: 1259/1546 (both GF)." },
  { origin: "Johannesburg", costLow: "1208.00", costHigh: "1436.00", note: "GF[1325-1445] KY[1090-1427], excluded: 1779/1847/2019/2139 (all GF)." },
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
  console.log(`✓ ${r.origin} -> Las Vegas seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log(`\nAll Las Vegas flight cost rows (${rows.length} total so far):`);
console.table(rows);

await sql.end();
