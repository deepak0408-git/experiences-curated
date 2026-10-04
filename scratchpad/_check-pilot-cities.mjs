import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const slugs = ["melbourne-au", "london-gb", "shanghai", "abu-dhabi"];
for (const slug of slugs) {
  const dest = await sql`SELECT id, name, slug, lat, lng, hero_image_url FROM destinations WHERE slug = ${slug}`;
  if (!dest.length) { console.log(slug, "-> NOT FOUND"); continue; }
  const d = dest[0];
  const events = await sql`SELECT name, slug, pack_status, is_hidden, start_date, end_date FROM sporting_events WHERE destination_id = ${d.id} ORDER BY start_date`;
  console.log(`\n${d.name} (${d.slug}) lat=${d.lat} lng=${d.lng} hero=${!!d.hero_image_url}`);
  for (const e of events) {
    console.log(`  - ${e.name} [${e.slug}] status=${e.pack_status} hidden=${e.is_hidden} ${e.start_date}..${e.end_date}`);
  }
  if (!events.length) console.log("  (no linked events)");
}

await sql.end();
