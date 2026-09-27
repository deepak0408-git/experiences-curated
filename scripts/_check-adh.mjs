import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const event = await sql`SELECT id, name, slug, pack_format, is_hidden, pack_status FROM sporting_events WHERE slug = 'abu-dhabi-grand-prix'`;
console.log("EVENT:", event);

if (event[0]) {
  const EVENT_ID = event[0].id;
  const tiers = await sql`SELECT id, tier, event_tier_label, cost_low, cost_high, edition_year FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID} ORDER BY tier`;
  console.log("TIERS:", tiers);

  const seating = await sql`SELECT count(*) FROM circuit_seating_profile WHERE sporting_event_id = ${EVENT_ID}`;
  console.log("EXISTING SEATING ROWS:", seating);

  const exps = await sql`SELECT id, title, slug FROM experiences WHERE sporting_event_id = ${EVENT_ID} ORDER BY title`;
  console.log("EXPERIENCES:", exps);
}

await sql.end();
