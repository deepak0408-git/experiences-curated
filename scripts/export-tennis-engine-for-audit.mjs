// Offline export for the founder's planned ChatGPT exhaustive-audit pass
// (Tennis Grand Slam Trip Intelligence spec §14 handoff). Bundles the real
// production engine source + the seeded rating snapshot into one folder
// (and a zip of that folder) that runs standalone, without DB or Next.js
// access. Re-run this any time the engine, explanation logic, presentation
// code, or ratings change, before handing off for a fresh audit.
//
// Usage: node --experimental-strip-types scripts/export-tennis-engine-for-audit.mjs

import { mkdirSync, copyFileSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import postgres from "postgres";
import "dotenv/config";

const LIB_DIR = "app/trip-intelligence/tennis/_lib";
const RESULTS_DIR = "app/trip-intelligence/tennis/results";
const OUT_DIR = "tennis-engine-audit-export";
const ENGINE_FILES = [
  "types.ts", "questions.ts", "weights.ts", "buildCandidates.ts",
  "scoreGrandSlam.ts", "rankCandidates.ts", "matchReasons.ts", "wordingLibrary.ts",
];

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(join(OUT_DIR, "presentation"), { recursive: true });
mkdirSync(join(OUT_DIR, "presentation", "_components"), { recursive: true });

// Copy engine source verbatim, rewriting relative imports to carry an
// explicit .ts extension — required for plain Node ESM resolution (Next's
// bundler resolves extensionless imports automatically; a standalone Node
// run does not).
for (const file of ENGINE_FILES) {
  const src = readFileSync(join(LIB_DIR, file), "utf-8");
  const rewritten = src.replace(/from "(\.\/[a-zA-Z]+)"/g, 'from "$1.ts"');
  writeFileSync(join(OUT_DIR, file), rewritten);
}

// Presentation-layer source, included for reference/review (not execution)
// — results/page.tsx and ResultCard.tsx are real Next.js Server/Client
// Components (next/link, next/navigation, a DB-backed data-access import)
// and cannot run standalone in plain Node the way the pure-logic engine
// files above can. They're copied verbatim so an auditor can verify how
// the engine's output (scores, tie groups, explanation strings) actually
// gets selected into cards and rendered, without needing the running app.
copyFileSync(join(RESULTS_DIR, "page.tsx"), join(OUT_DIR, "presentation", "page.tsx"));
copyFileSync(
  join(RESULTS_DIR, "_components", "ResultCard.tsx"),
  join(OUT_DIR, "presentation", "_components", "ResultCard.tsx"),
);

// Export the live rating snapshot actually seeded in the DB — never a
// hand-copied literal — so the offline bundle can't silently drift from
// what scoreGrandSlam.ts is really scoring against in production.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
const rows = await sql`select * from trip_intelligence_tennis_grand_slam_profiles order by source_slug`;
await sql.end();

const candidates = rows.map((r) => ({
  sportingEventId: r.sporting_event_id,
  sourceSlug: r.source_slug,
  grandSlamName: r.grand_slam_name,
  components: {
    D01A: Number(r.d01a_heritage_iconic_appeal), D01B: Number(r.d01b_modern_spectacle),
    D03A: Number(r.d03a_showcourt_experience), D03B: Number(r.d03b_outside_court_discovery), D03C: Number(r.d03c_player_proximity_practice),
    D04A: Number(r.d04a_grounds_atmosphere),
    D05A: Number(r.d05a_crowd_energy_intensity), D05B: Number(r.d05b_spectator_culture_etiquette),
    D06A: Number(r.d06a_host_city_exploration), D06B: Number(r.d06b_regional_exploration),
    D07A: Number(r.d07a_accessibility_connectivity), D07B: Number(r.d07b_on_site_comfort_facilities),
    D08A: Number(r.d08a_attendance_affordability), D08B: Number(r.d08b_destination_costs),
  },
  rubricVersion: r.rubric_version,
}));

writeFileSync(join(OUT_DIR, "candidates.json"), JSON.stringify(candidates, null, 2));

// Standalone runner — the exact same scoreGrandSlam/rankCandidates/
// composeExplanation functions, run from the local candidates.json rather
// than a live DB. This is what ChatGPT should execute for all 12,288
// combinations, not a rewritten approximation.
writeFileSync(
  join(OUT_DIR, "run.mjs"),
  `// Standalone runner for the exported Tennis Trip Intelligence engine.
// node --experimental-strip-types run.mjs
import { readFileSync } from "fs";
import { scoreGrandSlam } from "./scoreGrandSlam.ts";
import { rankCandidates, isFourWayTie } from "./rankCandidates.ts";
import { composeExplanation } from "./matchReasons.ts";
import { QUESTIONS } from "./questions.ts";

const candidates = JSON.parse(readFileSync("./candidates.json", "utf-8"));

// Example single run — see QUESTIONS for every answer value per question.
const answers = {
  q1_travel_motivation: "city",
  q2_tournament_identity: "heritage",
  q3_tennis_experience: "showcourts",
  q4_atmosphere: "calm",
  q5_beyond_tennis: "city",
  q6_convenience: "reasonable",
  q7_affordability: "sensible_budget",
};

const { weights, scores } = scoreGrandSlam(answers, candidates);
const tieGroups = rankCandidates(scores);
console.log("Ranking:", tieGroups.map(g => g.candidates.map(c => \`\${c.sourceSlug}:\${c.finalScore.toFixed(4)}\`)));
console.log("Four-way tie:", isFourWayTie(tieGroups));
if (tieGroups[0].candidates.length === 1) {
  const explanation = composeExplanation(answers, weights, tieGroups[0].candidates[0], tieGroups[1]?.candidates[0] ?? null);
  console.log(explanation);
}

// For the full 12,288-combination exhaustive audit, iterate every value
// of every Q*_OPTIONS from questions.ts and call scoreGrandSlam/
// rankCandidates/composeExplanation per combination, as above.
`,
);

writeFileSync(
  join(OUT_DIR, "package.json"),
  JSON.stringify({ name: "tennis-trip-intelligence-engine-audit-export", private: true, type: "module" }, null, 2),
);

writeFileSync(
  join(OUT_DIR, "README.md"),
  `# Tennis Trip Intelligence — offline audit export

## Executable (run.mjs + the files in this directory)
The real, unmodified scoring/ranking/explanation engine: types.ts, questions.ts,
weights.ts, buildCandidates.ts, scoreGrandSlam.ts, rankCandidates.ts,
matchReasons.ts, wordingLibrary.ts, plus candidates.json (the live seeded
rating snapshot). Run with \`node --experimental-strip-types run.mjs\`.

## presentation/ (reference only, not executable here)
page.tsx and _components/ResultCard.tsx — the real Next.js results-page
source, copied verbatim. These are Server/Client Components (next/link,
next/navigation, a DB-backed data-access import) and cannot run standalone
in plain Node the way the engine files above can. They're included so an
auditor can verify how the engine's output (scores, tie groups, explanation
strings) actually gets selected into cards and rendered — e.g. how many
cards show for a given tie shape, which fields each card reads — without
needing the running app or a database connection.
`,
);

console.log(`Exported engine + presentation source + ${candidates.length} candidate profiles to ./${OUT_DIR}/`);
console.log(`Run the engine with: cd ${OUT_DIR} && node --experimental-strip-types run.mjs`);
