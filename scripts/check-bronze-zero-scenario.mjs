import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const BELGIAN_GP_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const rows = await sql`SELECT tier, cost_low, cost_high, event_tier_label FROM planner_ticket_tier_cost WHERE sporting_event_id = ${BELGIAN_GP_ID} ORDER BY tier`;
console.log(rows);
await sql.end();
