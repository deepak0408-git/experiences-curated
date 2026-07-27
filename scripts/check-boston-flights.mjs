import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT d.name as dest_name, pfc.seasonal_band, pfc.cost_low, pfc.cost_high
  FROM planner_flight_cost pfc JOIN destinations d ON d.id = pfc.destination_id
  WHERE pfc.origin_market = 'Boston'
  ORDER BY d.name, pfc.seasonal_band
`;
console.log(rows);
await sql.end();
