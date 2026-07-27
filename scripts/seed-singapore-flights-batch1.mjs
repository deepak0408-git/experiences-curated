import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Singapore (Formula 1 Singapore Grand Prix 2026)
// -- batch 1 of 49 origins (Amsterdam through Johannesburg alphabetically,
// 17 origins). Researched 23 Jul 2026 per the planner-data-researcher
// skill's Flights methodology (SKILL.md section 1, step 2b): merge BOTH
// sites' prices into ONE combined sorted list, run the low/high density
// cutoff on that MERGED list, then split back out to report each site's
// own surviving low/high, then average the two sites' surviving low/high.
//
// Event: Formula 1 Singapore GP 2026, Oct 9-11 2026. Window: Oct 4-16 2026
// (standard, event <16 days).
//
// IMPORTANT CORRECTION THIS BATCH: prior batches this session (Milan,
// Virginia Water, St Andrews) incorrectly ran the outlier-exclusion filter
// PER-SITE independently instead of on the combined dataset -- the exact
// opposite of the documented SKILL.md rule, which was re-read fresh this
// batch after the error was caught. This was NOT a new rule invented --
// it was already fully specified in the skill doc and simply not followed.
// No retroactive re-audit of the prior 4 completed events was done (user's
// explicit decision) -- this correct method applies from this batch
// forward. See memory feedback_reread_skill_before_implementing.md.
//
// Two rows are user-decided values, NOT filter output -- do not silently
// "correct" them on a future refresh pass without re-confirming with the
// user first:
// - Atlanta: user explicitly chose costLow=1014, costHigh=2022 (the
//   correctly-run combined filter would produce costHigh=1673 instead).
// - Buenos Aires: user explicitly chose costLow=2020, costHigh=3211,
//   excluding only GF's $6,802/$7,320 from the raw data -- the correctly-
//   run combined filter would also exclude $3,076-$3,560 as part of the
//   same sparse tail, producing costHigh=2933 instead.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10"; // Singapore
const SEASONAL_BAND = "oct";

const ROUTES = [
  { origin: "Amsterdam", costLow: "862.00", costHigh: "1138.00", note: "GF[903-1194] KY[821-1082], no exclusions." },
  { origin: "Atlanta", costLow: "1014.00", costHigh: "2022.00", note: "USER-DECIDED, not filter output. Correctly-run combined filter would give GF[997-1699] KY[1030-1647] -> costHigh=1673, excluding GF's 1936/2081/2396. User explicitly chose to keep the full raw range instead." },
  { origin: "Bangalore", costLow: "309.00", costHigh: "471.00", note: "GF[298-514] KY[319-427], no exclusions." },
  { origin: "Barcelona", costLow: "784.00", costHigh: "1018.00", note: "GF[799-1096] KY[768-940], excluded (combined): 1301/1306/3342 (all GF)." },
  { origin: "Beijing", costLow: "352.00", costHigh: "523.00", note: "GF[394-580] KY[309-466], no exclusions." },
  { origin: "Berlin", costLow: "872.00", costHigh: "1126.00", note: "GF[903-1194] KY[841-1058], excluded (combined): 1447/1467/2357 (all GF)." },
  { origin: "Boston", costLow: "859.00", costHigh: "1367.00", note: "GF[864-1382] KY[854-1352], excluded (combined): 1936/10518 (both GF)." },
  { origin: "Buenos Aires", costLow: "2020.00", costHigh: "3211.00", note: "USER-DECIDED, not pure filter output. Raw GF/KY data reviewed by user; user chose to exclude only GF's isolated 6802/7320 from the raw dataset, keeping the rest. Correctly-run combined filter would also exclude 3076-3560 as part of the same sparse tail (costHigh=2933 instead)." },
  { origin: "Cairo", costLow: "733.00", costHigh: "920.00", note: "GF[735-908] KY[731-932], excluded: 1410 (GF, isolated)." },
  { origin: "Casablanca", costLow: "1146.00", costHigh: "1541.00", note: "GF[1262-1578] KY[1029-1503], excluded: 1775 x2 (GF)." },
  { origin: "Chicago", costLow: "948.00", costHigh: "1402.00", note: "GF[959-1460] KY[937-1344], excluded: 1999/2938/16039 (all GF)." },
  { origin: "Dallas", costLow: "1040.00", costHigh: "1338.00", note: "GF[999-1363] KY[1080-1312], excluded: 2239 (GF, isolated)." },
  { origin: "Doha", costLow: "631.00", costHigh: "877.00", note: "GF[710-1086] KY[551-667], excluded: 1202 (GF, isolated)." },
  { origin: "Dubai", costLow: "497.00", costHigh: "743.00", note: "GF[516-945] KY[478-540], no exclusions -- correctly-run combined filter keeps GF's low cluster since Kayak's dense 478-540 cluster corroborates it (this was wrongly excluded under the earlier per-site-only method)." },
  { origin: "Dublin", costLow: "674.00", costHigh: "997.00", note: "GF[683-1010] KY[664-983], excluded: 1193/1198/1199/1473 (all GF)." },
  { origin: "Hong Kong", costLow: "259.00", costHigh: "340.00", note: "GF[258-347] KY[259-332], no exclusions." },
  { origin: "Johannesburg", costLow: "946.00", costHigh: "1239.00", note: "GF[953-1277] KY[938-1200], no exclusions." },
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
