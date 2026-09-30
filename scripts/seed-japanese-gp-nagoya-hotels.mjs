// Seed: planner_hotel_tier_cost for Japanese Grand Prix 2027 (Suzuka Circuit
// event; destination row: Suzuka, id 9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9).
//
// Research date: 22 Sep 2026. Source: Booking.com, "Nagoya, Japan" search,
// 7-night stay 7-14 Apr 2027 (eventStartDate-2 to +5, per skill fixed
// 7-night rule), sort order=review_score_and_price, filtered ht_id=204
// (Hotels only) + review_score>=70 (Good+ bucket), client-side filtered to
// >=50 real reviews. 19 qualifying hotels out of 20 raw cards (1 rejected
// for <50 reviews).
//
// 70/30 Nagoya/Suzuka split ABANDONED per founder's real-time decision:
// every "Suzuka" search variant tried (plain "Suzuka, Japan", "Suzuka
// Circuit, Japan", "Suzuka, Mie, Japan") geocoded to Chubu Centrair
// Airport/Tokoname, ~25km from the actual circuit and city center — no
// genuine distinct "Suzuka-area" hotel market exists on Booking.com.
// Confirmed consistent with this event's own "Where to Stay — Nagoya vs.
// the Suzuka Area" experience, which already states Suzuka's own hotel
// stock is thin and largely absorbed by F1 teams/media before public sale.
// Founder decision: seed 100% from the real Nagoya sample instead of
// forcing an artificial split against a search that won't produce one.
//
// Prices extracted as Booking's real 7-night total (confirmed via raw HTML
// inspection: "1 week, 2 adults" / "Price US$X" block, includes taxes/fees)
// then divided by 7 for the per-night rate this table stores.
//
// Tier mapping — joint decision with founder, real hotel-count/price
// findings below:
// - No 2-star hotels exist in the qualifying sample at all.
// - Real 3-star ($153.86-314.86/night) and 4-star ($179-489/night) ranges
//   overlap heavily — same adjacent-tier-overlap pattern as London/
//   Wimbledon 2027 (skill doc). Applied the same fix: pooled all 15 real
//   3-star + 4-star hotels, sorted by real per-night price, split the pool
//   in half by price rank — cheaper 8 = budget, pricier 7 = moderate.
// - Real 5-star hotels: 4 total. The Tower Hotel Nagoya priced at
//   $1,540.43/night — 142% above the next-highest 5-star ($635.29) and on
//   a thin 145-review base vs. 1,644-3,349 for the other three 5-star
//   hotels in this same sample — flagged as a likely placeholder/inflated
//   2027 rate, not real current market pricing, and excluded from the
//   initial real-range group.
// - Founder's explicit call: keep the real 3-hotel 5-star group
//   ($388.57-635.29/night: Nagoya Kanko Hotel, Nagoya Marriott Associa
//   Hotel, Nikko Style Nagoya) as SPLURGE rather than luxury, and bring
//   the excluded outlier (The Tower Hotel Nagoya) back in as LUXURY on its
//   own. This means luxury is seeded from a single real hotel — a
//   deliberate, explicit exception to the skill's normal "minimum 3 real
//   hotels per tier" rule, made knowingly by the founder for this one
//   tier. costLow = costHigh = $1,540.43 (a single real price, not a
//   fabricated range).
//
// Final tiers (all real, no fabricated numbers):
//   budget:   $153.86-$180.43/night (8 hotels, pooled 3-star+4-star cheaper half)
//   moderate: $214.14-$489.00/night (7 hotels, pooled 3-star+4-star pricier half)
//   splurge:  $388.57-$635.29/night (3 real 5-star hotels, outlier excluded)
//   luxury:   $1,540.43-$1,540.43/night (1 real 5-star hotel — The Tower
//             Hotel Nagoya — single-hotel exception, founder-approved)

import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9"; // Suzuka
const EDITION_YEAR = 2027;
const SEASONAL_BAND = "Apr";
const CURRENCY = "USD";

const rows = [
  { tier: "budget", costLow: 153.86, costHigh: 180.43 },
  { tier: "moderate", costLow: 214.14, costHigh: 489.00 },
  { tier: "splurge", costLow: 388.57, costHigh: 635.29 },
  { tier: "luxury", costLow: 1540.43, costHigh: 1540.43 },
];

for (const row of rows) {
  const [result] = await sql`
    INSERT INTO planner_hotel_tier_cost
      (destination_id, tier, cost_low, cost_high, seasonal_band, currency, edition_year, refresh_pass, last_updated)
    VALUES
      (${DESTINATION_ID}, ${row.tier}, ${row.costLow}, ${row.costHigh}, ${SEASONAL_BAND}, ${CURRENCY}, ${EDITION_YEAR}, 'initial', now())
    RETURNING tier, cost_low, cost_high, seasonal_band, currency, edition_year, refresh_pass
  `;
  console.log("Inserted:", result);
}

await sql.end();
