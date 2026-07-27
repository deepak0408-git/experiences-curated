import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Melbourne (New Zealand tour of Australia
// 2026-27, "dec" seasonalBand) -- batch 3 (FINAL BATCH) of 49 origins
// (Philadelphia through Zurich alphabetically, 15 origins). Completes
// Melbourne/dec at 48 of 49 -- Moscow remains a genuine, flagged gap (see
// batch 2). Researched 25 Jul 2026 per the planner-data-researcher
// skill's Flights methodology (SKILL.md section 1, step 2b): merge BOTH
// sites' prices into ONE combined sorted list, run the density cutoff on
// that MERGED list, then split back out to report each site's own
// surviving low/high, then average.
//
// Window: Dec 4-16 2026 (multi-city window exception, see batch 1).
//
// Rio de Janeiro, Rome, Shanghai: Google Flights errored "Oops" on first
// attempt, recovered cleanly on retry -- transient, same pattern seen
// throughout this project.
//
// Sao Paulo: Kayak-only -- GF errored "Oops" twice (retried once, still
// failed).
//
// Philadelphia ($546), Rio de Janeiro ($260), Toronto ($1,414), Zurich
// ($624): each an isolated GF stray low price far below its own real
// cluster -- correctly excluded by the density filter's own >=40% jump
// rule, same known scraping-artifact pattern.
//
// Sydney: Kayak's data is genuinely dense and cheap ($105-$129) -- a real,
// high-frequency domestic route, not noise. Confirmed via raw data
// inspection before accepting.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const SEASONAL_BAND = "dec";

const ROUTES = [
  { origin: "Philadelphia", costLow: "1336.00", costHigh: "2541.50", note: "GF[1389-2415] KY[1283-2668], excluded low: 546(GF, isolated scraping artifact); excluded high: 2836(KY)/2889/5194(GF)." },
  { origin: "Rio de Janeiro", costLow: "2006.00", costHigh: "2867.50", note: "GF[2002-2939] KY[2010-2796], excluded low: 260(GF, isolated scraping artifact); excluded high: 3455x2/3892/3981/4042(KY)." },
  { origin: "Rome", costLow: "1395.00", costHigh: "2709.50", note: "GF[1577-2556] KY[1213-2863], no exclusions." },
  { origin: "San Francisco", costLow: "1345.00", costHigh: "1804.00", note: "GF[1350-1697] KY[1340-1911], excluded: 2089x2(KY)." },
  { origin: "Sao Paulo", costLow: "1939.00", costHigh: "3564.00", note: "KAYAK ONLY -- GF returned 'Oops' error page (retried once, still failed). Excluded high: 3675/3971/4087(KY)." },
  { origin: "Seoul", costLow: "948.00", costHigh: "1382.50", note: "GF[963-1415] KY[933-1350], excluded: 5197(GF, isolated)." },
  { origin: "Shanghai", costLow: "841.00", costHigh: "1381.50", note: "GF[932-1258] KY[750-1505], excluded: 3282(GF, isolated)." },
  { origin: "Singapore", costLow: "590.50", costHigh: "1285.50", note: "GF[582-1179] KY[599-1392], excluded: 1865(GF, isolated)." },
  { origin: "Stockholm", costLow: "1148.50", costHigh: "2335.00", note: "GF[837-2210] KY[1460-2460], no exclusions." },
  { origin: "Sydney", costLow: "106.00", costHigh: "196.50", note: "GF[107-264] KY[105-129], excluded low: 39(GF, isolated). Genuine dense/cheap domestic route, confirmed via raw data." },
  { origin: "Tokyo", costLow: "916.00", costHigh: "1813.00", note: "GF[1021-1848] KY[811-1778], excluded: 2033(KY, isolated)." },
  { origin: "Toronto", costLow: "2079.50", costHigh: "2619.50", note: "GF[2155-2614] KY[2004-2625], excluded low: 1414(GF, isolated scraping artifact); excluded high: 2829/3015/3021(KY)." },
  { origin: "Vancouver", costLow: "1679.50", costHigh: "2329.50", note: "GF[1594-2237] KY[1765-2422], excluded: 2487/2728(KY)." },
  { origin: "Washington D.C.", costLow: "1477.50", costHigh: "1913.50", note: "GF[1259-1792] KY[1696-2035], excluded: 2147x2(KY)." },
  { origin: "Zurich", costLow: "1489.50", costHigh: "2460.50", note: "GF[1512-2504] KY[1467-2417], excluded low: 624(GF, isolated scraping artifact); excluded high: 2841(GF)/3088(KY)." },
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

console.log("\n⚠ Moscow -> Melbourne (dec) remains intentionally unseeded -- genuine gap, see batch 2 notes.");

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID} AND seasonal_band = ${SEASONAL_BAND}
  ORDER BY origin_market
`;
console.log(`\nAll Melbourne/dec flight cost rows (${rows.length} total, should be 48 -- 49 origins minus Moscow gap):`);
console.table(rows);

await sql.end();
