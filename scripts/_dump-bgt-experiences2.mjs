import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const event = await db.execute(sql`select id, slug, name, pack_status, is_hidden, pack_format, pack_currency, venue_name, venue_address from sporting_events where id = 'a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd'`);
console.log("EVENT:", JSON.stringify(event, null, 2));

const exps = await db.execute(sql`
  select e.id, e.title, e.status, (e.hero_image_url is not null) as has_hero, see.pack_rank
  from sporting_event_experiences see
  join experiences e on e.id = see.experience_id
  where see.sporting_event_id = 'a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd'
  order by e.title`);
console.log("COUNT:", exps.length);
for (const r of exps) console.log(r.id, "|", r.status, "|", r.has_hero, "|", r.pack_rank, "|", r.title);
await client.end();
