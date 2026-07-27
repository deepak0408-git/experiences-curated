import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT d.name, count(*) as cnt
  FROM planner_flight_cost pfc JOIN destinations d ON d.id = pfc.destination_id
  GROUP BY d.name ORDER BY d.name
`;
console.log(rows);
await sql.end();
