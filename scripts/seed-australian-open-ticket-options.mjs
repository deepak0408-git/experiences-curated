import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Tennis Ticket Intelligence — Australian Open 2027 pilot seed. Stage 2
// implementation, 20 Oct 2026. Frozen source data: _tennis-options-source.json
// (43 options, scoring-contract-derived) + _tennis-catalogue-source.json
// (reconstructed descriptions, PENDING_OWNER_RATIFICATION — see
// catalogueRatified column, left FALSE by this script; must be flipped
// true by the founder, separately, never by a seed script).
//
// NOT an inline/one-off db.insert — this is the persisted seed script, same
// discipline as every F1 circuit_seating_profile seed. Re-runnable
// (onConflictDoNothing-equivalent via upsert on the unique
// (sporting_event_id, option_number) key).

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const dir = path.dirname(fileURLToPath(import.meta.url));
const optionsSource = JSON.parse(fs.readFileSync(path.join(dir, "_tennis-options-source.json"), "utf8"));
const catalogueSource = JSON.parse(fs.readFileSync(path.join(dir, "_tennis-catalogue-source.json"), "utf8"));

const SPORTING_EVENT_ID = "1ced8699-d5ce-49fb-add4-6ebc6f251ec6"; // australian-open, verified 19 Oct 2026
const REVIEWED_EDITION_YEAR = 2027;

function descriptionFor(optionId) {
  const found = catalogueSource.option_descriptions.find((d) => d.option_id === optionId);
  if (!found) throw new Error(`No reconstructed description for option ${optionId}`);
  return found.text;
}

const [event] = await sql`select id, slug, sport, edition_year from sporting_events where id = ${SPORTING_EVENT_ID}`;
if (!event) throw new Error(`sporting_events row ${SPORTING_EVENT_ID} not found — aborting, will not create one`);
if (event.sport !== "tennis") throw new Error(`Expected sport=tennis, found ${event.sport} — aborting`);
console.log(`Verified event: ${event.slug}, edition_year=${event.edition_year}`);

let inserted = 0;
for (const opt of optionsSource.options) {
  const sessionCode = opt.session_code; // null for Ground Pass — matches nullable column
  await sql`
    insert into tennis_ticket_intelligence_options (
      sporting_event_id, option_number, arena_code, arena_name,
      stage_code, stage_label, rounds_label, session_code, session_label,
      seating_code, seating_label, cost_index, cost_stars,
      description_text, source_note
    ) values (
      ${SPORTING_EVENT_ID}, ${parseInt(opt.option_id, 10)}, ${opt.arena_code}, ${opt.arena},
      ${opt.stage_code}, ${opt.stage_label}, ${opt.rounds_label}, ${sessionCode}, ${opt.session_label},
      ${opt.seating_code}, ${opt.seating_label}, ${opt.cost_index}, ${opt.cost_stars},
      ${descriptionFor(opt.option_id)},
      ${"Frozen numerical model from Stage 1/2 handoff package (02_scoring_contract.json, 01_ticket_options_43.json). Description text is RECONSTRUCTED (10_RECONSTRUCTED_LANGUAGE_CATALOGUE), pending founder ratification — see catalogueRatified flag."}
    )
    on conflict (sporting_event_id, option_number) do update set
      arena_code = excluded.arena_code,
      arena_name = excluded.arena_name,
      stage_code = excluded.stage_code,
      stage_label = excluded.stage_label,
      rounds_label = excluded.rounds_label,
      session_code = excluded.session_code,
      session_label = excluded.session_label,
      seating_code = excluded.seating_code,
      seating_label = excluded.seating_label,
      cost_index = excluded.cost_index,
      cost_stars = excluded.cost_stars,
      description_text = excluded.description_text,
      last_verified_date = now()
  `;
  inserted++;
}
console.log(`Upserted ${inserted} tennis ticket options.`);

// Edition status row — activatedAt and catalogueRatified both left
// unset/false. This script seeds data only; it never activates or
// ratifies. That is explicitly a separate, founder-only action.
await sql`
  insert into tennis_ticket_intelligence_edition_status (sporting_event_id, reviewed_edition_year)
  values (${SPORTING_EVENT_ID}, ${REVIEWED_EDITION_YEAR})
  on conflict (sporting_event_id) do update set reviewed_edition_year = excluded.reviewed_edition_year
`;
console.log(`Edition status row ensured — reviewed_edition_year=${REVIEWED_EDITION_YEAR}, activated_at=NULL, catalogue_ratified=false (unchanged if already set).`);

await sql.end();
