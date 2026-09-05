import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Local Travel + Food daily USD cost data for Austin (United States Grand
// Prix 2026), researched 5 Sep 2026 per the planner-data-researcher
// skill's Local Travel & Food methodology.
//
// SOURCE: Budget Your Trip (budgetyourtrip.com/united-states-of-america/austin),
// "All travelers" blended figure -- $60/day food, $47/day local
// transportation. No data-quality concerns (not implausibly high vs.
// comparable US cities) -- used as-published, no nearestMajorCity
// substitute needed.
//
// localTravelNote: written from the pack's own published "Getting to
// COTA -- the Traffic Reality" experience (official race-weekend shuttle
// from Waterloo Park/Travis County Expo Center, McAngus lot rideshare,
// post-race surge pricing) -- CapMetro (Austin's real bus/MetroRail
// system) does not reach the circuit, so this is named honestly as a
// rideshare/shuttle/parking story, not a transit one.
//
// foodNote: Austin's food truck culture (South Congress, Rainey Street,
// the Domain) as the real, named budget-dining practice, distinct from
// the city's separately-covered Franklin Barbecue/BBQ pack experiences.

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin

const LOCAL_TRAVEL_NOTE = "This range covers everyday Austin transit plus reaching Circuit of the Americas on race weekend — CapMetro's bus and limited MetroRail network don't reach COTA directly, so the circuit itself is a rideshare, parking, or official-shuttle trip, not a transit one. Book the official race-weekend shuttle from Downtown's Waterloo Park or the Travis County Expo Center ahead of time — seats sell out before race day, and it beats the post-race rideshare surge that regularly pushes $150-300+ back into the city.";

const FOOD_NOTE = "This range covers casual Austin dining — tacos, food trucks, and barbecue plates — not the city's higher-end tasting-menu scene. Skip sit-down restaurants for one of Austin's food truck parks (South Congress, Rainey Street, the Domain), where a full meal typically runs $10-15 and it's genuinely how locals eat, not just a tourist workaround.";

const result = await sql`
  INSERT INTO planner_destination_bands (destination_id, local_travel_low, local_travel_high, food_per_day_low, food_per_day_high, currency, local_travel_note, food_note)
  VALUES (${DESTINATION_ID}, '47.00', '47.00', '60.00', '60.00', 'USD', ${LOCAL_TRAVEL_NOTE}, ${FOOD_NOTE})
  ON CONFLICT (destination_id) DO UPDATE SET
    local_travel_low = EXCLUDED.local_travel_low,
    local_travel_high = EXCLUDED.local_travel_high,
    food_per_day_low = EXCLUDED.food_per_day_low,
    food_per_day_high = EXCLUDED.food_per_day_high,
    currency = EXCLUDED.currency,
    local_travel_note = EXCLUDED.local_travel_note,
    food_note = EXCLUDED.food_note,
    last_updated = NOW()
  RETURNING id
`;
console.log(`✓ Austin destination bands seeded, row id ${result[0].id}`);

const rows = await sql`
  SELECT local_travel_low, local_travel_high, food_per_day_low, food_per_day_high, currency
  FROM planner_destination_bands WHERE destination_id = ${DESTINATION_ID}
`;
console.log(rows);
await sql.end();
