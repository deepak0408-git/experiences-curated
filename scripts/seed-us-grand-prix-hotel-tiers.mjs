import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real hotel tier data for Austin (United States Grand Prix 2026),
// researched 5 Sep 2026 per the planner-data-researcher skill's Hotels
// methodology.
//
// Search window: 7-night fixed stay, eventStartDate-2 to eventStartDate+5
// (US GP starts 23 Oct 2026): Oct 21 - Oct 28, 2026. seasonalBand = "oct".
//
// Zone split: 80/20 city-center/circuit-area, per explicit founder
// instruction (overrides the skill's default 70/30 anchor/venue split).
// No nextClosestHotelDestinationId link exists (Austin is its own genuine
// fan-booking base) -- applied manually via two direct Booking.com
// searches, same template as Milan/Monza: "Downtown Austin, Texas" for the
// city-center 80% (20 hotels), "Del Valle, Texas" (COTA's real postal
// town, resolves on Booking.com where "Circuit of the Americas, Austin,
// TX" returned zero results) for the circuit-area 20% (5 hotels) -- this
// pool is genuinely Austin-Bergstrom Airport-adjacent properties, the
// closest real hotel cluster to the circuit itself.
//
// PRE-CHECK: event's pack already has a published "Where to Stay" experience
// naming 3 specific hotels (Hotel Magdalena, Austin Marriott Downtown,
// Embassy Suites Downtown South Congress). None appeared organically in the
// city-center search, so all 3 were force-checked directly on their own
// Booking.com pages for this exact date window:
//   - Hotel Magdalena: available, 4-star, $1,139-1,207/night
//   - Embassy Suites Downtown South Congress: available, 4-star, $519-1,054/night
//   - Austin Marriott Downtown: NO AVAILABILITY for these dates -- real gap,
//     not substituted.
//
// Splurge/luxury thinness: only 4 properties in the entire 25-hotel sample
// cleared ~$1,100/night. Four Seasons Austin, JW Marriott Austin, and
// Fairmont Austin -- Austin's other real luxury flagships -- were each
// checked directly and are ALL sold out for this exact window (confirmed
// "We have no availability" on each hotel's own Booking.com page), which
// is why they don't appear in the sample at all rather than being missed.
// This reads as genuine F1-weekend demand exhausting Austin's top-tier
// inventory this far out, not a research gap. South Congress Hotel was
// also checked directly and returned no priced rooms for this window on
// two separate fetches -- inconclusive, not force-included either way.
//
// Founder-approved exceptions, 5 Sep 2026:
// 1. Budget/moderate 2-3-star / 4-star overlap: same pattern as Wimbledon
//    2027 London (2-star/3-star overlap) -- pooled all non-splurge/luxury
//    hotels (21 total, prices $281-793) and split by REAL PRICE RANK
//    instead of star label: cheapest 10 = budget ($281-560), priciest 11 =
//    moderate ($585-793). A real $25 gap sits between 560 and 585, used as
//    the split point.
// 2. Splurge seeded with only 3 hotels at the exact minimum: The LINE
//    Austin (4-star, $1,125), Hotel Magdalena (4-star, $1,139), The
//    Driskill (5-star, $1,161) -- pooled together by price despite mixing
//    star classes, same logic as the budget/moderate fix.
// 3. Luxury seeded with a SINGLE hotel, Austin Proper Hotel (5-star,
//    $2,743) -- below the methodology's stated 3-hotel minimum. Explicit,
//    rare exception per founder instruction, given the confirmed real
//    exhaustion of Austin's other 5-star inventory for this date window
//    (Four Seasons/JW Marriott/Fairmont all sold out). Same class of
//    exception as Turin's budget tier and Virginia Water's/Singapore's
//    luxury tiers.
//
// CURRENCY: USD directly (Austin/USD, no conversion needed).
// All prices = 7-night Booking.com total / 7 (lowest available room per
// hotel), rounded to whole dollars.

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin
const SEASONAL_BAND = "oct";

const TIERS = [
  {
    tier: "budget",
    costLow: "281.00",
    costHigh: "560.00",
    note: "10 hotels (price-rank split, not pure star cutoff): Homewood Suites Austin Airport (3-star, $281), Home2 Suites Austin Downtown East Side (3-star, $330), Atwell Suites Austin Airport (3-star, $367), Holiday Inn Express Austin Airport East (2-star, $393), Home2 Suites Austin Airport (3-star, $423), Hampton Inn & Suites Austin University Capitol (3-star, $501), Embassy Suites Downtown South Congress (4-star, $519, pack-recommended force-include), Placemakr Austin Downtown (4-star, $536), citizenM Austin Downtown (4-star, $544), DoubleTree Suites Austin Downtown Capitol (4-star, $560).",
  },
  {
    tier: "moderate",
    costLow: "585.00",
    costHigh: "793.00",
    note: "11 hotels (price-rank split): Hilton Garden Inn Austin University Capitol District (3-star, $585), Kasa Downtown Austin (4-star, $600), Hilton Garden Inn Austin Downtown (3-star, $609), Stephen F Austin Royal Sonesta (4-star, $615), Hyatt House Austin/Downtown (4-star, $633), Kasa 2nd Street Austin (4-star, $644), Omni Austin Hotel Downtown (4-star, $656), Hyatt Centric Congress Avenue (4-star, $722), Hyatt Place Austin Downtown (3-star, $725), Hampton Inn & Suites Austin Downtown (3-star, $728), Renaissance Austin Downtown (4-star, $793).",
  },
  {
    tier: "splurge",
    costLow: "1125.00",
    costHigh: "1161.00",
    note: "3 hotels at the exact minimum, pooled by price across star classes: The LINE Austin (4-star, $1,125), Hotel Magdalena (4-star, $1,139, pack-recommended force-include), The Driskill (5-star, $1,161).",
  },
  {
    tier: "luxury",
    costLow: "2743.00",
    costHigh: "2743.00",
    note: "Single hotel, below the usual 3-minimum (explicit founder exception): Austin Proper Hotel (5-star, $2,743) -- Austin's other real 5-star flagships (Four Seasons, JW Marriott, Fairmont) confirmed sold out for this date window.",
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
  ORDER BY cost_low
`;
console.log(rows);
await sql.end();
