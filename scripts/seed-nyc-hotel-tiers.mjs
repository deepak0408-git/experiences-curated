import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real hotel tier data for New York (US Open 2026), researched 21 Jul 2026
// per the planner-data-researcher skill's Hotels methodology.
//
// nextClosestHotelDestinationId: NULL (New York is its own genuine fan
// booking base -- not a satellite/venue-adjacent destination).
//
// Search window: 7-night fixed stay, eventStartDate-2 to eventStartDate+5
// (US Open starts Aug 30 2026): Aug 28 - Sep 4, 2026.
//
// SOURCE LIMITATION -- flagged openly, not a silent gap: prices below are
// BOOKING.COM ONLY. Expedia, Hotels.com, and Kayak were all tested and
// failed for different confirmed reasons (Expedia/Hotels.com genuinely
// bot-blocked; Kayak is not an independent source, it redirects straight
// to Booking.com's own search results). Google Hotels automation proved
// unreliable (currency follows request IP geolocation not URL params;
// results non-deterministically fall back to generic city search instead
// of the specific hotel page) -- this remains an OPEN TODO to fix before
// scaling past a handful of destinations. See planner-data-researcher
// skill section 2 for full detail.
//
// Sample: Booking.com, ht_id=204 (Hotels property-type filter, mandatory
// -- fixes a real result-instability bug found the same day), sorted by
// order=review_score_and_price (closest available substitute for "guest
// rating high to low" -- Booking has no pure rating-only sort), filtered
// to >=50 real reviews. 24 organic hotels (Cambria Hotel New York Times
// Square dropped -- only 2 reviews, fails the >=50 threshold) + 2 of 4
// pack-recommended hotels force-included (Boro Hotel and Hyatt Grand
// Central New York had no Booking.com availability for this date window --
// likely sold out this far out -- flagged as an honest gap, not silently
// substituted; Four Points by Sheraton Flushing and Hilton Garden Inn LIC
// ARE included).
//
// Bucketing: anchored to real star rating (never inferred from price).
// EXCEPTION, user-approved 21 Jul 2026: Riverside Tower Hotel (officially
// 2-star, Booking.com) and The Bayard (officially 3-star) both priced at
// genuine luxury levels ($706 and $740/night respectively) -- reclassified
// into the luxury tier by real price rather than left in their official
// star bucket. This is a deliberate, rare departure from "never infer tier
// from price alone," explicitly decided by the user, not a default rule.
//
// All prices = 7-night Booking.com total / 7, rounded to whole dollars.

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York

const TIERS = [
  {
    tier: "budget",
    costLow: "221.00",
    costHigh: "388.00",
    note: "9 hotels, 3-star: Hyatt House Chelsea, U Hotel 5th Ave, La Quinta Times Sq South, Courtyard Times Sq West, Days Inn Chinatown, Hotel Stanford, Hampton Inn Times Sq South, Hilton Club Central 5th, Hilton Garden Inn LIC.",
  },
  {
    tier: "moderate",
    costLow: "246.00",
    costHigh: "348.00",
    note: "9 hotels, 4-star: Element by Marriott, Artezen, Club Quarters Times Sq, Cloud One Downtown, Riu Plaza Manhattan, Hyatt Regency Times Sq, M Social Times Sq, Romer Hell's Kitchen, Four Points Sheraton Flushing.",
  },
  {
    tier: "splurge",
    costLow: "400.00",
    costHigh: "558.00",
    note: "4 hotels: Soho Grand (4-star), The Marlton (4-star), Bryant Park Hotel (4-star), The Westin Times Square (5-star).",
  },
  {
    tier: "luxury",
    costLow: "706.00",
    costHigh: "884.00",
    note: "4 hotels: The Wall Street Hotel (5-star), The Wallace Hotel (5-star), Riverside Tower Hotel (price-reclassified from 2-star), The Bayard (price-reclassified from 3-star).",
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
