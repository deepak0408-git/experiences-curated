import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Turin (Nitto ATP Finals 2026) -- all 49 origins,
// researched 23-24 Jul 2026 per the planner-data-researcher skill's
// Flights methodology (SKILL.md section 1, step 2b): merge BOTH sites'
// prices into ONE combined sorted list, run the density cutoff on that
// MERGED list, then split back out to report each site's own surviving
// low/high, then average.
//
// Event: Nitto ATP Finals 2026, Nov 15-22 2026. Window: Nov 10-27 2026
// (standard, event <16 days). seasonalBand = "nov", matches
// sportingEvents.startDate's month (Nov 15) -- verified against the same
// bug class found and fixed on US Open (flight seasonalBand must match
// startDate's month or the planner's lookup silently skips the event).
//
// Google Flights had a real multi-hour outage/rate-limit during initial
// research (23 Jul 2026) -- 9 of 17 batch-1 origins failed with genuine
// "Oops, something went wrong" GF error pages, recovered fully the next day
// (24 Jul 2026) with zero methodology changes needed, confirming it was a
// transient GF-side issue, not a systemic block. Batches 2 and 3 were
// initially Kayak-only (built while GF was down) -- Google Flights was
// fetched for all 30 of those origins in a follow-up pass once GF
// recovered. Two origins (Milan, Singapore) were missed entirely across
// all 3 batches and caught only during a final row-count check (49
// expected, only 47 present) -- fetched separately as a small follow-up
// batch. Moscow is Google-Flights-only (Kayak sanctions-blocks the route,
// same pattern as every other destination).
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2"; // Turin
const SEASONAL_BAND = "nov";

