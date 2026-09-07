import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Local Travel + Food daily USD cost data for Mexico City (Mexico City
// Grand Prix 2026), researched 6 Sep 2026 per the planner-data-researcher
// skill's Local Travel & Food methodology.
//
// SOURCE: Budget Your Trip (budgetyourtrip.com/mexico/mexico-city),
// "All travelers" blended figure -- $47/day food, $13/day local
// transportation. No data-quality concerns (comparable to other
// moderately-priced destinations already seeded) -- used as-published,
// no nearestMajorCity substitute needed (Mexico City is itself a
// genuine, well-covered major city).
//
// localTravelNote: named transit system (Metro Line 9 direct to the
// circuit) plus the real MI Card / flat 5-peso fare, confirmed no
// F1-ticket-holder transit perk exists for this event (checked, unlike
// Melbourne/AO's free tram).
//
// foodNote: comida corrida (fixed-price fonda lunch) as the real, named
// budget-dining practice, confirmed via Culinary Backstreets.

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c"; // Mexico City

const LOCAL_TRAVEL_NOTE = "This range covers Mexico City's Metro and Metrobús network — no car needed, and Metro Line 9 (brown) runs directly to the circuit, with Velódromo, Ciudad Deportiva, and Puebla stations all near different gates. Load a rechargeable Tarjeta de Movilidad Integrada (MI Card) rather than buying single tickets — the metro itself is a flat 5 pesos a ride, among the cheapest fares of any major transit system.";

const FOOD_NOTE = "This range covers casual Mexico City dining — fondas, taquerías, and mid-range restaurants, not fine dining. Eat your main meal at lunch: a comida corrida (a fixed-price fonda lunch of soup, a main dish, rice, and a drink) typically runs 60-120 pesos, only served midday.";

const result = await sql`
  INSERT INTO planner_destination_bands (destination_id, local_travel_low, local_travel_high, food_per_day_low, food_per_day_high, currency, local_travel_note, food_note)
  VALUES (${DESTINATION_ID}, '13.00', '13.00', '47.00', '47.00', 'USD', ${LOCAL_TRAVEL_NOTE}, ${FOOD_NOTE})
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
console.log(`✓ Mexico City destination bands seeded, row id ${result[0].id}`);

const rows = await sql`
  SELECT local_travel_low, local_travel_high, food_per_day_low, food_per_day_high, currency
  FROM planner_destination_bands WHERE destination_id = ${DESTINATION_ID}
`;
console.log(rows);
await sql.end();
