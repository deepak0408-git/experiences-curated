import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Targeted Australian Open / French Open regression smoke tests —
// Section 10A #15 of the Wimbledon implementation contract. Confirms
// nothing about the Wimbledon onboarding (schema enum widening, shared
// presentationMappings.ts/arenaMaps.ts/FullResult.tsx edits) altered
// either prior tournament's stored data or option counts.

const AO_EVENT_ID = "1ced8699-d5ce-49fb-add4-6ebc6f251ec6";
const RG_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

let failures = 0;
function check(label, cond, detail = "") {
  const status = cond ? "PASS" : "FAIL";
  if (!cond) failures++;
  console.log(`[${status}] ${label}${detail ? " — " + detail : ""}`);
}

const [{ count: aoCount }] = await sql`SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${AO_EVENT_ID}`;
check("Australian Open still has exactly 43 option rows", aoCount === 43, `got ${aoCount}`);

const [{ count: rgCount }] = await sql`SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${RG_EVENT_ID}`;
check("French Open still has exactly 87 option rows", rgCount === 87, `got ${rgCount}`);

const [{ count: aoImg }] = await sql`SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${AO_EVENT_ID} AND hero_image IS NOT NULL`;
check("Australian Open hero_image count unchanged (43/43 — all had images before)", aoImg === 43, `got ${aoImg}`);

const [{ count: rgImg }] = await sql`SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${RG_EVENT_ID} AND hero_image IS NOT NULL`;
check("French Open hero_image count unchanged (87/87 — all had images before)", rgImg === 87, `got ${rgImg}`);

// Edition status untouched — still activated/ratified exactly as before.
const [aoStatus] = await sql`SELECT * FROM tennis_ticket_intelligence_edition_status WHERE sporting_event_id = ${AO_EVENT_ID}`;
check("Australian Open edition status still activated + ratified", aoStatus.activated_at !== null && aoStatus.catalogue_ratified === true);

const [rgStatus] = await sql`SELECT * FROM tennis_ticket_intelligence_edition_status WHERE sporting_event_id = ${RG_EVENT_ID}`;
check("French Open edition status still activated + ratified", rgStatus.activated_at !== null && rgStatus.catalogue_ratified === true);

// Wimbledon's own edition status row must NOT exist yet (fail-closed, not activated).
const [wimStatus] = await sql`SELECT * FROM tennis_ticket_intelligence_edition_status WHERE sporting_event_id = '8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf'`;
check("Wimbledon has NO edition_status row (fail-closed, not yet activated)", wimStatus === undefined);

// Confirm the enum widening didn't disturb AO/RG's existing arena_code
// values — compare as sets (sorted alphabetically here in JS, since
// Postgres's own ORDER BY sorts by the enum's declared order, not
// alphabetically, which isn't what this check cares about).
const [{ arena_codes: aoArenaCodes }] = await sql`
  SELECT array_agg(DISTINCT arena_code) AS arena_codes FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${AO_EVENT_ID}
`;
check(
  "Australian Open arena_codes unchanged (RLA,MCA,JCA,GP)",
  JSON.stringify([...aoArenaCodes].sort()) === JSON.stringify(["GP", "JCA", "MCA", "RLA"]),
  JSON.stringify(aoArenaCodes)
);

const [{ arena_codes: rgArenaCodes }] = await sql`
  SELECT array_agg(DISTINCT arena_code) AS arena_codes FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${RG_EVENT_ID}
`;
check(
  "French Open arena_codes unchanged (C14,GP,PC,SL,SM)",
  JSON.stringify([...rgArenaCodes].sort()) === JSON.stringify(["C14", "GP", "PC", "SL", "SM"]),
  JSON.stringify(rgArenaCodes)
);

await sql.end();

console.log(failures === 0 ? "\nALL AO/RG REGRESSION SMOKE TESTS PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
