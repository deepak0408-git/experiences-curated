import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Las Vegas (Formula 1 Las Vegas Grand Prix
// 2026) -- batch 2 of 49 origins (London through Paris alphabetically, 17
// origins). Researched 24 Jul 2026 per the planner-data-researcher skill's
// Flights methodology (SKILL.md section 1, step 2b): merge BOTH sites'
// prices into ONE combined sorted list, run the density cutoff on that
// MERGED list, then split back out to report each site's own surviving
// low/high, then average.
//
// Event: Formula 1 Las Vegas Grand Prix 2026, Nov 19-21 2026. Window:
// Nov 14-26 2026.
//
// Moscow: Kayak sanctions-blocked (same pattern as every destination).
// Google Flights itself displayed a "Limited flight results" warning and
// returned only 3 real results ($2,386/$2,470/$4,068) -- confirmed
// genuinely thin route via raw page inspection, not a fetch failure. Too
// few points to run any density filter meaningfully. User's explicit
// decision: use the raw 3-point range as-is, no exclusions, same
// precedent as the Moscow row on St Andrews.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409"; // Las Vegas
const SEASONAL_BAND = "nov";

const ROUTES = [
  { origin: "London", costLow: "737.00", costHigh: "862.00", note: "GF[731-948] KY[742-776], no exclusions." },
  { origin: "Los Angeles", costLow: "99.00", costHigh: "248.00", note: "GF[100-328] KY[97-167], no exclusions." },
  { origin: "Madrid", costLow: "767.00", costHigh: "985.00", note: "GF[766-1067] KY[768-902], no exclusions." },
  { origin: "Manchester", costLow: "814.00", costHigh: "978.00", note: "GF[813-973] KY[815-982], excluded: 1286 (GF, isolated)." },
  { origin: "Manila", costLow: "806.00", costHigh: "1099.00", note: "GF[818-1147] KY[793-1051], excluded: 1262/1267/1297/1499/2308 (all GF)." },
  { origin: "Melbourne", costLow: "1097.00", costHigh: "1327.00", note: "GF[1096-1370] KY[1098-1283], no exclusions." },
  { origin: "Mexico City", costLow: "282.00", costHigh: "523.00", note: "GF[282-568] KY[282-478], no exclusions." },
  { origin: "Miami", costLow: "360.00", costHigh: "445.00", note: "GF[342-452] KY[377-437], no exclusions." },
  { origin: "Milan", costLow: "832.00", costHigh: "1003.00", note: "GF[829-1004] KY[835-1001], no exclusions." },
  { origin: "Montreal", costLow: "374.00", costHigh: "458.00", note: "GF[388-475] KY[360-440], no exclusions." },
  { origin: "Moscow", costLow: "2386.00", costHigh: "4068.00", note: "USER-DECIDED, raw 3-point range, no filtering. Kayak sanctions-blocked; GF showed 'Limited flight results' with only 3 real prices ($2,386/$2,470/$4,068) -- genuinely thin route (long-haul, restricted airspace), confirmed via raw page inspection." },
  { origin: "Mumbai", costLow: "1098.00", costHigh: "1333.00", note: "GF[1138-1354] KY[1057-1311], excluded: 1585/1632/1655 (all GF)." },
  { origin: "Munich", costLow: "709.00", costHigh: "798.00", note: "GF[683-849] KY[735-747], no exclusions." },
  { origin: "Nairobi", costLow: "1200.00", costHigh: "1674.00", note: "GF[1324-1713] KY[1076-1634], excluded: 2061/3829 (both GF)." },
  { origin: "New Delhi", costLow: "1152.00", costHigh: "1510.00", note: "GF[1189-1504] KY[1114-1516], no exclusions." },
  { origin: "New York City", costLow: "328.00", costHigh: "427.00", note: "GF[320-477] KY[335-377], no exclusions." },
  { origin: "Paris", costLow: "632.00", costHigh: "742.00", note: "GF[631-769] KY[633-714], excluded: 920 (GF, isolated)." },
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
