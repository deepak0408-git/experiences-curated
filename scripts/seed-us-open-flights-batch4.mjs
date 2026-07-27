import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real flight cost data for US Open 2026 -- batch 4 of remaining origins
// (Milan through Shanghai alphabetically, 14 real routes + New York City's
// same-city $0 row). Researched 22 Jul 2026 per the planner-data-researcher
// skill's Flights methodology (2-site average + combined-dataset,
// density-based outlier exclusion).
//
// Search window: Aug 25 - Sep 18 2026 (standard startDate-5/endDate+5).
// Destination: New York. Sites: Google Flights + Kayak, round-trip,
// economy, <=1 stop, USD.
//
// METHODOLOGY FIX 22 Jul 2026: earlier attempts in this batch used Google
// Flights' free-text query with NO explicit dates, which silently defaulted
// to whatever date-pair Google guessed (not our real Aug 25-Sep 18 window).
// Fixed by adding explicit dates to the query string
// ("...on 2026-08-25 through 2026-09-18...") -- confirmed correct via the
// page's own "Track prices departing 2026-08-25 and returning 2026-09-18"
// readout before any origin in this batch was researched.
//
// NEW RULE ADDED THIS BATCH (see skill's pre-flight checklist): if an origin
// market IS the event's own destination city (New York City / JFK, for this
// NYC-hosted event), seed costLow = costHigh = 0.00 directly -- "no flight
// needed" as a real, present row, not a silent gap.
//
// MOSCOW EDGE CASE: Kayak returned "Restricted destination -- Due to
// government restrictions, we are unable to show results for this search"
// for Moscow-NYC (consistent with real Russia-related aviation
// restrictions/sanctions) -- Google Flights alone was used for this one
// route, an honest single-source limitation, same class as NYC hotels'
// single-source gap.
//
// OUTLIER PATTERN FLAGGED: a recurring stray ultra-low price ($42, $75,
// $100, $199, $315) appeared in 6 of 14 origins' raw Kayak/GF price lists,
// always far below the rest of that origin's real cluster -- treated as a
// scraping artifact per-origin (isolated-value exclusion), not a real fare,
// consistent with the existing density-based exclusion rule.

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const SEASONAL_BAND = "sep";

const ROUTES = [
  {
    origin: "Milan",
    costLow: "461.00",
    costHigh: "877.00",
    note: "GF+KY combined, excluded $1,273/$1,788 (sparse premium-cabin tail).",
  },
  {
    origin: "Montreal",
    costLow: "250.00",
    costHigh: "412.00",
    note: "GF+KY combined, excluded $525 (isolated).",
  },
  {
    origin: "Moscow",
    costLow: "1669.00",
    costHigh: "2844.00",
    note: "GOOGLE FLIGHTS ONLY -- Kayak blocked this route ('Restricted destination -- Due to government restrictions, we are unable to show results for this search'), consistent with real Russia-related aviation sanctions. Excluded $7,572/$7,738 (business/first-class sparse tail).",
  },
  {
    origin: "Munich",
    costLow: "610.00",
    costHigh: "951.00",
    note: "GF+KY combined, excluded $1,188x2/$4,063 (sparse premium tail).",
  },
  {
    origin: "Nairobi",
    costLow: "1083.00",
    costHigh: "2047.00",
    note: "GF+KY combined, excluded $435x2 (isolated low, likely stray-fare artifact).",
  },
  {
    origin: "New Delhi",
    costLow: "1083.00",
    costHigh: "1407.00",
    note: "GF+KY combined, excluded $799 (isolated low), $1,535/$1,808 (sparse tail).",
  },
  {
    origin: "New York City",
    costLow: "0.00",
    costHigh: "0.00",
    note: "Same-city origin/destination -- New York City is both this event's destination and one of the 49 origin markets. Seeded as a real $0 'no flight needed' row per the new same-city rule (see skill pre-flight checklist), not left as a silent gap.",
  },
  {
    origin: "Paris",
    costLow: "580.00",
    costHigh: "634.00",
    note: "GF+KY combined, excluded $679/$694/$714 (sparse tail).",
  },
  {
    origin: "Philadelphia",
    costLow: "229.00",
    costHigh: "461.00",
    note: "GF+KY combined, excluded $42 (scraping artifact), $771x3 (sparse tail).",
  },
  {
    origin: "Rio de Janeiro",
    costLow: "651.00",
    costHigh: "933.00",
    note: "GF+KY combined, excluded $75 (scraping artifact), $1,061/$1,102/$1,300 (sparse tail).",
  },
  {
    origin: "Rome",
    costLow: "664.00",
    costHigh: "924.00",
    note: "GF+KY combined, excluded $199 (scraping artifact), $1,285 (isolated).",
  },
  {
    origin: "San Francisco",
    costLow: "290.00",
    costHigh: "498.00",
    note: "GF+KY combined, excluded $949x2 (isolated).",
  },
  {
    origin: "Sao Paulo",
    costLow: "768.00",
    costHigh: "964.00",
    note: "GF+KY combined, excluded $75x2 (scraping artifact). Real cluster fairly continuous, no other exclusions.",
  },
  {
    origin: "Seoul",
    costLow: "795.00",
    costHigh: "1940.00",
    note: "GF+KY combined, excluded $315x2 (scraping artifact). Real cluster fairly continuous, no other exclusions.",
  },
  {
    origin: "Shanghai",
    costLow: "1189.00",
    costHigh: "1923.00",
    note: "GF+KY combined, excluded $100/$315x2 (scraping artifacts). Real cluster fairly continuous, no other exclusions.",
  },
];

for (const r of ROUTES) {
  const result = await sql`
    INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high, refresh_pass)
    VALUES (${DESTINATION_ID}, ${r.origin}, ${SEASONAL_BAND}, ${r.costLow}, ${r.costHigh}, 'initial')
    ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      refresh_pass = EXCLUDED.refresh_pass,
      last_updated = NOW()
    RETURNING id
  `;
  console.log(`✓ ${r.origin} -> New York (Sep) seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, refresh_pass
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY origin_market
`;
console.log("\nAll New York flight cost rows so far:");
console.table(rows);

await sql.end();
