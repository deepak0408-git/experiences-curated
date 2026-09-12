import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb"; // Sao Paulo

// Researched via planner-data-researcher skill's locked Local Travel & Food
// methodology, 12 Sep 2026. Source: budgetyourtrip.com/brazil/sao-paulo
// (fetched via Playwright), "All travelers" blended daily figures — the
// only figures BYT publishes for these two categories (no per-tier split).
// Food: $25/day. Local Transportation: $5.97/day. Sanity-checked against
// Mexico City ($47/$13) -- lower but plausible (no Liverpool/Manchester-
// style implausible reversal), founder-approved as-is.
//
// Notes: Local Travel names the real transit system (Metro Line 9) and the
// real, confirmed event-specific perk (F1 Express/circular shuttle buses
// run free on Sunday race day, per f1saopaulo.com.br's official useful-info
// page -- the regular Line 9 metro fare, ~R$5.40, still applies all three
// days, a real nuance not glossed over). Food names a real, specific,
// named budget practice (prato feito, the fixed daily lunch plate,
// averaging R$38.65/~US$6.80 per ANR/Agencia Brasil pricing data, Feb 2026).
await sql`
  INSERT INTO planner_destination_bands (destination_id, local_travel_low, local_travel_high, food_per_day_low, food_per_day_high, currency, local_travel_note, food_note)
  VALUES (
    ${DESTINATION_ID},
    5.97, 5.97,
    25.00, 25.00,
    'USD',
    ${"This range covers Metrô Line 9 and city buses — no car needed. The Autódromo station on Line 9 goes straight to the circuit gates. F1 Express and circular shuttle buses run free on Sunday race day specifically, though the regular Line 9 metro fare (around R$5.40) still applies all three days."},
    ${"This range covers casual dining, not fine dining — home-style cooking and mid-range restaurants dominate this budget. Order the prato feito (fixed daily lunch plate) at midday for a genuine local budget move, typically around R$39 (about US$7) for a full meal."}
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

const [row] = await sql`SELECT * FROM planner_destination_bands WHERE destination_id = ${DESTINATION_ID}`;
console.log("Seeded:", row);

await sql.end();
