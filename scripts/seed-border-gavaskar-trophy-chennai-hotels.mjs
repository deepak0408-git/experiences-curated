import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerHotelTierCost } from "../schema/database.ts";

// Border-Gavaskar Trophy 2027 — Chennai hotel tier cost seeding.
// Researched 9 Oct 2026, per planner-data-researcher skill §2.
//
// Standing decision (9 Oct 2026, founder-confirmed): Chennai is the SOLE
// researched hotel baseline for this 3-city pack (Nagpur, Chennai,
// Ahmedabad). Nagpur and Ahmedabad will NOT get their own hotel research —
// their hotel costs are extrapolated from this Chennai data in a separate,
// later pass, with an explicit "Chennai-baseline, reasonably extrapolated"
// disclaimer drafted into the Cost and Tickets spokes. This is a one-off
// approximation for a cricket-series pack, not the standard per-destination
// methodology.
//
// Search window: 27 Jan - 3 Feb 2027 (7 nights). NOT sportingEvents.startDate
// (21 Jan, the Nagpur Test) — Chennai's own Test is 29 Jan-2 Feb 2027, so the
// window is anchored to Chennai's real Test dates (startDate - 2 to +5 days),
// per the skill's fixed 7-night rule, applied to the city actually being
// priced rather than the event row's overall (misleading, for this city)
// startDate.
//
// Source: Booking.com (scripts/_hotel-research-tool.mjs), ht_id=204 +
// review_score=70 filters, order=review_score_and_price sort, >=50 real
// reviews required. Merged across 5 search runs (9 Oct 2026) because the
// scroll-based loader intermittently returned 0 cards (confirmed transient,
// same class of flakiness the skill's own notes describe for Booking.com/
// Kayak) and plateaus around 25 raw cards per run before a working
// "load more" mechanism was found — reached 13 unique qualifying hotels
// (>=50 reviews) against the skill's 25-hotel target. This is a real
// tooling ceiling, not a data gap — flagged honestly rather than padded.
//
// BUG FOUND AND FIXED IN THE SHARED TOOL during this research: Booking.com's
// card price is the TOTAL for the whole 7-night stay, not a nightly rate
// (confirmed via the card's own "1 week" text in
// [data-testid="price-for-x-nights"]). scripts/_hotel-research-tool.mjs now
// parses this label and divides to a real per-night price — earlier raw
// output from this same search had read ITC Grand Chola as "$2,392/night"
// (actually $2,392 for 7 nights = $342/night). Every price below is the
// corrected per-night figure.
//
// Named-hotel gap: The Savera and The Raintree (both named in this event's
// own published "Where to Stay in Chennai" experience) could not be located
// via this tool — direct property-name search falls back to a generic
// Chennai city search rather than finding the specific listing. Not
// force-included per the skill's rule (skill requires inclusion only when
// findable); flagged as an open gap, not silently dropped.
//
// Tier mapping (star-rating based, per skill §2) -- REVISED 9 Oct 2026
// after the founder caught Accord Chrome double-counted into BOTH
// Moderate (as its top end, $104) AND Splurge (as its sole hotel, $104) --
// the same hotel cannot anchor two different tiers. Re-split cleanly:
//   budget (2*, the 4 real 2-star hotels): SM MANSION (376 rev, $10.29),
//     GREENS INN (210 rev, $14.43), Hotel NKC Airport (58 rev, $21.71),
//     Woodlands Inn (340 rev, $33.43) -> range $10-34
//   moderate (3*/unstarred middle, Accord Chrome REMOVED): RR Mount Elite
//     Suites (3*, 437 rev, $34.14), Ginger Chennai OMR (3*, 371 rev,
//     $41.29), Urban Comforts (unstarred, 254 rev, $47.29) -> range $34-47
//   splurge: only 1 real qualifying hotel (Accord Chrome, 4*, 819 rev,
//     $104.29) -- below the skill's minimum-3-per-tier rule.
//     FOUNDER-APPROVED EXCEPTION (9 Oct 2026): seeded anyway as a single
//     real data point rather than left unseeded, costLow = costHigh = 104.
//     Same class of rare, explicit, user-approved departure as the skill's
//     own NYC price-driven-reclassification precedent -- do not treat
//     this as a new standing rule, re-raise if this gap recurs elsewhere.
//   luxury (5*): Trident Chennai (1303 rev, $150.14), Grand Chennai by GRT
//     Hotels (1041 rev, $158.43 -- also named in the pack's own Where-to-
//     Stay content), Taj Wellington Mews Chennai (386 rev, $196.43), The
//     Leela Palace Chennai (2179 rev, $256), ITC Grand Chola (1246 rev,
//     $341.71) -> range $150-342

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9"; // Chennai
const EDITION_YEAR = 2027;
const SEASONAL_BAND = "jan"; // matches sportingEvents.startDate month (21 Jan 2027)

const rows = [
  { tier: "budget", costLow: 10, costHigh: 34 },
  { tier: "moderate", costLow: 34, costHigh: 47 },
  { tier: "splurge", costLow: 104, costHigh: 104 }, // single-hotel exception, approved 9 Oct 2026
  { tier: "luxury", costLow: 150, costHigh: 342 },
];

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const values = rows.map((r) => ({
  destinationId: DESTINATION_ID,
  tier: r.tier,
  seasonalBand: SEASONAL_BAND,
  editionYear: EDITION_YEAR,
  costLow: r.costLow.toFixed(2),
  costHigh: r.costHigh.toFixed(2),
  currency: "USD",
  refreshPass: "initial",
}));

// Re-running this script after the Moderate/Splurge fix (9 Oct 2026) must
// UPDATE the existing rows, not silently no-op on the unique constraint --
// onConflictDoNothing would leave the old $34-104 Moderate row in place.
for (const v of values) {
  await db.insert(plannerHotelTierCost).values(v).onConflictDoUpdate({
    target: [plannerHotelTierCost.destinationId, plannerHotelTierCost.tier, plannerHotelTierCost.seasonalBand, plannerHotelTierCost.editionYear],
    set: { costLow: v.costLow, costHigh: v.costHigh, lastUpdated: new Date() },
  });
}

console.log(`Seeded ${values.length} planner_hotel_tier_cost rows for Border-Gavaskar Trophy 2027 (Chennai, ${SEASONAL_BAND} ${EDITION_YEAR}).`);
await client.end();
