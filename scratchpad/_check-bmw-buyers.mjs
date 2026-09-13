import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT count(*)::int AS n FROM purchases
  WHERE sporting_event_id = 'ea035967-b5d7-47e6-ad44-7cf4db07e70b' AND status = 'active'
`;
console.log(rows);
await sql.end();
