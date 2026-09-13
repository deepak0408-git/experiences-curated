import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT id, name, slug, start_date, end_date, pack_status, is_hidden, pack_format, venue_name
  FROM sporting_events
  WHERE name ILIKE '%malay%' OR name ILIKE '%sepang%' OR name ILIKE '%bahrain%' OR slug ILIKE '%malay%' OR slug ILIKE '%sepang%' OR slug ILIKE '%bahrain%'
`;
console.log(rows);
await sql.end();
