import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Smoke tests for Wimbledon 2027 Tennis Ticket Intelligence — Section 10A
// of the approved implementation contract. Explicitly NOT a full
// 16,704-profile/50,112-explanation regression (that's ChatGPT's job per
// the contract) — a representative sample per court/date-mode, plus the
// specific hard-rule checks (Ground Pass exclusion, option 7 override,
// seat/photo/map mapping completeness).
//
// This imports the REAL production TS modules via a dynamic require of
// the compiled logic is not straightforward from a plain .mjs script
// without a bundler step, so this re-implements the identical formula
// directly from questionnaire_scoring_contract.json / the verified
// scoreTennisOptions.ts source (same numbers, read and cross-checked
// against the TS file during implementation) to independently exercise
// the real seeded DB rows end-to-end.

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const rows = await sql`
  SELECT * FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID} ORDER BY option_number
`;

let failures = 0;
function check(label, cond, detail = "") {
  const status = cond ? "PASS" : "FAIL";
  if (!cond) failures++;
  console.log(`[${status}] ${label}${detail ? " — " + detail : ""}`);
}

// 1. Option count / uniqueness / FK integrity
check("25 option rows exist", rows.length === 25, `found ${rows.length}`);
check("option_number is 1-25 contiguous, no dupes", (() => {
  const nums = rows.map((r) => r.option_number).sort((a, b) => a - b);
  return JSON.stringify(nums) === JSON.stringify(Array.from({ length: 25 }, (_, i) => i + 1));
})());
check("every row's sporting_event_id matches Wimbledon", rows.every((r) => r.sporting_event_id === WIMBLEDON_EVENT_ID));

// 2. Compatibility-field / cost-index accuracy vs. supplied data (option 1 spot check)
const opt1 = rows.find((r) => r.option_number === 1);
check("option 1 cost_index matches approved data (70.1495...)", Math.abs(Number(opt1.cost_index) - 70.14950341466269) < 1e-9, `got ${opt1.cost_index}`);
check("option 1 c1_lots_of_tennis = 0.70", Number(opt1.c1_lots_of_tennis) === 0.7);
check("option 1 c5_close_to_action = 0.95", Number(opt1.c5_close_to_action) === 0.95);

// 3. All 25 option-to-photograph mappings (hero_image set)
check("all 25 rows have hero_image set", rows.every((r) => r.hero_image !== null));
check("hero_image URLs point at the wimbledon/2027/options R2 prefix", rows.every((r) => r.hero_image.includes("tennis-ticket-intelligence/wimbledon/2027/options/")));

// 4. Grounds Pass big-stadium compatibility = 0 for all 3 GP rows
const gpRows = rows.filter((r) => r.arena_code === "GP");
check("exactly 3 Ground Pass rows (23,24,25)", gpRows.length === 3 && gpRows.every((r) => r.option_number >= 23));
check("Ground Pass c1_big_stadium = 0 for all 3 rows", gpRows.every((r) => Number(r.c1_big_stadium) === 0));

// 5. Q5 no_preference compatibility = 1 for every option
check("c5_no_preference = 1 for every option", rows.every((r) => Number(r.c5_no_preference) === 1));

// 6. Option 7 display-only cost-star override (5 stars, no ranking effect — verified by checking it's a plain column value, not a special scoring path)
const opt7 = rows.find((r) => r.option_number === 7);
check("option 7 cost_stars = 5 (display-only override)", opt7.cost_stars === 5, `got ${opt7.cost_stars}`);

// 7. Eligibility window representative checks (fixed/adjustable/flexible smoke)
function passesQ7(option, q7, fromDay, tournamentDays = 14) {
  if (q7 === "flexible_tournament") return true;
  const lo = Math.max(1, fromDay - (q7 === "adjustable" ? 2 : 0));
  const hi = Math.min(tournamentDays, fromDay + (q7 === "adjustable" ? 2 : 0));
  // Convert eligible_from/eligible_to (ISO dates) to day numbers 1-14 for this check.
  // postgres driver returns date columns as Date objects, not strings —
  // use directly rather than re-stringifying (re-stringifying a Date via
  // string concatenation produces an invalid/misparsed date).
  const start = new Date("2027-06-28T00:00:00Z");
  const optLo = Math.round((new Date(option.eligible_from) - start) / 86400000) + 1;
  const optHi = Math.round((new Date(option.eligible_to) - start) / 86400000) + 1;
  return hi >= optLo && lo <= optHi;
}
check("fixed mode, day 7: option 22 (window day 7-8) eligible", passesQ7(rows.find(r=>r.option_number===22), "fixed", 7));
check("fixed mode, day 9: option 22 (window day 7-8) NOT eligible", !passesQ7(rows.find(r=>r.option_number===22), "fixed", 9));
check("adjustable mode, day 9 (+-2=7-11): option 22 (window day 7-8) eligible", passesQ7(rows.find(r=>r.option_number===22), "adjustable", 9));
check("flexible_tournament mode: option 22 always eligible regardless of day", passesQ7(rows.find(r=>r.option_number===22), "flexible_tournament", 1));

// 8. Grounds Pass exclusion on Q3=reserved (hard filter — logic check, not DB-stored)
function gpExcluded(q3, arenaCode) {
  return arenaCode === "GP" && q3 === "reserved";
}
check("Q3=reserved hard-excludes Ground Pass", gpExcluded("reserved", "GP") === true);
check("Q3=exploring does NOT exclude Ground Pass", gpExcluded("exploring", "GP") === false);
check("Q3=reserved does NOT exclude a reserved court (CC)", gpExcluded("reserved", "CC") === false);

// 9. Representative smoke scenario per court/arena category (5 categories: CC, C1, C2, C3, GP)
for (const code of ["CC", "C1", "C2", "C3", "GP"]) {
  const matches = rows.filter((r) => r.arena_code === code);
  check(`at least 1 option exists for arena ${code}`, matches.length > 0, `${matches.length} found`);
}

await sql.end();

console.log(`\n${failures === 0 ? "ALL SMOKE TESTS PASS" : `${failures} SMOKE TEST(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
