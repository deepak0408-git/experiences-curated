import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerHotelTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c"; // Mexico City
const SEASONAL_BAND = "oct";

// Mexico City GP 2026 hotel tier data — 100% Mexico City, no satellite-zone
// split (destinations.nextClosestHotelDestinationId is NULL; the circuit
// sits inside Iztacalco, a genuine Mexico City neighborhood, confirmed
// against the pack's own Where to Stay content, which recommends Roma
// Norte/Condesa/Polanco, none circuit-adjacent). Booking.com, checkin
// 2026-10-28 / checkout 2026-11-04 (7 nights), order=review_score_and_price,
// nflt=review_score=70;ht_id=204, >=50 real reviews filter applied
// client-side. The default 25-card page loads via scroll only — Booking.com
// now requires clicking "Load more results" for a real 51-hotel sample (75
// raw cards); the existing _hotel-research-tool.mjs stalls at 25 and needs
// a load-more-aware pass added — flagged for the skill, not yet fixed there.
// Approved by founder 6 Sep 2026.
//
// Tiered by real per-night price rather than star rating alone — Mexico
// City's star ratings didn't cleanly separate price bands (a 4-star hotel
// at $56/night and a 4-star at $453/night both existed in the same sample).
//
// 6 hotels named in the pack's own Where to Stay content (La Valise, NaNa
// Vida CDMX, Hotel Condesa df, Casa Cuenca, Las Alcobas, JW Marriott
// Polanco) were individually looked up and confirmed real/open/correctly
// located — but only NaNa Vida CDMX ($164-$300/night range, lands in
// Moderate) returned a usable price for these exact dates. La Valise and
// Las Alcobas are genuinely sold out/unavailable on Booking.com for this
// window; Condesa df, JW Marriott Polanco, and Casa Cuenca returned no
// price in the lookup pass. Per founder instruction, no price was invented
// for any of these — they are not part of the seeded ranges.
const rows = [
  { tier: "budget", costLow: "56.00", costHigh: "160.00" },
  { tier: "moderate", costLow: "164.00", costHigh: "297.00" },
  { tier: "splurge", costLow: "303.00", costHigh: "418.00" },
  { tier: "luxury", costLow: "432.00", costHigh: "791.00" },
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
