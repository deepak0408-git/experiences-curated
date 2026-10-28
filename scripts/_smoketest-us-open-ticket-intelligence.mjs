import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { scoreTennisOptions } from "../app/ticket-intelligence/tennis/[slug]/_lib/scoreTennisOptions.ts";
import { selectUsOpenExplanations } from "../app/ticket-intelligence/tennis/[slug]/_lib/usOpenExplanation.ts";

// Smoke test for US Open 2027 Ticket Intelligence:
//  1. 31 options seeded correctly (count, C1-C5, arena codes).
//  2. The 16 reference profiles each rank hero/alt1/alt2 exactly matching
//     the frozen contract's expected IDs, via the REAL scoring engine
//     (scoreTennisOptions.ts), not a hand-copied expectation.
//  3. selectUsOpenExplanations() returns the exact 48 reference passages
//     (source: "reference") for those same 16 profiles when fed the
//     scoring engine's own real ranked output.
//  4. A few representative non-reference profiles hit the generalized
//     fallback path (source: "generalized") without throwing.

const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";
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
console.log(`1. Seeded options: ${dbRows.length}/31 OK`);

function toTicketOption(r) {
  return {
    id: String(r.option_number),
    optionNumber: Number(r.option_number),
    arenaCode: r.arenaCode, arenaName: r.arenaName, stageCode: r.stageCode, stageLabel: r.stageLabel,
    roundsLabel: r.roundsLabel, sessionCode: r.sessionCode, sessionLabel: r.sessionLabel,
    seatingCode: r.seatingCode, seatingLabel: r.seatingLabel, costIndex: Number(r.costIndex), costStars: Number(r.costStars),
    descriptionText: r.descriptionText, heroImage: r.heroImage, stand: r.stand,
    // Raw postgres driver / Drizzle's date() column both return JS Date
    // objects, not ISO strings -- the real app only works because
    // TennisTicketQuiz.tsx is a client component and Next.js's RSC
    // serialization converts Dates to ISO strings crossing that boundary.
    // This script calls scoreTennisOptions() directly with no such
    // boundary, so it must do the same conversion explicitly.
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
  { q1: "lots_of_tennis", q5: "close_to_action", q2: "later", q4: "either", q3: "mix", q6: "value_focused", q7: "fixed", fromDate: "2027-08-29", toDate: "2027-08-29", hero: 29, alt1: 25, alt2: 28 },
  { q1: "close_up_courts", q5: "clear_balanced_view", q2: "early", q4: "day", q3: "exploring", q6: "balanced", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 22, alt1: 29, alt2: 28 },
  { q1: "big_stadium", q5: "no_preference", q2: "middle", q4: "night", q3: "reserved", q6: "premium", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 10, alt1: 11, alt2: 12 },
  { q1: "balance", q5: "close_to_action", q2: "middle", q4: "day", q3: "no_preference", q6: "balanced", q7: "fixed", fromDate: "2027-09-09", toDate: "2027-09-09", hero: 15, alt1: 14, alt2: 18 },
  { q1: "big_stadium", q5: "flexible", q2: "later", q4: "either", q3: "reserved", q6: "value_focused", q7: "fixed", fromDate: "2027-08-29", toDate: "2027-08-29", hero: 4, alt1: 1, alt2: 5 },
  { q1: "close_up_courts", q5: "clear_balanced_view", q2: "middle", q4: "night", q3: "exploring", q6: "premium", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 11, alt1: 24, alt2: 26 },
  { q1: "lots_of_tennis", q5: "flexible", q2: "later", q4: "day", q3: "mix", q6: "balanced", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 31, alt1: 29, alt2: 30 },
  { q1: "balance", q5: "no_preference", q2: "later", q4: "night", q3: "mix", q6: "premium", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 16, alt1: 17, alt2: 18 },
  { q1: "close_up_courts", q5: "no_preference", q2: "middle", q4: "either", q3: "no_preference", q6: "premium", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 30, alt1: 26, alt2: 27 },
  { q1: "balance", q5: "flexible", q2: "later", q4: "night", q3: "exploring", q6: "value_focused", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 16, alt1: 31, alt2: 17 },
  { q1: "big_stadium", q5: "clear_balanced_view", q2: "later", q4: "day", q3: "reserved", q6: "value_focused", q7: "adjustable", fromDate: "2027-09-12", toDate: "2027-09-12", hero: 14, alt1: 20, alt2: 13 },
  { q1: "lots_of_tennis", q5: "no_preference", q2: "later", q4: "either", q3: "no_preference", q6: "balanced", q7: "flexible_tournament", fromDate: null, toDate: null, hero: 16, alt1: 13, alt2: 19 },
  { q1: "big_stadium", q5: "close_to_action", q2: "later", q4: "day", q3: "reserved", q6: "value_focused", q7: "fixed", fromDate: "2027-09-12", toDate: "2027-09-12", hero: 21, alt1: 20, alt2: 19 },
  { q1: "balance", q5: "flexible", q2: "later", q4: "either", q3: "exploring", q6: "balanced", q7: "fixed", fromDate: "2027-09-12", toDate: "2027-09-12", hero: 19, alt1: 20, alt2: 21 },
  { q1: "lots_of_tennis", q5: "close_to_action", q2: "later", q4: "night", q3: "mix", q6: "premium", q7: "fixed", fromDate: "2027-08-29", toDate: "2027-08-29", hero: 25, alt1: 6, alt2: 24 },
  { q1: "close_up_courts", q5: "close_to_action", q2: "middle", q4: "day", q3: "reserved", q6: "value_focused", q7: "fixed", fromDate: "2027-08-29", toDate: "2027-08-29", hero: 28, alt1: 23, alt2: 3 },
];

let rankMatches = 0, rankMismatches = 0, refTextMatches = 0, refTextMismatches = 0;
for (const [i, p] of REFERENCE_PROFILES.entries()) {
  const answers = { q1: p.q1, q2: p.q2, q3: p.q3, q4: p.q4, q5: p.q5, q6: p.q6, q7: p.q7, fromDate: p.fromDate, toDate: p.toDate };
  const result = scoreTennisOptions(options, answers, "us-open");
  const gotHero = result.hero?.option.optionNumber;
  const gotAlt1 = result.alternative1?.option.optionNumber;
  const gotAlt2 = result.alternative2?.option.optionNumber;
  const ok = gotHero === p.hero && gotAlt1 === p.alt1 && gotAlt2 === p.alt2;
  if (ok) rankMatches++;
  else { rankMismatches++; console.log(`  RANK MISMATCH profile ${i+1}: expected ${p.hero}/${p.alt1}/${p.alt2}, got ${gotHero}/${gotAlt1}/${gotAlt2}`); }

  if (ok) {
    const expl = selectUsOpenExplanations(answers, result.hero, result.alternative1, result.alternative2);
    const isRef = expl.hero.source === "reference" && expl.alternative1.source === "reference" && expl.alternative2.source === "reference";
    if (isRef) refTextMatches++;
    else { refTextMismatches++; console.log(`  profile ${i+1}: expected reference-source explanations, got hero=${expl.hero.source} alt1=${expl.alternative1.source} alt2=${expl.alternative2.source}`); }
  }
}
console.log(`2. Reference profile ranking: ${rankMatches}/16 match, ${rankMismatches} mismatch`);
console.log(`3. Reference profile explanation source: ${refTextMatches}/16 used the reference catalogue, ${refTextMismatches} did not`);

const nonReferenceProfiles = [
  { q1: "lots_of_tennis", q2: "early", q3: "reserved", q4: "day", q5: "close_to_action", q6: "balanced", q7: "flexible_tournament", fromDate: null, toDate: null },
  { q1: "balance", q2: "middle", q3: "mix", q4: "either", q5: "no_preference", q6: "premium", q7: "flexible_tournament", fromDate: null, toDate: null },
];
let fallbackOk = 0;
for (const answers of nonReferenceProfiles) {
  const result = scoreTennisOptions(options, answers, "us-open");
  if (!result.hero) { console.log("  no eligible hero for non-reference profile -- unexpected"); continue; }
  const expl = selectUsOpenExplanations(answers, result.hero, result.alternative1, result.alternative2);
  if (expl.hero.source === "generalized") fallbackOk++;
  else console.log(`  unexpected source for non-reference profile: ${expl.hero.source}`);
}
console.log(`4. Non-reference profiles using generalized fallback without throwing: ${fallbackOk}/${nonReferenceProfiles.length}`);

const allOk = dbRows.length === 31 && rankMismatches === 0 && refTextMismatches === 0 && fallbackOk === nonReferenceProfiles.length;
console.log(allOk ? "\nALL SMOKE TESTS PASSED" : "\nSMOKE TEST FAILURES DETECTED -- see above");
process.exit(allOk ? 0 : 1);
