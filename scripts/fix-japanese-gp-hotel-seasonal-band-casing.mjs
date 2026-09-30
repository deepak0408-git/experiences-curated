import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Fix: planner_hotel_tier_cost rows for Suzuka were seeded with
// seasonal_band "Apr" (capitalized) instead of the lowercase "apr" every
// other table/getSpokeData.ts's SEASONAL_BAND_BY_MONTH expects. This silently
// zeroed out the hotels query in getSpokeData.ts (case-sensitive eq() match),
// which made moderateTotal null and forced CostSpoke.tsx to render its
// "Real pricing not live yet" fallback despite real, fully-seeded ticket/
// hotel/flight/destinationBand data existing. Found 29 Sep 2026 (founder
// screenshot showed the spoke still on the placeholder).
const sql = postgres(process.env.DIRECT_URL);

const before = await sql`SELECT id, tier, seasonal_band FROM planner_hotel_tier_cost WHERE destination_id = '9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9'`;
console.log("Before:", JSON.stringify(before, null, 2));

const result = await sql`
  UPDATE planner_hotel_tier_cost
  SET seasonal_band = 'apr'
  WHERE destination_id = '9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9' AND seasonal_band = 'Apr'
  RETURNING id, tier, seasonal_band
`;
console.log("Updated:", JSON.stringify(result, null, 2));

await sql.end();
