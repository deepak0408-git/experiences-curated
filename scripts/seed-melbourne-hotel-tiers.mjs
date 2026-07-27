import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real hotel tier data for Melbourne (New Zealand tour of Australia
// 2026-27, Boxing Day Test at the MCG), researched 22 Jul 2026 per the
// planner-data-researcher skill's Hotels methodology.
//
// EVENT WINDOW CLARIFICATION: this event is a 4-Test tour across 4 cities
// (Perth 9-13 Dec, Adelaide 17-21 Dec, MCG Melbourne 26-30 Dec, SCG Sydney
// 4-8 Jan) recorded as ONE sporting_events row spanning the full tour
// (9 Dec 2026 - 8 Jan 2027). The Melbourne leg specifically is the Boxing
// Day Test (26-30 Dec) -- used THAT window, not the tour's overall
// start/end dates, for the search: eventStartDate-2 to eventStartDate+5
// relative to 26 Dec = Dec 24 - Dec 31, 2026. seasonalBand = "dec".
//
// Melbourne is a genuine standalone destination -- no zone/satellite
// question. nextClosestHotelDestinationId stays NULL.
//
// PRE-CHECK: event's own pack has ZERO existing accommodation experiences
// -- clean slate, no pack hotels to force-include.
//
// SOURCE LIMITATION -- Booking.com only, same documented single-source gap
// as every other destination. Prices in INR (IP-geolocation driven),
// converted via Frankfurter (1 INR = 0.01039 USD, 21 Jul 2026 rate).
//
// SORT VERIFICATION: same false-alarm pattern as Abu Dhabi -- initial page
// load showed "Top picks for long stays" in the sort dropdown; a fresh
// reload with a longer settle wait confirmed "Best reviewed and lowest
// price" was genuinely active. Always verify the actual rendered sort
// state on a fresh load before trusting a result set.
//
// Sample: Booking.com, ht_id=204, sorted by order=review_score_and_price.
// Top 25 hotels, all with real official star badges (heavily 5-star) --
// excluded Novotel St Kilda (1 review), Private Unit in Heritage Building
// Fitzroy North (2 reviews), United Places Hotel Botanic Gardens (16
// reviews), all below the 50-review threshold.
//
// TOP-TIER GAP: only 3 hotels exist above $327/night, with The Ritz-Carlton
// Melbourne ($675.36) a huge standalone outlier ($296 gap to the next
// hotel). Neither a 2/1 nor a clean 3-hotel split across splurge+luxury
// gave both tiers >=3 hotels. User decision 22 Jul 2026: merge all 3 into
// splurge and leave luxury genuinely UNSEEDED for this destination --
// applying the methodology's actual rule ("if fewer than 3 hotels
// genuinely qualify, leave that tier unseeded") rather than forcing
// another under-minimum exception.
//
// CURRENCY: USD, 1 INR = 0.01039 USD (21 Jul 2026 Frankfurter rate). See
// feedback_planner_seeds_usd_only.md.
//
// All prices = 7-night Booking.com total / 7, rounded to USD cents.

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const SEASONAL_BAND = "dec";

const TIERS = [
  {
    tier: "budget",
    costLow: "98.26",
    costHigh: "229.21",
    note: "14 hotels: Quality Hotel Melbourne Airport (4-star), Mercure Melbourne La Trobe Street (4-star), Melbourne City Apartment Hotel (4-star), The Sebel Melbourne Moonee Ponds (5-star), Pan Pacific Melbourne (5-star), Hyatt House South Melbourne (4-star), Quest Collingwood (4-star), Holiday Inn Melbourne Bourke Street Mall by IHG (4-star), The StandardX Melbourne (5-star), Zagame's House (5-star), Hotel Indigo Melbourne Little Collins by IHG (4-star), Hilton Melbourne Little Queen Street (5-star), Meriton Suites Melbourne (5-star), Lanson Place Parliament Gardens (5-star).",
  },
  {
    tier: "moderate",
    costLow: "262.44",
    costHigh: "327.46",
    note: "8 hotels: The Motley Hotel Richmond Tapestry Collection by Hilton (5-star), The Langham Melbourne (5-star), The Royce (5-star), W Melbourne (5-star), The Westin Melbourne (5-star), 1 Hotel Melbourne (5-star), Park Hyatt Melbourne (5-star), Treasury on Collins Melbourne (5-star).",
  },
  {
    tier: "splurge",
    costLow: "378.20",
    costHigh: "675.36",
    note: "3 hotels (merged from what would otherwise be two under-minimum tiers, user decision 22 Jul 2026): The Lyall (5-star), Pullman East Melbourne (5-star), The Ritz-Carlton Melbourne (5-star, highest price in the sample by a wide margin).",
  },
];
// NOTE: no luxury row -- genuinely unseeded, 0 qualifying hotels remained
// after merging the top 3 into splurge. This is an intentional gap per
// methodology, not an oversight.

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
console.log("\nConfirmed state (3 tiers -- luxury intentionally unseeded):");
console.table(rows);

await sql.end();
