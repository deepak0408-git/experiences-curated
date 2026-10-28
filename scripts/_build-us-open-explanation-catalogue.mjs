import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Builds app/ticket-intelligence/tennis/[slug]/_lib/usOpenExplanationCatalogue.json
// from the Phase 4 handoff's two reference CSVs (copied locally to
// scripts/_uso27-source/):
//   - 16_reference_profiles.csv (USO27_Phase4_Expanded_Diverse_Review_Profiles.csv):
//     the 16 approved Q1-Q7 profiles + their frozen hero/alt1/alt2 option IDs.
//   - 48_reference_verification.csv (USO27_Phase4_Closure_48_Reference_Verification.csv):
//     48 rows (16 profiles x 3 roles), each with the approved passage text,
//     already self-verified exact_match=True against the engine's own
//     generated output.
//
// IMPORTANT: the two files' row/"set" ordering do NOT correspond 1:1 by
// position — verified directly (profile CSV row 1 has hero=29, which is
// verification "set 5", not "set 1"). This script joins them by matching
// the (hero, alt1, alt2) ID triplet, which is unambiguous (verified: all
// 16 triplets are distinct, every profile row matches exactly one set).
// Never assume row-position alignment between frozen reference files.
//
// This covers ONLY the 16 exact reference profiles (48 passages). The v8
// engine's generalized fallback for every other Q1-Q7 combination depends
// on helper functions (venue/name/occasion/setting/view/cost/stage/hero)
// defined in USO27_Phase4_Explanation_Engine_v6.py, which is NOT included
// in this handoff package — confirmed absent by a full file search of the
// extracted zip. usOpenExplanation.ts therefore throws (does not guess) on
// any profile outside these 16, by design, until that file is supplied.

const dir = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(dir, "_uso27-source");

function parseCsv(file) {
  const text = fs.readFileSync(file, "utf8");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (c === "\r") {
        // skip
      } else field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows[0];
  return rows.slice(1).filter((r) => r.length > 1).map((cells) => {
    const obj = {};
    header.forEach((h, i) => (obj[h] = cells[i] ?? ""));
    return obj;
  });
}

const profiles = parseCsv(path.join(SRC, "16_reference_profiles.csv"));
const verification = parseCsv(path.join(SRC, "48_reference_verification.csv"));

if (profiles.length !== 16) throw new Error(`Expected 16 reference profiles, found ${profiles.length}`);
if (verification.length !== 48) throw new Error(`Expected 48 verification rows, found ${verification.length}`);

// Confirm every verification row is an exact match before trusting its text.
for (const row of verification) {
  if (row.exact_match !== "True") {
    throw new Error(`Verification row for set ${row.set} role ${row.role} is not exact_match=True — stop, do not build catalogue from unverified text.`);
  }
}

// Group verification rows by set -> { Hero, "Alternative 1", "Alternative 2" }.
const bySet = {};
for (const row of verification) {
  (bySet[row.set] = bySet[row.set] || {})[row.role] = { optionId: parseInt(row.option_id, 10), text: row.approved };
}

const sets = Object.keys(bySet);
if (sets.length !== 16) throw new Error(`Expected 16 distinct sets in verification data, found ${sets.length}`);

// Build set -> (hero,alt1,alt2) triplet string, for joining against profiles.
const tripletForSet = {};
for (const set of sets) {
  const byRole = bySet[set];
  tripletForSet[set] = [byRole["Hero"].optionId, byRole["Alternative 1"].optionId, byRole["Alternative 2"].optionId].join(",");
}

const strings = [];
const entries = {};
const usedSets = new Set();

for (const p of profiles) {
  const heroId = parseInt(p.hero, 10);
  const alt1Id = parseInt(p.alt1, 10);
  const alt2Id = parseInt(p.alt2, 10);
  const triplet = [heroId, alt1Id, alt2Id].join(",");
  const matchSet = sets.find((s) => tripletForSet[s] === triplet);
  if (!matchSet) {
    throw new Error(`No verification set matches profile triplet (${triplet}) for profile q1=${p.q1} q5=${p.q5} q2=${p.q2} q4=${p.q4} q3=${p.q3} q6=${p.q6} q7=${p.date_mode} date=${p.date} — stop and report.`);
  }
  usedSets.add(matchSet);

  const byRole = bySet[matchSet];
  const heroTextIdx = strings.push(byRole["Hero"].text) - 1;
  const alt1TextIdx = strings.push(byRole["Alternative 1"].text) - 1;
  const alt2TextIdx = strings.push(byRole["Alternative 2"].text) - 1;

  // Key mirrors frenchOpenExplanation.ts's shape: q1-q6 + q7 mode + date +
  // the frozen hero/alt1/alt2 IDs. q7's raw CSV value is "fixed" |
  // "adjustable" | "flexible" (not "flexible_tournament") — mapped to the
  // app's QuizAnswers.q7 union in usOpenExplanation.ts's lookupKey, not
  // here, so this catalogue stores the source CSV's own values verbatim.
  const key = [p.q1, p.q2, p.q3, p.q4, p.q5, p.q6, p.date_mode, p.date || "", heroId, alt1Id, alt2Id].join("|");
  if (entries[key]) throw new Error(`Duplicate catalogue key "${key}" — stop and report.`);
  entries[key] = [heroId, alt1Id, alt2Id, heroTextIdx, alt1TextIdx, alt2TextIdx];
}

if (usedSets.size !== 16) throw new Error(`Expected all 16 verification sets to be used, used ${usedSets.size}`);

const catalogue = {
  uniqueKeyCount: Object.keys(entries).length,
  strings,
  entries,
};

const outPath = path.join(dir, "..", "app", "ticket-intelligence", "tennis", "[slug]", "_lib", "usOpenExplanationCatalogue.json");
fs.writeFileSync(outPath, JSON.stringify(catalogue, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Entries: ${catalogue.uniqueKeyCount}, strings: ${strings.length} (expected 48)`);
