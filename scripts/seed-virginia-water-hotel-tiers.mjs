import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real hotel tier data for Virginia Water / Surrey (BMW PGA Championship 2026),
// researched 22 Jul 2026 per the planner-data-researcher skill's Hotels
// methodology.
//
// Search window: 7-night fixed stay, eventStartDate-2 to eventStartDate+5
// (BMW PGA starts 17 Sep 2026): Sep 15 - Sep 22, 2026.
//
// PRE-CHECK done correctly this time (before any search, unlike the Milan
// miss earlier in the project -- see feedback_follow_documented_process_
// before_acting.md): pulled the event's own published pack accommodation
// experiences first. 2 pack-recommended hotels force-included: Coworth
// Park, Ascot and Wheatsheaf Hotel, Virginia Water. Both were genuinely
// sold out for the exact Sep 15-22 window (zero alternate dates shown,
// unlike Milan's Hotel de la Ville) -- user-approved workaround: shifted
// the search 1 week earlier (Sep 8-15) to get a real, if slightly
// off-window, anchor price for both. Flagged per-hotel below.
//
// SOURCE LIMITATION -- Booking.com only, same documented single-source gap
// as NYC and Milan.
//
// Sample: Booking.com, ht_id=204 (Hotels property-type filter), sorted by
// order=review_score_and_price. 24 hotels from the sort (excluding "Swan
// Inn, Heathrow Airport" -- score 2.5, hostel-grade, excluded as not a
// genuine comparable despite passing the raw review-count threshold) + 2
// force-included pack hotels = 26 total.
//
// CURRENCY FIX (22 Jul 2026): originally seeded in GBP -- wrong. The
// Planner is entirely USD-based regardless of destination local currency
// (see feedback_planner_seeds_usd_only.md). Booking.com's displayed
// currency follows request IP geolocation, not URL params (same known
// behavior documented for every destination). Values below are corrected:
// INR display -> GBP (1 INR = 0.00775 GBP, 21 Jul 2026 Frankfurter rate)
// -> USD (1 GBP = 1.3401 USD, same-day rate).
//
// Bucketing: star rating first (official Booking.com star badge), then
// price splits within each star band. This dataset separated far more
// cleanly by star than Milan's did -- 3-star cluster £64-204, 4-star
// cluster £105-258, one clean 5-star outlier at £998 -- so star bands and
// price bands mostly agree here; only 4 unstarred hotels (apartment/pub-
// hotel-style listings with no official star badge) were placed purely by
// price, same exception pattern as Milan.
//
// KNOWN GAP: luxury tier has only 1 qualifying hotel (Coworth Park),
// below the methodology's stated minimum of 3. Seeded anyway per explicit
// user instruction 22 Jul 2026 -- Coworth Park is a genuine Dorchester
// Collection 5-star property, real evidence it belongs in luxury even
// alone, not a fabricated range. Same class of exception as Milan's
// 2-hotel budget tier.
//
// All prices converted to USD, 7-night Booking.com total / 7.

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7"; // Surrey/Virginia Water

const TIERS = [
  {
    tier: "budget",
    costLow: "85.77",
    costHigh: "125.97",
    note: "4 hotels, 3-star: ibis budget London Heathrow Central, Warren Lodge, B&B HOTEL London Heathrow, Hotel Manor (Datchet, Windsor).",
  },
  {
    tier: "moderate",
    costLow: "140.71",
    costHigh: "192.97",
    note: "11 hotels: Delta Hotels by Marriott Heathrow Windsor (4-star), The Station (unstarred, placed by price), Macdonald Frimley Hall Hotel & Spa (4-star), The Wheatsheaf by Innkeeper's Collection (4-star), Village Hotel Bracknell (4-star), Holiday Inn Express London Heathrow T5 (3-star), The Prince Albert Pub & Hotel (unstarred, placed by price), Wheatsheaf Hotel Virginia Water (3-star, pack-recommended, priced from a 1-week-earlier window -- exact Sep 15-22 dates sold out), Goswell House Hotel Windsor (3-star), Best Western Ship Hotel (3-star), Holiday Inn London-Shepperton (unstarred, placed by price).",
  },
  {
    tier: "splurge",
    costLow: "203.70",
    costHigh: "345.75",
    note: "10 hotels: Hand and Spear (4-star), Crown Hotel (unstarred, placed by price), The Christopher Hotel Eton (3-star), Holiday Inn Express Windsor (3-star), LEGOLAND Windsor Resort (4-star), Sunday London Staines-upon-Thames Heathrow T5 (3-star), The Royal Adelaide Hotel (4-star), Sir Christopher Wren Hotel (4-star), The Swan Hotel (4-star), Macdonald Windsor (4-star).",
  },
  {
    tier: "luxury",
    costLow: "1337.42",
    costHigh: "1337.42",
    note: "1 hotel (below the usual 3-minimum, seeded as an explicit user-approved exception 22 Jul 2026): Coworth Park, Ascot -- Dorchester Collection, 5-star, 9.7 rating (324 reviews), pack-recommended. Priced from a 1-week-earlier window (Sep 8-15) since the exact Sep 15-22 dates showed zero availability with no alternate dates offered.",
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
