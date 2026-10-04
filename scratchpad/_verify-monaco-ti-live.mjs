import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const EVENT_ID = "14a2fa08-14f4-406d-a6df-5d00ad7998a6";

const seatCount = await sql`SELECT COUNT(*) FROM circuit_seating_profile WHERE sporting_event_id = ${EVENT_ID}`;
console.log("Seat rows:", seatCount[0].count);

const event = await sql`SELECT slug, pack_status, is_hidden, hero_image_url, destination_id FROM sporting_events WHERE id = ${EVENT_ID}`;
console.log("Event state:", event[0]);

await sql.end();
