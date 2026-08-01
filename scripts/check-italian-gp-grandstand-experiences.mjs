import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT e.title, e.experience_type, e.status
  FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = 'b93770c0-3d96-4e81-b3d0-c1e3a788fd8e'
  AND (e.title ILIKE '%grandstand%' OR e.title ILIKE '%curva%' OR e.title ILIKE '%where to sit%' OR e.title ILIKE '%stand%')
`;
console.log(rows);
await sql.end();
