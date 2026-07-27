import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for Johannesburg -- batch 3 (FINAL BATCH), remaining
// 14 origins x 2 seasons = 28 rows. Completes all 49 origin markets for
// Johannesburg (Australia tour of South Africa 2026 + England tour of South
// Africa 2026-27). Researched 22 Jul 2026 per the planner-data-researcher
// skill's Flights methodology (2-site combined-dataset density-based
// outlier exclusion, THEN average of each site's own surviving low/high).
//
// Same 2 seasons as batches 1 and 2:
// - "sep" = Australia tour of South Africa 2026 window, Sep 19-Oct 4 2026.
// - "dec" = England tour of South Africa 2026-27 window, Dec 12 2026-Jan 1 2027.
//
// CURRENCY COLUMN: planner_flight_cost now has a NOT NULL currency column
// (default 'USD', added 22 Jul 2026 as schema-level enforcement of the
// USD-only standing rule). Explicitly passing currency: "USD" on every row
// per the updated skill pre-flight checklist, not relying on the default
// alone.

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40"; // Johannesburg

const ROUTES = [
  { origin: "Philadelphia", band: "sep", costLow: "1388.00", costHigh: "2007.00", note: "GF[1402-2106] KY[1373-1908], excluded low: $435x2; high: $2,317." },
  { origin: "Philadelphia", band: "dec", costLow: "2239.00", costHigh: "2751.00", note: "GF[2351-2756] KY[2127-2746], excluded low: $435x2; high: $2,949-$4,439 (5 values, sparse tail)." },
  { origin: "Rio de Janeiro", band: "sep", costLow: "1472.00", costHigh: "1624.00", note: "GF[1508-1588] KY[1435-1659], excluded low: $801; high: $1,877-$2,628 (6 values, sparse tail)." },
  { origin: "Rio de Janeiro", band: "dec", costLow: "912.00", costHigh: "1833.00", note: "GF[871-1882] KY[952-1784], excluded low: $569; high: $3,210/$3,294x2." },
  { origin: "Rome", band: "sep", costLow: "719.00", costHigh: "923.00", note: "GF[668-811] KY[770-1034], excluded high: $1,152/$1,233." },
  { origin: "Rome", band: "dec", costLow: "851.00", costHigh: "1611.00", note: "GF[730-1606] KY[972-1616], excluded high: $1,733/$1,785/$2,003." },
  { origin: "San Francisco", band: "sep", costLow: "1483.00", costHigh: "1793.00", note: "GF[1425-1827] KY[1540-1758], excluded high: $2,227/$3,781." },
  { origin: "San Francisco", band: "dec", costLow: "2103.00", costHigh: "3308.00", note: "GF[1409-3228] KY[2797-3387], excluded low: $435x2; high: $3,807-$4,818 (10 values, sparse premium tail)." },
  { origin: "Sao Paulo", band: "sep", costLow: "1299.00", costHigh: "1924.00", note: "GF[1299-1985] KY[1299-1862], excluded low: $711; high: $2,093/$2,874/$9,362x3." },
  { origin: "Sao Paulo", band: "dec", costLow: "877.00", costHigh: "1495.00", note: "GF[828-1587] KY[926-1403], excluded low: $550; high: $1,645x2-$3,184 (9 values, sparse tail)." },
  { origin: "Seoul", band: "sep", costLow: "1097.00", costHigh: "2117.00", note: "GF[1097-2152] KY[1097-2081], excluded high: $2,747/$8,087." },
  { origin: "Seoul", band: "dec", costLow: "1165.00", costHigh: "1428.00", note: "GF[1071-1488] KY[1259-1368], excluded high: $2,099x2-$5,991 (9 values, sparse tail)." },
  { origin: "Shanghai", band: "sep", costLow: "1512.00", costHigh: "2333.00", note: "GF[1123-2271] KY[1900-2395], excluded low: $716; high: $2,674-$7,398 (5 values, sparse tail)." },
  { origin: "Shanghai", band: "dec", costLow: "912.00", costHigh: "1213.00", note: "GF[785-1305] KY[1039-1121], excluded high: $1,418-$4,397 (8 values, sparse tail)." },
  { origin: "Singapore", band: "sep", costLow: "862.00", costHigh: "1160.00", note: "GF[868-1173] KY[856-1147], excluded high: $1,359x2/$2,340/$2,680/$9,742." },
  { origin: "Singapore", band: "dec", costLow: "1015.00", costHigh: "1187.00", note: "GF[1042-1130] KY[988-1244], excluded high: $1,414-$2,801x2 (8 values, sparse tail)." },
  { origin: "Stockholm", band: "sep", costLow: "731.00", costHigh: "892.00", note: "GF[748-886] KY[714-897], excluded high: $1,407/$1,481/$1,638/$1,643." },
  { origin: "Stockholm", band: "dec", costLow: "1449.00", costHigh: "2084.00", note: "GF[1255-2007] KY[1642-2161], excluded low: $770; high: $2,299/$3,138." },
  { origin: "Sydney", band: "sep", costLow: "1745.00", costHigh: "2595.00", note: "GF[1409-2587] KY[2081-2603], excluded high: $2,812x2/$2,980x2/$3,739." },
  { origin: "Sydney", band: "dec", costLow: "2098.00", costHigh: "3049.00", note: "GF[1895-2781] KY[2300-3317], excluded low: $1,266; high: $3,495x2-$4,443 (6 values, sparse tail)." },
  { origin: "Toronto", band: "sep", costLow: "1241.00", costHigh: "1612.00", note: "GF[1158-1585] KY[1323-1638], excluded high: $2,173x3." },
  { origin: "Toronto", band: "dec", costLow: "2310.00", costHigh: "4521.00", note: "GF[1892-3373] KY[2728-5669], excluded high: $6,316 (isolated). Wide range is real -- both sites' own highs survive the density filter (Kayak's $5,669 forms a genuine dense cluster of 4 values within $200 of each other)." },
  { origin: "Vancouver", band: "sep", costLow: "1571.00", costHigh: "2043.00", note: "GF[1562-2097] KY[1580-1989], excluded high: $2,251." },
  { origin: "Vancouver", band: "dec", costLow: "2509.00", costHigh: "3244.00", note: "GF[2177-2892] KY[2840-3595], excluded high: $3,820/$3,973/$4,508." },
  { origin: "Washington D.C.", band: "sep", costLow: "1175.00", costHigh: "1791.00", note: "GF[1241-1871] KY[1109-1711], excluded low: $435x2; high: $2,075x2/$2,144." },
  { origin: "Washington D.C.", band: "dec", costLow: "1579.00", costHigh: "2860.00", note: "GF[1229-2814] KY[1928-2906], excluded low: $435x2; high: $3,180/$3,906/$4,686." },
  { origin: "Zurich", band: "sep", costLow: "624.00", costHigh: "1265.00", note: "GF[628-1288] KY[620-1241], excluded low: $78 (scraping artifact); high: $1,407." },
  { origin: "Zurich", band: "dec", costLow: "1213.00", costHigh: "2019.00", note: "GF[1170-1977] KY[1256-2061], excluded low: $814; high: $2,261." },
];

for (const r of ROUTES) {
  const result = await sql`
    INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass)
    VALUES (${DESTINATION_ID}, ${r.origin}, ${r.band}, ${r.costLow}, ${r.costHigh}, 'USD', 'initial')
    ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      currency = EXCLUDED.currency,
      refresh_pass = EXCLUDED.refresh_pass,
      last_updated = NOW()
    RETURNING id
  `;
  console.log(`✓ ${r.origin} (${r.band}) -> Johannesburg seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market, seasonal_band
`;
console.log(`\nAll Johannesburg flight cost rows (${rows.length} total, should be 97 = 49 origins x 2 seasons - 1 Tokyo-only):`);
console.table(rows);

await sql.end();
