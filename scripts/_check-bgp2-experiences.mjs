import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT e.id, e.title, e.experience_type, e.status, e.neighborhood
  FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = '07e23597-720b-41e1-b8ff-419e004307ee'
  ORDER BY e.experience_type, e.title
`;
console.log(rows.length, "experiences");
console.log(rows);
await sql.end();
