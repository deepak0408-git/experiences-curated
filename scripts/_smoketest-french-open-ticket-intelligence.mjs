import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Restricted technical smoke test for French Open 2027 Ticket Intelligence
// — a SMALL number of representative profiles, per spec §15. This is NOT
// the exhaustive 53,568-profile regression (explicitly out of scope,
// handled by a separate product-validation process). Reads real DB rows,
// runs them through the real production scoring/explanation modules
// (dynamic import, same parity-guarantee pattern as
// tennis-ticket-intelligence-regression-harness.mjs), writes nothing.

const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const AUSTRALIAN_OPEN_EVENT_ID = "1ced8699-d5ce-49fb-add4-6ebc6f251ec6";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const { scoreTennisOptions, resolveOptionRange } = await import(
  "../app/ticket-intelligence/tennis/[slug]/_lib/scoreTennisOptions.ts"
);
const { selectFrenchOpenExplanations } = await import(
  "../app/ticket-intelligence/tennis/[slug]/_lib/frenchOpenExplanation.ts"
);

// Raw postgres-driver date columns come back as JS Date objects, NOT the
// "YYYY-MM-DD" strings the real app sees — Drizzle's date() column (no
// `{mode:"date"}` config, confirmed in node_modules/drizzle-orm/pg-core/columns/date.ts)
// defaults to PgDateStringBuilder, which returns the raw string unchanged.
// This script uses the raw `postgres` client (same no-TTY-workaround
// pattern as this project's migration scripts), so dates must be
// re-stringified here to match what getTennisOptionsData.ts/Drizzle
// actually hands scoreTennisOptions.ts in production — otherwise this
// script would test different date behavior than the real app has.
function toDateString(d) {
  if (d === null || d === undefined) return null;
  if (typeof d === "string") return d;
  return d.toISOString().slice(0, 10);
}

