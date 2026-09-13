import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT id, name, slug, start_date, end_date, pack_status, is_hidden
  FROM sporting_events
  WHERE name ILIKE '%singapore%' OR slug ILIKE '%singapore%'
`;
console.log(rows);
await sql.end();
