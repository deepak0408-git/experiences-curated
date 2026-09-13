import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerHotelTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136"; // Doha
const SEASONAL_BAND = "nov";

// Qatar GP 2026 hotel tier data. Founder initially asked for a 50/50
// Lusail/Doha zone split (destinations.next_closest_hotel_destination_id
// is NULL for Doha, and Lusail has no destinations row of its own — same
// shape as Milan/Monza). Unlike Milan/Monza, the two Booking.com searches
// ("Lusail, Qatar" vs "Doha, Qatar") returned near-identical hotel pools —
// Lusail is not a distinct enough search area to separate from Doha.
// Founder confirmed (13 Sep 2026): treat as one combined Doha-wide market,
// no zone split.
//
// Booking.com, checkin 2026-11-25 / checkout 2026-12-02 (7 nights),
// order=review_score_and_price, nflt=review_score=70;ht_id=204, >=50 real
// reviews filter applied client-side. 74 unique qualifying hotels across
// both searches (scripts/_hotel-research-tool.mjs).
//
// Star rating failed the skill's >=3-per-tier rule (only 4 real 3-star
// hotels, zero 2-star, vs 58 hotels at 5-star spanning $138-$1,920/night)
// — a genuine Doha market characteristic (luxury-heavy), not a scrape
// error. Tiered by real per-night price instead, with boundaries chosen
// by the founder from the actual sorted price list (not a mechanical
// quartile cut):
// - budget/moderate: no sharp density gap in the $79-279 range (smooth
//   climb) — founder set the line at $185/$186.
// - splurge/luxury: real 23% price jump from Banyan Tree Doha ($395) to
//   Swissotel Corniche Park Towers ($486) — founder confirmed this as the
//   split point.
// - Katara Hills Doha, LXR Hotels & Resorts ($1,920/night) excluded
//   entirely — founder capped luxury at $1,076 (Le Royal Meridien Place
//   Vendome Lusail) and dropped this one outlier rather than raising the
//   cap or inventing a 5th tier.
//
// Raffles Doha and Four Seasons Hotel Doha (both named in the pack's own
// confirmed accommodation experience list, #12) land in luxury — matches
// existing editorial pick.
const rows = [
  { tier: "budget", costLow: "79.00", costHigh: "185.00" },
  { tier: "moderate", costLow: "186.00", costHigh: "279.00" },
  { tier: "splurge", costLow: "283.00", costHigh: "395.00" },
  { tier: "luxury", costLow: "486.00", costHigh: "1076.00" },
];

const inserted = await db
  .insert(plannerHotelTierCost)
  .values(rows.map((r) => ({
    destinationId: DESTINATION_ID,
    tier: r.tier,
    seasonalBand: SEASONAL_BAND,
    costLow: r.costLow,
    costHigh: r.costHigh,
    currency: "USD",
  })))
  .returning();

console.log("Inserted:", JSON.stringify(inserted, null, 2));
await client.end();
