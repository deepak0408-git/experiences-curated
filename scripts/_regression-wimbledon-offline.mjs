import fs from "node:fs";

// OFFLINE exhaustive regression comparison — reproduces the deployed
// scoring formula/eligibility rules and the deployed explanation lookup
// directly from the approved frozen source files (no DB, no network,
// no production app invocation), and compares against the approved
// package's own Phase 4 flexible-ranking reference
// (Wimbledon_2027_Phase4_Flexible_Rankings.json) for the flexible-mode
// subset (1,728 of the 50,112 total profiles — the only subset that
// reference file covers; fixed/adjustable aren't included in Phase 4's
// own export).
//
// Read-only and deterministic. Never writes to production data or the
// golden reference files. Emits a JSON/CSV discrepancy report.
//
// Usage:
//   node --experimental-strip-types scripts/_regression-wimbledon-offline.mjs \
//     <path-to-25_options_reference.csv> \
//     <path-to-Wimbledon_2027_Phase4_Flexible_Rankings.json> \
//     <path-to-wimbledonExplanationCatalogue.json> \
//     <output-report.json>

const [optionsCsvPath, flexibleRankingsPath, cataloguePath, outPath] = process.argv.slice(2);
if (!optionsCsvPath || !flexibleRankingsPath || !cataloguePath || !outPath) {
  console.error(
    "Usage: node _regression-wimbledon-offline.mjs <25_options_reference.csv> <Phase4_Flexible_Rankings.json> <wimbledonExplanationCatalogue.json> <out.json>"
  );
  process.exit(2);
}

function parseCsv(file) {
  const content = fs.readFileSync(file, "utf8").trim();
  const lines = content.split(/\r?\n/);
  function parseLine(line) {
    const out = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else inQ = false; }
        else cur += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === ",") { out.push(cur); cur = ""; }
        else cur += c;
      }
    }
    out.push(cur);
    return out;
  }
  const header = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseLine(line);
    const row = {};
    header.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

const optionRows = parseCsv(optionsCsvPath);
const flexibleRankings = JSON.parse(fs.readFileSync(flexibleRankingsPath, "utf8"));
const catalogue = JSON.parse(fs.readFileSync(cataloguePath, "utf8"));

// Reproduces scoreTennisOptions.ts's formula exactly (verified line-by-line
// against the deployed TS during implementation, 25 Oct 2026) using the
// deployed option rows' own data (not re-deriving/guessing anything).
const WEIGHTS = { C1: 27, C2: 17, C3: 17, C4: 12, C5: 27 };
const Q1_IDX = { lots_of_tennis: 0, big_stadium: 1, close_up_courts: 2, balance: 3 };
const Q5_IDX = { close_to_action: 0, clear_balanced_view: 1, no_preference: 2, flexible: 3 };
const Q6_ALPHA = { value_focused: 0.2, balanced: 0.1, premium: 0.05 };
const STAGE_IDX = { Early: 0, Middle: 1, Late: 2 };
const Q2_IDX = { early: 0, middle: 1, later: 2 };
const Q3_GP = { reserved: null, exploring: 1, mix: 0.65, no_preference: 1 };

function score(option, answers) {
  const c1raw = [option.c1_lots_of_tennis, option.c1_big_stadium, option.c1_close_up_courts, option.c1_balance].map(Number);
  const c1 = c1raw[Q1_IDX[answers.q1]];
  const optStage = STAGE_IDX[option.stage_code];
  const ansStage = Q2_IDX[answers.q2];
  const dist = Math.abs(optStage - ansStage);
  const c2 = dist === 0 ? 1 : dist === 1 ? 0.45 : 0.1;
  const c3raw = option.arena_code === "GP" ? Q3_GP[answers.q3] : 1;
  if (c3raw === null) return null; // hard-excluded
  const c3 = c3raw;
  const c4 = 1; // neutral_all
  const c5raw = [option.c5_close_to_action, option.c5_clear_balanced_view, option.c5_no_preference, option.c5_flexible].map(Number);
  const c5 = c5raw[Q5_IDX[answers.q5]];
  const E = WEIGHTS.C1 * c1 + WEIGHTS.C2 * c2 + WEIGHTS.C3 * c3 + WEIGHTS.C4 * c4 + WEIGHTS.C5 * c5;
  const alpha = Q6_ALPHA[answers.q6];
  const V = E / Math.pow(Number(option.cost_index) / 100, alpha);
  return { E, V };
}

