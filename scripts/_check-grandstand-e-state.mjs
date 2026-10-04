import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";

const seat = await sql`SELECT * FROM circuit_seating_profile WHERE sporting_event_id = ${EVENT_ID} AND seat_name = 'Grandstand E'`;
console.log("GRANDSTAND E SEAT ROW:");
console.log(JSON.stringify(seat, null, 2));

const exp = await sql`SELECT id, title, slug, status, body_content FROM experiences WHERE slug = 'chinese-gp-ticket-guide-mud1pntb'`;
console.log("TICKET GUIDE EXP:");
for (const r of exp) {
  console.log("id:", r.id, "title:", r.title, "status:", r.status);
  console.log("--- body_content ---");
  console.log(r.body_content);
}

await sql.end();
