import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Test data only — placeholder USD ranges, not real pricing. Purpose: let
// the user test multi-sport selection on Screen 1 (US Open = tennis, joins
// Belgian/Italian/Abu Dhabi GP = formula_one already seeded). Kept low
// enough that the total midpoint clears well under $1,000.
const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";
const NEW_YORK_DEST_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10";

await sql`
  INSERT INTO planner_hotel_tier_cost (destination_id, tier, cost_low, cost_high)
  VALUES (${NEW_YORK_DEST_ID}, 'general', 150, 250)
  ON CONFLICT (destination_id, tier) DO UPDATE SET cost_low = 150, cost_high = 250, last_updated = now()
`;
console.log("✓ Seeded planner_hotel_tier_cost (New York, general)");

await sql`
  INSERT INTO planner_ticket_tier_cost (sporting_event_id, tier, cost_low, cost_high)
  VALUES (${US_OPEN_EVENT_ID}, 'general', 120, 220)
  ON CONFLICT (sporting_event_id, tier) DO UPDATE SET cost_low = 120, cost_high = 220, last_updated = now()
`;
console.log("✓ Seeded planner_ticket_tier_cost (US Open, general)");

await sql`
  INSERT INTO planner_destination_bands (destination_id, local_travel_low, local_travel_high, food_per_day_low, food_per_day_high)
  VALUES (${NEW_YORK_DEST_ID}, 40, 60, 30, 45)
  ON CONFLICT (destination_id) DO UPDATE SET
    local_travel_low = 40, local_travel_high = 60,
    food_per_day_low = 30, food_per_day_high = 45, last_updated = now()
`;
console.log("✓ Seeded planner_destination_bands (New York)");

await sql`
  INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high)
  VALUES (${NEW_YORK_DEST_ID}, 'unspecified', 'sep', 120, 220)
  ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
    cost_low = 120, cost_high = 220, last_updated = now()
`;
console.log("✓ Seeded planner_flight_cost (New York, unspecified, sep)");

console.log("\nDone. Test-only planner cost data now backs US Open 2026.");
console.log("Total range: $430–$795 (midpoint ~$612) — well under $1,000 threshold requested.");

await sql.end();
