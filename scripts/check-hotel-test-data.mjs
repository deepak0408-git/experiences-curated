import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT d.name, h.tier, h.cost_low, h.cost_high, h.last_updated
  FROM planner_hotel_tier_cost h JOIN destinations d ON d.id = h.destination_id
  ORDER BY d.name, h.tier
`;
console.log(rows);
await sql.end();
