import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const EVENT_ID = "14a2fa08-14f4-406d-a6df-5d00ad7998a6";

const deleted = await sql`
  DELETE FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID} AND seat_name = 'Zone Z1'
  RETURNING seat_name
`;
console.log("Deleted stale row:", deleted);

await sql.end();
