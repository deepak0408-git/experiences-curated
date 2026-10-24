import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { revalidateCacheTags } from "./_lib/revalidate-cache.mjs";
import { CACHE_TAGS } from "./_lib/cache-tags.mjs";

// Seeds the 87 French Open 2027 tennis_ticket_intelligence_options rows
// from the founder-approved implementation package
// (Roland_Garros_2027_Implementation_Ready_DB_Local_001-087.zip),
// specifically the "Final C1-C7 Parameters" sheet of
// RG27_87_Experience_Parameters_DB_Local_001-087.xlsx (extracted to
// scripts/_rg27-source/params_sheet4.tsv — plain XML-parsed TSV, no xlsx
// library dependency added to the project) and
// RG27_Experience_to_Image_Mapping_DB_Local_001-087.csv (copied to
// scripts/_rg27-source/image_mapping.csv). Both source files' SHA-256 was
// verified against the package's own SHA256SUMS.csv before this script was
// written.
//
// Idempotent and event-scoped: upserts on the existing
// (sporting_event_id, option_number) unique constraint, touches ONLY rows
// where sporting_event_id = FRENCH_OPEN_EVENT_ID. Never touches Australian
// Open's 43 rows (different sporting_event_id entirely).
//
// option_number is used DIRECTLY from the source data's "ID" column
// (already 1-87, per founder confirmation — "database option_number =
// approved reference ID - 43" was already applied to the supplied package;
// this script does NOT subtract 43 again).

const dir = path.dirname(fileURLToPath(import.meta.url));
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

