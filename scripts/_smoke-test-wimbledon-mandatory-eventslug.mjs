import { config } from "dotenv";
config({ path: ".env.local" });
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import postgres from "postgres";

// Parity-guarantee smoke test (imports the REAL scoreTennisOptions.ts
// module directly, not a reimplementation) for the third Q4-neutrality
// pass, 25 Oct 2026: eventSlug is now a REQUIRED parameter, validated
// against a closed set, with no silent fallback for an unrecognized
// tournament. Confirms:
//   1. scoreTennisOptions() still requires 3 args at the type level
//      (covered by `npx tsc --noEmit` separately — this script checks
//      the runtime behavior a .mjs caller actually sees).
//   2. Calling with an unrecognized eventSlug throws, rather than
//      defaulting to any tournament's rules.
//   3. Wimbledon's 25 options all get C4=1 for all 3 Q4 answers, via the
//      REAL c4Compatibility() code path (through scoreTennisOptions,
//      not a hand-rolled copy).
//   4. AO's/French Open's Ground Pass day/night penalty is unchanged,
//      via the same real code path.

const dir = path.dirname(fileURLToPath(import.meta.url));
const { scoreTennisOptions, assertTennisEventSlug } = await import(
  pathToFileURL(path.join(dir, "..", "app/ticket-intelligence/tennis/[slug]/_lib/scoreTennisOptions.ts")).href
);

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const AO_EVENT_ID = "1ced8699-d5ce-49fb-add4-6ebc6f251ec6";
const RG_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";

function toDateString(d) {
  if (d === null || d === undefined) return null;
  if (typeof d === "string") return d;
  return d.toISOString().slice(0, 10);
}

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

async function loadOptions(eventId) {
  const rows = await sql`
    SELECT option_number, arena_code, arena_name, stage_code, stage_label, rounds_label,
           session_code, session_label, seating_code, seating_label, cost_index, cost_stars,
           description_text, hero_image, stand, eligible_from, eligible_to,
           c1_lots_of_tennis, c1_big_stadium, c1_close_up_courts, c1_balanced_experience,
           c5_close_to_action, c5_balanced_view, c5_no_preference, c5_flexible_explore
    FROM tennis_ticket_intelligence_options
    WHERE sporting_event_id = ${eventId}
    ORDER BY option_number
  `;
  return rows.map((r) => ({
    optionNumber: r.option_number,
    arenaCode: r.arena_code,
    arenaName: r.arena_name,
    stageCode: r.stage_code,
    stageLabel: r.stage_label,
    roundsLabel: r.rounds_label,
    sessionCode: r.session_code,
    sessionLabel: r.session_label,
    seatingCode: r.seating_code,
    seatingLabel: r.seating_label,
    costIndex: Number(r.cost_index),
    costStars: r.cost_stars,
    descriptionText: r.description_text,
    heroImage: r.hero_image,
    stand: r.stand,
    eligibleFrom: toDateString(r.eligible_from),
    eligibleTo: toDateString(r.eligible_to),
    c1LotsOfTennis: r.c1_lots_of_tennis === null ? null : Number(r.c1_lots_of_tennis),
    c1BigStadium: r.c1_big_stadium === null ? null : Number(r.c1_big_stadium),
    c1CloseUpCourts: r.c1_close_up_courts === null ? null : Number(r.c1_close_up_courts),
    c1BalancedExperience: r.c1_balanced_experience === null ? null : Number(r.c1_balanced_experience),
    c5CloseToAction: r.c5_close_to_action === null ? null : Number(r.c5_close_to_action),
    c5BalancedView: r.c5_balanced_view === null ? null : Number(r.c5_balanced_view),
    c5NoPreference: r.c5_no_preference === null ? null : Number(r.c5_no_preference),
    c5FlexibleExplore: r.c5_flexible_explore === null ? null : Number(r.c5_flexible_explore),
  }));
}

const wimOptions = await loadOptions(WIMBLEDON_EVENT_ID);
const aoOptions = await loadOptions(AO_EVENT_ID);
const rgOptions = await loadOptions(RG_EVENT_ID);
await sql.end();

let failures = 0;
function check(label, cond, detail = "") {
  const status = cond ? "PASS" : "FAIL";
  if (!cond) failures++;
  console.log(`[${status}] ${label}${detail ? " — " + detail : ""}`);
}

