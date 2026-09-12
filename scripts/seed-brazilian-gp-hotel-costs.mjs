import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerHotelTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb"; // Sao Paulo
const SEASONAL_BAND = "nov"; // Brazilian GP 2026 event month

// Researched via planner-data-researcher skill's locked Hotels methodology,
// 12 Sep 2026. Sao Paulo is 100% the search location (nextClosestHotelDestinationId
// is NULL — genuine fan booking base, no satellite-city split), per founder
// instruction. Booking.com, 7-night window (4-11 Nov 2026, event dates
// 6-8 Nov +/-2/+5), order=review_score_and_price, ht_id=204 filter, >=50
// reviews. Two fetches confirmed stable (33/35 overlap).
//
// Budget/Moderate/Splurge: star rating didn't separate price cleanly in
// this market (same failure mode as London/Wimbledon 2027) -- 22 real
// hotels (flats/apartments/hostels excluded from the 35-37 hotel raw pool)
// split into 3 equal price-rank groups instead, per that precedent.
//
// Luxury: none of the 3 lower tiers' search results surfaced a genuine 5-star
// property at all -- checked candidates directly on each hotel's own
// Booking.com page instead (surfaced via Hotel Emiliano's own "similar
// properties" panel, since Emiliano itself -- our pack's recommended luxury
// stay -- has genuinely NO availability for the real event dates).
// Hotel Fasano Sao Paulo ($2,117/night, "1 room left") excluded from the
// seeded range per founder decision (12 Sep 2026) -- real but too much of an
// outlier scarcity price to represent the tier; George V Casa Branca,
// Canopy By Hilton Sao Paulo Jardins, and The Westin Sao Paulo (all 3 with
// real confirmed event-date availability) form the seeded luxury range.
const rows = [
  { tier: "budget", low: 42, high: 112 },
  { tier: "moderate", low: 127, high: 208 },
  { tier: "splurge", low: 210, high: 311 },
  { tier: "luxury", low: 415, high: 730 },
];

for (const r of rows) {
  await db.insert(plannerHotelTierCost).values({
    destinationId: DESTINATION_ID,
    tier: r.tier,
    seasonalBand: SEASONAL_BAND,
    costLow: r.low.toFixed(2),
    costHigh: r.high.toFixed(2),
    currency: "USD",
  }).onConflictDoNothing();
  console.log(`Seeded: ${r.tier} — $${r.low}-${r.high}/night`);
}

console.log(`\n✓ 4 hotel tiers seeded for Sao Paulo (Brazilian GP), seasonal band "${SEASONAL_BAND}".`);
console.log("Note: Hotel Emiliano (pack's recommended luxury stay) has no real availability for event dates — luxury tier built from 3 other confirmed-available 5-star alternatives instead.");

await client.end();
