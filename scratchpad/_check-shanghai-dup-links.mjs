import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const dest = await sql`SELECT id FROM destinations WHERE slug = 'shanghai'`;
const rows = await sql`SELECT slug, title, booking_links FROM experiences WHERE destination_id = ${dest[0].id} AND experience_type IN ('day_trip','cultural_site','activity') AND status = 'published'`;
for (const r of rows) {
  const links = r.booking_links;
  if (links && JSON.stringify(links).includes('yu-garden')) {
    console.log(r.title, '->', JSON.stringify(links));
  }
}
await sql.end();
