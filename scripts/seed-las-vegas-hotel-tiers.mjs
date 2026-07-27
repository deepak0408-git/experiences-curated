import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real hotel tier data for Las Vegas (F1 Las Vegas Grand Prix 2026),
// researched 22 Jul 2026 per the planner-data-researcher skill's Hotels
// methodology.
//
// Search window: 7-night fixed stay, eventStartDate-2 to eventStartDate+5
// (Las Vegas GP starts 19 Nov 2026): Nov 17 - Nov 24, 2026. seasonalBand = "nov".
//
// Las Vegas is a genuine standalone destination -- no zone/satellite
// question. nextClosestHotelDestinationId stays NULL.
//
// PRE-CHECK: event's own pack has ZERO existing accommodation experiences
// -- clean slate, no pack hotels to force-include.
//
// SOURCE LIMITATION -- Booking.com only, same documented single-source gap
// as every other destination. Prices displayed in INR (IP-geolocation
// driven, not URL-param controllable) despite Las Vegas's own destination
// currency already being USD -- converted the same way as every other
// destination via Frankfurter (1 INR = 0.01039 USD, 21 Jul 2026 rate).
//
// Sort verification: an initial check of individual hotel-card link
// params showed sr_order=popularity, which looked like the requested
// order=review_score_and_price hadn't applied -- re-verified by reading
// the actual sort dropdown label in the rendered page ("Best reviewed and
// lowest price"), confirming the sort WAS correctly applied; the
// per-card sr_order param is not a reliable signal of the page-level sort.
//
// Sample: Booking.com, ht_id=204, sorted by order=review_score_and_price.
// 53 raw results (heavy casino/budget-motel presence, a real characteristic
// of the Las Vegas hotel market) -- excluded Collection O Las Vegas,
// Palms Place Hotel (both no score/reviews), and Palette Las Vegas (1
// review). Took the next 24 qualifying hotels; only AC Hotel Symphony Park
// unstarred.
//
// Bucketing: natural price clusters, no star/price override exceptions
// needed. Two 3-star hotels (Jockey Club Suites, Best Western Plus Casino
// Royale) landed in luxury by real price alongside 5-star Vdara and JW
// Marriott -- genuine market pricing, not a data error. Motel 6 Strip
// (2-star, $130.76) landing in splurge reflects a real Strip-location
// price premium despite budget branding.
//
// CURRENCY: USD, 1 INR = 0.01039 USD (21 Jul 2026 Frankfurter rate). See
// feedback_planner_seeds_usd_only.md.
//
// All prices = 7-night Booking.com total / 7, rounded to USD cents.

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409"; // Las Vegas
const SEASONAL_BAND = "nov";

const TIERS = [
  {
    tier: "budget",
    costLow: "26.46",
    costHigh: "60.94",
    note: "7 hotels: Arizona Charlie's Boulder (2-star), Golden Gate Casino Hotel (3-star), Masquerade Tower at Rio (3-star), Super 8 by Wyndham Las Vegas North Strip (2-star), Oasis at Gold Spike (3-star), Mardi Gras Hotel & Casino (3-star), Plaza Hotel & Casino (4-star).",
  },
  {
    tier: "moderate",
    costLow: "76.30",
    costHigh: "107.31",
    note: "6 hotels: Alexis Park All Suite Resort (3-star), Motel 6 Las Vegas NV I-15 Stadium (2-star), Studio 6 Suites Las Vegas Tropicana (2-star), Baymont by Wyndham Las Vegas South Strip (2-star), La Quinta by Wyndham Las Vegas Summerlin Tech (3-star), Tru By Hilton Las Vegas Airport NV (3-star).",
  },
  {
    tier: "splurge",
    costLow: "130.76",
    costHigh: "167.55",
    note: "6 hotels: Motel 6 Las Vegas NV Strip (2-star, real Strip-location price premium despite budget branding), The Berkley Las Vegas (4-star), TownePlace Suites by Marriott Las Vegas Henderson (3-star), AC Hotel by Marriott Las Vegas Symphony Park (unstarred, placed by price), The Signature at MGM Grand All Suites (4-star), Circa Resort & Casino Adults Only (4-star).",
  },
  {
    tier: "luxury",
    costLow: "216.29",
    costHigh: "283.26",
    note: "5 hotels: Jockey Club Suites (3-star, placed by real price alongside genuine luxury brands), JW Marriott Las Vegas Resort & Spa (4-star), Best Western Plus Casino Royale Center Strip (3-star, real price), Vdara Hotel & Spa at ARIA Las Vegas (5-star), The Vanderpump Las Vegas Hotel & Casino / The Cromwell (5-star, highest price in the sample).",
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
