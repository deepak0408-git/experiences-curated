import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const [event] = await sql`SELECT id, name, slug, destination_id, pack_status, start_date, end_date FROM sporting_events WHERE slug LIKE '%us-open%'`;
console.log(event);
if (event) {
  const [dest] = await sql`SELECT id, name, currency FROM destinations WHERE id = ${event.destination_id}`;
  console.log(dest);
}
await sql.end();
