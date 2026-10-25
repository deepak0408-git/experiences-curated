import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { revalidateCacheTags } from "./_lib/revalidate-cache.mjs";
import { CACHE_TAGS } from "./_lib/cache-tags.mjs";

// Seeds the 25 Wimbledon 2027 tennis_ticket_intelligence_options rows from
// the founder-approved implementation package
// (Wimbledon_2027_FINAL_Developer_Handoff.zip), specifically
// data/25_options_reference.csv. Package integrity (SHA-256 manifest,
// option-count/contiguity, photo-manifest coverage, 50,112-row/16,704-
// profile explanation catalogue) was verified against the package's own
// audit/SHA256_MANIFEST.json and validation/check_package.py-equivalent
// checks before this script was written — see conversation record, 25 Oct
// 2026.
//
// Idempotent and event-scoped: upserts on the existing
// (sporting_event_id, option_number) unique constraint, touches ONLY rows
// where sporting_event_id = WIMBLEDON_EVENT_ID. Never touches Australian
// Open's 43 rows or French Open's 87 rows (different sporting_event_id
// entirely).
//
// option_number is used DIRECTLY from the source CSV's option_number
// column (already 1-25, contiguous, verified).

const dir = path.dirname(fileURLToPath(import.meta.url));
const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const PACKAGE_ROOT =
  "C:/Users/HP/AppData/Local/Temp/claude/c--Users-HP--claude-projects-ExperienceCurator/70194cfc-eada-4e86-b5c3-2f9900cbaa56/scratchpad/wimbledon_pkg/Wimbledon_2027_FINAL_Developer_Handoff";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

function parseCsv(file) {
  const content = fs.readFileSync(file, "utf8").trim();
  const lines = content.split(/\r?\n/);
  function parseLine(line) {
    const out = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"') {
          if (line[i + 1] === '"') {
            cur += '"';
            i++;
          } else inQ = false;
        } else cur += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === ",") {
          out.push(cur);
          cur = "";
        } else cur += c;
      }
    }
    out.push(cur);
    return out;
  }
  const header = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseLine(line);
    const row = {};
    header.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

// arena_code (CSV) -> arena_name. Matches arenaDisplayName()'s fallback to
// option.arenaName for every non-GP arenaCode, and the fan-facing court
// names used elsewhere in the approved package (READ_FIRST.md, Section 7
// of the implementation contract).
const ARENA_NAME_BY_CODE = {
  CC: "Centre Court",
  C1: "No. 1 Court",
  C2: "No. 2 Court",
  C3: "No. 3 Court",
  GP: "Ground Pass",
};

// stage_code (CSV: Early/Middle/Late, already matching the Postgres enum
// directly — no collapsing needed, unlike French Open's Transition/Late
// access values).
const ROUNDS_LABEL_BY_STAGE = {
  Early: "Early rounds",
  Middle: "Middle rounds",
  Late: "Late rounds",
};

// seating_tier (CSV) -> seating_code (DB column), matching the keys added
// to presentationMappings.ts's SEATING_MAP. Ground Pass has no seating
// code requirement (its presentation is handled by the arenaCode === "GP"
// branch, same as AO/French Open).
const SEATING_CODE_BY_TIER = {
  "A-T": "A_T",
  "U-Z": "U_Z",
  "ZA-ZF": "ZA_ZF",
  "A-Q": "A_Q",
  "R-W": "R_W",
  "X-ZC": "X_ZC",
  Reserved: "RESERVED",
  "Grounds admission": "GP",
};

function seatingLabelFor(row) {
  if (row.arena_code === "GP") return "Unreserved grounds access";
  return `Seating block ${row.seating_tier}`;
}

function roundsLabelFor(row) {
  if (row.arena_code === "GP") return `Grounds Pass — ${row.stage_code}`;
  return ROUNDS_LABEL_BY_STAGE[row.stage_code];
}

function sessionLabelFor(row) {
  // Wimbledon's approved 25-option catalogue has no day/night session
  // split (unlike AO/French Open) — every ticketed option is a single
  // all-day session, and Ground Pass is grounds access with no fixed
  // session. Verified: data/25_options_reference.csv has no session
  // column at all.
  if (row.arena_code === "GP") return "Grounds access";
  return "All-day session";
}

const rows = parseCsv(path.join(PACKAGE_ROOT, "data/25_options_reference.csv"));

