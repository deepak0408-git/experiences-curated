import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { scoreTennisOptions } from "../app/ticket-intelligence/tennis/[slug]/_lib/scoreTennisOptions.ts";
import { selectUsOpenExplanations } from "../app/ticket-intelligence/tennis/[slug]/_lib/usOpenExplanation.ts";

// Full 15,552-profile regression batch for US Open 2027 Ticket
// Intelligence, per the Phase 5 handoff spec's §14.4/§12.2 requirement and
// the frozen Phase 3 contract's own regression evidence section:
//   15,552 = 4 Q1 x 4 Q5 x 3 Q2 x 3 Q4 x 4 Q3 x 3 Q6 x 9 Q7 scenarios.
//
// This runs the ACTUAL PRODUCTION CODE — scoreTennisOptions.ts and
// usOpenExplanation.ts, the same modules the live app imports — against
// every profile in the grid, not a separate simplified scorer (per spec
// section 14.1: "Do not build a separate simplified scorer for
// validation"). The profile grid and Q7 date scenarios are copied exactly
// from the handoff's own independent Python reference
// (03_scoring/USO27_Phase3_Regression_and_Frozen_Contract.zip's
// uso_phase3_audit.py, line 4's `dates` list) so this batch is directly
// comparable to that reference's own summary numbers.
//
// Outputs (to OUT_DIR):
//   - us_open_15552_profiles.jsonl  — one line per profile: inputs, eligible
//     count, hero/alt1/alt2 IDs + C1-C5/E/alpha/V, hero/alt1/alt2
//     explanation text + source, no-match flag.
//   - us_open_15552_summary.json    — aggregate counts, comparable to the
//     Python audit's own USO27_Phase3_Regression_Summary.json shape.
//   - us_open_15552_exceptions.jsonl — any profile where scoreTennisOptions
//     threw, returned a structurally invalid result, or the explanation
//     selector threw unexpectedly.

const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";
const OUT_DIR = process.argv[2] || "./scripts/_uso27-source/regression-output";
fs.mkdirSync(OUT_DIR, { recursive: true });

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const dbRows = await sql`
  SELECT option_number, arena_code AS "arenaCode", arena_name AS "arenaName", stage_code AS "stageCode",
         stage_label AS "stageLabel", rounds_label AS "roundsLabel", session_code AS "sessionCode",
         session_label AS "sessionLabel", seating_code AS "seatingCode", seating_label AS "seatingLabel",
         cost_index AS "costIndex", cost_stars AS "costStars", description_text AS "descriptionText",
         hero_image AS "heroImage", stand, eligible_from AS "eligibleFrom", eligible_to AS "eligibleTo",
         c1_lots_of_tennis AS "c1LotsOfTennis", c1_big_stadium AS "c1BigStadium", c1_close_up_courts AS "c1CloseUpCourts",
         c1_balanced_experience AS "c1BalancedExperience", c5_close_to_action AS "c5CloseToAction",
         c5_balanced_view AS "c5BalancedView", c5_no_preference AS "c5NoPreference", c5_flexible_explore AS "c5FlexibleExplore"
  FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${US_OPEN_EVENT_ID}
  ORDER BY option_number
`;
await sql.end();

if (dbRows.length !== 31) throw new Error(`Expected 31 seeded options, found ${dbRows.length}`);

function toTicketOption(r) {
  return {
    id: String(r.option_number),
    optionNumber: Number(r.option_number),
    arenaCode: r.arenaCode, arenaName: r.arenaName, stageCode: r.stageCode, stageLabel: r.stageLabel,
    roundsLabel: r.roundsLabel, sessionCode: r.sessionCode, sessionLabel: r.sessionLabel,
    seatingCode: r.seatingCode, seatingLabel: r.seatingLabel, costIndex: Number(r.costIndex), costStars: Number(r.costStars),
    descriptionText: r.descriptionText, heroImage: r.heroImage, stand: r.stand,
    // See scripts/_smoketest-us-open-ticket-intelligence.mjs's comment:
    // raw postgres/Drizzle date() columns return JS Date objects, not ISO
    // strings; the real app only works because of RSC serialization at
    // the server/client boundary, which this standalone script has none
    // of, so it must convert explicitly.
    eligibleFrom: r.eligibleFrom ? r.eligibleFrom.toISOString().slice(0, 10) : null,
    eligibleTo: r.eligibleTo ? r.eligibleTo.toISOString().slice(0, 10) : null,
    c1LotsOfTennis: r.c1LotsOfTennis===null?null:Number(r.c1LotsOfTennis), c1BigStadium: r.c1BigStadium===null?null:Number(r.c1BigStadium),
    c1CloseUpCourts: r.c1CloseUpCourts===null?null:Number(r.c1CloseUpCourts), c1BalancedExperience: r.c1BalancedExperience===null?null:Number(r.c1BalancedExperience),
    c5CloseToAction: r.c5CloseToAction===null?null:Number(r.c5CloseToAction), c5BalancedView: r.c5BalancedView===null?null:Number(r.c5BalancedView),
    c5NoPreference: r.c5NoPreference===null?null:Number(r.c5NoPreference), c5FlexibleExplore: r.c5FlexibleExplore===null?null:Number(r.c5FlexibleExplore),
  };
}
const options = dbRows.map(toTicketOption);

