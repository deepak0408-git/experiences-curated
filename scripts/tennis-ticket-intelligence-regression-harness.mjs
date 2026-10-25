// Portable deterministic regression harness — Tennis Ticket Intelligence,
// Australian Open 2027. For ChatGPT's independent 32,832-profile scoring +
// explanation regression (Stage 2 Authorization §4; extended per Testing
// Handoff Completion request).
//
// PARITY GUARANTEE: this harness imports the real, deployed scoring
// (scoreTennisOptions.ts) and explanation (selectExplanation.ts) modules
// directly from the application source tree — it does NOT reimplement
// them. There is no second algorithm to silently diverge from production;
// whatever this harness outputs is exactly what the live app would
// compute for the same inputs, by construction, not by discipline.
//
// Requirements: Node 20+ with --experimental-strip-types (ships with
// Node 22/24; confirmed working against the Node version in this repo's
// dev environment). No database, no secrets, no Next.js runtime needed —
// the imported modules have zero DB/network calls (scoreTennisOptions.ts
// and selectExplanation.ts are pure functions operating on in-memory data
// only; the only I/O either module performs is selectExplanation.ts's own
// static JSON import of reconstructedLanguageCatalogue.json, bundled
// alongside it).
//
// Usage:
//   node --experimental-strip-types tennis-ticket-intelligence-regression-harness.mjs
// (enumerates all 32,832 profiles, prints a summary, and writes full
// per-profile results to regression-output.jsonl for independent
// inspection — see "Independent execution" section in the completion
// report for packaging instructions.)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

// Real production modules — relative path into the app source tree. This
// harness must be run from within a checkout of the full repository (or
// with the three referenced app/_lib files copied alongside it in the
// same relative structure — see packaging instructions in the completion
// report). pathToFileURL is required for dynamic import() of an absolute
// filesystem path on Windows (a bare "C:\..." path is not a valid ESM
// specifier).
//
// Two valid layouts resolve to the same app/ subtree at a different
// relative depth: inside the original repo this file lives in scripts/,
// so the app/ tree is a sibling of scripts/ (one level up — "../app/...").
// In the standalone regression package, this file sits at the package
// root with app/ as a direct sibling ("./app/..."). Try the package
// layout first, fall back to the in-repo layout, so the same file works
// unmodified in both locations — verified against both during packaging.
const APP_LIB_SUBPATH = "app/ticket-intelligence/tennis/[slug]/_lib";
function resolveLibPath(filename) {
  const packageLayout = path.join(dir, APP_LIB_SUBPATH, filename);
  if (fs.existsSync(packageLayout)) return packageLayout;
  const inRepoLayout = path.join(dir, "..", APP_LIB_SUBPATH, filename);
  if (fs.existsSync(inRepoLayout)) return inRepoLayout;
  throw new Error(`Could not locate ${filename} in either package or in-repo layout relative to ${dir}`);
}

const { scoreTennisOptions, getEligibilityDiagnostics } = await import(
  pathToFileURL(resolveLibPath("scoreTennisOptions.ts")).href
);
const { selectHeroExplanation, selectAlternativeExplanation } = await import(
  pathToFileURL(resolveLibPath("selectExplanation.ts")).href
);

const optionsSource = JSON.parse(fs.readFileSync(path.join(dir, "_tennis-options-source.json"), "utf8"));
// scoreTennisOptions.ts now requires an explicit eventSlug (25 Oct 2026,
// third Q4-neutrality pass) — read from the source file's own
// event_slug field rather than hardcoded, so this harness stays correct
// if ever repointed at a different tournament's source JSON.
const eventSlug = optionsSource.event_slug;
if (!eventSlug) {
  throw new Error("_tennis-options-source.json has no event_slug field — cannot call scoreTennisOptions without an explicit tournament identifier.");
}

