import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { tripIntelligenceGrandPrixProfiles, tripIntelligenceEngineConfigurations } from "../schema/database.ts";
import { eq } from "drizzle-orm";

// Applies the 5 approved C06B (Trip Extension) rating corrections from the
// "E|C Trip Intelligence — Implementation Revision" spec (Change 6, 11 Oct
// 2026). Editorial changes only — not algorithmic. Touches only the named
// 5 rows' C06B subdimension; no other characteristic, subdimension, or GP
// is modified. Re-runnable: recomputes the derived C06 score from the
// patched subdimensions' own stored weights, so running it twice is a
// no-op.

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const APPROVED_CHANGES = [
  { slug: "abu-dhabi", newScore: 5, expectedBefore: 4 },
  { slug: "las-vegas", newScore: 5, expectedBefore: 4 },
  { slug: "qatar", newScore: 3, expectedBefore: 4 },
  { slug: "singapore", newScore: 3, expectedBefore: 4 },
  { slug: "turkiye", newScore: 4, expectedBefore: 5 },
];

const CHARACTERISTIC_KEY = "C06";
const SUBDIMENSION_NAME = "Trip Extension";
const FLAT_COLUMN = "c06DestinationAppeal";

let patched = 0;
const report = [];

for (const change of APPROVED_CHANGES) {
  const [row] = await db
    .select()
    .from(tripIntelligenceGrandPrixProfiles)
    .where(eq(tripIntelligenceGrandPrixProfiles.sourceSlug, change.slug));
  if (!row) {
    throw new Error(`No trip_intelligence_grand_prix_profiles row for slug "${change.slug}" — aborting.`);
  }

  const detail = structuredClone(row.subdimensionDetail);
  const charDetail = detail.characteristics[CHARACTERISTIC_KEY];
  if (!charDetail) {
    throw new Error(`Row "${change.slug}" has no characteristic ${CHARACTERISTIC_KEY} — aborting.`);
  }
  const subdim = charDetail.subdimensions[SUBDIMENSION_NAME];
  if (!subdim) {
    throw new Error(
      `Row "${change.slug}" characteristic ${CHARACTERISTIC_KEY} has no subdimension "${SUBDIMENSION_NAME}" — aborting.`,
    );
  }

  const oldScore = subdim.score;
  if (oldScore !== change.expectedBefore) {
    throw new Error(
      `Row "${change.slug}" ${CHARACTERISTIC_KEY}.${SUBDIMENSION_NAME} is currently ${oldScore}, expected ${change.expectedBefore} — ` +
        `aborting to avoid applying this patch against unexpected state (already patched, or data drifted).`,
    );
  }
  subdim.score = change.newScore;

  const recomputedDerived = Object.values(charDetail.subdimensions).reduce(
    (sum, s) => sum + s.score * s.weight,
    0,
  );
  const roundedDerived = Math.round(recomputedDerived * 1000) / 1000;
  charDetail.derived_score = roundedDerived;

  await db
    .update(tripIntelligenceGrandPrixProfiles)
    .set({
      subdimensionDetail: detail,
      [FLAT_COLUMN]: String(roundedDerived),
      updatedAt: new Date(),
    })
    .where(eq(tripIntelligenceGrandPrixProfiles.sourceSlug, change.slug));

  patched++;
  report.push({ slug: change.slug, before: oldScore, after: change.newScore, derivedBefore: null, derivedAfter: roundedDerived });
  console.log(
    `  ${change.slug}: C06B (Trip Extension) ${oldScore} -> ${change.newScore} (C06 derived recomputed to ${roundedDerived})`,
  );
}

await db.insert(tripIntelligenceEngineConfigurations).values({
  configurationKey: "implementation-revision-2026-10-11",
  configurationPayload: {
    status: "implementation_revision_applied",
    version: "implementation-revision-2026-10-11",
    source: "E|C Trip Intelligence — Implementation Revision spec",
    questionnaire_changes: {
      q3_atmosphere_removed: true,
      question_count: 7,
      question_weights: {
        Q1: 0.185185185185, Q2: 0.197530864198, Q4: 0.148148148148,
        Q5: 0.148148148148, Q6: 0.111111111111, Q7: 0.098765432099, Q8: 0.111111111111,
      },
      q4_more_f1_renamed: "F1 Fan Culture & Atmosphere",
      q4_more_f1_rescored: { C02: 0.5, C09A: 0.5 },
      q4_day_trips_renamed: "Trips & Adventures",
    },
    rating_changes: APPROVED_CHANGES.map((c) => ({
      slug: c.slug,
      characteristic: CHARACTERISTIC_KEY,
      subdimension: SUBDIMENSION_NAME,
      before: c.expectedBefore,
      after: c.newScore,
    })),
    hero_and_alternative_selection_unchanged: true,
    affordability_logic_unchanged: true,
    baseline_scores_unchanged_except_5_c06b_rows: true,
  },
  status: "experimental",
});

console.log(`\n${patched} rows patched. New engine-config row "implementation-revision-2026-10-11" inserted (status: experimental).`);
await client.end();
