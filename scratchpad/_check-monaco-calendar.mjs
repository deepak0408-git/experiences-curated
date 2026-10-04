import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const rows = await sql`SELECT id, name, start_date, is_provisional, matched_sporting_event_id FROM external_calendar_events WHERE name ILIKE '%monaco%'`;
console.log('External calendar events:', rows);

await sql.end();
