import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Local Travel + Food daily USD cost data for Doha (Qatar Grand Prix 2026),
// researched 13 Sep 2026 per the planner-data-researcher skill's Local
// Travel & Food methodology.
//
// SOURCE: Budget Your Trip (budgetyourtrip.com/qatar/doha), "All
// travelers" blended figure -- $106/day food (real reported range
// $47-194), $23/day local transportation (single published figure, no
// range given). No nearestMajorCity substitute needed -- Doha is itself a
// well-covered major capital city. No sanity-check flag -- these figures
// are directionally consistent with the luxury-skewed hotel market found
// during hotel-tier research for this same destination (see
// scripts/seed-qatar-gp-hotels.mjs).
//
// localTravelNote: named transit system (Doha Metro + Lusail Tram) plus a
// real, confirmed F1-ticket-holder perk -- a free 3-day Qatar Rail pass
// for unlimited metro/tram travel, redeemable at Goldclub offices or
// select Lusail Tram ticket offices, plus a complimentary shuttle from
// Lusail Metro Station to the circuit. Strongest possible note per the
// skill (a genuine event-specific perk beats a generic tip).
//
// foodNote: shawarma + karak tea from a Souq Waqif-style cafeteria as the
// real, named local budget-food practice, confirmed via Time Out Doha /
// Qatar Living cheap-eats coverage.

const DESTINATION_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136"; // Doha

const LOCAL_TRAVEL_NOTE = "This range covers Doha's metro, tram, and taxi network — no car needed. F1 ticket holders get a free 3-day Qatar Rail pass covering unlimited Doha Metro and Lusail Tram travel plus a complimentary shuttle from Lusail Metro Station to the circuit — redeem it at any Goldclub office or select Lusail Tram ticket offices.";

const FOOD_NOTE = "This range covers everything from hotel dining to casual restaurants — Doha skews upscale, so this isn't a cheap-eats city by default. For a genuinely local budget move, grab shawarma and karak tea from a cafeteria in Souq Waqif or similar spots — a full meal typically runs under QR 20-30 (around $5-8).";

const result = await sql`
  INSERT INTO planner_destination_bands (destination_id, local_travel_low, local_travel_high, food_per_day_low, food_per_day_high, currency, local_travel_note, food_note)
  VALUES (${DESTINATION_ID}, '23.00', '23.00', '47.00', '194.00', 'USD', ${LOCAL_TRAVEL_NOTE}, ${FOOD_NOTE})
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
console.log(`✓ Doha destination bands seeded, row id ${result[0].id}`);

const rows = await sql`
  SELECT local_travel_low, local_travel_high, food_per_day_low, food_per_day_high, currency
  FROM planner_destination_bands WHERE destination_id = ${DESTINATION_ID}
`;
console.log(rows);
await sql.end();