const Q1 = ["lots_of_tennis", "big_stadium", "close_up_courts", "balance"];
const Q5 = ["close_to_action", "clear_balanced_view", "no_preference", "flexible"]; // app spelling
const Q2 = ["early", "middle", "later"]; // app spelling, maps to stage Early/Middle/Late
const Q4 = ["day", "night", "either"]; // app spelling
const Q3 = ["reserved", "exploring", "mix", "no_preference"];
const Q6 = ["value_focused", "balanced", "premium"];
// Exact 9 date scenarios from uso_phase3_audit.py line 4's `dates` list —
// [kind, fromDate, toDate]. "flexible" kind maps to the app's q7 value
// "flexible_tournament".
const Q7_SCENARIOS = [
  ["flexible", null, null],
  ["fixed", "2027-08-29", "2027-08-29"],
  ["fixed", "2027-09-05", "2027-09-05"],
  ["fixed", "2027-09-09", "2027-09-09"],
  ["fixed", "2027-09-12", "2027-09-12"],
  ["fixed", "2027-08-28", "2027-08-28"], // before tournament start -> expected no-match for every profile
  ["fixed", "2027-09-13", "2027-09-13"], // after tournament end -> expected no-match for every profile
  ["adjustable", "2027-09-07", "2027-09-07"],
  ["adjustable", "2027-09-12", "2027-09-12"],
];

function* allProfiles() {
  let id = 0;
  for (const q1 of Q1)
    for (const q5 of Q5)
      for (const q2 of Q2)
        for (const q4 of Q4)
          for (const q3 of Q3)
            for (const q6 of Q6)
              for (const [q7kind, fromDate, toDate] of Q7_SCENARIOS) {
                id++;
                yield {
                  profileId: id,
                  q1, q5, q2, q4, q3, q6,
                  q7: q7kind === "flexible" ? "flexible_tournament" : q7kind,
                  fromDate, toDate,
                };
              }
}

const profileCount = Q1.length * Q5.length * Q2.length * Q4.length * Q3.length * Q6.length * Q7_SCENARIOS.length;
console.log(`Profile grid size: ${profileCount} (expected 15552)`);
if (profileCount !== 15552) throw new Error(`Profile grid size mismatch: ${profileCount} !== 15552`);

const profilesPath = path.join(OUT_DIR, "us_open_15552_profiles.jsonl");
const exceptionsPath = path.join(OUT_DIR, "us_open_15552_exceptions.jsonl");
const profilesStream = fs.createWriteStream(profilesPath);
const exceptionsStream = fs.createWriteStream(exceptionsPath);

let total = 0, eligibleProfiles = 0, noMatchProfiles = 0, exceptionCount = 0;
let referenceExplanationCount = 0, generalizedExplanationCount = 0, explanationErrorCount = 0;
const uniqueTopThree = new Set();
const heroWinnerCounts = {};

