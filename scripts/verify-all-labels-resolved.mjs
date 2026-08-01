import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT se.name, t.tier, t.event_tier_label, t.cost_low, t.cost_high
  FROM planner_ticket_tier_cost t JOIN sporting_events se ON se.id = t.sporting_event_id
  WHERE t.tier != 'general'
  ORDER BY se.name, t.tier
`;
console.log(rows);
const stillNull = rows.filter(r => r.event_tier_label === null);
console.log(`\n${stillNull.length} rows still NULL (excluding general)`);
await sql.end();
