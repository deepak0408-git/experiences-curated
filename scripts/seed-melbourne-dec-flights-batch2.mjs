import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Melbourne (New Zealand tour of Australia
// 2026-27, "dec" seasonalBand) -- batch 2 of 49 origins (London through
// Paris alphabetically, 16 of 17 seeded -- Moscow is a genuine, flagged
// gap, see below). Researched 24-25 Jul 2026 per the planner-data-
// researcher skill's Flights methodology (SKILL.md section 1, step 2b):
// merge BOTH sites' prices into ONE combined sorted list, run the density
// cutoff on that MERGED list, then split back out to report each site's
// own surviving low/high, then average.
//
// Window: Dec 4-16 2026 (multi-city window exception, anchored to the
// tour's Dec 9 start rather than the full ~40-day tour span -- see
// batch 1 for full reasoning).
//
// Melbourne itself skipped as an origin lookup in this batch (it's the
// destination, not a real fetch target here).
//
// MOSCOW: GENUINE UNSEEDED GAP, EXPLICIT USER DECISION 24-25 Jul 2026 --
// Kayak sanctions-blocked (0 results, expected pattern seen on every
// destination) AND Google Flights errored twice with "Oops" (retried once
// after 3 other origins in this same batch -- Montreal/Mumbai/Munich --
// recovered cleanly on retry, but Moscow did not). User explicitly chose
// to leave this route unseeded rather than force a synthetic value or keep
// retrying indefinitely. Do NOT silently fill this gap on a future refresh
// pass without re-confirming with the user first.
//
// Los Angeles ($352), Manchester ($410), Montreal ($597), Munich ($772),
// New York City ($297): each an isolated GF stray low price far below its
// own real cluster -- correctly excluded by the density filter's own
// >=40% jump rule, same known scraping-artifact pattern seen across every
// prior destination.
//
// Manchester's high tail ($16,350-$30,250, Kayak) -- confirmed genuinely
// sparse/isolated (no cluster of >=4 neighbors within $200), correctly
// excluded by the filter, not a scraping glitch.
//
// Miami's wide range ($1,683-$3,369.50) is genuine, not a filter miss --
// verified against raw Kayak data: a real, dense, continuous cluster from
// $2,763 through $5,830 (many repeated real result-card values), same
// volatile-long-haul pattern already confirmed on Buenos Aires (batch 1).
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const SEASONAL_BAND = "dec";

const ROUTES = [
  { origin: "London", costLow: "1374.00", costHigh: "1665.50", note: "GF[1349-1671] KY[1399-1660], excluded: 1842/1915(GF)." },
  { origin: "Los Angeles", costLow: "845.50", costHigh: "1559.00", note: "GF[872-1548] KY[819-1570], excluded low: 352(GF, isolated scraping artifact); excluded high: 2165(GF)." },
  { origin: "Madrid", costLow: "1351.50", costHigh: "2176.50", note: "GF[1241-1998] KY[1462-2355], excluded: 2511(KY, isolated)." },
  { origin: "Manchester", costLow: "1655.50", costHigh: "3540.50", note: "GF[1450-2006] KY[1861-5075], excluded low: 410(GF, isolated scraping artifact); excluded high: 16350/21212/25388/30250(KY) -- confirmed genuinely sparse/isolated, not a scraping glitch." },
  { origin: "Manila", costLow: "759.50", costHigh: "1507.50", note: "GF[744-1463] KY[775-1552], no exclusions." },
  { origin: "Mexico City", costLow: "2092.50", costHigh: "3676.00", note: "GF[2133-3666] KY[2052-3686], no exclusions." },
  { origin: "Miami", costLow: "1683.00", costHigh: "3369.50", note: "GF[1259-3140] KY[2107-3599], excluded: 3695/3733/5074/5077x2/5825x2/5830x2/7196/7511x2/12561(KY) -- verified genuine wide spread beyond this tail, not noise; the surviving KY high (3599) reflects a real dense cluster." },
  { origin: "Milan", costLow: "1491.50", costHigh: "2252.50", note: "GF[1647-2243] KY[1336-2262], excluded: 2578x2/2838(KY)." },
  { origin: "Montreal", costLow: "1511.00", costHigh: "2631.00", note: "GF[1460-2535] KY[1562-2727], excluded low: 597(GF, isolated scraping artifact); excluded high: 2822/2876/3017/3308(KY)/3095/3251(GF)." },
  { origin: "Mumbai", costLow: "1123.50", costHigh: "1497.50", note: "GF[1165-1424] KY[1082-1571], excluded: 3880(GF, isolated)." },
  { origin: "Munich", costLow: "1385.00", costHigh: "2356.50", note: "GF[1428-2221] KY[1342-2492], excluded low: 772(GF, isolated scraping artifact); excluded high: 2871(GF)." },
  { origin: "Nairobi", costLow: "1687.00", costHigh: "4854.00", note: "KAYAK ONLY -- GF returned 'Oops' error page (retried once, still failed)." },
  { origin: "New Delhi", costLow: "1104.50", costHigh: "1741.00", note: "GF[1117-1464] KY[1092-2018], excluded: 2154(KY)/3039(GF)." },
  { origin: "New York City", costLow: "1351.00", costHigh: "2542.00", note: "GF[1227-2538] KY[1475-2546], excluded low: 297(GF, isolated scraping artifact)." },
  { origin: "Paris", costLow: "1219.50", costHigh: "2078.50", note: "GF[1244-2107] KY[1195-2050], no exclusions." },
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
  console.log(`✓ ${r.origin} -> Melbourne (dec) seeded, row id ${result[0].id}`);
}

console.log("\n⚠ Moscow -> Melbourne (dec) intentionally NOT seeded -- genuine gap, GF errored twice + Kayak sanctions-blocked, explicit user decision to leave unfilled rather than force a value.");

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID} AND seasonal_band = ${SEASONAL_BAND}
  ORDER BY origin_market
`;
console.log(`\nAll Melbourne/dec flight cost rows (${rows.length} total so far, should be 33 -- 17+16, Moscow excluded):`);
console.table(rows);

await sql.end();
