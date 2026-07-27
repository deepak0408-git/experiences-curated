import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real hotel tier data for Johannesburg/Sandton (Australia tour of South
// Africa 2026 + England tour of South Africa 2026-27), researched 22 Jul
// 2026 per the planner-data-researcher skill's Hotels methodology.
//
// Search window: 7-night fixed stay keyed to the Australia tour's dates
// (startDate-2 to startDate+5, Australia tour starts 24 Sep 2026):
// Sep 22 - Sep 29, 2026. seasonalBand = "sep".
//
// SEASONAL BAND GAP FOUND + FIXED (22 Jul 2026): Johannesburg is shared by
// 2 events with genuinely different seasons (Australia tour Sep 2026 vs
// England tour Dec 2026/Jan 2027) but planner_hotel_tier_cost had no
// season/event dimension at all -- destination_id + tier only, unlike
// planner_flight_cost which already had seasonalBand. Added seasonalBand
// to planner_hotel_tier_cost this same session (schema + DB migration via
// scripts/add-hotel-seasonal-band-column.mjs), unique constraint now
// (destination_id, tier, seasonal_band). This seed covers the "sep" band
// only -- the England tour's Dec/Jan window is a real, separate gap, not
// yet researched. TODO for Screen 2: getPlannerEvents.ts / 
// getTradeoffOptions.ts hotel price queries must filter by seasonal_band
// matching the user's selected date window -- test specifically against
// Johannesburg before go-live (2 real seasons on one destination).
//
// PRE-CHECK done correctly (event's own pack accommodation experiences
// checked before any search): found "Where to Stay in Sandton,
// Johannesburg" already published, naming 2 hotels -- The Michelangelo
// Towers and Radisson Blu Gautrain Hotel, Sandton. Both force-included.
// (The same pack also has separate Cape Town and Durban accommodation
// experiences -- different cities, out of scope for this Johannesburg
// destination row.)
//
// SOURCE LIMITATION -- Booking.com only, same documented single-source gap
// as every other destination researched so far.
//
// Sample: Booking.com, ht_id=204 (Hotels property-type filter), sorted by
// order=review_score_and_price, search centered on Sandton (the real
// "where to stay" answer from our own pack, not central Johannesburg).
// 25 hotels from the sort (excluding AtholPlace Hotel & Villa -- only 25
// reviews, fails the >=50 threshold) + 2 force-included pack hotels = 26
// total, one (Studio Stay on Sixty6) unstarred and low-review but real.
//
// Bucketing: star rating first, then price splits/placement within bands.
// 13 of 26 hotels (half the sample, including both pack hotels) had no
// official Booking.com star badge -- likely because Sandton's market is
// dominated by serviced-apartment/aparthotel-style listings. User
// confirmed keeping the same star-first method regardless (22 Jul 2026),
// placing all unstarred hotels by price as usual.
//
// DAVINCI Suites moved from an initial splurge placement to luxury after
// the user found independent confirmation (Google search) that it's the
// same 5-star DAVINCI Hotel and Suites brand/property as "DAVINCI Hotel on
// Nelson Mandela Square" (already correctly in luxury) -- Booking.com's
// star badge for the Suites listing was simply missing, not indicating a
// lower tier. This resolved what would otherwise have been a genuine
// splurge/luxury price-range overlap.
//
// CURRENCY: converted to USD directly this time -- INR display -> ZAR
// (1 INR = 0.17088 ZAR) -> USD (1 ZAR = 0.06081 USD), both 21 Jul 2026
// Frankfurter rates. See feedback_planner_seeds_usd_only.md -- this is the
// standing rule for every Planner cost table, gotten wrong on both Milan
// and Virginia Water earlier in the same project before being corrected
// and written down.
//
// All prices = 7-night Booking.com total / 7, rounded to USD cents.

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40"; // Johannesburg
const SEASONAL_BAND = "sep";

const TIERS = [
  {
    tier: "budget",
    costLow: "48.22",
    costHigh: "56.92",
    note: "3 hotels: Road Lodge Sandton (1-star), BlackBrick Sandton One (unstarred, placed by price), Sandton Times Square (unstarred, placed by price).",
  },
  {
    tier: "moderate",
    costLow: "52.90",
    costHigh: "119.92",
    note: "10 hotels: BlackBrick Sandton Two (4-star), Garden Court Morningside Sandton (3-star), City Lodge Hotel Sandton Morningside (3-star), Hyatt House Johannesburg Sandton (4-star), Premier Hotel Quatermain (4-star), ONOMO Hotel Johannesburg Sandton (unstarred), The Catalyst Apartment Hotel by NEWMARK (unstarred), Studio Stay on Sixty6 (unstarred), Southern Sun Hyde Park Sandton (unstarred), @Sandton Hotel (unstarred).",
  },
  {
    tier: "splurge",
    costLow: "123.20",
    costHigh: "210.95",
    note: "6 hotels: NH Johannesburg Sandton (5-star, priced in this band despite the star badge -- real price cluster wins here), The Capital Empire (4-star), Radisson Blu Gautrain Hotel Sandton (unstarred, pack-recommended), The Capital on the Park (unstarred), Seven Villa Hotel & Spa (5-star), Sandton Sun and Towers (unstarred).",
  },
  {
    tier: "luxury",
    costLow: "221.83",
    costHigh: "936.90",
    note: "6 hotels: Hoeveld House (5-star), Raphael Suites (5-star), The Michelangelo Towers (unstarred, pack-recommended), DAVINCI Suites (unstarred, moved here from an initial splurge placement -- same brand/property as DAVINCI Hotel on Nelson Mandela Square, confirmed independently 22 Jul 2026), DAVINCI Hotel on Nelson Mandela Square (5-star), The Leonardo (unstarred), Saxon Hotel Villas & Spa (5-star, the single highest price in the whole 26-hotel sample).",
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
  console.log(`✓ ${result[0].tier} seeded`);
}

const rows = await sql`
  SELECT tier, seasonal_band, cost_low, cost_high, refresh_pass
  FROM planner_hotel_tier_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY tier
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