// scoreTennisOptions expects camelCase TicketOption fields (same shape
// getTennisOptionsData.ts produces from the DB) — map once from the
// frozen source JSON's snake_case shape, exactly as the seed script and
// getTennisOptionsData.ts both already do independently. This mapping is
// data reshaping only, not scoring logic — it introduces no algorithmic
// divergence risk.
const options = optionsSource.options.map((o) => ({
  id: o.option_id,
  optionNumber: parseInt(o.option_id, 10),
  arenaCode: o.arena_code,
  arenaName: o.arena,
  stageCode: o.stage_code,
  stageLabel: o.stage_label,
  roundsLabel: o.rounds_label,
  sessionCode: o.session_code,
  sessionLabel: o.session_label,
  seatingCode: o.seating_code,
  seatingLabel: o.seating_label,
  costIndex: o.cost_index,
  costStars: o.cost_stars,
  descriptionText: "", // not needed for scoring; selectExplanation reads its own catalogue copy by option number
}));

// ── Profile enumeration — unchanged grid from the prior harness pass ────
const Q1_VALUES = ["lots_of_tennis", "big_stadium", "close_up_courts", "balance"];
const Q2_VALUES = ["early", "middle", "later"];
const Q3_VALUES = ["reserved", "exploring", "mix", "no_preference"];
const Q4_VALUES = ["day", "night", "either"];
const Q5_VALUES = ["close_to_action", "clear_balanced_view", "no_preference", "flexible"];
const Q6_VALUES = ["value_focused", "balanced", "premium"];
const Q7_MODES = ["fixed", "adjustable", "flexible_tournament"];

const DATE_FIXTURES = {
  all: { fromDate: "2027-01-17", toDate: "2027-01-31" },
  Early: { fromDate: "2027-01-17", toDate: "2027-01-23" },
  Middle: { fromDate: "2027-01-24", toDate: "2027-01-27" },
  Later: { fromDate: "2027-01-28", toDate: "2027-01-31" },
  "Early+Middle": { fromDate: "2027-01-17", toDate: "2027-01-27" },
  "Middle+Later": { fromDate: "2027-01-24", toDate: "2027-01-31" },
};

export function* enumerateProfiles() {
  for (const q1 of Q1_VALUES)
    for (const q2 of Q2_VALUES)
      for (const q3 of Q3_VALUES)
        for (const q4 of Q4_VALUES)
          for (const q5 of Q5_VALUES)
            for (const q6 of Q6_VALUES)
              for (const q7 of Q7_MODES)
                for (const [fixtureName, dates] of Object.entries(DATE_FIXTURES)) {
                  yield { q1, q2, q3, q4, q5, q6, q7, ...dates, _fixtureName: fixtureName };
                }
  for (const q1 of Q1_VALUES)
    for (const q2 of Q2_VALUES)
      for (const q3 of Q3_VALUES)
        for (const q4 of Q4_VALUES)
          for (const q5 of Q5_VALUES)
            for (const q6 of Q6_VALUES) {
              yield { q1, q2, q3, q4, q5, q6, q7: "flexible_tournament", fromDate: null, toDate: null, _fixtureName: "flexible_no_dates" };
            }
}

// Eligibility diagnostics use getEligibilityDiagnostics, exported directly
// from scoreTennisOptions.ts (same production file, same two hard-filter
// checks scoreTennisOptions itself runs internally) — NOT a separate
// reimplementation. This distinguishes:
//   - eligible options (passed both hard filters) — may or may not rank
//     in the top 3; ineligibility and "didn't make top 3" are NOT the
//     same thing, and this harness reports them separately.
//   - excluded options (failed at least one hard filter), each with every
//     applicable reason (an option can fail both the Ground-Pass/Reserved
//     check and Q7 date eligibility simultaneously).
function computeEligibility(answers) {
  const eligibleIds = [];
  const excluded = [];
  for (const o of options) {
    const diag = getEligibilityDiagnostics(o, answers);
    if (diag.eligible) {
      eligibleIds.push(o.optionNumber);
    } else {
      excluded.push({ optionNumber: o.optionNumber, reasons: diag.reasons });
    }
  }
  return { eligibleIds, excluded };
}

