import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// The 12 Sep 2026 São Paulo GP rename only updated sporting_events.name and
// deleted the unmatched duplicate calendar row — it missed that
// external_calendar_events is a fully separate table with its own `name`
// column, which /calendar/formula-1 actually reads from. This row's name
// was still "Brazilian Grand Prix", caught live by the founder on the
// deployed calendar page.
const ROW_ID = "eb933e8a-9614-46f5-aa5f-fc54afbf3cea";

const [before] = await sql`SELECT name FROM external_calendar_events WHERE id = ${ROW_ID}`;
console.log(`Before: "${before.name}"`);

await sql`UPDATE external_calendar_events SET name = 'São Paulo Grand Prix' WHERE id = ${ROW_ID}`;

const [after] = await sql`SELECT name FROM external_calendar_events WHERE id = ${ROW_ID}`;
console.log(`After: "${after.name}"`);

await sql.end();
