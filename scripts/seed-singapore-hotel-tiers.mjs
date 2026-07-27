import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real hotel tier data for Singapore (F1 Singapore Grand Prix 2026),
// researched 22 Jul 2026 per the planner-data-researcher skill's Hotels
// methodology.
//
// Search window: 7-night fixed stay, eventStartDate-2 to eventStartDate+5
// (Singapore GP starts 9 Oct 2026): Oct 7 - Oct 14, 2026. seasonalBand = "oct".
//
// Singapore is a genuine standalone destination (city-state) -- no zone/
// satellite question here, unlike Milan or St Andrews.
// nextClosestHotelDestinationId stays NULL.
//
// PRE-CHECK: event's own pack has ZERO existing accommodation experiences
// -- clean slate, no pack hotels to force-include.
//
// SOURCE LIMITATION -- Booking.com only, same documented single-source gap
// as every other destination.
//
// Sample: Booking.com, ht_id=204, sorted by order=review_score_and_price.
// 50 raw results, 4 excluded for <50 reviews (lyf Chinatown Singapore,
// Days Inn by Wyndham Singapore Novena, The Initial Sama Serviced
// Residences, Aura Hotel Purvis), leaving 46 qualifying -- took the top 25
// by the existing sort to keep sample size consistent with methodology.
//
// Bucketing: cleanest dataset of any destination researched so far -- all
// 25 hotels had a real official star badge (no unstarred placements
// needed), and natural price gaps produced clean, non-overlapping tiers
// without any star/price override exceptions. Marina Bay Sands ($1,349/
// night) is a genuine, obvious outlier (759 USD gap to the next-highest
// hotel) -- Singapore's signature luxury landmark, expected to anchor the
// top of the range.
//
// KNOWN GAP: luxury tier has only 2 qualifying hotels (Oxley Thanksgiving
// Residence, Marina Bay Sands), below the methodology's stated minimum of
// 3. Seeded anyway per explicit user instruction 22 Jul 2026 -- both are
// genuinely luxury-priced real hotels (Marina Bay Sands especially, as
// Singapore's best-known luxury property), not a fabricated range. Same
// class of exception as Milan's budget tier and Virginia Water's luxury
// tier.
//
// CURRENCY: USD directly, 1 INR = 0.01039 USD (21 Jul 2026 Frankfurter
// rate). See feedback_planner_seeds_usd_only.md.
//
// All prices = 7-night Booking.com total / 7, rounded to USD cents.

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10"; // Singapore
const SEASONAL_BAND = "oct";

const TIERS = [
  {
    tier: "budget",
    costLow: "118.80",
    costHigh: "208.82",
    note: "9 hotels: Hotel 81 Selegie (2-star), Hotel 81 Tristar (3-star), Hotel Boss (4-star), V Hotel Lavender (4-star), Hotel Chancellor@Orchard (3-star), Park View Hotel (3-star), Hmlet Cantonment (4-star), Coliwoo Orchard (3-star), York Hotel (4-star).",
  },
  {
    tier: "moderate",
    costLow: "223.37",
    costHigh: "343.57",
    note: "10 hotels: Four Points by Sheraton Singapore Jurong (4-star), VicHaus Serviced Apartment (4-star), Heritage Collection on Victoria (3-star), Furama RiverFront (4-star), Beverly Hotels Elements (3-star), Owen House by Hmlet (4-star), Furama City Centre (4-star), Village Hotel Albert Court by Far East Hospitality (4-star), The Snooze Hotel at Bugis (3-star), Mercure ICON Singapore City Centre (4-star).",
  },
  {
    tier: "splurge",
    costLow: "433.78",
    costHigh: "510.10",
    note: "4 hotels: Amara Singapore (5-star), Crowne Plaza Changi Airport by IHG (5-star), Orchard Rendezvous Hotel by Far East Hospitality (4-star), One Farrer Hotel (5-star).",
  },
  {
    tier: "luxury",
    costLow: "590.33",
    costHigh: "1349.08",
    note: "2 hotels (below the usual 3-minimum, seeded as an explicit user-approved exception 22 Jul 2026): Oxley Thanksgiving Residence (4-star), Marina Bay Sands (5-star, Singapore's signature luxury landmark, highest price of the whole 25-hotel sample by a wide margin).",
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
