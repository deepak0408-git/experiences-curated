import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
await sql`
  UPDATE sporting_events
  SET pre_trip_brief_live_at = now(),
      pre_trip_brief_approval_token = NULL,
      updated_at = now()
  WHERE id = ${EVENT_ID}
`;
const [row] = await sql`SELECT name, pre_trip_brief_live_at FROM sporting_events WHERE id = ${EVENT_ID}`;
console.log(row);
await sql.end();
