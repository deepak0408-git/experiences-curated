import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

console.log("=== SPORT DEFAULTS ===");
const defaults = await sql`SELECT sport, tier_key, default_label FROM planner_ticket_tier_sport_label ORDER BY sport, tier_key`;
console.log(defaults);

console.log("\n=== EVENT OVERRIDES ===");
const overrides = await sql`
  SELECT se.name, t.tier, t.event_tier_label, t.cost_low, t.cost_high
  FROM planner_ticket_tier_cost t JOIN sporting_events se ON se.id = t.sporting_event_id
  ORDER BY se.name, t.tier
`;
console.log(overrides);

await sql.end();
