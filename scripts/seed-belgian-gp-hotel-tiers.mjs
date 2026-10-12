import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { plannerHotelTierCost } from "../schema/database.ts";

// Belgian GP 2027 hotel tier seeding — planner-data-researcher skill §2.
// Satellite-venue pattern (same structural shape as Milan/Monza): no
// nextClosestHotelDestinationId DB link created, since neither Spa nor
// Stavelot has its own destinations row. Pool combines 3 Booking.com
// searches (Spa, Stavelot, Liege — Liege added after Spa+Stavelot alone
// returned only 7 real qualifying hotels, too thin for the 3-per-tier
// minimum), 21-28 Jul 2027 (7 nights), order=review_score_and_price,
// ht_id=204 + review_score>=70 filter.
//
// 3 genuinely distant outliers excluded (Blanckthys Hotel Voeren, Cafe
// Coureur Borgloon, Klappoel - by Cafe Rene Borgloon — 50-80km further
// out, different province, not real Liege/venue-area options). 2 cross-
// search duplicates deduped (Hotel Dufays, Hotel Verviers Van der Valk
// appeared in both Spa and Stavelot searches). Final pool: 21 real hotels.
//
// Bucketed by PRICE QUARTILE, not star rating -- star rating did not
// correlate with price in this market (e.g. Hotel Dufays, officially 3
// star, priced at $686/night; several 4-star hotels at $148-250), founder-
// approved departure from the standard star-anchored rule, 12 Oct 2026.
// No genuine 5-star property exists in this market; "luxury" here is the
// real top-priced tier, not a 5-star standard.
//
// Representative hotel named per tier (for later Cost spoke copy), drawn
// directly from the researched pool:
//   budget:   Hotel Mosa ($105/night)
//   moderate: Park Inn by Radisson Liege Airport ($254/night)
//   splurge:  Domaine des Thermes ($406/night)
//   luxury:   Hotel Verviers Van der Valk ($789/night)
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "101b815a-ba64-4484-aad6-63721a44ed85"; // Belgian Ardennes
const EDITION_YEAR = 2027;
const SEASONAL_BAND = "jul";
const CURRENCY = "USD";

const TIERS = [
  { tier: "budget", costLow: 105, costHigh: 172 },
  { tier: "moderate", costLow: 206, costHigh: 261 },
  { tier: "splurge", costLow: 262, costHigh: 406 },
  { tier: "luxury", costLow: 451, costHigh: 789 },
];

const values = TIERS.map((t) => ({
  destinationId: DESTINATION_ID,
  tier: t.tier,
  seasonalBand: SEASONAL_BAND,
  editionYear: EDITION_YEAR,
  costLow: String(t.costLow),
  costHigh: String(t.costHigh),
  currency: CURRENCY,
  refreshPass: "initial",
}));

const inserted = await db
  .insert(plannerHotelTierCost)
  .values(values)
  .onConflictDoUpdate({
    target: [plannerHotelTierCost.destinationId, plannerHotelTierCost.tier, plannerHotelTierCost.seasonalBand, plannerHotelTierCost.editionYear],
    set: {
      costLow: sql`excluded.cost_low`,
      costHigh: sql`excluded.cost_high`,
      currency: sql`excluded.currency`,
      lastUpdated: new Date(),
    },
  })
  .returning({ tier: plannerHotelTierCost.tier, costLow: plannerHotelTierCost.costLow, costHigh: plannerHotelTierCost.costHigh });

console.log(`✓ Seeded ${inserted.length} hotel tier rows for Belgian Ardennes (edition ${EDITION_YEAR}, band ${SEASONAL_BAND})`);
inserted.forEach((r) => console.log(`  ${r.tier}: $${r.costLow}-${r.costHigh}`));
await client.end();