const startTime = Date.now();
for (const p of allProfiles()) {
  total++;
  const answers = { q1: p.q1, q2: p.q2, q3: p.q3, q4: p.q4, q5: p.q5, q6: p.q6, q7: p.q7, fromDate: p.fromDate, toDate: p.toDate };

  let result;
  try {
    result = scoreTennisOptions(options, answers, "us-open");
  } catch (err) {
    exceptionCount++;
    exceptionsStream.write(JSON.stringify({ profileId: p.profileId, stage: "scoring", profile: p, error: String(err?.message ?? err) }) + "\n");
    continue;
  }

  const record = {
    profileId: p.profileId,
    q1: p.q1, q2: p.q2, q3: p.q3, q4: p.q4, q5: p.q5, q6: p.q6, q7: p.q7, fromDate: p.fromDate, toDate: p.toDate,
    eligibleCount: options.length - result.excludedCount,
  };

  if (!result.hero) {
    noMatchProfiles++;
    record.status = "no_match";
    profilesStream.write(JSON.stringify(record) + "\n");
    continue;
  }

  eligibleProfiles++;
  const heroId = result.hero.option.optionNumber;
  const alt1Id = result.alternative1?.option.optionNumber ?? null;
  const alt2Id = result.alternative2?.option.optionNumber ?? null;

  record.status = "eligible";
  record.heroOptionId = heroId;
  record.alternative1OptionId = alt1Id;
  record.alternative2OptionId = alt2Id;
  record.heroScore = {
    c1: result.hero.contributions.c1 / 27, c2: result.hero.contributions.c2 / 17, c3: result.hero.contributions.c3 / 17,
    c4: result.hero.contributions.c4 / 12, c5: result.hero.contributions.c5 / 27,
    rawScoreE: result.hero.rawScore, costIndex: result.hero.option.costIndex,
    alpha: { value_focused: 0.2, balanced: 0.1, premium: 0.05 }[p.q6],
    adjustedScoreV: result.hero.adjustedScore,
  };

  uniqueTopThree.add([heroId, alt1Id, alt2Id].join(","));
  heroWinnerCounts[result.hero.option.arenaName] = (heroWinnerCounts[result.hero.option.arenaName] ?? 0) + 1;

  try {
    const expl = selectUsOpenExplanations(answers, result.hero, result.alternative1, result.alternative2);
    record.heroExplanation = expl.hero.text;
    record.heroExplanationSource = expl.hero.source;
    record.alternative1Explanation = expl.alternative1?.text ?? null;
    record.alternative1ExplanationSource = expl.alternative1?.source ?? null;
    record.alternative2Explanation = expl.alternative2?.text ?? null;
    record.alternative2ExplanationSource = expl.alternative2?.source ?? null;
    if (expl.hero.source === "reference") referenceExplanationCount++;
    else generalizedExplanationCount++;
  } catch (err) {
    explanationErrorCount++;
    exceptionsStream.write(JSON.stringify({ profileId: p.profileId, stage: "explanation", profile: p, heroId, alt1Id, alt2Id, error: String(err?.message ?? err) }) + "\n");
    record.explanationError = String(err?.message ?? err);
  }

  profilesStream.write(JSON.stringify(record) + "\n");
}

profilesStream.end();
exceptionsStream.end();

const elapsedMs = Date.now() - startTime;

// Expected no-match count, per the Python audit's own logic: every profile
// using the two out-of-range fixed-date scenarios (2027-08-28, 2027-09-13)
// has zero eligible options for every Q1/Q5/Q2/Q4/Q3/Q6 combination (31
// options, all eligible windows inside 2027-08-29..2027-09-10), so expected
// no-match count = 2 (date scenarios) x (profile count / 9 date scenarios).
const expectedNoMatch = (2 / 9) * profileCount;

const summary = {
  profileCount: total,
  eligibleProfiles,
  noMatchProfiles,
  expectedNoMatchProfiles: expectedNoMatch,
  noMatchCountMatchesExpectation: noMatchProfiles === expectedNoMatch,
  exceptionCount,
  explanationErrorCount,
  referenceExplanationHeroCount: referenceExplanationCount,
  generalizedExplanationHeroCount: generalizedExplanationCount,
  uniqueTopThreeCombinations: uniqueTopThree.size,
  heroWinnerCountsByArena: heroWinnerCounts,
  elapsedMs,
  generatedAtUtc: new Date().toISOString(),
  productionCodePaths: {
    scoring: "app/ticket-intelligence/tennis/[slug]/_lib/scoreTennisOptions.ts",
    explanation: "app/ticket-intelligence/tennis/[slug]/_lib/usOpenExplanation.ts",
  },
  notes: [
    "Runs the actual production scoreTennisOptions()/selectUsOpenExplanations() modules, not a separate simplified scorer.",
    "Profile grid and the 9 Q7 date scenarios are copied exactly from the handoff's own independent Python reference (uso_phase3_audit.py).",
    "generalizedExplanationHeroCount reflects the ported v6 fallback for every profile outside the 16 exact reference triplets -- that text is the frozen implementation baseline, not individually founder-approved (see usOpenExplanation.ts header comment).",
  ],
};

fs.writeFileSync(path.join(OUT_DIR, "us_open_15552_summary.json"), JSON.stringify(summary, null, 2));

console.log(JSON.stringify(summary, null, 2));
console.log(`\nWrote:\n  ${profilesPath}\n  ${exceptionsPath}\n  ${path.join(OUT_DIR, "us_open_15552_summary.json")}`);
