import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const rows = await sql`
  SELECT id, title, slug FROM experiences
  WHERE title IN (
    'F1 Paddock Club & Champions Club — Mexico City',
    'Mexico City GP Ticket Guide',
    'Foro Sol — The Loudest Corner in F1',
    'Where to Sit — Grandstand Comparison'
  )
`;
console.table(rows);
await sql.end();
