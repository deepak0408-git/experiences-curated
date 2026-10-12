import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { readFileSync } from "node:fs";
import { tripIntelligenceGrandPrixProfiles } from "../schema/database.ts";
import { buildCandidates } from "../app/trip-intelligence/_lib/buildCandidates.ts";
import { scoreGrandPrix } from "../app/trip-intelligence/_lib/scoreGrandPrix.ts";
import { getMatchReasons } from "../app/trip-intelligence/_lib/matchReasons.ts";

// Validates the 10 Oct 2026 getMatchReasons() fallback (added for the
// 20-profile / 60-recommendation / 32-empty-explanation gap found by the
// 5,000-profile live test run) against the reference dataset in
// EC_TI_20_Explanation_Edge_Cases.zip. Run with
// `npx tsx scripts/verify-trip-intelligence-explanation-fallback.ts`.
//
// Checks, per the task's acceptance criteria:
//   1. All 20 profiles retain the same top-3 (slug + order) as the ZIP.
//   2. All 32 previously-empty recommendations now have a non-empty reason.
//   3. All 28 previously-non-empty recommendations are byte-for-byte
//      unchanged from the ZIP's recorded existing_match_reasons.
//   4. No fallback reason is empty/falls through unexpectedly.

interface AffectedProfile {
  profile_id: string;
  answers: Record<string, string>;
  recommendations: { rank: number; slug: string; matchReasons: string[] }[];
}

const dataDir = "scratchpad/edge_cases";
const affected: AffectedProfile[] = JSON.parse(readFileSync(`${dataDir}/affected_20_profiles.json`, "utf8"));

let failures = 0;
function check(label: string, pass: boolean, detail?: string) {
  const status = pass ? "PASS" : "FAIL";
  console.log(`[${status}] ${label}${detail ? " — " + detail : ""}`);
  if (!pass) failures++;
}

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { ssl: "require", prepare: false });
  const db = drizzle(client);
  const rows = await db.select().from(tripIntelligenceGrandPrixProfiles);
  const candidates = buildCandidates(rows as never);
  const bySlug = new Map(candidates.map((c) => [c.sourceSlug, c]));

  check("affected_20_profiles.json has exactly 20 profiles", affected.length === 20, `found ${affected.length}`);

  let totalRecs = 0;
  let previouslyEmptyNowFilled = 0;
  let previouslyNonEmptyUnchanged = 0;
  let previouslyNonEmptyChanged = 0;

  for (const profile of affected) {
    const answers = profile.answers as Parameters<typeof scoreGrandPrix>[0];
    const result = scoreGrandPrix(answers, candidates);
    const actualTop3 = [result.hero.sourceSlug, ...result.alternatives.map((a) => a.sourceSlug)];
    const expectedTop3 = profile.recommendations.sort((a, b) => a.rank - b.rank).map((r) => r.slug);

    check(
      `${profile.profile_id}: top-3 slugs+order unchanged`,
      JSON.stringify(actualTop3) === JSON.stringify(expectedTop3),
      `expected ${expectedTop3.join(",")}, got ${actualTop3.join(",")}`,
    );

    for (const rec of profile.recommendations) {
      totalRecs++;
      const candidate = bySlug.get(rec.slug);
      if (!candidate) {
        check(`${profile.profile_id}/${rec.slug}: candidate exists`, false, "not found in candidate set");
        continue;
      }
      const actualReasons = getMatchReasons(answers, candidate);
      const wasEmpty = rec.matchReasons.length === 0;

      if (wasEmpty) {
        const nowFilled = actualReasons.length > 0;
        check(`${profile.profile_id}/${rec.slug}: previously-empty reason now filled`, nowFilled, nowFilled ? actualReasons[0] : "still empty");
        if (nowFilled) previouslyEmptyNowFilled++;
      } else {
        const unchanged = JSON.stringify(actualReasons) === JSON.stringify(rec.matchReasons);
        check(
          `${profile.profile_id}/${rec.slug}: existing reason byte-for-byte unchanged`,
          unchanged,
          unchanged ? undefined : `expected ${JSON.stringify(rec.matchReasons)}, got ${JSON.stringify(actualReasons)}`,
        );
        if (unchanged) previouslyNonEmptyUnchanged++;
        else previouslyNonEmptyChanged++;
      }
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Total recommendations checked: ${totalRecs}`);
  console.log(`Previously empty, now filled: ${previouslyEmptyNowFilled}`);
  console.log(`Previously non-empty, unchanged: ${previouslyNonEmptyUnchanged}`);
  console.log(`Previously non-empty, CHANGED (should be 0): ${previouslyNonEmptyChanged}`);

  console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
  await client.end();
  process.exit(failures === 0 ? 0 : 1);
}

main();
