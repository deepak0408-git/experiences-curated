import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real hotel tier data for Turin (Nitto ATP Finals 2026), researched 22 Jul
// 2026 per the planner-data-researcher skill's Hotels methodology.
//
// Search window: 7-night fixed stay, eventStartDate-2 to eventStartDate+5
// (ATP Finals starts 15 Nov 2026): Nov 13 - Nov 20, 2026. seasonalBand = "nov".
//
// Turin is a genuine standalone destination (major city) -- no zone/
// satellite question. nextClosestHotelDestinationId stays NULL.
//
// PRE-CHECK: event's own pack has ZERO existing accommodation experiences
// -- clean slate, no pack hotels to force-include.
//
// SOURCE LIMITATION -- Booking.com only, same documented single-source gap
// as every other destination.
//
// Sample: Booking.com, ht_id=204, sorted by order=review_score_and_price.
// Top 26 by the sort, all >=50 reviews, 25 with real official star badges
// (only Hotel Dora unstarred, placed by price into budget).
//
// Bucketing: used real natural price gaps ($91->148, $365->427, $538->597)
// as tier boundaries, same approach as Singapore and St Andrews -- no
// star/price override exceptions needed.
//
// KNOWN GAP: budget tier has only 2 qualifying hotels (Hotel Sharing,
// Hotel Dora), below the methodology's stated minimum of 3. Seeded anyway
// per explicit user instruction 22 Jul 2026 -- both are genuinely
// low-priced with a real $57 gap to the next-cheapest hotel, not a
// fabricated range. Same class of exception as Milan's budget tier,
// Virginia Water's and Singapore's luxury tiers.
//
// CURRENCY: USD directly, 1 INR = 0.01039 USD (21 Jul 2026 Frankfurter
// rate). See feedback_planner_seeds_usd_only.md.
//
// All prices = 7-night Booking.com total / 7, rounded to USD cents.

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2"; // Turin
const SEASONAL_BAND = "nov";

const TIERS = [
  {
    tier: "budget",
    costLow: "89.55",
    costHigh: "91.44",
    note: "2 hotels (below the usual 3-minimum, seeded as an explicit exception): Hotel Sharing (3-star), Hotel Dora (unstarred, placed by price).",
  },
  {
    tier: "moderate",
    costLow: "148.29",
    costHigh: "364.85",
    note: "14 hotels: B&B Hotel Torino President (3-star), Idea Hotel Torino Mirafiori (3-star), Hotel Amadeus (3-star), B&B HOTEL Torino Orbassano (3-star), Novotel Torino Corso Giulio Cesare (4-star), Hotel Antica Dogana (3-star), Hotel Astoria (3-star), Art Hotel Boston (4-star), Best Western Plus Hotel Genova (4-star), Art Hotel Olympic (4-star), Hotel Valentino Du Parc (3-star), Holiday Inn Turin Corso Francia by IHG (4-star), Loger Confort Residence & Apartments (4-star), Taverna Dantesca (3-star).",
  },
  {
    tier: "splurge",
    costLow: "427.30",
    costHigh: "538.06",
    note: "6 hotels: NH Torino Centro (4-star), Starhotels Majestic (4-star), NH Torino Lingotto Congress (4-star), Hotel Diplomatic (4-star), Hotel Roma e Rocca Cavour (3-star), Santa Giulia Hotel e Residence Torino (4-star).",
  },
  {
    tier: "luxury",
    costLow: "597.26",
    costHigh: "731.67",
    note: "4 hotels: Hotel Indigo Turin by IHG (4-star), NH Collection Torino Santo Stefano (4-star), DoubleTree by Hilton Turin Lingotto (4-star), Hilton Turin Centre (5-star, highest price in the sample).",
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
