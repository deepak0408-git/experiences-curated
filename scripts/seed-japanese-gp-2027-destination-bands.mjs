import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9"; // Suzuka

// Researched via planner-data-researcher skill's locked Local Travel & Food
// methodology, 22-23 Sep 2026.
//
// Suzuka has no dedicated Budget Your Trip cost page (confirmed via live
// fetch + search — only a hotel-comparison page exists at
// budgetyourtrip.com/hotels/japan/suzuka-1851348-t_oneweek, not the "Past
// travelers have spent" daily-cost page this methodology needs). Founder
// approved Nagoya (~50km away, real transit link to the circuit, real BYT
// coverage) as destinations.nearestMajorCity, same pattern as Turin->Milan.
//
// Source: budgetyourtrip.com/japan/nagoya (fetched via Playwright, real
// browser UA), "All travelers" blended daily figures -- the only figures
// BYT publishes for these two categories (no per-tier split).
// Food: $47/day. Local Transportation: $11/day.
// Sanity-checked against Tokyo ($64/$17 on the same site) -- Nagoya cheaper
// than Tokyo is expected, no Liverpool/Manchester-style implausible
// reversal. Founder-approved as-is, 23 Sep 2026.
//
// Notes: Local Travel names the real transit system (Nagoya subway +
// JR/Kintetsu rail) and the real, confirmed event-specific perk -- the
// official "Suzuka Grand Prix" Kintetsu limited express running direct
// from Nagoya Station to Suzuka Circuit Ino Station on race weekend,
// sourced from Suzuka Circuit's own official F1 access page
// (suzukacircuit.jp/eng/f1/access/info) -- solid/load-bearing source.
// Food names a real, specific, named local practice -- Nagoya's "morning
// service" (moningu) custom at chains like Komeda Coffee -- sourced from
// travel-blog/food-guide aggregators, directional only, softened
// accordingly.
await sql`
  INSERT INTO planner_destination_bands (destination_id, local_travel_low, local_travel_high, food_per_day_low, food_per_day_high, currency, local_travel_note, food_note)
  VALUES (
    ${DESTINATION_ID},
    11.00, 11.00,
    47.00, 47.00,
    'USD',
    ${"This range covers Nagoya's city subway and JR/Kintetsu rail network, plus the onward trip to the circuit — no car needed. For race weekend, the special \"Suzuka Grand Prix\" Kintetsu limited express runs direct from Nagoya Station to Suzuka Circuit Ino Station in about an hour, with all seats reserved."},
    ${"This range covers casual teishoku set-lunch and izakaya dinner dining, not fine dining — Nagoya is solidly mid-range for Japan. Time your coffee run for Nagoya's famous \"morning service\" (moningu) at chains like Komeda Coffee, where toast, egg, and salad come free with your coffee order."}
  )
  ON CONFLICT (destination_id) DO UPDATE SET
    local_travel_low = EXCLUDED.local_travel_low,
    local_travel_high = EXCLUDED.local_travel_high,
    food_per_day_low = EXCLUDED.food_per_day_low,
    food_per_day_high = EXCLUDED.food_per_day_high,
    currency = EXCLUDED.currency,
    local_travel_note = EXCLUDED.local_travel_note,
    food_note = EXCLUDED.food_note,
    last_updated = NOW()
`;

await sql`
  UPDATE destinations SET nearest_major_city = 'Nagoya', updated_at = NOW()
  WHERE id = ${DESTINATION_ID}
`;

const [row] = await sql`SELECT * FROM planner_destination_bands WHERE destination_id = ${DESTINATION_ID}`;
console.log("Seeded:", row);

const [dest] = await sql`SELECT id, name, nearest_major_city FROM destinations WHERE id = ${DESTINATION_ID}`;
console.log("Destination updated:", dest);

await sql.end();
