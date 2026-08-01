import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Kuala Lumpur (Bahrain GP / Malaysia GP 2026) --
// batch 1 of 49 origins (Amsterdam through Miami alphabetically, 23 real
// routes + Buenos Aires with a user-specified override). Researched 29-31
// Jul 2026 per the planner-data-researcher skill's Flights methodology.
//
// costLow/costHigh = the pooled density-filtered range: every real fare
// from GF + Kayak merged into one sorted list, then outlier-trimmed (low
// cutoff on a >=40% jump near the bottom; high cutoff at the last price
// with >=4 other prices within $200 of it), taking the min/max of what
// survives. This is the exact range presented to and approved by the user
// 31 Jul 2026 -- NOT a per-site average.
//
// Event: Bahrain Grand Prix (Malaysia GP / Sepang), Sep 2026. Standard
// window (not multi-city exception): startDate-5 to endDate+5, searched as
// 2026-09-27 to 2026-10-09.
//
// Mexico City excluded from this batch -- Google Flights returned a
// genuine "No results returned" for this route/date window (confirmed via
// direct token inspection, not an extraction bug). Kayak also returned no
// usable fares. Will retry in the next batch.
//
// Buenos Aires: GF returned only 1 fare ($3,728) and Kayak returned only 2
// fares ($1,989 / $2,549) -- n=3 total, too thin for the density filter to
// run meaningfully (it degenerated to GF's single point). User explicitly
// directed the range to use Kayak's own $1,989-$2,549 pair directly, 31
// Jul 2026.
//
// currency column: planner_flight_cost has a NOT NULL currency column
// (default 'USD'). Explicitly tagging currency: "USD" on every row per the
// skill's pre-flight checklist.

const DESTINATION_ID = "09d5f140-02e3-4e6a-bdda-f8ef2142153a"; // Kuala Lumpur
const SEASONAL_BAND = "sep";

const ROUTES = [
  { origin: "Amsterdam", costLow: "619.00", costHigh: "973.00", note: "GF[656-973] KY[619-745], pooled n=14, excluded 0." },
  { origin: "Atlanta", costLow: "1123.00", costHigh: "2068.00", note: "GF[1138-2256] KY[1123-1961], pooled n=36, excluded 1 ($2,256 isolated)." },
  { origin: "Bangalore", costLow: "279.00", costHigh: "514.00", note: "GF[279-514] KY[324-365], pooled n=28, excluded 0." },
  { origin: "Barcelona", costLow: "658.00", costHigh: "885.00", note: "GF[692-1347] KY[658-698], pooled n=14, excluded 2 ($1,310/$1,347 sparse tail)." },
  { origin: "Beijing", costLow: "483.00", costHigh: "842.00", note: "GF[496-842] KY[483-831], pooled n=29, excluded 0." },
  { origin: "Berlin", costLow: "705.00", costHigh: "1219.00", note: "GF[916-2635] KY[705-987], pooled n=30, excluded 2 ($2,635 sparse tail)." },
  { origin: "Boston", costLow: "924.00", costHigh: "1288.00", note: "GF[961-2092] KY[924-1288], pooled n=26, excluded 2 ($1,481/$2,092 sparse tail)." },
  { origin: "Buenos Aires", costLow: "1989.00", costHigh: "2549.00", note: "GF[3728] KY[1989-2549], n=3 too thin for density test -- user directed to use Kayak's own range directly, 31 Jul 2026." },
  { origin: "Cairo", costLow: "601.00", costHigh: "796.00", note: "GF[626-948] KY[601-687], pooled n=28, excluded 1 ($948 isolated)." },
  { origin: "Casablanca", costLow: "766.00", costHigh: "942.00", note: "GF[766-1635] KY[793-833], pooled n=16, excluded 3 ($1,248/$1,327/$1,635 sparse tail)." },
  { origin: "Chicago", costLow: "932.00", costHigh: "1484.00", note: "GF[1124-11404] KY[932-1307], pooled n=38, excluded 2 ($2,124/$11,404 sparse tail)." },
  { origin: "Dallas", costLow: "1074.00", costHigh: "1232.00", note: "GF[1074-1232] KY[1074-1146], pooled n=15, excluded 0." },
  { origin: "Doha", costLow: "567.00", costHigh: "851.00", note: "GF[567-969] KY[616-696], pooled n=12, excluded 1 ($969 isolated)." },
  { origin: "Dubai", costLow: "478.00", costHigh: "877.00", note: "GF[578-1109] KY[478-810], pooled n=37, excluded 1 ($1,109 isolated)." },
  { origin: "Dublin", costLow: "741.00", costHigh: "980.00", note: "GF[786-1525] KY[741-786], pooled n=16, excluded 1 ($1,525 isolated)." },
  { origin: "Hong Kong", costLow: "249.00", costHigh: "415.00", note: "GF[249-583] KY[274-301], pooled n=31, excluded 2 ($533/$583 sparse tail)." },
  { origin: "Johannesburg", costLow: "777.00", costHigh: "1072.00", note: "GF[987-1242] KY[777-912], pooled n=15, excluded 1 ($1,242 isolated)." },
  { origin: "London", costLow: "639.00", costHigh: "957.00", note: "GF[639-1576] KY[826-868], pooled n=21, excluded 4 ($1,172/$1,199/$1,429/$1,576 sparse tail)." },
  { origin: "Los Angeles", costLow: "714.00", costHigh: "1040.00", note: "GF[820-1316] KY[714-819], pooled n=9, excluded 1 ($1,316 isolated)." },
  { origin: "Madrid", costLow: "634.00", costHigh: "870.00", note: "GF[656-1802] KY[634-672], pooled n=11, excluded 1 ($1,802 isolated)." },
  { origin: "Manchester", costLow: "838.00", costHigh: "1058.00", note: "GF[901-1058] KY[838-942], pooled n=12, excluded 0." },
  { origin: "Manila", costLow: "156.00", costHigh: "342.00", note: "GF[163-433] KY[156-231], pooled n=29, excluded 1 ($433 isolated)." },
  { origin: "Melbourne", costLow: "565.00", costHigh: "977.00", note: "GF[620-4903] KY[565-772], pooled n=53, excluded 4 ($1,060/$1,206/$1,279/$4,903 sparse tail)." },
  { origin: "Miami", costLow: "1406.00", costHigh: "2120.00", note: "GF[1524-2435] KY[1406-2120], pooled n=37, excluded 1 ($2,435 isolated)." },
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
  console.log(`✓ ${r.origin} -> Kuala Lumpur seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log(`\nAll Kuala Lumpur flight cost rows (${rows.length} total):`);
console.table(rows);

await sql.end();
