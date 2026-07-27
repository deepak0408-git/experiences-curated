import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Milan (Italian GP 2026) -- batch 2 of 49 origins
// (London through Philadelphia alphabetically, 17 origins). Researched
// 22 Jul 2026 per the planner-data-researcher skill's Flights methodology
// (2-site combined-dataset density-based outlier exclusion, THEN average
// of each site's own surviving low/high).
//
// Event: Italian Grand Prix 2026, Sep 4-6 2026. Window: Aug 30 - Sep 11 2026.
//
// Moscow: Kayak blocks the route ("Restricted destination -- government
// restrictions"), same sanctions pattern seen on NYC/Johannesburg. Google
// Flights only, single-site density filter applied.
//
// currency column: explicitly tagging currency: "USD" on every row.

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const SEASONAL_BAND = "sep";

const ROUTES = [
  { origin: "London", costLow: "72.00", costHigh: "478.00", note: "GF[57-411] KY[87-544], excluded high: $828 (isolated)." },
  { origin: "Los Angeles", costLow: "772.00", costHigh: "1172.00", note: "GF[766-1080] KY[777-1263], excluded high: $1,381/$1,386." },
  { origin: "Madrid", costLow: "113.00", costHigh: "542.00", note: "GF[110-480] KY[116-603], no exclusions." },
  { origin: "Manchester", costLow: "51.00", costHigh: "617.00", note: "GF[47-620] KY[55-613], excluded high: $1,141 (isolated)." },
  { origin: "Manila", costLow: "1009.00", costHigh: "1535.00", note: "GF[1036-1493] KY[982-1577], excluded high: $1,821/$1,953." },
  { origin: "Melbourne", costLow: "1515.00", costHigh: "2017.00", note: "GF[1467-1937] KY[1563-2096], excluded high: $2,125-$8,866x4 (10 values, huge sparse premium tail)." },
  { origin: "Mexico City", costLow: "1131.00", costHigh: "1673.00", note: "GF[1133-1681] KY[1129-1664], excluded high: $1,942/$2,917." },
  { origin: "Miami", costLow: "812.00", costHigh: "1236.00", note: "GF[812-1340] KY[812-1131], excluded low: $500x2 (scraping artifact); high: $2,364 (isolated)." },
  { origin: "Montreal", costLow: "747.00", costHigh: "1119.00", note: "GF[786-1160] KY[708-1077], excluded high: $1,354/$1,412/$1,660." },
  { origin: "Moscow", costLow: "1176.00", costHigh: "1653.00", note: "GOOGLE FLIGHTS ONLY -- Kayak blocked (government restrictions/sanctions). Single-site density filter, excluded low: $710x3/$756/$768 (isolated cluster below main body); high: $2,856 (isolated)." },
  { origin: "Mumbai", costLow: "778.00", costHigh: "1318.00", note: "GF[763-1287] KY[792-1349], excluded high: $1,422/$1,704/$2,207x3." },
  { origin: "Munich", costLow: "302.00", costHigh: "425.00", note: "GF[402-440] KY[202-409], excluded high: $763/$991/$1,149." },
  { origin: "Nairobi", costLow: "962.00", costHigh: "1541.00", note: "GF[1020-1654] KY[903-1427], excluded low: $63 (isolated); high: $1,726/$1,737." },
  { origin: "New Delhi", costLow: "742.00", costHigh: "1134.00", note: "GF[770-1163] KY[713-1104], excluded high: $1,618/$1,985/$2,196." },
  { origin: "New York City", costLow: "606.00", costHigh: "947.00", note: "GF[603-1024] KY[609-870], excluded high: $1,353/$2,744." },
  { origin: "Paris", costLow: "100.00", costHigh: "480.00", note: "GF[93-466] KY[106-494], excluded low: $47 (isolated); high: $1,121 (isolated)." },
  { origin: "Philadelphia", costLow: "824.00", costHigh: "1141.00", note: "GF[824-1144] KY[823-1137], excluded low: $500x2 (scraping artifact)." },
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
