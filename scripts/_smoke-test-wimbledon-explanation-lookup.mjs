import fs from "node:fs";

// Verifies the compiled wimbledonExplanationCatalogue.json is internally
// consistent and that a representative set of lookups (one per court
// category + one flexible + one adjustable) resolve correctly, exercising
// the exact lookup-key logic wimbledonExplanation.ts uses (mode/day/Q1/
// Q2/Q3/Q5/Q6/rank), without needing a bundler to import the .ts module
// directly from a plain script.

const CATALOGUE_PATH = "app/ticket-intelligence/tennis/[slug]/_lib/wimbledonExplanationCatalogue.json";
const catalogue = JSON.parse(fs.readFileSync(CATALOGUE_PATH, "utf8"));

let failures = 0;
function check(label, cond, detail = "") {
  const status = cond ? "PASS" : "FAIL";
  if (!cond) failures++;
  console.log(`[${status}] ${label}${detail ? " — " + detail : ""}`);
}

check("uniqueKeyCount field matches actual entries count", catalogue.uniqueKeyCount === Object.keys(catalogue.entries).length);
check("uniqueKeyCount = 50112", catalogue.uniqueKeyCount === 50112, `got ${catalogue.uniqueKeyCount}`);
check("strings array is non-empty and all non-empty strings", catalogue.strings.length > 0 && catalogue.strings.every((s) => typeof s === "string" && s.length > 0));

function lookupKey(mode, day, q1, q2, q3, q5, q6, rank) {
  return [mode, day, q1, q2, q3, q5, q6, rank].join("|");
}

// Representative lookups: flexible, fixed, adjustable, across a spread of answers.
const scenarios = [
  { mode: "flexible", day: "", q1: "lots_of_tennis", q2: "early", q3: "reserved", q5: "close_to_action", q6: "value_focused" },
  { mode: "fixed", day: "7", q1: "big_stadium", q2: "later", q3: "exploring", q5: "flexible", q6: "premium" },
  { mode: "adjustable", day: "1", q1: "close_up_courts", q2: "middle", q3: "mix", q5: "clear_balanced_view", q6: "balanced" },
  { mode: "fixed", day: "14", q1: "balance", q2: "later", q3: "no_preference", q5: "no_preference", q6: "value_focused" },
];

for (const s of scenarios) {
  for (const rank of [1, 2, 3]) {
    const key = lookupKey(s.mode, s.day, s.q1, s.q2, s.q3, s.q5, s.q6, rank);
    const entry = catalogue.entries[key];
    const label = `lookup resolves: mode=${s.mode} day="${s.day}" q1=${s.q1} q2=${s.q2} q3=${s.q3} q5=${s.q5} q6=${s.q6} rank=${rank}`;
    check(label, !!entry);
    if (entry) {
      const [optionNumber, score, textIdx] = entry;
      check(`  -> option_number in 1-25 range`, optionNumber >= 1 && optionNumber <= 25, `got ${optionNumber}`);
      check(`  -> fan_facing_text non-empty`, !!catalogue.strings[textIdx], `"${(catalogue.strings[textIdx] || "").slice(0, 60)}..."`);
    }
  }
}

// Confirm scores descend with rank within each scenario (hero highest).
for (const s of scenarios) {
  const scores = [1, 2, 3].map((rank) => catalogue.entries[lookupKey(s.mode, s.day, s.q1, s.q2, s.q3, s.q5, s.q6, rank)]?.[1]);
  check(`scores descend hero>alt1>alt2 for scenario mode=${s.mode} day="${s.day}"`, scores[0] >= scores[1] && scores[1] >= scores[2], `${scores.join(" >= ")}`);
}

console.log(failures === 0 ? "\nALL EXPLANATION-LOOKUP SMOKE TESTS PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
