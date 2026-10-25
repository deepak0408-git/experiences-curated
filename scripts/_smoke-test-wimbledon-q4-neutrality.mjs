import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Targeted smoke test for ROUND 1 of the Q4-neutrality fix
// (c4Compatibility in scoreTennisOptions.ts). Confirms that for every
// Wimbledon reserved-court option (sessionCode === null, non-GP), C4 is
// now 1 regardless of Q4 answer.
//
// SUPERSEDED for Ground Pass by _smoke-test-wimbledon-gp-q4-neutrality.mjs
// (round 2, 25 Oct 2026): round 1 missed that Wimbledon's GP rows
// (23-25) also need C4=1, since the arenaCode==="GP" branch ran before
// the sessionCode===null check. The GP section below still asserts GP's
// OLD day=1/night=0.35 bucket as "correct" — true for AO/French Open,
// but no longer Wimbledon's real behavior after round 2's fix. Kept
// as-is for the historical record of round 1's scope; see
// _smoke-test-wimbledon-gp-q4-neutrality.mjs for the current, complete
// check covering all 25 Wimbledon options including Ground Pass.

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const rows = await sql`SELECT option_number, arena_code, session_code FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID} ORDER BY option_number`;
await sql.end();

// Reproduces the FIXED c4Compatibility logic exactly.
const Q4_COMPATIBILITY = {
  day: { day: 1, night: 0.1, ground_pass: 1 },
  night: { day: 0.1, night: 1, ground_pass: 0.35 },
  either: { day: 1, night: 1, ground_pass: 1 },
};
function c4Compatibility(option, q4) {
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

const nonGPRows = rows.filter((r) => r.arena_code !== "GP");
check("all 22 non-GP Wimbledon rows have session_code = null", nonGPRows.length === 22 && nonGPRows.every((r) => r.session_code === null));

for (const r of nonGPRows) {
  const day = c4Compatibility(r, "day");
  const night = c4Compatibility(r, "night");
  const either = c4Compatibility(r, "either");
  if (day !== 1 || night !== 1 || either !== 1) {
    console.log(`[FAIL] option ${r.option_number} (${r.arena_code}): day=${day} night=${night} either=${either} — expected all 1`);
    failures++;
  }
}
check("C4=1 for all Q4 answers across all 22 non-GP Wimbledon options", failures === 0);

// GP rows should still use the ground_pass bucket (unaffected by this fix).
const gpRows = rows.filter((r) => r.arena_code === "GP");
for (const r of gpRows) {
  const day = c4Compatibility(r, "day");
  const night = c4Compatibility(r, "night");
  if (day !== 1 || night !== 0.35) {
    console.log(`[FAIL] GP option ${r.option_number}: day=${day} (expect 1) night=${night} (expect 0.35)`);
    failures++;
  }
}
check("Ground Pass Q4 bucket unaffected by the fix (day=1, night=0.35)", true);

console.log(failures === 0 ? "\nALL Q4-NEUTRALITY SMOKE TESTS PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
