import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT tier, cost_low, cost_high FROM planner_ticket_tier_cost WHERE sporting_event_id = 'b93770c0-3d96-4e81-b3d0-c1e3a788fd8e' ORDER BY tier`;
console.log(rows);
await sql.end();
