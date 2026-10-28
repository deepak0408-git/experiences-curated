import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { scoreTennisOptions } from "../app/ticket-intelligence/tennis/[slug]/_lib/scoreTennisOptions.ts";
import { selectUsOpenExplanations } from "../app/ticket-intelligence/tennis/[slug]/_lib/usOpenExplanation.ts";

// Produces the actual production-code outputs for all 16 approved
// reference profiles and their 48 explanation passages, end to end
// (scoring -> ranking -> explanation selection), for Section E of the
// validation package. Exact-match pass/fail recorded per passage.

const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";
const OUT = process.argv[2] || "./scripts/_uso27-source/reference-validation";
fs.mkdirSync(OUT, { recursive: true });

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
const options = dbRows.map(toTicketOption);

const REFERENCE_PROFILES = [
  { set: 1, q1: "lots_of_tennis", q5: "close_to_action", q2: "later", q4: "either", q3: "mix", q6: "value_focused", q7: "fixed", fromDate: "2027-08-29", toDate: "2027-08-29", hero: 29, alt1: 25, alt2: 28 },
  { set: 2, q1: "close_up_courts", q5: "clear_balanced_view", q2: "early", q4: "day", q3: "exploring", q6: "balanced", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 22, alt1: 29, alt2: 28 },
  { set: 3, q1: "big_stadium", q5: "no_preference", q2: "middle", q4: "night", q3: "reserved", q6: "premium", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 10, alt1: 11, alt2: 12 },
  { set: 4, q1: "balance", q5: "close_to_action", q2: "middle", q4: "day", q3: "no_preference", q6: "balanced", q7: "fixed", fromDate: "2027-09-09", toDate: "2027-09-09", hero: 15, alt1: 14, alt2: 18 },
  { set: 5, q1: "big_stadium", q5: "flexible", q2: "later", q4: "either", q3: "reserved", q6: "value_focused", q7: "fixed", fromDate: "2027-08-29", toDate: "2027-08-29", hero: 4, alt1: 1, alt2: 5 },
  { set: 6, q1: "close_up_courts", q5: "clear_balanced_view", q2: "middle", q4: "night", q3: "exploring", q6: "premium", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 11, alt1: 24, alt2: 26 },
  { set: 7, q1: "lots_of_tennis", q5: "flexible", q2: "later", q4: "day", q3: "mix", q6: "balanced", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 31, alt1: 29, alt2: 30 },
  { set: 8, q1: "balance", q5: "no_preference", q2: "later", q4: "night", q3: "mix", q6: "premium", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 16, alt1: 17, alt2: 18 },
  { set: 9, q1: "close_up_courts", q5: "no_preference", q2: "middle", q4: "either", q3: "no_preference", q6: "premium", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 30, alt1: 26, alt2: 27 },
  { set: 10, q1: "balance", q5: "flexible", q2: "later", q4: "night", q3: "exploring", q6: "value_focused", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 16, alt1: 31, alt2: 17 },
  { set: 11, q1: "big_stadium", q5: "clear_balanced_view", q2: "later", q4: "day", q3: "reserved", q6: "value_focused", q7: "adjustable", fromDate: "2027-09-12", toDate: "2027-09-12", hero: 14, alt1: 20, alt2: 13 },
  { set: 12, q1: "lots_of_tennis", q5: "no_preference", q2: "later", q4: "either", q3: "no_preference", q6: "balanced", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 16, alt1: 13, alt2: 19 },
  { set: 13, q1: "big_stadium", q5: "close_to_action", q2: "later", q4: "day", q3: "reserved", q6: "value_focused", q7: "fixed", fromDate: "2027-09-12", toDate: "2027-09-12", hero: 21, alt1: 20, alt2: 19 },
  { set: 14, q1: "balance", q5: "flexible", q2: "later", q4: "either", q3: "exploring", q6: "balanced", q7: "fixed", fromDate: "2027-09-12", toDate: "2027-09-12", hero: 19, alt1: 20, alt2: 21 },
  { set: 15, q1: "lots_of_tennis", q5: "close_to_action", q2: "later", q4: "night", q3: "mix", q6: "premium", q7: "fixed", fromDate: "2027-08-29", toDate: "2027-08-29", hero: 25, alt1: 6, alt2: 24 },
  { set: 16, q1: "close_up_courts", q5: "close_to_action", q2: "middle", q4: "day", q3: "reserved", q6: "value_focused", q7: "fixed", fromDate: "2027-08-29", toDate: "2027-08-29", hero: 28, alt1: 23, alt2: 3 },
];

