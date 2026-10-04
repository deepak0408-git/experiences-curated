import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT d.name as destination, f.origin_market, f.cost_low, f.cost_high
  FROM planner_flight_cost f
  JOIN destinations d ON d.id = f.destination_id
  WHERE f.cost_low = 0 AND f.cost_high = 0
  ORDER BY d.name
`;
rows.forEach(r => console.log(`${r.destination.padEnd(20)} origin=${r.origin_market}`));
await sql.end();
