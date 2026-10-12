import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { tripIntelligenceGrandPrixProfiles, tripIntelligenceEngineConfigurations } from "../schema/database.ts";
import { eq } from "drizzle-orm";

// Applies the 3 approved rating corrections from
// grand-prix-characteristic-ratings.patch.json (10 Oct 2026 incremental
// recalibration — see README.md in the project root). Touches only
// canada, singapore, azerbaijan; every other event/subdimension/C10 value
// is left untouched. Re-runnable: recomputes derived scores from the
// patched subdimension inputs rather than hardcoding the "after" values, so
// running it twice is a no-op.

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Each entry: which row, which characteristic object inside
// subdimension_detail.characteristics, which named subdimension's score to
// change, and the new score. Derived score + flat column are recomputed
// from the patched subdimensions' own stored weights (not hardcoded), so a
// re-run is idempotent and a future weight change would still compute
// correctly.
const APPROVED_CHANGES = [
  {
    slug: "canada",
    characteristicKey: "C07",
    subdimensionName: "Circuit Access & Logistics",
    newScore: 4,
    flatColumn: "c07AccessibilityConvenience",
  },
  {
    slug: "singapore",
    characteristicKey: "C07",
    subdimensionName: "Circuit Access & Logistics",
    newScore: 4,
    flatColumn: "c07AccessibilityConvenience",
  },
  {
    slug: "azerbaijan",
    characteristicKey: "C01",
    subdimensionName: "Racing Action",
    newScore: 4,
    flatColumn: "c01RacingActionCircuitExperience",
  },
];

let patched = 0;
for (const change of APPROVED_CHANGES) {
  const [row] = await db
    .select()
    .from(tripIntelligenceGrandPrixProfiles)
    .where(eq(tripIntelligenceGrandPrixProfiles.sourceSlug, change.slug));
  if (!row) {
    throw new Error(`No trip_intelligence_grand_prix_profiles row for slug "${change.slug}" — aborting.`);
  }

  const detail = structuredClone(row.subdimensionDetail);
  const charDetail = detail.characteristics[change.characteristicKey];
  if (!charDetail) {
    throw new Error(`Row "${change.slug}" has no characteristic ${change.characteristicKey} — aborting.`);
  }
  const subdim = charDetail.subdimensions[change.subdimensionName];
  if (!subdim) {
    throw new Error(
      `Row "${change.slug}" characteristic ${change.characteristicKey} has no subdimension "${change.subdimensionName}" — aborting.`,
    );
  }

  const oldScore = subdim.score;
  subdim.score = change.newScore;

  // Recompute the derived score from both subdimensions' own stored
  // weights — mirrors the formula already used by the handoff's
  // full_calendar_audit.py (derived = sum(score*weight for each sub)).
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
      [change.flatColumn]: String(roundedDerived),
      updatedAt: new Date(),
    })
    .where(eq(tripIntelligenceGrandPrixProfiles.sourceSlug, change.slug));

  patched++;
  console.log(
    `  ${change.slug}: ${change.characteristicKey}.${change.subdimensionName} ${oldScore} -> ${change.newScore} ` +
      `(derived recomputed to ${roundedDerived})`,
  );
}

// Versioned engine-config row documenting this rubric revision — never
// overwrites the existing "candidate-v3-experience-first-030" row, per
// schema/database.ts's explicit "new config changes are always a new row"
// convention.
await db.insert(tripIntelligenceEngineConfigurations).values({
  configurationKey: "recalibration-2026-10-10",
  configurationPayload: {
    status: "incremental_recalibration_patch_applied",
    version: "recalibration-2026-10-10",
    source: "README.md + grand-prix-characteristic-ratings.patch.json + matching-rubric.patch.json",
    rating_changes: APPROVED_CHANGES.map((c) => ({
      slug: c.slug,
      characteristic: c.characteristicKey,
      subdimension: c.subdimensionName,
      new_score: c.newScore,
    })),
    rubric_changes: {
      q2_racing_circuit: { C01A: 0.6, C01B: 0.2, C05A: 0.2 },
      q3_festival: { C09B: 0.95, C09A: 0.05 },
      q3_glamour: { C04B: 0.95, C04A: 0.05 },
      q3_fan_experience: { C09A: 0.95, C09B: 0.05 },
      q6_very: { C07A: 0.2, C07B: 0.8 },
      q6_quite: { C07A: 0.3, C07B: 0.7 },
      street_circuit_experience_fit_bonus: 0.15,
      street_circuit_qualifying_slugs: ["monaco", "singapore", "las-vegas", "saudi-arabia", "azerbaijan", "spain-madrid"],
      street_circuit_alternative_safeguard: "third_slot_only_within_existing_030_shortlist_no_affordability_veto",
    },
    questionnaire_unchanged: true,
    master_ratings_unchanged_except_3_rows: true,
  },
  status: "experimental",
});

console.log(`\n${patched} rows patched. New engine-config row "recalibration-2026-10-10" inserted (status: experimental).`);
await client.end();
