import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT id, name, start_date, is_provisional, matched_sporting_event_id FROM external_calendar_events WHERE name ILIKE '%french open%' OR name ILIKE '%roland garros%'`;
console.log(rows);
await sql.end();
