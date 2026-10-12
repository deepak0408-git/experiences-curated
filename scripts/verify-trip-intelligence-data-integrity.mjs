import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { tripIntelligenceGrandPrixProfiles, tripIntelligenceFanInsights } from "../schema/database.ts";

// Phase 1 data-integrity checks for Trip Intelligence (see plan at
// C:\Users\HP\.claude\plans\go-ahead-in-plan-merry-bentley.md, §5 Phase 1).
// No test framework exists in this codebase (checked — no vitest/jest), so
// this follows house convention: a real, persisted, re-runnable verification
// script rather than a throwaway one-off, same spirit as the seed scripts
// it checks. Run manually after any trip_intelligence_* reseed:
//   node --experimental-strip-types scripts/verify-trip-intelligence-data-integrity.mjs
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

let failures = 0;
function check(label, pass, detail) {
  const status = pass ? "PASS" : "FAIL";
  console.log(`[${status}] ${label}${detail ? " — " + detail : ""}`);
  if (!pass) failures++;
}

const profiles = await db.select().from(tripIntelligenceGrandPrixProfiles);
const insights = await db.select().from(tripIntelligenceFanInsights);

// 1. Row counts
check("24 grand prix profiles exist", profiles.length === 24, `found ${profiles.length}`);
check("24 fan insight rows exist", insights.length === 24, `found ${insights.length}`);

// 2. No missing/duplicate sporting_event_id across profiles
const profileEventIds = profiles.map((p) => p.sportingEventId);
check(
  "no duplicate sporting_event_id in profiles",
  new Set(profileEventIds).size === profileEventIds.length,
  `${profileEventIds.length} rows, ${new Set(profileEventIds).size} unique`,
);
const insightEventIds = insights.map((i) => i.sportingEventId);
check(
  "no duplicate sporting_event_id in fan insights",
  new Set(insightEventIds).size === insightEventIds.length,
  `${insightEventIds.length} rows, ${new Set(insightEventIds).size} unique`,
);

// 3. Every profile has a matching fan-insight row (same sporting_event_id set)
const profileIdSet = new Set(profileEventIds);
const insightIdSet = new Set(insightEventIds);
const missingInsights = [...profileIdSet].filter((id) => !insightIdSet.has(id));
check(
  "every profile has a matching fan-insight row",
  missingInsights.length === 0,
  missingInsights.length ? `${missingInsights.length} profiles with no insight row` : undefined,
);

// 4. Subdimension math reconciles to the stored derived C01-C09 columns.
// subdimensionDetail preserves the source JSON's two-subdimension breakdown
// per characteristic (Cxx.subdimensions.{A,B}.score * weight, summed) —
// recompute and compare against the derived column Phase 1 stored.
const CHAR_KEYS = [
  ["C01", "c01RacingActionCircuitExperience"],
  ["C02", "c02AtmosphereFanPassion"],
  ["C03", "c03CircuitHeritagePrestige"],
  ["C04", "c04SpectacleGlamour"],
  ["C05", "c05SpectatorViewingExperience"],
  ["C06", "c06DestinationAppeal"],
  ["C07", "c07AccessibilityConvenience"],
  ["C08", "c08WeatherPhysicalComfort"],
  ["C09", "c09FanEngagementEntertainment"],
];
let subdimensionMismatches = 0;
for (const profile of profiles) {
  const characteristics = profile.subdimensionDetail.characteristics;
  for (const [charKey, column] of CHAR_KEYS) {
    const charData = characteristics[charKey];
    if (!charData?.subdimensions) continue; // shouldn't happen for C01-C09, but don't crash if it does
    const subs = Object.values(charData.subdimensions);
    const recomputed = subs.reduce((sum, s) => sum + s.score * s.weight, 0);
    const stored = Number(profile[column]);
    // Half-point precision in source data; allow tiny float tolerance.
    if (Math.abs(recomputed - stored) > 0.01) {
      console.log(
        `  mismatch: ${profile.sourceSlug} ${charKey} — recomputed ${recomputed.toFixed(3)}, stored ${stored}`,
      );
      subdimensionMismatches++;
    }
  }
}
check("all C01-C09 subdimension math reconciles to stored derived scores", subdimensionMismatches === 0, `${subdimensionMismatches} mismatches across ${profiles.length} profiles`);

// 5. C10 reconciles to the documented clamp formula, where a verifiable
// weighted_index_usd is present in subdimensionDetail/affordability payload.
// clamp(5 - 4 * (cost - 750) / 1500, 1, 5)
let c10Mismatches = 0;
let c10Checked = 0;
for (const profile of profiles) {
  const affordability = profile.subdimensionDetail.affordability;
  const costUsd = affordability?.weighted_index_usd;
  if (costUsd === undefined) continue; // some pilot-batch rows store this outside subdimensionDetail; skip rather than false-fail
  c10Checked++;
  const expected = Math.min(5, Math.max(1, 5 - (4 * (costUsd - 750)) / 1500));
  const stored = Number(profile.c10Affordability);
  if (Math.abs(expected - stored) > 0.01) {
    console.log(`  mismatch: ${profile.sourceSlug} C10 — expected ${expected.toFixed(3)}, stored ${stored}`);
    c10Mismatches++;
  }
}
check("C10 reconciles to the clamp formula where verifiable", c10Mismatches === 0, `${c10Checked} checked, ${c10Mismatches} mismatches`);

// 6. publish_ready is true for all 24 (founder-approved override)
const notReady = insights.filter((i) => !i.publishReady);
check("publish_ready = true for all 24 fan-insight rows", notReady.length === 0, notReady.length ? `${notReady.length} not ready` : undefined);

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
await client.end();
process.exit(failures === 0 ? 0 : 1);
