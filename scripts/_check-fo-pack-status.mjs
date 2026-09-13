import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT id, name, slug, pack_format, pack_status, is_hidden, venue_name, venue_address, ticketing_url, pre_trip_brief_lines FROM sporting_events WHERE id = 'e6f2b585-196e-4842-8648-753a40979f4f'`;
console.log(rows);
await sql.end();
