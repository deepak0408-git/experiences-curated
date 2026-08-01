import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Closes the last remaining gap in the entire Flights dataset:
// Moscow -> Melbourne, "dec" seasonalBand (New Zealand tour of Australia).
//
// Google Flights failed with "Oops" on 3 separate attempts across 2
// sessions (24 Jul batch 2 initial + 1 retry, 25 Jul 1 more retry) and
// Kayak returned 0 results each time (sanctions-block, same pattern as
// every destination). Given the persistent, repeated failure (not a
// one-off transient issue), explicit user decision 25 Jul 2026: copy the
// "jan" seasonalBand's Moscow value ($1,472.00-$1,622.00, itself a real
// GF-only result -- Kayak sanctions-blocked, GF recovered cleanly on that
// band's retry) into the "dec" band as a practical fallback, rather than
// leaving this one route permanently gapped.
//
// This value is NOT independently researched for December -- it is a
// deliberate reuse of the January figure. Flag this explicitly if this
// row is ever reviewed or refreshed; a genuine December-specific GF fetch
// should still be attempted on a future refresh pass if Google Flights
// recovers for this route.

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const SEASONAL_BAND = "dec";

const result = await sql`
  INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high, currency, refresh_pass)
  VALUES (${DESTINATION_ID}, 'Moscow', ${SEASONAL_BAND}, '1472.00', '1622.00', 'USD', 'initial')
  ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
    cost_low = EXCLUDED.cost_low,
    cost_high = EXCLUDED.cost_high,
    currency = EXCLUDED.currency,
    refresh_pass = EXCLUDED.refresh_pass,
    last_updated = NOW()
  RETURNING id
`;
console.log("✓ Moscow -> Melbourne (dec) seeded (value copied from 'jan' band), row id", result[0].id);

const count = await sql`SELECT COUNT(*) FROM planner_flight_cost WHERE destination_id = ${DESTINATION_ID} AND seasonal_band = ${SEASONAL_BAND}`;
console.log("Melbourne/dec row count now:", count[0].count, "(should be 49 -- gap closed)");

await sql.end();
