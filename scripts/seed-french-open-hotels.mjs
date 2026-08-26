import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerHotelTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "488adb47-5327-43e2-8206-d40480301962"; // Paris
const SEASONAL_BAND = "may";

// French Open 2027 hotel tier data — 20km NULL zone (Paris only, no
// satellite city), Booking.com, checkin 2027-05-21 / checkout 2027-05-28
// (7 nights), order=review_score_and_price + price-ascending cross-check,
// nflt=review_score=70;ht_id=204, >=50 real reviews filter applied
// client-side. Approved by founder 26 Aug 2026.
//
// Moderate/splurge: 3-star and 4-star price ranges overlapped almost
// completely ($185-384 vs $176-707) — same failure mode documented for
// London/Wimbledon 2027 in the skill. Applied the same fix: pooled all
// 3-star + 4-star hotels (31 total), sorted by real per-night price,
// split the pool in half by price rank (cheapest 16 = moderate, priciest
// 15 = splurge).
//
// Luxury: 4 genuine "palace" 5-star properties (Shangri-La, Le Bristol,
// Cheval Blanc, Four Seasons George V — $2,584-3,651/night) excluded as
// founder-approved outliers, not representative of a standard luxury
// tier. Remaining 3 real 5-star properties kept (right at the skill's
// minimum-3-per-tier floor).
const rows = [
  { tier: "budget", costLow: "121.00", costHigh: "182.00" },
  { tier: "moderate", costLow: "176.00", costHigh: "371.00" },
  { tier: "splurge", costLow: "384.00", costHigh: "707.00" },
  { tier: "luxury", costLow: "817.00", costHigh: "1659.00" },
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
