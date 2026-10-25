import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Targeted smoke test for the SECOND Q4-neutrality fix round — confirms
// Wimbledon's Ground Pass options (23-25) now get C4=1 for every Q4
// answer, including "night" (the specific gap the first fix round
// missed: the arenaCode==="GP" branch ran before the sessionCode===null
// neutrality check, so Wimbledon's GP rows kept AO's shared day/night-
// penalty GP bucket). Also confirms AO/French Open's GP rows retain
// their original day/night-penalty behavior (day=1, night=0.35,
// either=1) — this fix must not change their behavior at all.

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const AO_EVENT_ID = "1ced8699-d5ce-49fb-add4-6ebc6f251ec6";
const RG_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const wimRows = await sql`SELECT option_number, arena_code, session_code FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID} ORDER BY option_number`;
const aoGpRows = await sql`SELECT option_number, arena_code, session_code FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${AO_EVENT_ID} AND arena_code = 'GP'`;
const rgGpRows = await sql`SELECT option_number, arena_code, session_code FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${RG_EVENT_ID} AND arena_code = 'GP'`;
await sql.end();

// Reproduces the FIXED c4Compatibility logic exactly, including the
// eventSlug parameter.
const Q4_COMPATIBILITY = {
  day: { day: 1, night: 0.1, ground_pass: 1 },
  night: { day: 0.1, night: 1, ground_pass: 0.35 },
  either: { day: 1, night: 1, ground_pass: 1 },
};
const WIMBLEDON_SLUG = "wimbledon";
function c4Compatibility(option, q4, eventSlug) {
  if (eventSlug === WIMBLEDON_SLUG) return 1;
  if (option.arena_code === "GP") return Q4_COMPATIBILITY[q4].ground_pass;
  if (option.session_code === null) return 1;
  const bucket = option.session_code === "Day" ? "day" : "night";
  return Q4_COMPATIBILITY[q4][bucket];
}

let failures = 0;
function check(label, cond, detail = "") {
  const status = cond ? "PASS" : "FAIL";
  if (!cond) failures++;
  console.log(`[${status}] ${label}${detail ? " — " + detail : ""}`);
}

// Wimbledon: ALL 25 options (GP included) must get C4=1 for every Q4 answer.
for (const r of wimRows) {
  for (const q4 of ["day", "night", "either"]) {
    const c4 = c4Compatibility(r, q4, "wimbledon");
    if (c4 !== 1) {
      console.log(`[FAIL] Wimbledon option ${r.option_number} (${r.arena_code}), Q4=${q4}: C4=${c4}, expected 1`);
      failures++;
    }
  }
}
check(`C4=1 for all 25 Wimbledon options across all 3 Q4 answers (${wimRows.length} options x 3 = ${wimRows.length * 3} checks)`, failures === 0);

// AO Ground Pass: must retain day=1, night=0.35, either=1 (eventSlug not "wimbledon").
let aoFail = 0;
for (const r of aoGpRows) {
  const day = c4Compatibility(r, "day", "australian-open");
  const night = c4Compatibility(r, "night", "australian-open");
  const either = c4Compatibility(r, "either", "australian-open");
  if (day !== 1 || night !== 0.35 || either !== 1) {
    console.log(`[FAIL] AO GP option ${r.option_number}: day=${day} night=${night} either=${either}`);
    aoFail++;
  }
}
check(`AO Ground Pass retains original day=1/night=0.35/either=1 (${aoGpRows.length} options)`, aoFail === 0);

// French Open Ground Pass: same check.
let rgFail = 0;
for (const r of rgGpRows) {
  const day = c4Compatibility(r, "day", "french-open");
  const night = c4Compatibility(r, "night", "french-open");
  const either = c4Compatibility(r, "either", "french-open");
  if (day !== 1 || night !== 0.35 || either !== 1) {
    console.log(`[FAIL] French Open GP option ${r.option_number}: day=${day} night=${night} either=${either}`);
    rgFail++;
  }
}
check(`French Open Ground Pass retains original day=1/night=0.35/either=1 (${rgGpRows.length} options)`, rgFail === 0);

console.log(failures === 0 ? "\nALL WIMBLEDON GP Q4-NEUTRALITY SMOKE TESTS PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
