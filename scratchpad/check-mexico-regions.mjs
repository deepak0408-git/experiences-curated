import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const rows = await sql`
  SELECT pom.region, pfc.origin_market, pfc.cost_low, pfc.cost_high
  FROM planner_flight_cost pfc
  JOIN planner_origin_markets pom ON pom.city = pfc.origin_market
  WHERE pfc.destination_id = '883ac422-5318-460f-819a-6ae784ac4b8c'
  ORDER BY pom.region, pfc.cost_low::numeric
`;
console.table(rows);
await sql.end();
