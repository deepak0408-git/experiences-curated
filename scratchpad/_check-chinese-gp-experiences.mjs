import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";

const rows = await sql`
  SELECT e.id, e.title, e.slug, e.status, e.experience_type, e.hero_image_url, e.sporting_event_id
  FROM experiences e
  INNER JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = ${EVENT_ID}
  ORDER BY e.experience_type, e.title
`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
