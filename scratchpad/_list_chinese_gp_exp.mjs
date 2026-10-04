import { config } from "dotenv";
config({ path: "C:/Users/HP/.claude/projects/ExperienceCurator/.env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const rows = await sql`
  SELECT e.title, e.slug, e.experience_type FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = '020c6a95-1b15-4a63-8a55-853656b1fe8d'
  ORDER BY e.title
`;
console.table(rows);
await sql.end();