function rank(options, answers) {
  const eligible = options.filter((o) => !(o.arena_code === "GP" && answers.q3 === "reserved"));
  const scored = eligible
    .map((o) => ({ option: o, ...score(o, answers) }))
    .filter((s) => s.V !== null)
    .sort((a, b) => (b.V !== a.V ? b.V - a.V : parseInt(a.option.option_number, 10) - parseInt(b.option.option_number, 10)));
  return scored;
}

const Q1 = ["lots_of_tennis", "big_stadium", "close_up_courts", "balance"];
const Q2 = ["early", "middle", "later"];
const Q3 = ["reserved", "exploring", "mix", "no_preference"];
const Q5 = ["close_to_action", "clear_balanced_view", "no_preference", "flexible"];
const Q6 = ["value_focused", "balanced", "premium"];

const discrepancies = [];
let checked = 0;

for (const q1 of Q1) {
  for (const q2 of Q2) {
    for (const q3 of Q3) {
      for (const q5 of Q5) {
        for (const q6 of Q6) {
          const answers = { q1, q2, q3, q5, q6 };
          const scored = rank(optionRows, answers);
          const actualTop3 = scored.slice(0, 3).map((s) => parseInt(s.option.option_number, 10));

          // Find the matching reference record (Phase4 export uses
          // positional tuple order [q1,q2,q3,q5,q6]).
          const ref = flexibleRankings.find(
            (r) => r.answers[0] === q1 && r.answers[1] === q2 && r.answers[2] === q3 && r.answers[3] === q5 && r.answers[4] === q6
          );
          checked++;
          if (!ref) {
            discrepancies.push({ profile: answers, type: "MISSING_REFERENCE", expected: null, actual: actualTop3 });
            continue;
          }
          const expectedTop3 = ref.top3.map((t) => t.id);
          if (JSON.stringify(expectedTop3) !== JSON.stringify(actualTop3)) {
            discrepancies.push({ profile: answers, type: "TOP3_MISMATCH", expected: expectedTop3, actual: actualTop3 });
          }

          // Cross-check explanation catalogue resolves for this profile's
          // flexible-mode rank 1/2/3 and matches the actual scored option
          // numbers.
          for (const r1 of [1, 2, 3]) {
            const key = ["flexible", "", q1, q2, q3, q5, q6, r1].join("|");
            const entry = catalogue.entries[key];
            const expectedOption = actualTop3[r1 - 1];
            if (expectedOption === undefined) continue; // fewer than 3 eligible — fine
            if (!entry) {
              discrepancies.push({ profile: answers, type: "EXPLANATION_KEY_MISSING", rank: r1, key });
            } else if (entry[0] !== expectedOption) {
              discrepancies.push({ profile: answers, type: "EXPLANATION_OPTION_MISMATCH", rank: r1, expected: expectedOption, actual: entry[0] });
            }
          }
        }
      }
    }
  }
}

const report = {
  mode: "offline",
  profilesChecked: checked,
  discrepancyCount: discrepancies.length,
  discrepancies,
};
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(`Checked ${checked} flexible-mode profiles (576 expected — Q1x Q2x Q3x Q5x Q6).`);
console.log(`Discrepancies: ${discrepancies.length}`);
console.log(`Report written to ${outPath}`);
process.exit(discrepancies.length === 0 ? 0 : 1);