async function loadOptions(eventId) {
  const rows = await sql`
    SELECT id, option_number, arena_code, arena_name, stage_code, stage_label, rounds_label,
           session_code, session_label, seating_code, seating_label, cost_index, cost_stars,
           description_text, hero_image, stand, eligible_from, eligible_to,
           c1_lots_of_tennis, c1_big_stadium, c1_close_up_courts, c1_balanced_experience,
           c5_close_to_action, c5_balanced_view, c5_no_preference, c5_flexible_explore
    FROM tennis_ticket_intelligence_options
    WHERE sporting_event_id = ${eventId}
    ORDER BY option_number
  `;
  return rows.map((r) => ({
    id: r.id,
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

const foOptions = await loadOptions(FRENCH_OPEN_EVENT_ID);
console.log(`French Open options loaded: ${foOptions.length} (expected 87)`);
if (foOptions.length !== 87) throw new Error("Expected exactly 87 French Open options");

let pass = 0;
let fail = 0;
function check(name, condition, detail) {
  if (condition) {
    console.log(`  PASS: ${name}`);
    pass++;
  } else {
    console.log(`  FAIL: ${name}${detail ? " — " + detail : ""}`);
    fail++;
  }
}

// ── Test 1: representative profiles score + explain without throwing ───
console.log("\n[Test 1] Representative profile scoring + explanation lookup");
const PROFILES = [
  { q1: "lots_of_tennis", q2: "early", q3: "reserved", q4: "day", q5: "close_to_action", q6: "value_focused", q7: "flexible_tournament", fromDate: null, toDate: null },
  { q1: "big_stadium", q2: "later", q3: "reserved", q4: "night", q5: "clear_balanced_view", q6: "premium", q7: "flexible_tournament", fromDate: null, toDate: null },
  { q1: "close_up_courts", q2: "middle", q3: "exploring", q4: "either", q5: "flexible", q6: "balanced", q7: "flexible_tournament", fromDate: null, toDate: null },
  { q1: "balance", q2: "early", q3: "mix", q4: "day", q5: "no_preference", q6: "value_focused", q7: "fixed", fromDate: "2027-05-23", toDate: "2027-05-29" },
  { q1: "lots_of_tennis", q2: "later", q3: "reserved", q4: "day", q5: "close_to_action", q6: "balanced", q7: "adjustable", fromDate: "2027-06-04", toDate: "2027-06-05" },
];
for (const [i, answers] of PROFILES.entries()) {
  try {
    const result = scoreTennisOptions(foOptions, answers, "french-open");
    check(`profile ${i + 1}: has a hero`, !!result.hero, JSON.stringify(answers));
    const explanations = selectFrenchOpenExplanations(answers, result.hero, result.alternative1, result.alternative2);
    check(`profile ${i + 1}: hero explanation resolves`, !!explanations.hero.text, JSON.stringify(answers));
  } catch (err) {
    check(`profile ${i + 1}: no throw`, false, err.message);
  }
}

// ── Test 2: Q3 Reserved excludes Ground Pass (options 85-87) ───────────
console.log("\n[Test 2] Q3 Reserved hard-excludes Ground Pass options 85/86/87");
{
  const answers = { q1: "lots_of_tennis", q2: "early", q3: "reserved", q4: "day", q5: "no_preference", q6: "balanced", q7: "flexible_tournament", fromDate: null, toDate: null };
  const result = scoreTennisOptions(foOptions, answers, "french-open");
  const groundPassIds = new Set([85, 86, 87]);
  const surfaced = [result.hero, result.alternative1, result.alternative2].filter(Boolean).map((s) => s.option.optionNumber);
  check("no Ground Pass option (85/86/87) surfaced when Q3=reserved", surfaced.every((id) => !groundPassIds.has(id)), `surfaced: ${surfaced}`);
  check("excludedCount >= 3 (at least the 3 GP options excluded)", result.excludedCount >= 3, `excludedCount: ${result.excludedCount}`);
}

// ── Test 3: Q7 date boundaries — French Open's real May 23 - Jun 6 window, not AO's Jan dates ──
console.log("\n[Test 3] Q7 date eligibility uses French Open's real window");
{
  const answers = { q1: "lots_of_tennis", q2: "early", q3: "reserved", q4: "day", q5: "no_preference", q6: "balanced", q7: "fixed", fromDate: "2027-05-23", toDate: "2027-05-23" };
  const result = scoreTennisOptions(foOptions, answers, "french-open");
  check("fixed date 2027-05-23 (real FO opening day) finds a hero", !!result.hero);
  const aoOnlyDateAnswers = { ...answers, fromDate: "2027-01-17", toDate: "2027-01-17" };
  const aoResult = scoreTennisOptions(foOptions, aoOnlyDateAnswers, "french-open");
  check("AO's own date (2027-01-17, outside FO's window) excludes ALL French Open options", aoResult.hero === undefined, `hero: ${aoResult.hero?.option.optionNumber}`);
}

// ── Test 4: Philippe-Chatrier stand display ─────────────────────────────
console.log("\n[Test 4] Philippe-Chatrier stand field");
{
  const pcOptions = foOptions.filter((o) => o.arenaCode === "PC");
  const withStand = pcOptions.filter((o) => o.stand);
  check("all 64 Philippe-Chatrier options have a stand value", withStand.length === 64, `found ${withStand.length}`);
  const baselineStands = new Set(pcOptions.filter((o) => o.seatingCode.endsWith("_BL")).map((o) => o.stand));
  const sidelineStands = new Set(pcOptions.filter((o) => o.seatingCode.endsWith("_SL")).map((o) => o.stand));
  check('all Baseline PC options use stand "Lacoste or Brugnon"', baselineStands.size === 1 && baselineStands.has("Lacoste or Brugnon"), [...baselineStands].join(","));
  check('all Sideline PC options use stand "Borotra or Cochet"', sidelineStands.size === 1 && sidelineStands.has("Borotra or Cochet"), [...sidelineStands].join(","));
  const nonPcOptions = foOptions.filter((o) => o.arenaCode !== "PC");
  check("no non-Philippe-Chatrier French Open option has a stand value", nonPcOptions.every((o) => !o.stand));
}

// ── Test 5: AO non-regression spot-check ────────────────────────────────
console.log("\n[Test 5] Australian Open spot-check (count + a scored profile)");
{
  const aoOptions = await loadOptions(AUSTRALIAN_OPEN_EVENT_ID);
  check("AO still has exactly 43 options", aoOptions.length === 43, `found ${aoOptions.length}`);
  check("AO options have no C1/C5 raw values (still using code tables)", aoOptions.every((o) => o.c1LotsOfTennis === null && o.c5CloseToAction === null));
  check("AO options have no eligibleFrom/To (still using stage-keyed map)", aoOptions.every((o) => o.eligibleFrom === null && o.eligibleTo === null));
  check("AO options have no stand value", aoOptions.every((o) => o.stand === null));
  const answers = { q1: "big_stadium", q2: "later", q3: "reserved", q4: "night", q5: "close_to_action", q6: "premium", q7: "flexible_tournament", fromDate: null, toDate: null };
  const result = scoreTennisOptions(aoOptions, answers, "australian-open");
  check("AO scoring still produces a hero", !!result.hero);
}

console.log(`\n${pass} passed, ${fail} failed`);
await sql.end();
if (fail > 0) process.exit(1);
