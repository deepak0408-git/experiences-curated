import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT se.name, t.tier, t.event_tier_label, t.cost_low, t.cost_high,
    CASE
      WHEN t.tier = 'general' THEN 'expected NULL — general is Screen 2 blended default, no label needed'
      WHEN t.event_tier_label IS NULL THEN 'expected NULL — falls back to sport default label at read time'
      ELSE 'has real event-level override'
    END as explanation
  FROM planner_ticket_tier_cost t JOIN sporting_events se ON se.id = t.sporting_event_id
  ORDER BY se.name, t.tier
`;
console.log(rows);
await sql.end();
