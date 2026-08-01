import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT tier, event_tier_label, cost_low, cost_high FROM planner_ticket_tier_cost WHERE sporting_event_id = '91f298a3-ca22-49c3-9c8e-5a200f0026c9'`;
console.log(rows);
await sql.end();
