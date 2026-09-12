import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// F1's official 2026 name for this race is the "São Paulo Grand Prix" (per
// formula1.com/en/racing/2026/brazil), not "Brazilian Grand Prix" (the
// historical name). Founder decision, 12 Sep 2026: update user-facing
// display text only — sportingEvents.name, calendar, and pack copy — leave
// the internal slug (brazilian-grand-prix), file paths, PACK_PRICING_CONFIG
// keys, env var names, and SPOKES_BY_EVENT keys untouched to avoid a much
// bigger rework (breaking the live URL, needing a redirect, renaming every
// config table key). Also resolves the duplicate calendar row: an unmatched
// "São Paulo Grand Prix" externalCalendarEvents row existed alongside the
// matched "Brazilian Grand Prix" row for the same Nov 2026 race — deleting
// the duplicate now that the matched row's display name is correct.
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const DUPLICATE_CALENDAR_ROW_ID = "1d32f9f2-37cf-46bb-bc7e-1272898d255d";

const [before] = await sql`SELECT name FROM sporting_events WHERE id = ${EVENT_ID}`;
console.log(`sportingEvents.name before: "${before.name}"`);

await sql`UPDATE sporting_events SET name = 'São Paulo Grand Prix 2026' WHERE id = ${EVENT_ID}`;

const [after] = await sql`SELECT name FROM sporting_events WHERE id = ${EVENT_ID}`;
console.log(`sportingEvents.name after: "${after.name}"`);

const deleted = await sql`DELETE FROM external_calendar_events WHERE id = ${DUPLICATE_CALENDAR_ROW_ID} RETURNING name`;
console.log(`Deleted duplicate calendar row: ${deleted[0]?.name ?? "not found"}`);

await sql.end();