const BASE_ANSWERS = { q1: "lots_of_tennis", q2: "early", q3: "exploring", q5: "no_preference", q6: "value_focused", q7: "flexible_tournament", fromDate: null, toDate: null };

// 1. assertTennisEventSlug rejects an unrecognized slug.
try {
  assertTennisEventSlug("not-a-real-tournament");
  check("assertTennisEventSlug throws on an unrecognized slug", false, "did not throw");
} catch (err) {
  check("assertTennisEventSlug throws on an unrecognized slug", err instanceof Error, err.message);
}

// 2. scoreTennisOptions throws on an unrecognized eventSlug rather than defaulting.
try {
  scoreTennisOptions(wimOptions, { ...BASE_ANSWERS, q4: "night" }, "not-a-real-tournament");
  check("scoreTennisOptions throws on an unrecognized eventSlug (no silent default)", false, "did not throw");
} catch (err) {
  check("scoreTennisOptions throws on an unrecognized eventSlug (no silent default)", err instanceof Error, err.message);
}

// 3. Real c4Compatibility (via scoreTennisOptions + contributions.c4) gives C4=1
//    for every Wimbledon option across all 3 Q4 answers — using the REAL module,
//    checked via each option's individual score contribution, not a reimplementation.
for (const q4 of ["day", "night", "either"]) {
  const answers = { ...BASE_ANSWERS, q3: "exploring", q4 };
  // Score every Wimbledon option by isolating it in its own call, so each
  // one's contributions.c4 is directly inspectable (scoreTennisOptions
  // only returns hero/alt1/alt2, not every scored option).
  for (const opt of wimOptions) {
    const result = scoreTennisOptions([opt], answers, "wimbledon");
    if (!result.hero) continue; // ineligible for this profile — skip, not a C4 concern
    const c4Contribution = result.hero.contributions.c4;
    const c4 = c4Contribution / 12; // WEIGHTS.C4 = 12
    if (Math.abs(c4 - 1) > 1e-9) {
      console.log(`[FAIL] Wimbledon option ${opt.optionNumber} (${opt.arenaCode}), Q4=${q4}: C4=${c4}, expected 1 (via real module)`);
      failures++;
    }
  }
}
check("real c4Compatibility (via scoreTennisOptions) gives C4=1 for all 25 Wimbledon options x 3 Q4 answers", failures === 0);

// 4. AO Ground Pass retains day=1/night=0.35/either=1, via the real module.
const aoGp = aoOptions.filter((o) => o.arenaCode === "GP");
let aoFail = 0;
for (const q4 of ["day", "night", "either"]) {
  const expected = { day: 1, night: 0.35, either: 1 }[q4];
  for (const opt of aoGp) {
    const answers = { ...BASE_ANSWERS, q3: "exploring", q4 };
    const result = scoreTennisOptions([opt], answers, "australian-open");
    const c4 = result.hero.contributions.c4 / 12;
    if (Math.abs(c4 - expected) > 1e-9) {
      console.log(`[FAIL] AO GP option ${opt.optionNumber}, Q4=${q4}: C4=${c4}, expected ${expected} (via real module)`);
      aoFail++;
    }
  }
}
check("real c4Compatibility (via scoreTennisOptions) gives AO Ground Pass day=1/night=0.35/either=1", aoFail === 0);

// 5. French Open Ground Pass, same check.
const rgGp = rgOptions.filter((o) => o.arenaCode === "GP");
let rgFail = 0;
for (const q4 of ["day", "night", "either"]) {
  const expected = { day: 1, night: 0.35, either: 1 }[q4];
  for (const opt of rgGp) {
    const answers = { ...BASE_ANSWERS, q3: "exploring", q4 };
    const result = scoreTennisOptions([opt], answers, "french-open");
    const c4 = result.hero.contributions.c4 / 12;
    if (Math.abs(c4 - expected) > 1e-9) {
      console.log(`[FAIL] French Open GP option ${opt.optionNumber}, Q4=${q4}: C4=${c4}, expected ${expected} (via real module)`);
      rgFail++;
    }
  }
}
check("real c4Compatibility (via scoreTennisOptions) gives French Open Ground Pass day=1/night=0.35/either=1", rgFail === 0);

console.log(failures === 0 ? "\nALL MANDATORY-EVENTSLUG SMOKE TESTS PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