if (rows.length !== 25) {
  throw new Error(`Expected exactly 25 option rows, found ${rows.length} — stop, do not seed partial data.`);
}
const optionNumbers = rows.map((r) => parseInt(r.option_number, 10)).sort((a, b) => a - b);
for (let i = 0; i < 25; i++) {
  if (optionNumbers[i] !== i + 1) {
    throw new Error(`option_number gap/duplicate detected at position ${i}: expected ${i + 1}, got ${optionNumbers[i]}`);
  }
}
for (const r of rows) {
  if (r.sporting_event_id !== WIMBLEDON_EVENT_ID) {
    throw new Error(`Option ${r.option_number}: sporting_event_id "${r.sporting_event_id}" does not match expected Wimbledon event ID.`);
  }
}

// Image manifest — maps image_group -> R2 URL, uploaded separately by
// scripts/upload-tennis-wimbledon-images.mjs (Phase F, same two-pass
// pattern as French Open: seed first with deterministic URLs this script
// knows the upload step WILL produce, then the upload script fills R2
// with the actual files). If upload is skipped, these URLs 404 — the
// visible symptom to catch, same discipline as French Open's seed script.
function heroImageUrlFor(imageGroup) {
  return `https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/wimbledon/2027/options/${imageGroup}.png`;
}

const preparedRows = rows.map((r) => {
  const id = parseInt(r.option_number, 10);
  const arenaCode = r.arena_code;
  if (!ARENA_NAME_BY_CODE[arenaCode]) throw new Error(`Unmapped arena_code "${arenaCode}" (option ${id})`);
  const seatingCode = SEATING_CODE_BY_TIER[r.seating_tier];
  if (!seatingCode) throw new Error(`Unmapped seating_tier "${r.seating_tier}" (option ${id})`);

  const costStarsOverride = r.display_cost_stars_override.trim();
  // cost_stars: the approved CSV has no plain numeric cost_stars column —
  // display_cost_stars_override is a DISPLAY-ONLY override (option 7 only,
  // value 5, ranking_effect: false per questionnaire_scoring_contract.json)
  // layered on top of a derived baseline. Deriving the baseline from
  // cost_index via the same 5-tier banding the rest of this product uses
  // elsewhere (<55 / <65 / <75 / <85 / >=85 -> 1-5 stars), since the
  // approved package supplies no separate baseline-stars column and
  // explicitly frames the override as relative to cost_index banding, not
  // as a replacement scoring mechanism.
  const costIndexNum = parseFloat(r.cost_index);
  const baselineStars = costIndexNum < 55 ? 1 : costIndexNum < 65 ? 2 : costIndexNum < 75 ? 3 : costIndexNum < 85 ? 4 : 5;
  const costStars = costStarsOverride ? parseInt(costStarsOverride, 10) : baselineStars;

  return {
    sportingEventId: WIMBLEDON_EVENT_ID,
    optionNumber: id,
    arenaCode,
    arenaName: ARENA_NAME_BY_CODE[arenaCode],
    stageCode: r.stage_code,
    stageLabel: `${r.stage_code} Rounds`,
    roundsLabel: roundsLabelFor(r),
    sessionCode: null, // Wimbledon's approved catalogue has no day/night split — see sessionLabelFor's comment above.
    sessionLabel: sessionLabelFor(r),
    seatingCode,
    seatingLabel: seatingLabelFor(r),
    costIndex: r.cost_index,
    costStars,
    descriptionText: `${ARENA_NAME_BY_CODE[arenaCode]}${arenaCode === "GP" ? "" : `, ${r.seating_tier}`} — ${r.stage_code.toLowerCase()} rounds.`,
    sourceNote: `Approved Wimbledon 2027 implementation package (Wimbledon_2027_FINAL_Developer_Handoff.zip, data/25_options_reference.csv), option_number ${id}. Representative price: £${r.representative_price_gbp}.`,
    heroImage: heroImageUrlFor(r.image_group),
    stand: null, // Wimbledon's approved catalogue has no paired-stand concept (Philippe-Chatrier/French Open only).
    eligibleFrom: r.eligible_from,
    eligibleTo: r.eligible_to,
    c1LotsOfTennis: r.c1_lots_of_tennis,
    c1BigStadium: r.c1_big_stadium,
    c1CloseUpCourts: r.c1_close_up_courts,
    c1BalancedExperience: r.c1_balance,
    c5CloseToAction: r.c5_close_to_action,
    c5BalancedView: r.c5_clear_balanced_view,
    c5NoPreference: r.c5_no_preference,
    c5FlexibleExplore: r.c5_flexible,
  };
});

console.log(`Prepared ${preparedRows.length} Wimbledon option rows. Upserting...`);

