import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real hotel tier data for St Andrews (Alfred Dunhill Links Championship
// 2026), researched 22 Jul 2026 per the planner-data-researcher skill's
// Hotels methodology.
//
// Search window: 7-night fixed stay, eventStartDate-2 to eventStartDate+5
// (Dunhill Links starts 1 Oct 2026): Sep 29 - Oct 6, 2026. seasonalBand = "oct".
//
// ZONE DECISION (22 Jul 2026): St Andrews was flagged in the skill as
// "NULL for now, explicitly unvalidated" -- resolved this pass. The event
// spans 3 courses (St Andrews Old Course, Carnoustie, Kingsbarns) with real
// driving distances comparable to Milan-Monza (~13 miles/21km to Dundee).
// User decision: create a minimal Dundee destination row (name/region/
// currency only, no experiences/event-builder -- no future sporting events
// expected there) and link St Andrews -> Dundee via
// nextClosestHotelDestinationId, same structural pattern as Milan->Monza.
// See scripts/add-dundee-destination.mjs.
//
// Zone split: St Andrews pool (town + nearby Fife + Carnoustie, 18 hotels)
// + Dundee pool (13 hotels, the real anchor city) = 31 total qualifying
// candidates, treated as ONE combined bucketing pool (same approach as
// Milan/Monza) rather than kept separate.
//
// PRE-CHECK: event's own pack has ZERO existing accommodation experiences
// -- clean slate, no pack hotels to force-include.
//
// SOURCE LIMITATION -- Booking.com only, same documented single-source gap
// as every other destination.
//
// Sample: Booking.com, ht_id=204, sorted by order=review_score_and_price,
// search scoped to "St Andrews, Fife, Scotland" (wide Fife/Dundee radius
// intentionally kept per user decision -- reflects how a real Dunhill
// Links fan actually searches for lodging across tournament week). 35 raw
// results, 4 excluded for <50 reviews (The Kithmore, OYO Ashlea Manor,
// Aboukir Hotel, The Balfour by Coorie Doon Stays), 31 qualifying.
//
// Bucketing: this dataset had the cleanest natural price gaps of any
// destination researched so far -- used real gap boundaries ($102/$222,
// $222/$237, $448/$702) rather than forcing a strict star-band split.
// Two hotels moved by price over their official star rating, same
// exception pattern as prior destinations: The Albany St Andrews
// (officially 3-star, $406.70 -- priced into splurge) and Hotel Du Vin
// St Andrews (officially 4-star, $931.44 -- priced into luxury, above
// every genuine 5-star hotel in the sample).
//
// CURRENCY: USD directly, 1 INR = 0.01039 USD (21 Jul 2026 Frankfurter
// rate). See feedback_planner_seeds_usd_only.md.
//
// All prices = 7-night Booking.com total / 7, rounded to USD cents.

const DESTINATION_ID = "6672a395-f471-4b9e-9d1a-0f567441470a"; // St Andrews
const SEASONAL_BAND = "oct";

const TIERS = [
  {
    tier: "budget",
    costLow: "55.35",
    costHigh: "96.26",
    note: "5 hotels: Railway Inn (unstarred), Longforgan Coaching Inn (3-star, Dundee-area), go2 Dundee Camperdown Hotel (2-star), Lomond Hills Hotel & Health Club (unstarred), Monifieth Farm Hotel (unstarred).",
  },
  {
    tier: "moderate",
    costLow: "102.13",
    costHigh: "221.59",
    note: "18 hotels: Corner Hotel (3-star), The Landmark Hotel and SPA Leisure Club Dundee (4-star), Four Points Flex by Sheraton Dundee (3-star), Best Western Queens Hotel (3-star), Holiday Inn Express Dundee by IHG (3-star), The Fort Hotel (2-star, priced into moderate), THE COASTAL INN ACCOMMODATIONs (3-star), Hotel Indigo - Dundee by IHG (4-star), 19th Hole Hotel Carnoustie (unstarred), The Clarendon (4-star), Malmaison Dundee (4-star), Hampton by Hilton Dundee City Centre (3-star), Harbour Inn (4-star), Old Manor Hotel (4-star), Casa Fresa - Orchar Suites (unstarred), Apex City Quay Hotel & Spa (4-star), Staybridge Suites - Dundee by IHG (4-star), The Inn At Lathones (3-star).",
  },
  {
    tier: "splurge",
    costLow: "236.78",
    costHigh: "447.60",
    note: "5 hotels: Carnoustie Golf Hotel (4-star), The Upper Largo Hotel & Restaurant (4-star), The Crusoe (unstarred, genuinely splurge-priced), The Albany St Andrews (officially 3-star, moved here by price -- $406.70 sits well above the rest of the 3-star band), Fairmont St Andrews (5-star, priced into splurge rather than luxury this sample).",
  },
  {
    tier: "luxury",
    costLow: "702.16",
    costHigh: "945.39",
    note: "3 hotels: Kinnettles Hotel & Spa (5-star), Hotel Du Vin St Andrews (officially 4-star, moved here by price -- $931.44 exceeds every genuine 5-star hotel in the sample), Seaton House Small Luxury Hotels of the World (5-star, highest price in the sample).",
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
