import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT se.name, t.tier, t.cost_low, t.cost_high
  FROM planner_ticket_tier_cost t JOIN sporting_events se ON se.id = t.sporting_event_id
  ORDER BY se.name, t.tier
`;
console.log(rows);
await sql.end();
