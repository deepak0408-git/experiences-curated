import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Melbourne (New Zealand tour of Australia
// 2026-27, "dec" seasonalBand) -- batch 1 of 49 origins (Amsterdam through
// Johannesburg alphabetically, 17 origins). Researched 24-25 Jul 2026 per
// the planner-data-researcher skill's Flights methodology (SKILL.md
// section 1, step 2b): merge BOTH sites' prices into ONE combined sorted
// list, run the density cutoff on that MERGED list, then split back out
// to report each site's own surviving low/high, then average.
//
// Event: New Zealand tour of Australia 2026-27, Dec 9 2026 - Jan 8 2027
// (31 days -- a genuine long multi-city tour, unlike the <16-day standard
// events used everywhere else). MULTI-CITY WINDOW EXCEPTION applied per
// explicit user decision 24 Jul 2026: rather than searching the full
// ~40-day span (which would pull in unrelated late-tour fares), the
// window is anchored to just the start of the tour -- Dec 4-16 2026 (+/-5
// days around Dec 9) -- since the "dec" seasonalBand represents fans
// attending the Melbourne-adjacent early leg, not the whole tour.
// seasonalBand="dec" matches this window's own month, NOT necessarily
// sportingEvents.startDate's month by the same rule used elsewhere --
// startDate IS Dec 9, so this also happens to match the standard rule.
//
// Melbourne's nearestAirportIata was NULL before this research -- set to
// MEL (24 Jul 2026, explicit user approval) since Melbourne is a genuine
// standalone destination with its own major international airport, same
// pattern as Las Vegas/Singapore/Abu Dhabi. Melbourne itself is one of the
// 49 origin markets (it appears as an origin in every OTHER destination's
// research) -- however, per the Turin/Las Vegas/Abu Dhabi correction, a
// same-city row is only seeded when it's the destination's OWN batch
// reaching its own city as an origin below (batch 2, alphabetically M).
//
// Amsterdam, Dubai, Johannesburg: Google Flights errored ("Oops" page) --
// Kayak-only fallback, same precedent as Doha/Casablanca/Mexico City.
//
// Chicago ($486), Dublin ($429): isolated GF stray low prices far below
// their own real clusters -- correctly excluded by the density filter's
// own >=40% jump rule, same known scraping-artifact pattern seen across
// every prior destination, just scaled up because Melbourne is a
// genuinely long-haul/expensive route from most origins.
//
// Buenos Aires's wide range ($2,551.50-$10,403.50) is genuine, not a
// filter miss -- verified against raw data: Kayak has a real dense,
// continuous spread from $1,893 up through $13,296 (many repeated real
// result-card values), and GF's own cluster ($3,210-$7,511) sits inside
// that same spread. A genuinely volatile long-haul route (likely
// multi-stop via US/Middle East hubs), correctly kept wide by the filter.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const SEASONAL_BAND = "dec";

const ROUTES = [
  { origin: "Amsterdam", costLow: "1689.00", costHigh: "2685.00", note: "KAYAK ONLY -- GF returned 'Oops' error page." },
  { origin: "Atlanta", costLow: "1404.50", costHigh: "2081.50", note: "GF[1312-1926] KY[1497-2237], no exclusions." },
  { origin: "Bangalore", costLow: "1104.00", costHigh: "1474.00", note: "GF[1125-1393] KY[1083-1555], excluded: 4108x2(GF)." },
  { origin: "Barcelona", costLow: "1327.50", costHigh: "2522.00", note: "GF[1348-2459] KY[1307-2585], no exclusions." },
  { origin: "Beijing", costLow: "1008.50", costHigh: "1692.00", note: "GF[1118-1487] KY[899-1897], excluded: 4633(GF, isolated)." },
  { origin: "Berlin", costLow: "1032.50", costHigh: "2121.50", note: "GF[899-2021] KY[1166-2222], excluded: 3213/3951(GF)." },
  { origin: "Boston", costLow: "1378.50", costHigh: "2249.00", note: "GF[1265-2274] KY[1492-2224], excluded: 2486/3468(GF)." },
  { origin: "Buenos Aires", costLow: "2551.50", costHigh: "10403.50", note: "GF[3210-7511] KY[1893-13296], no exclusions -- genuinely wide, verified real dense spread on Kayak, not a stray." },
  { origin: "Cairo", costLow: "1471.00", costHigh: "1931.50", note: "GF[1406-1455] KY[1536-2408], excluded: 2725x2/2854x2/7173x2/7230(KY), sparse high tail." },
  { origin: "Casablanca", costLow: "1756.00", costHigh: "3123.00", note: "GF[1736-3135] KY[1776-3111], excluded: 3347(KY)/3422x2(GF)/3519(KY)/4399/7213(GF)." },
  { origin: "Chicago", costLow: "1508.00", costHigh: "2176.50", note: "GF[1426-2218] KY[1590-2135], excluded low: 486(GF, isolated scraping artifact); excluded high: 2338(GF)." },
  { origin: "Dallas", costLow: "1636.50", costHigh: "2496.00", note: "GF[1580-2217] KY[1693-2775], no exclusions." },
  { origin: "Doha", costLow: "1584.00", costHigh: "2442.00", note: "GF[1594-2353] KY[1574-2531], excluded: 5730x2/8924(GF), sparse high tail." },
  { origin: "Dubai", costLow: "1432.00", costHigh: "2268.00", note: "KAYAK ONLY -- GF returned 'Oops' error page. Excluded high: 2870(KY, isolated)." },
  { origin: "Dublin", costLow: "1302.50", costHigh: "2374.00", note: "GF[1349-2292] KY[1256-2456], excluded low: 429(GF, isolated scraping artifact); excluded high: 2577(KY)." },
  { origin: "Hong Kong", costLow: "636.50", costHigh: "1355.00", note: "GF[644-1297] KY[629-1413], excluded: 1564/1816/1826/1861x2(KY)." },
  { origin: "Johannesburg", costLow: "1770.00", costHigh: "4570.00", note: "KAYAK ONLY -- GF returned 'Oops' error page. Excluded high: 4873/20815(KY)." },
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

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID} AND seasonal_band = ${SEASONAL_BAND}
  ORDER BY origin_market
`;
console.log(`\nAll Melbourne/dec flight cost rows (${rows.length} total so far, should be 17):`);
console.table(rows);

await sql.end();
