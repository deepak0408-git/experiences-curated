import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerHotelTierCost } from "../schema/database.ts";

// Hungarian GP 2027 — Budapest hotel-tier cost seed.
// planner-data-researcher skill, §2 (Hotels).
//
// Zone logic: destinations.nextClosestHotelDestinationId is NULL for
// Budapest (confirmed via DB check, 16 Oct 2026) — single-zone, 100%
// Budapest sample, no 70/30 split. Confirmed against the pack's own
// "Staying in Pest" experience copy, which explicitly calls Pest "the
// default base for race weekend" — Gödöllő (a single named hotel in the
// pack, no destination row of its own) is an edge case, not a genuine
// second hotel market, same shape as the Lake Como exclusion on Italian GP.
// User-approved 16 Oct 2026.
//
// METHODOLOGY DEVIATION, user-approved 16 Oct 2026: the real race-weekend
// search window (2027-07-28 to 2027-08-04, eventStartDate-2 to +5) returned
// only 24 qualifying hotels under the locked review_score>=70 + ht_id=204
// filter, almost all 4-5 star/boutique — budget tier (2-3 star) had only 2
// qualifying hotels, below the skill's 3-hotel minimum. Researched the week
// PRIOR to race weekend instead (2027-07-21 to 2027-07-28, same 7-night
// window, same filters) as an off-peak proxy to get a fuller, more
// representative sample — these are indicative planning figures, not exact
// race-weekend pricing. Source: Booking.com, order=review_score_and_price,
// nflt=review_score=70;ht_id=204, >=50 real reviews, fetched 16 Oct 2026.
//
// Tiering deviation: star rating does not cleanly separate this sample
// (only 1 real 3-star hotel; rest is a 4-star/5-star/unrated-apartment mix)
// — same class of exception as the London budget/moderate star-overlap
// precedent, but resolved here by natural price-gap clustering rather than
// a 50/50 pool split, since the real gaps in the data line up cleanly:
//   Budget:   $76-$91   (Anna Hotel 4*, ibis Budapest Stadium 3*, Spirit Apartments unrated)
//   Moderate: $146-$254 (Maison Bistro 4*, Grand Budapest Apartments 4*, Budapest Downtown
//                        Residences unrated, Brody House unrated, Emerald Downtown Suites
//                        unrated, Hotel Vision 4*, Hotel Collect 4*, BasiliQ 4*,
//                        Bagatelle Gardenhouse unrated, Kimpton BEM 5*)
//   Splurge:  $287-$528 (Hotel Moments 4*, Wonder 4*, Aria Hotel 5*, Parisi Udvar/Hyatt 5*,
//                        Matild Palace 5*)
//   Luxury:   $604-$1,106 (Mamaison Chain Bridge 4*, Apartments Kozmo Residences 5*,
//                        BoHo 4*, Kozmo Hotel Suites & Spa 5*)
// User-approved 16 Oct 2026.
//
// seasonalBand: "jul" (lowercase) — confirmed against existing DB rows,
// all of which use lowercase month abbreviations (jan/feb/.../dec), not
// "Jul". Keyed to the event's own calendar month (startDate 2027-07-30).

const BUDAPEST_DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EDITION_YEAR = 2027;

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = [
  {
    destinationId: BUDAPEST_DESTINATION_ID,
    tier: "budget",
    seasonalBand: "jul",
    editionYear: EDITION_YEAR,
    costLow: "76.00",
    costHigh: "91.00",
    currency: "USD",
    refreshPass: "initial",
  },
  {
    destinationId: BUDAPEST_DESTINATION_ID,
    tier: "moderate",
    seasonalBand: "jul",
    editionYear: EDITION_YEAR,
    costLow: "146.00",
    costHigh: "254.00",
    currency: "USD",
    refreshPass: "initial",
  },
  {
    destinationId: BUDAPEST_DESTINATION_ID,
    tier: "splurge",
    seasonalBand: "jul",
    editionYear: EDITION_YEAR,
    costLow: "287.00",
    costHigh: "528.00",
    currency: "USD",
    refreshPass: "initial",
  },
  {
    destinationId: BUDAPEST_DESTINATION_ID,
    tier: "luxury",
    seasonalBand: "jul",
    editionYear: EDITION_YEAR,
    costLow: "604.00",
    costHigh: "1106.00",
    currency: "USD",
    refreshPass: "initial",
  },
];

await db.insert(plannerHotelTierCost).values(rows).onConflictDoNothing();

console.log(`Seeded ${rows.length} planner_hotel_tier_cost rows for Budapest (Hungarian GP 2027, edition ${EDITION_YEAR}).`);

await client.end();
