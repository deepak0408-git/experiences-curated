import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { tripIntelligenceGrandPrixProfiles } from "../schema/database.ts";
import { buildCandidates } from "../app/trip-intelligence/_lib/buildCandidates.ts";
import { scoreGrandPrix } from "../app/trip-intelligence/_lib/scoreGrandPrix.ts";
// Imported as a namespace, not a named re-export — Node's native ESM loader
// can't statically resolve weights.ts's `export { K as SCORING_KEYS }`
// renamed re-export from a plain entry-point import (a Node loader quirk,
// unrelated to this patch); the namespace form sidesteps it.
import * as weightsModule from "../app/trip-intelligence/_lib/weights.ts";
const { makeWeights, SCORING_KEYS } = weightsModule;

// Focused regression checks for the 10 Oct 2026 incremental recalibration
// (README.md + grand-prix-characteristic-ratings.patch.json +
// matching-rubric.patch.json). Exercises the live engine functions directly
// against real DB candidates — no mocks — per house convention of a real,
// persisted, re-runnable verification script (see
// verify-trip-intelligence-data-integrity.mjs).
//
// Run with `npx tsx scripts/verify-trip-intelligence-recalibration-patch.ts`
// — NOT `node --experimental-strip-types`. This is the first Trip
// Intelligence script to import live app engine code (scoreGrandPrix.ts/
// weights.ts) rather than just the DB schema; Node's native strip-types
// loader can't statically resolve weights.ts's `export { K as
// SCORING_KEYS }` renamed re-export when loaded as a plain .mjs entry point
// (a Node ESM-loader limitation, unrelated to this patch) — tsx's full
// transpile handles it correctly.

// Wrapped in an async function (not top-level await) so this file stays
// loadable as a CJS-interop script under tsx — see the extension note above.
main();

