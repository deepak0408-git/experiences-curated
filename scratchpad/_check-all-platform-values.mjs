import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const dest = await sql`SELECT id FROM destinations WHERE slug = 'london-gb'`;
const rows = await sql`SELECT title, booking_links FROM experiences WHERE destination_id = ${dest[0].id} AND experience_type IN ('day_trip','accommodation') AND status = 'published'`;
for (const r of rows) {
  console.log(r.title, '->', r.booking_links);
}
await sql.end();
