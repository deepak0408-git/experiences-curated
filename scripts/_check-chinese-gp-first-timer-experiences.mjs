import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const rows = await sql`
  SELECT e.title, e.slug, e.status, e.experience_type
  FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = '020c6a95-1b15-4a63-8a55-853656b1fe8d'
    AND (e.slug LIKE '%first-timer%' OR e.slug LIKE '%visa%')
  ORDER BY e.title
`;
console.log(JSON.stringify(rows, null, 2));

await sql.end();