async function main() {

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

let failures = 0;
function check(label, pass, detail) {
  const status = pass ? "PASS" : "FAIL";
  console.log(`[${status}] ${label}${detail ? " — " + detail : ""}`);
  if (!pass) failures++;
}

const rows = await db.select().from(tripIntelligenceGrandPrixProfiles);
const candidates = buildCandidates(rows);

check("all 24 Grand Prix still returned as candidates", candidates.length === 24, `found ${candidates.length}`);

const bySlug = new Map(candidates.map((c) => [c.sourceSlug, c]));

// --- A. Rating patch: only the 3 approved rows changed -------------------
const canada = bySlug.get("canada");
const singapore = bySlug.get("singapore");
const azerbaijan = bySlug.get("azerbaijan");

check("canada C07 recomputed to 4.4", Math.abs(canada.components.C07B * 0.6 + canada.components.C07A * 0.4 - 4.4) < 1e-9 && canada.components.C07B === 4, `C07B=${canada.components.C07B}`);
check("singapore C07B is now 4", singapore.components.C07B === 4, `C07B=${singapore.components.C07B}`);
check("azerbaijan C01A is now 4", azerbaijan.components.C01A === 4, `C01A=${azerbaijan.components.C01A}`);
check("azerbaijan computed C01 is now 4.0", azerbaijan.components.C01 === 4, `C01=${azerbaijan.components.C01}`);

const baseAnswers = {
  q1_trip_purpose: "balanced",
  q2_gp_identity: "open",
  q3_atmosphere: "crowds",
  q4_off_track: "city",
  q5_spectator: "open",
  q6_convenience: "flexible",
  q7_weather: "any_weather",
  q8_affordability: "not_deciding",
};

// --- B. Rubric weight maps sum to 1 (makeWeights throws otherwise) -------
try {
  makeWeights({ ...baseAnswers, q2_gp_identity: "racing_circuit" });
  check("Q2 racing_circuit weights sum to 1", true);
} catch (e) {
  check("Q2 racing_circuit weights sum to 1", false, e.message);
}
for (const q3 of ["festival", "glamour", "fan_experience"]) {
  try {
    makeWeights({ ...baseAnswers, q3_atmosphere: q3 });
    check(`Q3 ${q3} weights sum to 1`, true);
  } catch (e) {
    check(`Q3 ${q3} weights sum to 1`, false, e.message);
  }
}
for (const q6 of ["very", "quite"]) {
  try {
    makeWeights({ ...baseAnswers, q6_convenience: q6 });
    check(`Q6 ${q6} weights sum to 1`, true);
  } catch (e) {
    check(`Q6 ${q6} weights sum to 1`, false, e.message);
  }
}

// --- C. C01 split doesn't disturb unrelated question mappings ------------
for (const q of [
  { ...baseAnswers, q1_trip_purpose: "racing_first" },
  { ...baseAnswers, q2_gp_identity: "legendary" },
  { ...baseAnswers, q2_gp_identity: "street_spectacle" },
  { ...baseAnswers, q4_off_track: "more_f1" },
]) {
  try {
    const w = makeWeights(q);
    const allFinite = SCORING_KEYS.every((k) => Number.isFinite(w[k])) && Number.isFinite(w.C01);
    check(`weights finite for answers touching legacy C01 mappings (${JSON.stringify(q)})`, allFinite);
  } catch (e) {
    check("weights finite for legacy C01 mapping", false, e.message);
  }
}

// --- D. Street-circuit experience-fit bonus -------------------------------
const QUALIFYING = new Set(["monaco", "singapore", "las-vegas", "saudi-arabia", "azerbaijan", "spain-madrid"]);
const streetAnswers = { ...baseAnswers, q2_gp_identity: "street_spectacle", q8_affordability: "not_deciding" };

const streetResult = scoreGrandPrix(streetAnswers, candidates);
const streetFitBySlug = new Map(streetResult.results.map((r) => [r.sourceSlug, r.experienceFit]));

// Isolate the bonus by independently recomputing raw (pre-bonus) experience
// fit from the same weights the engine itself would use, then asserting the
// engine's actual output equals raw+0.15 for exactly the 6 qualifying slugs
// and raw (unchanged) for every other slug.
let bonusAppliedCorrectly = true;
const neutralStreet = { ...streetAnswers, q8_affordability: "not_deciding" };
const w = makeWeights(neutralStreet, 0.15);
const experienceKeys = SCORING_KEYS.filter((k) => k !== "C10");
const weightSum = experienceKeys.reduce((s, k) => s + w[k], 0);

for (const [slug, candidate] of bySlug) {
  let rawFit = 0;
  for (const k of experienceKeys) rawFit += (w[k] / weightSum) * candidate.components[k];
  const expectedFit = QUALIFYING.has(slug) ? rawFit + 0.15 : rawFit;
  const actualFit = streetFitBySlug.get(slug);
  if (Math.abs(expectedFit - actualFit) > 1e-9) {
    bonusAppliedCorrectly = false;
    console.log(`    mismatch for ${slug}: expected ${expectedFit}, got ${actualFit}`);
  }
}
check("street-circuit +0.15 bonus applied to exactly the 6 qualifying slugs, no others", bonusAppliedCorrectly);

// --- E. Safeguard: fires correctly, never touches hero/2nd, no cost veto -
const majorStreetAnswers = { ...streetAnswers, q8_affordability: "major" };
const majorStreetResult = scoreGrandPrix(majorStreetAnswers, candidates);
const top3Slugs = [majorStreetResult.hero.sourceSlug, ...majorStreetResult.alternatives.map((a) => a.sourceSlug)];
check("Q8=major + street_spectacle still returns a valid top 3", top3Slugs.length === 3, top3Slugs.join(", "));

// Real-world data may or may not naturally need the safeguard to fire, so
// also synthetically force the exact trigger condition: no qualifying
// street circuit in the natural (pre-bonus) top 3, but at least one
// qualifying circuit still inside the 0.30-point shortlist once the +0.15
// bonus is applied — the precise scenario the safeguard exists for. A mild,
// proportional scale-down (97% of every component) of the 6 qualifying
// circuits was calibrated (via manual sweep against this real dataset) to
// land exactly in that zone: enough to drop them out of the organic top 3,
// close enough that +0.15 pulls at least one (Las Vegas) back inside the
// 0.30-point tolerance band. Flattening to a constant or depressing more
// aggressively either keeps them naturally competitive or pushes them so
// far below tolerance that even the bonus can't recover them — both
// verified not to exercise the safeguard's actual firing path.
const depressedCandidates = candidates.map((c) => {
  if (!QUALIFYING.has(c.sourceSlug)) return c;
  const scaled = Object.fromEntries(
    Object.entries(c.components).map(([k, v]) => [k, k === "C10" ? v : Math.max(1, v * 0.97)]),
  );
  return { ...c, components: scaled };
});
const naturalResult = scoreGrandPrix({ ...baseAnswers, q2_gp_identity: "open", q8_affordability: "major" }, depressedCandidates);
const naturalTop3 = [naturalResult.hero.sourceSlug, ...naturalResult.alternatives.map((a) => a.sourceSlug)];
check(
  "control: with depressed scores and no street preference, qualifying circuits do NOT naturally reach top 3",
  !naturalTop3.some((s) => QUALIFYING.has(s)),
  naturalTop3.join(", "),
);

const forcedAnswers = { ...baseAnswers, q2_gp_identity: "street_spectacle", q8_affordability: "major" };
const forcedResult = scoreGrandPrix(forcedAnswers, depressedCandidates);
const forcedTop3 = [forcedResult.hero.sourceSlug, ...forcedResult.alternatives.map((a) => a.sourceSlug)];
const forcedThird = forcedTop3[2];
check(
  "safeguard fires: 3rd slot becomes a qualifying street circuit when none would naturally rank top 3",
  QUALIFYING.has(forcedThird),
  `forced top3=${forcedTop3.join(", ")}`,
);

// Hero/2nd invariance: independently reconstruct what the ranked order
// would be WITHOUT the safeguard (same weights, same bonus, same Q8 blend —
// just skip the 3rd-slot swap) and confirm slots 1-2 match the engine's
// real output exactly.
const w2 = makeWeights({ ...forcedAnswers, q8_affordability: "not_deciding" }, 0.15);
const weightSum2 = experienceKeys.reduce((s, k) => s + w2[k], 0);
const rawFitBySlug = new Map();
for (const [slug, candidate] of new Map(depressedCandidates.map((c) => [c.sourceSlug, c]))) {
  let fit = 0;
  for (const k of experienceKeys) fit += (w2[k] / weightSum2) * candidate.components[k];
  if (QUALIFYING.has(slug)) fit += 0.15;
  rawFitBySlug.set(slug, fit);
}
const alpha2 = 0.25; // Q8 major -> full MAX_AFFORDABILITY_BLEND
const depressedBySlug = new Map(depressedCandidates.map((c) => [c.sourceSlug, c]));
const reconstructedRanked = [...rawFitBySlug.keys()].sort((a, b) => {
  const candA = depressedBySlug.get(a);
  const candB = depressedBySlug.get(b);
  const finalA = (1 - alpha2) * rawFitBySlug.get(a) + alpha2 * candA.components.C10;
  const finalB = (1 - alpha2) * rawFitBySlug.get(b) + alpha2 * candB.components.C10;
  return finalB - finalA || rawFitBySlug.get(b) - rawFitBySlug.get(a) || a.localeCompare(b);
});
check(
  "hero and 2nd place unaffected by the safeguard (match the pre-safeguard reconstructed ranking)",
  forcedTop3[0] === reconstructedRanked[0] && forcedTop3[1] === reconstructedRanked[1],
  `engine hero/2nd=${forcedTop3[0]},${forcedTop3[1]} vs reconstructed=${reconstructedRanked[0]},${reconstructedRanked[1]}`,
);
check(
  "no affordability veto: safeguard's 3rd pick stands even under Q8=major",
  forcedAnswers.q8_affordability === "major" && QUALIFYING.has(forcedThird),
);

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
await client.end();
process.exit(failures === 0 ? 0 : 1);

}
