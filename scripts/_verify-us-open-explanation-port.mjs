import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import postgres from "postgres";
import { __testOnly } from "../app/ticket-intelligence/tennis/[slug]/_lib/usOpenExplanation.ts";
const { hero, alternative, normalizeProfile } = __testOnly;

// HERO-ROLE ONLY, as of 28 Oct 2026. USO27_Phase4_FinalGate_48_Reference_Review.csv's
// "generated" column was confirmed (via ChatGPT clarification + direct
// verification) to be a HISTORICAL PRE-v8 renderer's output, not v8's own
// alternative() -- it does not match v8's own alternative() either (0/32
// after switching the port to v8's own function, same as it mismatched
// v6's alternative() in an earlier pass). hero()'s logic came from v6 only
// (v8 imports v6's hero as base_hero, no override) and is unaffected by
// that distinction, so Hero-role rows here remain a valid check; the
// authoritative check for alternative() is
// scripts/_verify-us-open-187-contrast-audit.mjs, which compares against
// USO27_Phase4_Closure_187_Contrast_Audit.csv -- confirmed generated from
// the real frozen renderer (372/374 exact match; the 2 misses are the
// audit file's own internal hero/alt-ID-vs-text labeling inconsistency on
// 2 of 187 rows, not a port defect -- see that script's own findings).

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

const finalGate = parseCsv(fs.readFileSync("C:/Users/HP/AppData/Local/Temp/uso27_patch/04_explanations_v8/USO27_Phase4_FinalGate_48_Reference_Review.csv", "utf8"));
const profiles16 = parseCsv(fs.readFileSync(new URL("./_uso27-source/16_reference_profiles.csv", import.meta.url), "utf8"));

// Map FinalGate's "set" number -> real date_mode/date from the 16-profile
// CSV, joined by (hero,alt1,alt2) ID triplet (same join as
// _build-us-open-explanation-catalogue.mjs — FinalGate's own row order
// does NOT match the 16-profile CSV's row order, verified earlier).
const dateModeBySet = {};
for (const row of finalGate) {
  if (dateModeBySet[row.set]) continue;
  const triplet = row.frozen_ids; // "22|29|28" style
  const [h, a1, a2] = triplet.split("|").map(Number);
  const p = profiles16.find((p) => Number(p.hero) === h && Number(p.alt1) === a1 && Number(p.alt2) === a2);
  if (!p) { console.log("No profile match for set", row.set, triplet); continue; }
  dateModeBySet[row.set] = { dateMode: p.date_mode, date: p.date || null };
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
  FROM tennis_ticket_intelligence_options WHERE sporting_event_id = '91f298a3-ca22-49c3-9c8e-5a200f0026c9'
`;
await sql.end();

const optionsByNum = new Map();
for (const r of dbRows) {
  optionsByNum.set(Number(r.option_number), {
    id: String(r.option_number),
    optionNumber: Number(r.option_number),
    arenaCode: r.arenaCode, arenaName: r.arenaName, stageCode: r.stageCode, stageLabel: r.stageLabel,
    roundsLabel: r.roundsLabel, sessionCode: r.sessionCode, sessionLabel: r.sessionLabel,
    seatingCode: r.seatingCode, seatingLabel: r.seatingLabel, costIndex: Number(r.costIndex), costStars: Number(r.costStars),
    descriptionText: r.descriptionText, heroImage: r.heroImage, stand: r.stand,
    eligibleFrom: r.eligibleFrom, eligibleTo: r.eligibleTo,
    c1LotsOfTennis: r.c1LotsOfTennis===null?null:Number(r.c1LotsOfTennis), c1BigStadium: r.c1BigStadium===null?null:Number(r.c1BigStadium),
    c1CloseUpCourts: r.c1CloseUpCourts===null?null:Number(r.c1CloseUpCourts), c1BalancedExperience: r.c1BalancedExperience===null?null:Number(r.c1BalancedExperience),
    c5CloseToAction: r.c5CloseToAction===null?null:Number(r.c5CloseToAction), c5BalancedView: r.c5BalancedView===null?null:Number(r.c5BalancedView),
    c5NoPreference: r.c5NoPreference===null?null:Number(r.c5NoPreference), c5FlexibleExplore: r.c5FlexibleExplore===null?null:Number(r.c5FlexibleExplore),
  });
}

const Q2_MAP = { Early: "early", Middle: "middle", Late: "later" };
const Q4_MAP = { Day: "day", Night: "night", Either: "either" };
const Q5_MAP = { close_to_action: "close_to_action", balanced_view: "clear_balanced_view", no_preference: "no_preference", flexible_explore: "flexible" };
const Q3_MAP = { reserved: "reserved", exploring: "exploring", mix: "mix", no_preference: "no_preference" };

function mkScoredOption(option) {
  return { option, rawScore: 0, adjustedScore: 0, contributions: { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 } };
}

let total = 0, matched = 0, differ = 0;
const diffs = [];

for (const row of finalGate) {
  const set = row.set, role = row.role;
  if (role !== "Hero") continue; // Alternative rows: see header comment -- not a valid ground truth for alternative()
  const ids = row.frozen_ids.split("|").map(Number);
  const heroId = ids[0];
  const heroOpt = optionsByNum.get(heroId);
  if (!heroOpt) { console.log("MISSING hero option for set", set, role); continue; }

  const dm = dateModeBySet[set] ?? { dateMode: "flexible", date: null };
  const q7 = dm.dateMode === "flexible" ? "flexible_tournament" : dm.dateMode;
  const answers = {
    q1: row.profile_q1,
    q2: Q2_MAP[row.profile_q2] ?? row.profile_q2.toLowerCase(),
    q3: Q3_MAP[row.profile_q3] ?? row.profile_q3,
    q4: Q4_MAP[row.profile_q4] ?? row.profile_q4.toLowerCase(),
    q5: Q5_MAP[row.profile_q5] ?? row.profile_q5,
    q6: row.profile_q6,
    q7,
    fromDate: dm.date,
    toDate: dm.date,
  };
  const p = normalizeProfile(answers);

  const alt1Id = ids[1], alt2Id = ids[2];
  const alt1Opt = alt1Id ? optionsByNum.get(alt1Id) : null;
  const alt2Opt = alt2Id ? optionsByNum.get(alt2Id) : null;
  const alternatives = [alt1Opt, alt2Opt].filter(Boolean);
  const got = hero(p, heroOpt, alternatives);

  total++;
  if (got === row.generated) matched++;
  else { differ++; diffs.push({ set, role, expected: row.generated, got }); }
}

console.log(`Total: ${total}, Matched: ${matched}, Differ: ${differ}`);
for (const d of diffs.slice(0, 8)) {
  console.log("---", d.set, d.role, "source:", d.source);
  console.log("EXPECTED:", d.expected);
  console.log("GOT     :", d.got);
}
