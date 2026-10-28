import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { revalidateCacheTags } from "./_lib/revalidate-cache.mjs";
import { CACHE_TAGS } from "./_lib/cache-tags.mjs";

// Seeds the 31 US Open 2027 tennis_ticket_intelligence_options rows from
// the Phase 5 handoff package's master CSV
// (USO27_Phase5_Development_Handoff_COMPLETE.zip,
// 01_master_data/US_Open_2027_Experience_Options_Master_v07_Numbering_Approved_Schema_Mapping_Pending.csv,
// SHA256 2d6380d92d95923d2ef6a3cf336b3e14783b36ca548be6c8261f1a57ea37d9e7,
// verified against the package's own FILE_MANIFEST_SHA256.json before this
// script was written), copied locally to
// scripts/_uso27-source/options_master_v07.csv.
//
// The CSV's own per-row status columns (cost_index_approval_status,
// schema_status) say "provisional; not frozen" / "NOT seed-ready" — this
// conflicts with the package's top-level DEVELOPMENT_SPECIFICATION.md,
// which calls the data frozen. Per explicit founder direction (28 Oct
// 2026), this script treats the top-level spec as authoritative and seeds
// anyway. Recorded here, not re-litigated.
//
// Idempotent and event-scoped: upserts on the existing
// (sporting_event_id, option_number) unique constraint, touches ONLY rows
// where sporting_event_id = US_OPEN_EVENT_ID. Never touches AO/French
// Open/Wimbledon rows (different sporting_event_id entirely).
//
// Unlike French Open's workbook, this CSV already supplies arena/seating
// codes, raw per-option C1/C5 values, and per-option eligible_from/
// eligible_to directly (arena_code_proposed_not_migrated,
// seating_code_proposed_not_approved) — no court-name-to-enum translation
// needed, just a column rename onto the real schema. arena_code_proposed
// values AA/LA/GS were added to the tennis_arena_code enum by
// scripts/_migrate-0019-tennis-us-open-arena-codes.mjs; GP (Grounds
// Admission) reuses the existing AO/French Open/Wimbledon Ground Pass code.
//
// descriptionText is seeded AS-IS from the CSV's "DRAFT —" draft copy —
// this is deliberate, not an oversight: tennisTicketIntelligenceEditionStatus
// is NOT inserted/activated by this script, so getTennisOptionsData.ts's
// fail-closed isPubliclyAvailable check (requires activatedAt !== null AND
// catalogueRatified === true) keeps this route showing a "not yet
// available" state regardless of what's in the options table. Draft text
// sits in the DB for scoring/explanation development and smoke testing,
// never served publicly, until a founder-approved copy pass replaces it
// and a separate activation script (following
// scripts/_ratify-activate-french-open.mjs's pattern) flips both flags.

const dir = path.dirname(fileURLToPath(import.meta.url));
const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

function parseCsv(file) {
  const text = fs.readFileSync(file, "utf8");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (c === "\r") {
        // skip
      } else field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows[0];
  return rows.slice(1).filter((r) => r.length > 1).map((cells) => {
    const obj = {};
    header.forEach((h, i) => (obj[h] = cells[i] ?? ""));
    return obj;
  });
}

const sourceRows = parseCsv(path.join(dir, "_uso27-source", "options_master_v07.csv"));

if (sourceRows.length !== 31) {
  throw new Error(`Expected exactly 31 option rows, found ${sourceRows.length} — stop, do not seed partial data.`);
}
const optionNumbers = sourceRows.map((r) => parseInt(r.option_number, 10)).sort((a, b) => a - b);
for (let i = 0; i < 31; i++) {
  if (optionNumbers[i] !== i + 1) {
    throw new Error(`option_number gap/duplicate detected at position ${i}: expected ${i + 1}, got ${optionNumbers[i]}`);
  }
}

const rows = sourceRows.map((r) => {
  const arenaCode = r.arena_code_proposed_not_migrated;
  if (!["AA", "LA", "GS", "GP"].includes(arenaCode)) {
    throw new Error(`Unmapped arena code "${arenaCode}" (option ${r.option_number})`);
  }
  const seatingCode = r.seating_code_proposed_not_approved;
  if (!seatingCode) throw new Error(`Missing seating code (option ${r.option_number})`);

  const num = (v) => (v === "" || v === null || v === undefined ? null : v);

  return {
    sportingEventId: US_OPEN_EVENT_ID,
    optionNumber: parseInt(r.option_number, 10),
    arenaCode,
    arenaName: r.arena_name,
    stageCode: r.stage_code,
    stageLabel: r.stage_label,
    roundsLabel: r.rounds_label,
    sessionCode: r.session_code, // US Open: every row (GP included) carries a real Day/Night value
    sessionLabel: r.session_label,
    seatingCode,
    seatingLabel: r.seating_label,
    costIndex: r.cost_index,
    costStars: parseInt(r.cost_stars, 10),
    descriptionText: r.description_text,
    sourceNote:
      `US Open 2027 Phase 5 handoff, master v07 (SHA256 2d6380d92d95923d2ef6a3cf336b3e14783b36ca548be6c8261f1a57ea37d9e7), ` +
      `option ${r.option_number} (${r.record_key || "no record key"}). Cost index is a provisional relative-cost model ` +
      `("${r.cost_index_model || "model n/a"}"), NOT a confirmed 2027 ticket price — historical 2026 third-party proxy ` +
      `USD ${r.historical_2026_price_proxy_usd || "n/a"}. Date window status: ${r.date_status || "n/a"}. ` +
      `Schema mapping status at seed time: ${r.schema_status || "n/a"}.`,
    heroImage: null, // wired by a separate image-upload pass
    stand: null, // US Open's master CSV has no per-option stand field
    eligibleFrom: r.eligible_from,
    eligibleTo: r.eligible_to,
    c1LotsOfTennis: num(r.c1_lots_of_tennis),
    c1BigStadium: num(r.c1_big_stadium),
    c1CloseUpCourts: num(r.c1_close_up_courts),
    c1BalancedExperience: num(r.c1_balanced_experience),
    c5CloseToAction: num(r.c5_close_to_action),
    c5BalancedView: num(r.c5_balanced_view),
    c5NoPreference: num(r.c5_no_preference),
    c5FlexibleExplore: num(r.c5_flexible_explore),
  };
});

console.log(`Prepared ${rows.length} US Open option rows. Upserting...`);

let inserted = 0;
let updated = 0;
for (const row of rows) {
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
      -- COALESCE, not a plain overwrite: this script always passes
      -- heroImage=null (the image upload is a separate pass, run after
      -- seeding -- see upload-tennis-us-open-images.mjs). A plain
      -- EXCLUDED.hero_image here would silently wipe every row's real R2
      -- URL back to null on any re-run after the upload step, which is
      -- exactly what happened in production on 28 Oct 2026 (caught live
      -- during visual UAT: every option showed "Arena view coming soon").
      -- Never downgrade an existing real value to null on a re-seed.
      hero_image = COALESCE(tennis_ticket_intelligence_options.hero_image, EXCLUDED.hero_image),
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
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${US_OPEN_EVENT_ID}
`;
console.log(`US Open option rows now in DB: ${count}`);

await sql.end();

// Not activated — no tennisTicketIntelligenceEditionStatus row is inserted
// here. getTennisOptionsData.ts's fail-closed check keeps this route
// showing "not yet available" until a separate, explicit activation step.
await revalidateCacheTags([CACHE_TAGS.TENNIS_TICKET_INTELLIGENCE, CACHE_TAGS.TRIP_INTELLIGENCE_TENNIS]);
