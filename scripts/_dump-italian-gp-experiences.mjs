import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import { writeFileSync } from "node:fs";
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const rows = await db.execute(sql`
  select e.id, e.slug, e.title, e.subtitle, e.status, e.experience_type, e.body_content, e.why_its_special, e.practical_info,
         e.insider_tips, e.what_to_avoid, e.getting_there, e.booking_links, e.editorial_note
  from sporting_event_experiences see join experiences e on e.id = see.experience_id
  where see.sporting_event_id = 'b93770c0-3d96-4e81-b3d0-c1e3a788fd8e' order by e.title`);
let out = "";
for (const r of rows) {
  out += `\n\n======== ${r.slug} [${r.status}] id=${r.id}\n`;
  for (const [k, v] of Object.entries(r)) { if (v == null || v === "" || k==="id"||k==="slug") continue; out += `--- ${k}: ${typeof v === "string" ? v : JSON.stringify(v)}\n`; }
}
writeFileSync(process.argv[2], out);
console.log("rows", rows.length, "chars", out.length);
await client.end();
