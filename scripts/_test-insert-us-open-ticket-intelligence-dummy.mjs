import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// THROWAWAY TEST DATA — to be removed by the founder directly, per
// CLAUDE.md's no-delete-scripts rule (Claude never writes the matching
// delete script, even for its own test inserts).
//
// Purpose: pretend Ticket Intelligence exists for US Open 2027, purely to
// verify the "Find your seat"/"Find your ticket" wiring (event-pack hub
// card, Ticket Intelligence quiz entry, Trip Intelligence results sidebar
// + alternative cards) actually lights up end-to-end for a second tennis
// event, not just Australian Open. US Open has no real Ticket Intelligence
// catalogue — arena/stage/seating values below are schema-valid
// placeholders (the tennis_arena_code enum is RLA/MCA/JCA/GP, all
// Australian Open arena codes — there is no US Open equivalent yet), and
// every text field says so explicitly so nobody mistakes this for real
// content if it's ever glimpsed before removal.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const SPORTING_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9"; // us-open (US Open 2027), verified 20 Oct 2026
const REVIEWED_EDITION_YEAR = 2027;

const [event] = await sql`select id, slug, sport, edition_year from sporting_events where id = ${SPORTING_EVENT_ID}`;
if (!event) throw new Error(`sporting_events row ${SPORTING_EVENT_ID} not found — aborting, will not create one`);
if (event.sport !== "tennis") throw new Error(`Expected sport=tennis, found ${event.sport} — aborting`);
console.log(`Verified event: ${event.slug}, edition_year=${event.edition_year}`);

await sql`
  insert into tennis_ticket_intelligence_options (
    sporting_event_id, option_number, arena_code, arena_name,
    stage_code, stage_label, rounds_label, session_code, session_label,
    seating_code, seating_label, cost_index, cost_stars,
    description_text, source_note
  ) values (
    ${SPORTING_EVENT_ID}, 1, 'RLA', 'DUMMY TEST ARENA — NOT REAL US OPEN DATA',
    'Middle', 'Middle rounds', 'Round of 16 through quarterfinals', 'Day', 'Day session',
    'TEST', 'Dummy test seating — placeholder only', 50.00, 3,
    'THIS IS DUMMY TEST DATA inserted to verify the Find your seat/Find your ticket wiring end-to-end for a second tennis event. Not real US Open ticketing content. To be removed by the founder directly.',
    'Dummy test row — no real source. Inserted 20 Oct 2026 to test Ticket Intelligence wiring for US Open 2027, to be removed by the founder.'
  )
  on conflict (sporting_event_id, option_number) do update set
    description_text = excluded.description_text,
    last_verified_date = now()
`;
console.log("Inserted 1 dummy tennis ticket option for US Open 2027.");

await sql`
  insert into tennis_ticket_intelligence_edition_status (sporting_event_id, reviewed_edition_year, activated_at, activated_by, catalogue_ratified)
  values (${SPORTING_EVENT_ID}, ${REVIEWED_EDITION_YEAR}, now(), 'dummy-test-script', true)
  on conflict (sporting_event_id) do update set
    reviewed_edition_year = excluded.reviewed_edition_year,
    activated_at = excluded.activated_at,
    activated_by = excluded.activated_by,
    catalogue_ratified = excluded.catalogue_ratified
`;
console.log("Activated + ratified dummy edition status for US Open 2027 (TEST ONLY).");

await sql.end();
