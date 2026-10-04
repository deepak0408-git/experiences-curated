import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const [exp] = await sql`SELECT id, title, slug, sport, sporting_event_id, status FROM experiences WHERE slug = 'china-visa-apps-payments-guide-mskq7nml'`;
console.log("EXPERIENCE:", JSON.stringify(exp, null, 2));

const links = await sql`
  SELECT see.sporting_event_id, se.slug AS event_slug, se.name, se.pack_format
  FROM sporting_event_experiences see
  JOIN sporting_events se ON se.id = see.sporting_event_id
  WHERE see.experience_id = ${exp.id}
`;
console.log("LINKED EVENTS:", JSON.stringify(links, null, 2));

await sql.end();