function parseTsv(file) {
  const lines = fs.readFileSync(file, "utf8").trim().split(/\r?\n/);
  const header = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    const row = {};
    header.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

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

// Court (fan-facing) -> tennis_arena_code enum value.
const ARENA_CODE_BY_COURT = {
  "Philippe-Chatrier": "PC",
  "Suzanne-Lenglen": "SL",
  "Simonne-Mathieu": "SM",
  "Court 14": "C14",
  "Outside Courts": "GP",
};

// Court -> fan-facing arena_name (matches arenaDisplayName()'s fallback to
// option.arenaName for every non-GP arenaCode).
const ARENA_NAME_BY_COURT = {
  "Philippe-Chatrier": "Court Philippe-Chatrier",
  "Suzanne-Lenglen": "Court Suzanne-Lenglen",
  "Simonne-Mathieu": "Court Simonne-Mathieu",
  "Court 14": "Court 14",
};

// Internal stage -> tennis_stage_code enum value. Transition scores
// identically to Middle, "Late access" identically to Late in the approved
// C2 table (verified during discovery) — collapsed here for the scoring
// column; the real fan-facing distinction, where one exists, lives in
// stage_label/rounds_label instead.
const STAGE_CODE_BY_INTERNAL_STAGE = {
  Early: "Early",
  Middle: "Middle",
  Late: "Late",
  Transition: "Middle",
  "Late access": "Late",
};

// Fan-facing stage_label per internal stage (distinct from the collapsed
// stage_code above, so Ground Pass's 3 fan-facing names stay distinguishable
// even though 2 of them share a stage_code with Philippe-Chatrier/etc).
const STAGE_LABEL_BY_INTERNAL_STAGE = {
  Early: "Early Rounds",
  Middle: "Middle Rounds",
  Late: "Late Rounds",
  Transition: "Middle Rounds",
  "Late access": "Late Rounds",
};

// Session -> tennis_session_code enum value. Semifinals/Finals score
// identically to "Day" in the approved C4 table (verified during
// discovery: Day=1.00, Night=0.10 for both) — collapsed for the scoring
// column; the real fan-facing session name is carried in session_label.
const SESSION_CODE_BY_SESSION = {
  Day: "Day",
  Night: "Night",
  Semifinals: "Day",
  Finals: "Day",
};

function roundsLabelFor(row) {
  // Rounds label — factual, derived only from the approved
  // Internal-stage/Session/Court columns already in the workbook; no new
  // claims. Ground Pass rows use their own fan-facing experience name
  // (already descriptive: "Ground Pass — Early" etc.) as the rounds label
  // equivalent, matching AO's own GP rows pattern (AO has no GP rows to
  // compare against directly in this table, so this follows the general
  // "describe what this option covers" intent of rounds_label elsewhere).
  if (row["Court / access"] === "Outside Courts") return row["Fan-facing experience"];
  if (row.Session === "Semifinals") return "Semifinal rounds";
  if (row.Session === "Finals") return "Championship finals";
  if (row["Internal stage"] === "Early") return "Early rounds";
  if (row["Internal stage"] === "Middle" || row["Internal stage"] === "Transition") return "Middle rounds";
  return "Late rounds";
}

function sessionLabelFor(row) {
  if (row["Court / access"] === "Outside Courts") return "Grounds access";
  if (row.Session === "Semifinals") return "Semifinal Session";
  if (row.Session === "Finals") return "Final Session";
  if (row.Session === "Day") return "Day Session";
  if (row.Session === "Night") return "Night Session";
  return row.Session;
}

// Seating code scheme: `${CATEGORY}_${ORIENTATION}` matching the keys
// added to presentationMappings.ts's SEATING_MAP. Ground Pass has no
// seating code requirement (its presentation is handled by the arenaCode
// === "GP" branch, same as AO).
const CATEGORY_CODE = { Gold: "GOLD", "Category 1": "C1", "Category 2": "C2", "Category 3": "C3" };
const ORIENTATION_CODE = { Baseline: "BL", Sideline: "SL" };

function seatingCodeFor(row) {
  if (row["Court / access"] === "Outside Courts") return "GP";
  const cat = CATEGORY_CODE[row.Category];
  const orient = ORIENTATION_CODE[row.Orientation];
  if (!cat || !orient) {
    throw new Error(`Unmapped category/orientation: "${row.Category}"/"${row.Orientation}" (ID ${row.ID})`);
  }
  return `${cat}_${orient}`;
}

function seatingLabelFor(row) {
  if (row["Court / access"] === "Outside Courts") return "Unreserved grounds access";
  return `${row.Category} ${row.Orientation}`;
}

const paramRows = parseTsv(path.join(dir, "_rg27-source", "params_sheet4.tsv"));
const imageRows = parseCsv(path.join(dir, "_rg27-source", "image_mapping.csv"));

if (paramRows.length !== 87) {
  throw new Error(`Expected exactly 87 parameter rows, found ${paramRows.length} — stop, do not seed partial data.`);
}
const ids = paramRows.map((r) => parseInt(r.ID, 10)).sort((a, b) => a - b);
for (let i = 0; i < 87; i++) {
  if (ids[i] !== i + 1) throw new Error(`option_number gap/duplicate detected at position ${i}: expected ${i + 1}, got ${ids[i]}`);
}

const imageByExperienceId = new Map(imageRows.map((r) => [parseInt(r.experience_id, 10), r]));
// R2 upload step (Phase F) writes the real hero_image URL per option after
// this seed runs — see scripts/upload-tennis-french-open-images.mjs. This
// script leaves hero_image as the deterministic R2 URL it WILL be at
// (same key convention as AO's heroImage column), so option rows and
// images stay in sync even if upload runs in a separate pass; if the
// upload step is skipped entirely, these URLs would 404, which is the
// visible symptom to catch rather than silently leaving every row null.
function heroImageUrlFor(id) {
  const img = imageByExperienceId.get(id);
  if (!img) return null;
  return `https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/french-open/2027/options/${img.image_filename}`;
}

const rows = paramRows.map((r) => {
  const id = parseInt(r.ID, 10);
  const court = r["Court / access"];
  const arenaCode = ARENA_CODE_BY_COURT[court];
  if (!arenaCode) throw new Error(`Unmapped court "${court}" (ID ${id})`);
  const internalStage = r["Internal stage"];
  const stageCode = STAGE_CODE_BY_INTERNAL_STAGE[internalStage];
  if (!stageCode) throw new Error(`Unmapped internal stage "${internalStage}" (ID ${id})`);
  const sessionCode = SESSION_CODE_BY_SESSION[r.Session] ?? null;

  const standRaw = (r.stand || "").trim();
  const stand = standRaw.length > 0 ? standRaw : null;

  return {
    sportingEventId: FRENCH_OPEN_EVENT_ID,
    optionNumber: id,
    arenaCode,
    arenaName: arenaCode === "GP" ? "Ground Pass" : ARENA_NAME_BY_COURT[court],
    stageCode,
    stageLabel: STAGE_LABEL_BY_INTERNAL_STAGE[internalStage],
    roundsLabel: roundsLabelFor(r),
    sessionCode: arenaCode === "GP" ? null : sessionCode,
    sessionLabel: sessionLabelFor(r),
    seatingCode: seatingCodeFor(r),
    seatingLabel: seatingLabelFor(r),
    costIndex: r["C6 Cost index"],
    costStars: parseInt(r["C6 Cost stars"], 10),
    descriptionText: r["Fan-facing experience"],
    sourceNote:
      `Approved Roland-Garros 2027 parameter workbook (RG27_87_Experience_Parameters_DB_Local_001-087.xlsx, ` +
      `"Final C1-C7 Parameters" sheet), option ID ${id}. Cost evidence: ${r["Cost evidence basis"] || "n/a"}.` +
      (r["Ticketing / review note"] ? ` Note: ${r["Ticketing / review note"]}` : ""),
    heroImage: heroImageUrlFor(id),
    stand,
    eligibleFrom: r["C7 Eligible from"],
    eligibleTo: r["C7 Eligible to"],
    c1LotsOfTennis: r["C1 Lots of tennis"],
    c1BigStadium: r["C1 Big stadium"],
    c1CloseUpCourts: r["C1 Close-up courts"],
    c1BalancedExperience: r["C1 Balanced experience"],
    c5CloseToAction: r["C5 Close to action"],
    c5BalancedView: r["C5 Balanced view"],
    c5NoPreference: r["C5 No preference"],
    c5FlexibleExplore: r["C5 Flexible/explore"],
  };
});

console.log(`Prepared ${rows.length} French Open option rows. Upserting...`);

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
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${FRENCH_OPEN_EVENT_ID}
`;
console.log(`French Open option rows now in DB: ${count}`);

const [{ count: aoCount }] = await sql`
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options WHERE sporting_event_id = '1ced8699-d5ce-49fb-add4-6ebc6f251ec6'
`;
console.log(`Australian Open option rows (should still be 43): ${aoCount}`);

await sql.end();

// Re-seeding after activation (a correction pass, not first seed) would
// otherwise leave the fixed rows stale behind the cache for up to an hour —
// see feedback_unstable_cache_tags_and_revalidation memory.
await revalidateCacheTags([CACHE_TAGS.TENNIS_TICKET_INTELLIGENCE, CACHE_TAGS.TRIP_INTELLIGENCE_TENNIS]);