const ROUTES = [
  { origin: "Amsterdam", costLow: "204.00", costHigh: "300.00", note: "GF[213-296] KY[195-303], no exclusions." },
  { origin: "Atlanta", costLow: "911.00", costHigh: "1150.00", note: "GF[956-1230] KY[865-1070], excluded: 1291/1506 (both GF)." },
  { origin: "Bangalore", costLow: "815.00", costHigh: "1096.00", note: "GF[893-1054] KY[737-1137], excluded: 1427/1436/1530 (all GF)." },
  { origin: "Barcelona", costLow: "43.00", costHigh: "342.00", note: "GF[41-420] KY[45-263], no exclusions." },
  { origin: "Beijing", costLow: "743.00", costHigh: "1242.00", note: "GF[756-1300] KY[730-1184], no exclusions." },
  { origin: "Berlin", costLow: "209.00", costHigh: "409.00", note: "GF[236-500] KY[181-317], no exclusions." },
  { origin: "Boston", costLow: "747.00", costHigh: "1077.00", note: "GF[813-1098] KY[681-1055], excluded: 1263 (GF, isolated)." },
  { origin: "Buenos Aires", costLow: "1323.00", costHigh: "1718.00", note: "GF[1518-1767] KY[1127-1668], excluded: 1924/1973/2090/2190/3078/3571/6420 (all GF, sparse tail)." },
  { origin: "Cairo", costLow: "401.00", costHigh: "578.00", note: "GF[469-678] KY[333-478], excluded: 718/1126/1185 (all GF)." },
  { origin: "Casablanca", costLow: "255.00", costHigh: "367.00", note: "GF[272-378] KY[238-355], excluded: 988/1027 (both GF)." },
  { origin: "Chicago", costLow: "823.00", costHigh: "1144.00", note: "GF[829-1229] KY[816-1058], no exclusions." },
  { origin: "Dallas", costLow: "759.00", costHigh: "1007.00", note: "GF[746-1055] KY[772-959], no exclusions." },
  { origin: "Doha", costLow: "774.00", costHigh: "1213.00", note: "GF[790-1462] KY[757-963], excluded: 1619/1721 (both GF)." },
  { origin: "Dubai", costLow: "444.00", costHigh: "838.00", note: "GF[477-891] KY[410-785], excluded: 1158/1245/1245 (all GF)." },
  { origin: "Dublin", costLow: "152.00", costHigh: "335.00", note: "GF[172-402] KY[132-267], no exclusions." },
  { origin: "Hong Kong", costLow: "644.00", costHigh: "1205.00", note: "GF[644-1047] KY[643-1363], no exclusions." },
  { origin: "Johannesburg", costLow: "663.00", costHigh: "992.00", note: "GF[706-1003] KY[619-980], excluded: 1354 (GF, isolated)." },
  { origin: "London", costLow: "108.00", costHigh: "237.00", note: "GF[126-306] KY[89-167], no exclusions." },
  { origin: "Los Angeles", costLow: "735.00", costHigh: "887.00", note: "GF[759-954] KY[711-819], excluded: 1123 (GF, isolated)." },
  { origin: "Madrid", costLow: "116.00", costHigh: "284.00", note: "GF[123-379] KY[109-189], excluded: 439/502/681 (all GF)." },
  { origin: "Manchester", costLow: "216.00", costHigh: "383.00", note: "GF[234-455] KY[197-310], no exclusions." },
  { origin: "Manila", costLow: "1104.00", costHigh: "1382.00", note: "GF[1099-1447] KY[1108-1316], excluded: 1629/1861/3032 (all GF)." },
  { origin: "Melbourne", costLow: "1404.00", costHigh: "2033.00", note: "GF[1398-1998] KY[1409-2068], excluded: 2431/2761 (both GF)." },
  { origin: "Mexico City", costLow: "1058.00", costHigh: "1333.00", note: "GF[1076-1421] KY[1039-1245], excluded: 1452/1455/1530 (all GF)." },
  { origin: "Miami", costLow: "754.00", costHigh: "937.00", note: "GF[772-953] KY[735-920], no exclusions." },
  { origin: "Milan", costLow: "177.00", costHigh: "275.00", note: "GF[273-411] KY[80-138], excluded: 20(KY, low, isolated); 526/669/709/4646/6089 (GF, sparse high tail). Origin missed in initial batches, fetched separately after a 49-row count check found only 47 present." },
  { origin: "Montreal", costLow: "713.00", costHigh: "976.00", note: "GF[713-982] KY[712-970], no exclusions." },
  { origin: "Moscow", costLow: "732.00", costHigh: "1262.00", note: "GOOGLE FLIGHTS ONLY -- Kayak sanctions-blocked (same pattern as every destination). GF showed a 'Limited flight results' warning but 10 genuine results, no exclusions." },
  { origin: "Mumbai", costLow: "765.00", costHigh: "1049.00", note: "GF[742-1047] KY[788-1050], excluded: 1218 (GF, isolated)." },
  { origin: "Munich", costLow: "178.00", costHigh: "382.00", note: "GF[185-453] KY[170-310], excluded: 6134 (GF, isolated)." },
  { origin: "Nairobi", costLow: "766.00", costHigh: "1230.00", note: "GF[783-1303] KY[748-1156], excluded: 3310 (GF, isolated)." },
  { origin: "New Delhi", costLow: "772.00", costHigh: "1056.00", note: "GF[750-1144] KY[793-968], excluded: 1389/2000 (both GF)." },
  { origin: "New York City", costLow: "711.00", costHigh: "777.00", note: "GF[722-777] KY[700-776], excluded: 1026 (GF, isolated)." },
  { origin: "Paris", costLow: "127.00", costHigh: "236.00", note: "GF[127-240] KY[126-231], no exclusions." },
  { origin: "Philadelphia", costLow: "866.00", costHigh: "986.00", note: "GF[953-974] KY[779-997], excluded: 1166/3905 (both GF)." },
  { origin: "Rio de Janeiro", costLow: "1037.00", costHigh: "1349.00", note: "GF[1049-1518] KY[1025-1180], excluded: 1657/1715 (both GF)." },
  { origin: "Rome", costLow: "120.00", costHigh: "232.00", note: "GF[169-326] KY[70-138], excluded low: 39(KY)x2/46(GF); excluded high: 486/612 (both GF)." },
  { origin: "San Francisco", costLow: "765.00", costHigh: "970.00", note: "GF[770-969] KY[760-971], excluded: 1305 (GF, isolated)." },
  { origin: "Sao Paulo", costLow: "909.00", costHigh: "1255.00", note: "GF[962-1389] KY[856-1121], excluded: 1851 (GF, isolated)." },
  { origin: "Seoul", costLow: "830.00", costHigh: "1401.00", note: "GF[842-1408] KY[817-1394], excluded: 5260/5331 (both GF)." },
  { origin: "Shanghai", costLow: "835.00", costHigh: "1233.00", note: "GF[905-1276] KY[764-1189], excluded: 11009 (GF, isolated)." },
  { origin: "Singapore", costLow: "853.00", costHigh: "1161.00", note: "GF[867-1167] KY[839-1154], excluded: 1543 (GF, isolated). Origin missed in initial batches, fetched separately after a 49-row count check found only 47 present." },
  { origin: "Stockholm", costLow: "175.00", costHigh: "333.00", note: "GF[210-432] KY[139-233], no exclusions." },
  { origin: "Sydney", costLow: "1307.00", costHigh: "1955.00", note: "GF[1445-1893] KY[1169-2017], no exclusions." },
  { origin: "Tokyo", costLow: "1192.00", costHigh: "1703.00", note: "GF[1338-1856] KY[1045-1549], excluded: 1925/2289 (both GF)." },
  { origin: "Toronto", costLow: "599.00", costHigh: "827.00", note: "GF[597-916] KY[600-737], excluded: 1056 (GF, isolated)." },
  { origin: "Vancouver", costLow: "667.00", costHigh: "996.00", note: "GF[674-1001] KY[659-991], no exclusions." },
  { origin: "Washington D.C.", costLow: "706.00", costHigh: "918.00", note: "GF[759-1006] KY[652-829], excluded: 1302/1427/1427/1536 (all GF)." },
  { origin: "Zurich", costLow: "166.00", costHigh: "299.00", note: "GF[175-328] KY[156-269], no exclusions." },
];
// NOTE: Turin is NOT one of the 49 origin markets (planner_origin_markets),
// unlike New York/Milan/Johannesburg where the destination city IS also a
// selectable origin. A same-city $0/$0 "Turin -> Turin" row was mistakenly
// seeded here on 24 Jul 2026, then deleted the same day once caught -- it
// had no real lookup path since "Turin" is never a selectable origin
// market. Full 49 origins above is the correct, complete count.

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
  console.log(`✓ ${r.origin} -> Turin seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log(`\nAll Turin flight cost rows (${rows.length} total, should be 49):`);
console.table(rows);

await sql.end();
