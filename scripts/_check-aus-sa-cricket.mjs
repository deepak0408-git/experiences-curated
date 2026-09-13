import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT id, name, slug, sport, start_date, end_date, pack_status, is_hidden, pack_format FROM sporting_events WHERE id = 'be8e1129-6e53-4e45-a574-931250988806'`;
console.log(rows);
await sql.end();
