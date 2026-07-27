import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Johannesburg/Sandton hotel tiers, DECEMBER season band, researched 22 Jul
// 2026. Companion to scripts/seed-johannesburg-hotel-tiers.mjs (the "sep"
// band) -- Johannesburg is shared by 2 events with genuinely different
// seasons: Australia tour (Sep 2026) and England tour (Dec 2026/Jan 2027).
// This reuses the same 26-hotel identification, star-rating, and
// pre-check work from the Sep pass -- only fresh price/availability data
// was pulled for this window, per user instruction to not duplicate the
// research from scratch.
//
// Search window: 7-night fixed stay keyed to the England tour's dates
// (startDate-2 to startDate+5, England tour starts 17 Dec 2026):
// Dec 15 - Dec 22, 2026. seasonalBand = "dec".
//
// Availability differs from the Sep pass: Hoeveld House has NO
// availability for this window (excluded, honest gap -- same pack-
// recommended-hotel-sold-out pattern seen elsewhere, except Hoeveld House
// isn't pack-recommended so it's just dropped, not force-included).
// Radisson Blu Gautrain (pack-recommended) and Sandton Sun and Towers both
// needed a longer page-render wait to return real prices -- retried and
// confirmed genuinely available, not a real gap.
//
// Real December prices run meaningfully higher than September's for most
// hotels (e.g. Saxon Hotel $983.65 vs Sep's cheaper-tier equivalent,
// The Michelangelo Towers $313.02 vs Sep's ~$286) -- consistent with
// December being a higher-demand period in Johannesburg.
//
// Sandton Sun and Towers (unstarred) moved from an initial splurge
// placement to luxury by price ($261.78) -- same overlap-resolution
// pattern as Milan's TheROOMS and Johannesburg-Sep's DAVINCI Suites,
// user-approved 22 Jul 2026.
//
// CURRENCY: USD directly, 1 INR = 0.01039 USD (21 Jul 2026 Frankfurter
// rate). See feedback_planner_seeds_usd_only.md.
//
// All prices = 7-night Booking.com total / 7, rounded to USD cents.

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40"; // Johannesburg
const SEASONAL_BAND = "dec";

const TIERS = [
  {
    tier: "budget",
    costLow: "44.35",
    costHigh: "59.89",
    note: "4 hotels: Road Lodge Sandton (1-star), Sandton Times Square (unstarred), BlackBrick Sandton Two (4-star, priced into budget this season), BlackBrick Sandton One (unstarred).",
  },
  {
    tier: "moderate",
    costLow: "65.85",
    costHigh: "124.73",
    note: "10 hotels: ONOMO Hotel Johannesburg Sandton (unstarred), Garden Court Morningside Sandton (3-star), City Lodge Hotel Sandton Morningside (3-star), Premier Hotel Quatermain (4-star), Studio Stay on Sixty6 (unstarred), The Catalyst Apartment Hotel by NEWMARK (unstarred), @Sandton Hotel (unstarred), Southern Sun Hyde Park Sandton (unstarred), Hyatt House Johannesburg Sandton (4-star), The Capital Empire (4-star).",
  },
  {
    tier: "splurge",
    costLow: "125.54",
    costHigh: "200.41",
    note: "4 hotels: NH Johannesburg Sandton (5-star, priced into splurge this season), Radisson Blu Gautrain Hotel Sandton (unstarred, pack-recommended), The Capital on the Park (unstarred), Seven Villa Hotel & Spa (5-star).",
  },
  {
    tier: "luxury",
    costLow: "237.11",
    costHigh: "983.65",
    note: "7 hotels: Raphael Suites (5-star), Sandton Sun and Towers (unstarred, moved here from an initial splurge placement to resolve a real price-band overlap), DAVINCI Suites (5-star, same brand as DAVINCI Hotel on Nelson Mandela Square), The Michelangelo Towers (unstarred, pack-recommended), DAVINCI Hotel on Nelson Mandela Square (5-star), The Leonardo (unstarred), Saxon Hotel Villas & Spa (5-star, highest price in the sample). Hoeveld House (5-star) excluded -- no availability for this window.",
  },
];

for (const t of TIERS) {
  const result = await sql`
    INSERT INTO planner_hotel_tier_cost (destination_id, tier, seasonal_band, cost_low, cost_high, refresh_pass)
    VALUES (${DESTINATION_ID}, ${t.tier}, ${SEASONAL_BAND}, ${t.costLow}, ${t.costHigh}, 'initial')
    ON CONFLICT (destination_id, tier, seasonal_band) DO UPDATE SET
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      refresh_pass = EXCLUDED.refresh_pass,
      last_updated = NOW()
    RETURNING tier
  `;
  console.log(`✓ ${result[0].tier} (dec) seeded`);
}

const rows = await sql`
  SELECT tier, seasonal_band, cost_low, cost_high, refresh_pass
  FROM planner_hotel_tier_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY seasonal_band, tier
`;
console.log("\nConfirmed state (both seasons):");
console.table(rows);

await sql.end();
