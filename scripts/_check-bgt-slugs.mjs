import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const rows = await db.execute(sql`
  select e.slug, e.title, e.experience_type, e.budget_tier
  from sporting_event_experiences see
  join experiences e on e.id = see.experience_id
  where see.sporting_event_id = 'a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd'
  order by e.slug`);
for (const r of rows) console.log(r.slug, "|", r.experience_type, "|", r.budget_tier);
await client.end();
