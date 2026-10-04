import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
for (const slug of ["silverstone", "dubai"]) {
  const d = await sql`SELECT id, name FROM destinations WHERE slug = ${slug}`;
  if (!d.length) { console.log(slug, "not found"); continue; }
  const events = await sql`SELECT name, slug, pack_status, is_hidden, start_date FROM sporting_events WHERE destination_id = ${d[0].id}`;
  console.log(slug, '->', events.length, 'events:', events.map(e => e.name).join(', ') || '(none)');
}
await sql.end();
