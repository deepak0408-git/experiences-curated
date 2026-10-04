import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerHotelTierCost } from "../schema/database.ts";

// Chinese Grand Prix 2027 (Shanghai, Apr 16-18 2027) hotel tier cost seeding.
// Researched 23 Sep 2026, per planner-data-researcher skill Hotels section.
//
// destinationId has nextClosestHotelDestinationId = NULL (Shanghai is its own
// booking base), but the pack's own already-published "Where to Stay —
// Jiading vs. Downtown Shanghai" experience (sportingEventId matches this
// event) frames the real trade-off as Jiading/circuit-adjacent vs Downtown —
// structurally like NYC's multi-neighborhood combined-pool sampling, not a
// satellite-venue 70/30 split. Curator-approved 23 Sep 2026.
//
// Booking.com searches, 7-night window (Apr 14-21 2027, eventStart-2 to +5):
//   "The Bund, Shanghai"        -> 13 qualifying (>=50 reviews)
//   "Anting, Shanghai"          -> 9 qualifying (>=50 reviews) — resolved
//                                  mostly to Hongqiao-area hotels; genuine
//                                  circuit-adjacent inventory with >=50
//                                  reviews is thin on Booking.com.
//   "Hyatt Regency Shanghai Jiading" (named in pack copy) — NOT findable on
//                                  Booking.com under this or any close name;
//                                  excluded, no sourceable price.
//   Courtyard Shanghai Jiading (named in pack copy, 26 reviews) — force-
//                                  included per skill's named-hotel rule
//                                  despite being below the 50-review filter.
//
// STAR RATING NOT AVAILABLE for Shanghai listings on Booking.com — confirmed
// via raw card HTML dump, not an extraction bug (no star markup present on
// any card, including branded international properties like Fairmont/
// Waldorf Astoria). Standard star-based bucketing is not possible for this
// destination. Curator-approved fallback, 23 Sep 2026: price-rank bucketing
// (same fallback mechanism the skill already documents for London's real
// budget/moderate star-overlap case) across the real, combined 23-hotel pool,
// split into 4 roughly-even price bands.
//
// KNOWN OPEN GAP, flagged to curator, not resolved by this script: the
// existing Shanghai "oct" rows (Shanghai Masters 2026, editionYear 2026,
// budget $40-91 up to luxury $147-548) have NO persisted seed script on
// disk, so their original search methodology cannot be verified. This
// script's April 2027 tiers run roughly 2x higher across the board. A plain
// "Shanghai" citywide query (tested 23 Sep 2026, same date window) returns
// unusable near-zero-review results (all flatlined at review score "10"),
// so that query type cannot explain or validate either dataset. The
// deviation may be genuine (F1 demand vs snooker Masters demand; narrower,
// intentionally area-targeted April sample vs whatever produced the Oct
// numbers), or the Oct numbers may themselves be unreliable. Curator
// decision 23 Sep 2026: proceed with this real, traceable April sample as-is
// rather than block on re-litigating Oct's unverifiable data. Revisit Oct's
// own numbers as a separate task.

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963"; // Shanghai
const EDITION_YEAR = 2027;
const SEASONAL_BAND = "apr";

const rows = [
  { tier: "budget", costLow: 83, costHigh: 103 },
  { tier: "moderate", costLow: 114, costHigh: 148 },
  { tier: "splurge", costLow: 154, costHigh: 252 },
  { tier: "luxury", costLow: 363, costHigh: 552 },
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

await db.insert(plannerHotelTierCost).values(values).onConflictDoNothing();

console.log(`Seeded ${values.length} planner_hotel_tier_cost rows for Chinese GP 2027 (Shanghai, ${SEASONAL_BAND} ${EDITION_YEAR}).`);
await client.end();