// Approved text, loaded from the catalogue build's own source (CSV), for
// an exact independent comparison against this run's actual output.
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
const verif = parseCsv(fs.readFileSync("./scripts/_uso27-source/48_reference_verification.csv", "utf8"));
// Group by set -> {Hero, "Alternative 1", "Alternative 2"} first, then
// build a TRIPLET-keyed lookup (not a "set number"-keyed one) -- the
// verification CSV's own "set" column numbering does NOT correspond to
// this script's REFERENCE_PROFILES array order (confirmed earlier,
// scripts/_build-us-open-explanation-catalogue.mjs's own header comment:
// "profile CSV row 1 has hero=29, which is verification set 5, not set
// 1"). Keying by the real (hero,alt1,alt2) triplet instead avoids
// reintroducing that exact mislabeling bug here.
const bySet = {};
for (const row of verif) (bySet[row.set] = bySet[row.set] || {})[row.role] = { optionId: Number(row.option_id), approved: row.approved };
const approvedByTripletRole = {};
for (const set of Object.keys(bySet)) {
  const h = bySet[set]["Hero"].optionId, a1 = bySet[set]["Alternative 1"].optionId, a2 = bySet[set]["Alternative 2"].optionId;
  const triplet = `${h},${a1},${a2}`;
  approvedByTripletRole[`${triplet}|Hero`] = bySet[set]["Hero"].approved;
  approvedByTripletRole[`${triplet}|Alternative 1`] = bySet[set]["Alternative 1"].approved;
  approvedByTripletRole[`${triplet}|Alternative 2`] = bySet[set]["Alternative 2"].approved;
}

const results = [];
let rankPass = 0, rankFail = 0;
let passageExact = 0, passageFail = 0;

for (const p of REFERENCE_PROFILES) {
  const answers = { q1: p.q1, q2: p.q2, q3: p.q3, q4: p.q4, q5: p.q5, q6: p.q6, q7: p.q7, fromDate: p.fromDate, toDate: p.toDate };
  const scoreResult = scoreTennisOptions(options, answers, "us-open");
  const gotHero = scoreResult.hero?.option.optionNumber;
  const gotAlt1 = scoreResult.alternative1?.option.optionNumber;
  const gotAlt2 = scoreResult.alternative2?.option.optionNumber;
  const rankingExact = gotHero === p.hero && gotAlt1 === p.alt1 && gotAlt2 === p.alt2;
  if (rankingExact) rankPass++; else rankFail++;

  let explanation = null;
  if (rankingExact) {
    explanation = selectUsOpenExplanations(answers, scoreResult.hero, scoreResult.alternative1, scoreResult.alternative2);
  }

  const record = {
    set: p.set,
    profile: { q1: p.q1, q2: p.q2, q3: p.q3, q4: p.q4, q5: p.q5, q6: p.q6, q7: p.q7, fromDate: p.fromDate, toDate: p.toDate },
    expectedTopThree: [p.hero, p.alt1, p.alt2],
    actualTopThree: [gotHero, gotAlt1, gotAlt2],
    rankingExactMatch: rankingExact,
    passages: {},
  };

  const triplet = `${p.hero},${p.alt1},${p.alt2}`;
  for (const [role, text] of [["Hero", explanation?.hero.text], ["Alternative 1", explanation?.alternative1?.text], ["Alternative 2", explanation?.alternative2?.text]]) {
    const approved = approvedByTripletRole[`${triplet}|${role}`];
    const exact = text === approved;
    if (exact) passageExact++; else passageFail++;
    record.passages[role] = { approved, actual: text ?? null, exactMatch: exact, source: role === "Hero" ? explanation?.hero.source : role === "Alternative 1" ? explanation?.alternative1?.source : explanation?.alternative2?.source };
  }

  results.push(record);
}

const summary = {
  totalProfiles: REFERENCE_PROFILES.length,
  rankingExactMatches: rankPass,
  rankingMismatches: rankFail,
  totalPassages: passageExact + passageFail,
  passageExactMatches: passageExact,
  passageMismatches: passageFail,
};

fs.writeFileSync(path.join(OUT, "16_reference_profile_results.json"), JSON.stringify(results, null, 2));
fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