// ── Run one profile end-to-end: scoring + both explanation calls ────────
export function runProfile(answers) {
  const result = scoreTennisOptions(options, answers, eventSlug);
  const { eligibleIds, excluded } = computeEligibility(answers);

  const heroExplanation = result.hero ? selectHeroExplanation(result.hero) : null;
  const alt1Explanation = result.alternative1 ? selectAlternativeExplanation(result.alternative1, result.hero) : null;
  const alt2Explanation = result.alternative2 ? selectAlternativeExplanation(result.alternative2, result.hero) : null;

  // Consistency check between this harness's own eligibility computation
  // and scoreTennisOptions's internal excludedCount — both must agree,
  // since both ultimately derive from the same two hard-filter checks.
  // A mismatch would indicate getEligibilityDiagnostics has drifted from
  // passesHardFilters inside the production module — flagged, not
  // silently trusted.
  if (excluded.length !== result.excludedCount) {
    throw new Error(
      `Eligibility diagnostic mismatch for profile ${JSON.stringify(answers)}: ` +
        `computed ${excluded.length} excluded, scoreTennisOptions reported ${result.excludedCount}`
    );
  }

  return {
    profile: answers,
    eligibleOptionIds: eligibleIds,
    excludedOptions: excluded, // [{ optionNumber, reasons: string[] }]
    eligibleCount: eligibleIds.length,
    excludedCount: result.excludedCount,
    hero: result.hero
      ? {
          optionNumber: result.hero.option.optionNumber,
          arenaCode: result.hero.option.arenaCode,
          stageCode: result.hero.option.stageCode,
          sessionCode: result.hero.option.sessionCode,
          seatingCode: result.hero.option.seatingCode,
          contributions: result.hero.contributions,
          rawScore: result.hero.rawScore,
          adjustedScore: result.hero.adjustedScore,
          explanation: heroExplanation,
        }
      : null,
    alternative1: result.alternative1
      ? {
          optionNumber: result.alternative1.option.optionNumber,
          contributions: result.alternative1.contributions,
          rawScore: result.alternative1.rawScore,
          adjustedScore: result.alternative1.adjustedScore,
          explanation: alt1Explanation,
        }
      : null,
    alternative2: result.alternative2
      ? {
          optionNumber: result.alternative2.option.optionNumber,
          contributions: result.alternative2.contributions,
          rawScore: result.alternative2.rawScore,
          adjustedScore: result.alternative2.adjustedScore,
          explanation: alt2Explanation,
        }
      : null,
  };
}

// ── CLI entry point ──────────────────────────────────────────────────────
const isMain = process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]));
if (isMain) {
  const outPath = path.join(dir, "regression-output.jsonl");
  const out = fs.createWriteStream(outPath, { flags: "w" });

  let count = 0;
  const heroCounts = {};
  const allSurfaced = new Set();
  let exactTies = 0;
  let missingStatementIds = 0;

  for (const answers of enumerateProfiles()) {
    count++;
    const row = runProfile(answers);
    out.write(JSON.stringify(row) + "\n");

    if (row.hero) {
      heroCounts[row.hero.optionNumber] = (heroCounts[row.hero.optionNumber] ?? 0) + 1;
      allSurfaced.add(row.hero.optionNumber);
      if (!row.hero.explanation?.statementIds?.length) missingStatementIds++;
    }
    if (row.alternative1) {
      allSurfaced.add(row.alternative1.optionNumber);
      if (row.hero && row.hero.adjustedScore === row.alternative1.adjustedScore) exactTies++;
      if (!row.alternative1.explanation?.statementIds?.length) missingStatementIds++;
    }
    if (row.alternative2) {
      allSurfaced.add(row.alternative2.optionNumber);
      if (!row.alternative2.explanation?.statementIds?.length) missingStatementIds++;
    }
  }
  out.end();

  console.log(`Total profiles enumerated: ${count} (expected 32,832)`);
  console.log(`Distinct options surfaced in top-3: ${allSurfaced.size} of 43`);
  console.log(`Distinct options that were ever hero: ${Object.keys(heroCounts).length} of 43`);
  console.log(`Exact hero/alt1 ties observed: ${exactTies}`);
  console.log(`Profiles with a missing statement ID (should be 0): ${missingStatementIds}`);
  console.log(`Full per-profile output written to: ${outPath}`);
}
