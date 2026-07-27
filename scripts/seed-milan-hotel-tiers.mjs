import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real hotel tier data for Milan (Italian GP 2026), researched 21 Jul 2026
// per the planner-data-researcher skill's Hotels methodology.
//
// Zone pattern: Milan/Monza satellite-venue split, manual 70/30 (no
// nextClosestHotelDestinationId link -- Monza is not a standalone
// user-facing destination in the app). This script seeds Milan (the 70%
// anchor-city pool) only; Monza-area hotels are a separate destination
// concept and not seeded to planner_hotel_tier_cost under this destination_id.
//
// Search window: 7-night fixed stay, eventStartDate-2 to eventStartDate+5
// (Italian GP starts 4 Sep 2026): Sep 2 - Sep 9, 2026.
//
// SOURCE LIMITATION -- Booking.com only, same documented gap as NYC.
//
// Sample: Booking.com, ht_id=204 (Hotels property-type filter), sorted by
// order=review_score_and_price. 21 Milan hotels total: 18 from the sort,
// plus 3 force-included pack-recommended hotels (Hyatt Centric Milan
// Centrale, Hilton Milan, BB Hotels Smarthotel Re Milano Nord) per the
// event's own published PackView accommodation experiences.
//
// One pack hotel (Holiday Inn Milan Nord Zara, Monza-area not Milan) was
// dropped from the dataset 21 Jul 2026 -- user judgment call: mainstream
// mid-market brand priced at the highest rate of all 29 hotels researched,
// a brand/price mismatch suspicious enough to exclude rather than trust.
//
// Bucketing: star rating first (official Booking.com star badge), then
// price splits within each star band -- NOT pure price percentile, per
// methodology. 4 unstarred hotels (apartment/residence-style listings with
// no official star badge) placed purely by price, user-approved 21 Jul 2026.
// TheROOMS by TheFLOOR Collection (officially 1-star) placed in splurge by
// price/boutique branding rather than its literal star badge, user-approved
// same day -- a documented departure from "never infer tier from price
// alone," same class of exception as NYC's Riverside Tower/The Bayard.
//
// KNOWN GAP: budget tier has only 2 qualifying hotels, below the
// methodology's stated minimum of 3. Seeded anyway per explicit user
// instruction 21 Jul 2026 (dataset skewed hard to 4-star; this is a
// deliberate exception, not a silent violation of the rule).
//
// CURRENCY FIX (22 Jul 2026): originally seeded in EUR -- wrong. The
// Planner is entirely USD-based regardless of destination local currency
// (see feedback_planner_seeds_usd_only.md). Values below are corrected to
// USD: 7-night Booking.com total / 7, converted INR display -> EUR
// (1 INR = 0.0091 EUR, 21 Jul 2026 Frankfurter rate) -> USD
// (1 EUR = 1.1418 USD, same-day rate).

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan

const TIERS = [
  {
    tier: "budget",
    costLow: "179.26",
    costHigh: "213.52",
    note: "2 hotels (below the usual 3-minimum, seeded as an explicit exception): The Best Hotel (2-star), Hotel Domenichino (3-star).",
  },
  {
    tier: "moderate",
    costLow: "180.40",
    costHigh: "298.01",
    note: "7 hotels: Amedia Hotel Milan (4-star), Milan Suite Hotel (4-star), Privilege Apartments (unstarred, placed by price), c-hotels Rubens (4-star), Residenze Italia (4-star), UNA Hotels Galles Milano (4-star), Hotel de la Ville (4-star, pack-recommended, Monza-area but included here as the closest price band).",
  },
  {
    tier: "splurge",
    costLow: "308.29",
    costHigh: "596.02",
    note: "16 hotels: La Bergamina Hotel & Restaurant (unstarred), B&B Hotel Milano City Center Duomo (3-star), Residence Inn by Marriott Milano Linate (unstarred), BB Hotels Smarthotel Re Milano Nord (4-star, pack-recommended), 21 House of Stories Navigli (4-star), TheROOMS by TheFLOOR Collection (1-star, placed by price/branding exception), Residence Oasi Di Monza (4-star), BB Hotels Smarthotel Missori (4-star), Hotel Calimala Milano (4-star), Mokinba Hotels King (4-star), The FLOOR (3-star), Energy Park Hotel (4-star), Starhotels Echo (4-star), Mercure Milano Agrate Brianza (4-star), Room Mate Collection Giulia (4-star), Hilton Milan (4-star, pack-recommended).",
  },
  {
    tier: "luxury",
    costLow: "733.04",
    costHigh: "810.68",
    note: "3 hotels: Casa Laveni (unstarred, placed by price), Radisson Collection Hotel Santa Sofia Milan (5-star), Hyatt Centric Milan Centrale (4-star, pack-recommended, isolated by a real price gap from the rest of the 4-star band).",
  },
];

for (const t of TIERS) {
  const result = await sql`
    INSERT INTO planner_hotel_tier_cost (destination_id, tier, cost_low, cost_high, refresh_pass)
    VALUES (${DESTINATION_ID}, ${t.tier}, ${t.costLow}, ${t.costHigh}, 'initial')
    ON CONFLICT (destination_id, tier) DO UPDATE SET
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      refresh_pass = EXCLUDED.refresh_pass,
      last_updated = NOW()
    RETURNING tier
  `;
  console.log(`✓ ${result[0].tier} seeded`);
}

const rows = await sql`
  SELECT tier, cost_low, cost_high, refresh_pass
  FROM planner_hotel_tier_cost
  WHERE destination_id = ${DESTINATION_ID}
  ORDER BY tier
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
