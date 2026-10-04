import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const dests = await sql`SELECT id, name, slug FROM destinations WHERE name ILIKE '%monaco%'`;
console.log('Destinations:', dests);

const events = await sql`SELECT id, name, slug, pack_status, pack_format, is_hidden, start_date, end_date FROM sporting_events WHERE name ILIKE '%monaco%' OR slug ILIKE '%monaco%'`;
console.log('Events:', events);

await sql.end();
