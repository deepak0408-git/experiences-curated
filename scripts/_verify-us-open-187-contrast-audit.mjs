import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import postgres from "postgres";
import { selectUsOpenExplanations } from "../app/ticket-intelligence/tennis/[slug]/_lib/usOpenExplanation.ts";

// Verifies the production usOpenExplanation.ts's alternative-card text
// against the handoff's own 187-contrasting-profile audit
// (USO27_Phase4_Closure_187_Contrast_Audit.csv), which records two
// profiles (a/b) sharing the same hero/alt1/alt2 triplet but differing
// preferences, and the alt1/alt2 explanation text each produced. This is
// the broader, more adversarial sample the spec's §12.3/§G ask for,
// beyond the 16 exact reference profiles.
//
// IMPORTANT: a profile in this file can be EITHER a reference profile
// (text comes from the 16/48 catalogue) OR a non-reference profile (text
// comes from the ported v6 generative fallback) -- this script resolves
// each profile_a/profile_b string back into full Q1-Q7 answers via
// pattern matching ("q1=...; q5=...; ..."), reconstructs the exact
// QuizAnswers the audit file used, and calls the real production
// selectUsOpenExplanations() to get actual output for comparison, rather
// than assuming either path.

const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";

function parseCsv(text) {
  const rows = []; let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) { if (c === '"') { if (text[i+1] === '"') { field += '"'; i++; } else inQuotes = false; } else field += c; }
    else { if (c === '"') inQuotes = true; else if (c === ",") { row.push(field); field=""; } else if (c === "\n") { row.push(field); rows.push(row); row=[]; field=""; } else if (c === "\r") {} else field += c; }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const header = rows[0];
  return rows.slice(1).filter(r=>r.length>1).map(cells => { const o={}; header.forEach((h,i)=>o[h]=cells[i]??""); return o; });
}

// Parses "q1=lots_of_tennis; q5=no_preference; q6=value_focused; q4=Night; q2=Early; q3=reserved"
// into a partial-answers object with SOURCE spellings (q2 as stage code,
// q4 capitalized) -- this file has no q7/date column, so every profile
// here is tested under q7="flexible_tournament" (no date restriction),
// consistent with how the audit's own underlying generation most likely
// ran (the 15,552 grid's "flexible" scenario is 1 of 9 Q7 scenarios and
// date never appears in this file's columns at all).
function parseProfileString(s) {
  const out = {};
  for (const part of s.split(";")) {
    const [k, v] = part.trim().split("=");
    out[k.trim()] = v.trim();
  }
  return out;
}

const Q2_SOURCE_TO_APP = { Early: "early", Middle: "middle", Late: "later" };
const Q4_SOURCE_TO_APP = { Day: "day", Night: "night", Either: "either" };
const Q5_SOURCE_TO_APP = { close_to_action: "close_to_action", balanced_view: "clear_balanced_view", no_preference: "no_preference", flexible_explore: "flexible" };

function toAnswers(parsed) {
  return {
    q1: parsed.q1,
    q2: Q2_SOURCE_TO_APP[parsed.q2],
    q3: parsed.q3,
    q4: Q4_SOURCE_TO_APP[parsed.q4],
    q5: Q5_SOURCE_TO_APP[parsed.q5],
    q6: parsed.q6,
    q7: "flexible_tournament",
    fromDate: null,
    toDate: null,
  };
}

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
  FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${US_OPEN_EVENT_ID} ORDER BY option_number
