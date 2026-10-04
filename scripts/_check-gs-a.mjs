import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";

const rows = await sql`
  SELECT seat_name, seat_type, ticket_tier_cost_id, linked_experience_id, covered, reserved_seating, single_day_available, min_age, action_tags
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_name
`;
console.table(rows);
await sql.end();
