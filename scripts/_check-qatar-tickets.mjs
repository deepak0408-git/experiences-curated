import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const t = await sql`SELECT * FROM planner_ticket_tier_cost WHERE sporting_event_id = '8ab4460a-122e-4c1b-bcfe-81f93359c899'`;
console.log("Qatar GP ticket tiers:", t);
await sql.end();
