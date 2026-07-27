import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real hotel tier data for Abu Dhabi (Abu Dhabi Grand Prix 2026), researched
// 22 Jul 2026 per the planner-data-researcher skill's Hotels methodology.
//
// Search window: 7-night fixed stay, eventStartDate-2 to eventStartDate+5
// (Abu Dhabi GP starts 4 Dec 2026): Dec 2 - Dec 9, 2026. seasonalBand = "dec".
//
// Abu Dhabi is a genuine standalone destination -- no zone/satellite
// question. nextClosestHotelDestinationId stays NULL.
//
// PRE-CHECK: event's own pack has ZERO existing accommodation experiences
// -- clean slate, no pack hotels to force-include.
//
// SOURCE LIMITATION -- Booking.com only, same documented single-source gap
// as every other destination. Prices in INR (IP-geolocation driven),
// converted via Frankfurter (1 INR = 0.01039 USD, 21 Jul 2026 rate).
//
// SORT VERIFICATION: initial page load showed "Top picks for long stays" in
// the sort dropdown instead of the requested review_score_and_price --
// investigated (a caching/timing glitch, not a real Booking.com issue for
// this destination), confirmed by reloading fresh: sort dropdown correctly
// showed "Best reviewed and lowest price" and per-card sr_order params
// matched. Same lesson as Las Vegas -- always verify the actual rendered
// sort state, don't assume from a single fetch.
//
// Sample: Booking.com, ht_id=204, sorted by order=review_score_and_price.
// Top 25 hotels, all with real official star badges -- no unstarred
// placements needed.
//
// REAL MARKET FINDING: this dataset skews heavily 4-star/5-star with
// nothing below $300/night -- genuinely reflects Abu Dhabi's premium
// hotel positioning near race weekend, not a data gap. The "budget" tier
// label is retained per the standard schema enum, but is NOT literally
// cheap in absolute cross-destination terms (contrast Las Vegas/Turin
// budget tiers starting around $26-90/night) -- flagged explicitly here
// so this isn't mistaken for an error later.
//
// Splurge/luxury boundary: only 6 hotels exist above $655, with 2 real
// gaps of similar size ($231 at $693->924, $260 at $946->1206) -- neither
// cut gives all 4 tiers >=3 hotels. User chose Cut B: splurge absorbs the
// $655-946 cluster (4 hotels, including 4-star Doubletree alongside 3
// genuine 5-star properties), luxury holds only the top 2 genuine
// ultra-flagship properties (The WB Abu Dhabi Curio Collection, The Abu
// Dhabi EDITION).
//
// KNOWN GAP: luxury tier has only 2 qualifying hotels, below the
// methodology's stated minimum of 3. Seeded anyway per explicit user
// instruction 22 Jul 2026 -- both are genuine standout ultra-premium
// flagship properties, not a fabricated range.
//
// CURRENCY: USD, 1 INR = 0.01039 USD (21 Jul 2026 Frankfurter rate). See
// feedback_planner_seeds_usd_only.md.
//
// All prices = 7-night Booking.com total / 7, rounded to USD cents.

const DESTINATION_ID = "d4d2ed49-0217-441d-8d1f-38c9b03db2ca"; // Abu Dhabi
const SEASONAL_BAND = "dec";

const TIERS = [
  {
    tier: "budget",
    costLow: "303.41",
    costHigh: "475.75",
    note: "14 hotels: Al Nakheel Hotel Apartments (4-star), Gravity Hotel Abu Dhabi (3-star), Al Manzel Hotel Apartments (4-star), Cristal Hotel Abu Dhabi (4-star), Al Maha Arjaan by Rotana (5-star), Oaks Liwa Executive Suites (4-star), Royal Rose Hotel Curio Collection by Hilton (5-star), Capital Centre Arjaan by Rotana (4-star), Grand Mercure Majlis Residences Abu Dhabi (5-star), Rixos Marina Abu Dhabi (5-star), Pearl Rotana Capital Centre (4-star), Beach Rotana All Suites (5-star), Grand Millennium Al Wahda Hotel and Executive Apartments (5-star), City Seasons Al Hamra Hotel (4-star). NOTE: genuinely premium in absolute terms ($303-476/night) -- not literally cheap, this reflects Abu Dhabi's real market positioning.",
  },
  {
    tier: "moderate",
    costLow: "511.44",
    costHigh: "560.87",
    note: "5 hotels: Marriott Executive Apartments Downtown Abu Dhabi (4-star), Jannah Executive Hotel Apartments (4-star), Courtyard by Marriott World Trade Center Abu Dhabi (4-star), Grand Millennium Al Wahda Executive Apartments (4-star), La Quinta by Wyndham Abu Dhabi Al Wahda (4-star).",
  },
  {
    tier: "splurge",
    costLow: "655.57",
    costHigh: "945.71",
    note: "4 hotels (user-chosen split, 22 Jul 2026 -- 'Cut B'): Shangri-La Qaryat Al Beri Abu Dhabi (5-star), Park Rotana Abu Dhabi (5-star), Doubletree By Hilton Abu Dhabi Yas Island Residences (4-star), Andaz Capital Gate Abu Dhabi By Hyatt (5-star).",
  },
  {
    tier: "luxury",
    costLow: "1206.01",
    costHigh: "1533.14",
    note: "2 hotels (below the usual 3-minimum, seeded as an explicit user-approved exception 22 Jul 2026): The WB Abu Dhabi Curio Collection By Hilton (5-star), The Abu Dhabi EDITION (5-star, highest price in the sample). Both genuine ultra-premium flagship properties.",
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
