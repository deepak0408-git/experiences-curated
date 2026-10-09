import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import { writeFileSync } from "node:fs";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.execute(sql`
  select e.slug, e.title, e.subtitle, e.experience_type, e.budget_tier, e.neighborhood, e.address,
         e.body_content, e.why_its_special, e.practical_info,
         e.insider_tips, e.what_to_avoid, e.getting_there, e.booking_links,
         e.google_maps_rating, e.google_maps_url, e.curation_tier
  from sporting_event_experiences see
  join experiences e on e.id = see.experience_id
  where see.sporting_event_id = 'a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd'
  order by e.title`);

let out = "";
for (const r of rows) {
  out += `\n\n======== ${r.slug}\n`;
  for (const [k, v] of Object.entries(r)) {
    if (v == null || v === "") continue;
    out += `--- ${k}: ${typeof v === "string" ? v : JSON.stringify(v)}\n`;
  }
}
const path = process.argv[2];
writeFileSync(path, out);
console.log("wrote", rows.length, "rows,", out.length, "chars");
await client.end();
