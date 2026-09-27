import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899"; // Qatar GP 2026

const tiers = await sql`SELECT id, tier, event_tier_label, cost_low, cost_high, edition_year FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID} ORDER BY tier`;
console.log("TIERS:", tiers);

const seating = await sql`SELECT count(*) FROM circuit_seating_profile WHERE sporting_event_id = ${EVENT_ID}`;
console.log("EXISTING SEATING ROWS:", seating);

const exps = await sql`SELECT id, title, slug FROM experiences WHERE sporting_event_id = ${EVENT_ID} ORDER BY title`;
console.log("EXPERIENCES:", exps);

await sql.end();