let inserted = 0;
let updated = 0;
for (const row of preparedRows) {
  const result = await sql`
    INSERT INTO tennis_ticket_intelligence_options (
      sporting_event_id, option_number, arena_code, arena_name,
      stage_code, stage_label, rounds_label, session_code, session_label,
      seating_code, seating_label, cost_index, cost_stars,
      description_text, source_note, hero_image, stand,
      eligible_from, eligible_to,
      c1_lots_of_tennis, c1_big_stadium, c1_close_up_courts, c1_balanced_experience,
      c5_close_to_action, c5_balanced_view, c5_no_preference, c5_flexible_explore
    ) VALUES (
      ${row.sportingEventId}, ${row.optionNumber}, ${row.arenaCode}, ${row.arenaName},
      ${row.stageCode}, ${row.stageLabel}, ${row.roundsLabel}, ${row.sessionCode}, ${row.sessionLabel},
      ${row.seatingCode}, ${row.seatingLabel}, ${row.costIndex}, ${row.costStars},
      ${row.descriptionText}, ${row.sourceNote}, ${row.heroImage}, ${row.stand},
      ${row.eligibleFrom}, ${row.eligibleTo},
      ${row.c1LotsOfTennis}, ${row.c1BigStadium}, ${row.c1CloseUpCourts}, ${row.c1BalancedExperience},
      ${row.c5CloseToAction}, ${row.c5BalancedView}, ${row.c5NoPreference}, ${row.c5FlexibleExplore}
    )
    ON CONFLICT (sporting_event_id, option_number) DO UPDATE SET
      arena_code = EXCLUDED.arena_code,
      arena_name = EXCLUDED.arena_name,
      stage_code = EXCLUDED.stage_code,
      stage_label = EXCLUDED.stage_label,
      rounds_label = EXCLUDED.rounds_label,
      session_code = EXCLUDED.session_code,
      session_label = EXCLUDED.session_label,
      seating_code = EXCLUDED.seating_code,
      seating_label = EXCLUDED.seating_label,
      cost_index = EXCLUDED.cost_index,
      cost_stars = EXCLUDED.cost_stars,
      description_text = EXCLUDED.description_text,
      source_note = EXCLUDED.source_note,
      hero_image = EXCLUDED.hero_image,
      stand = EXCLUDED.stand,
      eligible_from = EXCLUDED.eligible_from,
      eligible_to = EXCLUDED.eligible_to,
      c1_lots_of_tennis = EXCLUDED.c1_lots_of_tennis,
      c1_big_stadium = EXCLUDED.c1_big_stadium,
      c1_close_up_courts = EXCLUDED.c1_close_up_courts,
      c1_balanced_experience = EXCLUDED.c1_balanced_experience,
      c5_close_to_action = EXCLUDED.c5_close_to_action,
      c5_balanced_view = EXCLUDED.c5_balanced_view,
      c5_no_preference = EXCLUDED.c5_no_preference,
      c5_flexible_explore = EXCLUDED.c5_flexible_explore,
      last_verified_date = now()
    RETURNING (xmax = 0) AS inserted
  `;
  if (result[0].inserted) inserted++;
  else updated++;
}

console.log(`Done. Inserted: ${inserted}, Updated: ${updated}`);

const [{ count }] = await sql`
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID}
`;
console.log(`Wimbledon option rows now in DB: ${count}`);

const [{ count: aoCount }] = await sql`
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options WHERE sporting_event_id = '1ced8699-d5ce-49fb-add4-6ebc6f251ec6'
`;
console.log(`Australian Open option rows (should still be 43): ${aoCount}`);

const [{ count: rgCount }] = await sql`
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options WHERE sporting_event_id = 'e6f2b585-196e-4842-8648-753a40979f4f'
`;
console.log(`French Open option rows (should still be 87): ${rgCount}`);

await sql.end();

// Does NOT create/activate tennis_ticket_intelligence_edition_status —
// that stays fail-closed (no row = not publicly available) until the
// founder explicitly activates after reviewing, per Execution Phase E of
// the approved implementation contract ("await ChatGPT regression
// approval before activation").
console.log(
  "\nNOTE: tennis_ticket_intelligence_edition_status was NOT created/touched by this script — Wimbledon stays " +
    "fail-closed (not publicly available) until explicitly activated after independent regression approval."
);

await revalidateCacheTags([CACHE_TAGS.TENNIS_TICKET_INTELLIGENCE, CACHE_TAGS.TRIP_INTELLIGENCE_TENNIS]);
