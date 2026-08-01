import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const indexes = await sql`
  SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'planner_ticket_tier_cost'
`;
console.log("INDEXES:", indexes);

const rows = await sql`SELECT se.name, t.tier, t.event_tier_label, t.cost_low, t.cost_high FROM planner_ticket_tier_cost t JOIN sporting_events se ON se.id = t.sporting_event_id ORDER BY se.name, t.tier`;
console.log("ROWS:", rows);

await sql.end();