`;
await sql.end();

function toTicketOption(r) {
  return {
    id: String(r.option_number), optionNumber: Number(r.option_number), arenaCode: r.arenaCode, arenaName: r.arenaName,
    stageCode: r.stageCode, stageLabel: r.stageLabel, roundsLabel: r.roundsLabel, sessionCode: r.sessionCode,
    sessionLabel: r.sessionLabel, seatingCode: r.seatingCode, seatingLabel: r.seatingLabel, costIndex: Number(r.costIndex),
    costStars: Number(r.costStars), descriptionText: r.descriptionText, heroImage: r.heroImage, stand: r.stand,
    eligibleFrom: r.eligibleFrom ? r.eligibleFrom.toISOString().slice(0, 10) : null,
    eligibleTo: r.eligibleTo ? r.eligibleTo.toISOString().slice(0, 10) : null,
    c1LotsOfTennis: r.c1LotsOfTennis===null?null:Number(r.c1LotsOfTennis), c1BigStadium: r.c1BigStadium===null?null:Number(r.c1BigStadium),
    c1CloseUpCourts: r.c1CloseUpCourts===null?null:Number(r.c1CloseUpCourts), c1BalancedExperience: r.c1BalancedExperience===null?null:Number(r.c1BalancedExperience),
    c5CloseToAction: r.c5CloseToAction===null?null:Number(r.c5CloseToAction), c5BalancedView: r.c5BalancedView===null?null:Number(r.c5BalancedView),
    c5NoPreference: r.c5NoPreference===null?null:Number(r.c5NoPreference), c5FlexibleExplore: r.c5FlexibleExplore===null?null:Number(r.c5FlexibleExplore),
  };
}
const optionsByNum = new Map(dbRows.map(toTicketOption).map((o) => [o.optionNumber, o]));

function mkScoredOption(option) {
  return { option, rawScore: 0, adjustedScore: 0, contributions: { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 } };
}

const audit = parseCsv(fs.readFileSync("scripts/_uso27-source/187_contrast_audit.csv", "utf8"));
if (audit.length !== 187) throw new Error(`Expected 187 rows, found ${audit.length}`);

let total = 0, alt1Match = 0, alt2Match = 0, alt1Mismatch = 0, alt2Mismatch = 0;
const mismatches = [];

for (const row of audit) {
  const heroId = Number(row.hero_id), alt1Id = Number(row.alt1_id), alt2Id = Number(row.alt2_id);
  const heroOpt = optionsByNum.get(heroId), alt1Opt = optionsByNum.get(alt1Id), alt2Opt = optionsByNum.get(alt2Id);
  if (!heroOpt || !alt1Opt || !alt2Opt) { console.log("MISSING option for row", row); continue; }

  for (const variant of ["a", "b"]) {
    const profileStr = row[`profile_${variant}`];
    const expectedAlt1 = row[`alt1_${variant}`];
    const expectedAlt2 = row[`alt2_${variant}`];
    const parsed = parseProfileString(profileStr);
    const answers = toAnswers(parsed);

    total++;
    const result = selectUsOpenExplanations(answers, mkScoredOption(heroOpt), mkScoredOption(alt1Opt), mkScoredOption(alt2Opt));

    if (result.alternative1.text === expectedAlt1) alt1Match++;
    else { alt1Mismatch++; mismatches.push({ hero: heroId, alt1: alt1Id, alt2: alt2Id, variant, role: "alt1", expected: expectedAlt1, got: result.alternative1.text, source: result.alternative1.source }); }

    if (result.alternative2.text === expectedAlt2) alt2Match++;
    else { alt2Mismatch++; mismatches.push({ hero: heroId, alt1: alt1Id, alt2: alt2Id, variant, role: "alt2", expected: expectedAlt2, got: result.alternative2.text, source: result.alternative2.source }); }
  }
}

console.log(`Total profile-instances tested: ${total} (187 rows x 2 variants = 374)`);
console.log(`alt1: ${alt1Match} match, ${alt1Mismatch} mismatch`);
console.log(`alt2: ${alt2Match} match, ${alt2Mismatch} mismatch`);
for (const m of mismatches.slice(0, 10)) {
  console.log("---", JSON.stringify({ hero: m.hero, alt1: m.alt1, alt2: m.alt2, variant: m.variant, role: m.role, source: m.source }));
  console.log("EXPECTED:", m.expected);
  console.log("GOT     :", m.got);
}

fs.writeFileSync(
  "scripts/_uso27-source/regression-output/us_open_187_contrast_verification.json",
  JSON.stringify({ total, alt1Match, alt1Mismatch, alt2Match, alt2Mismatch, mismatches }, null, 2)
);
