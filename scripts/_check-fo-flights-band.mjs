import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const band = await sql`SELECT * FROM planner_destination_bands WHERE destination_id = '488adb47-5327-43e2-8206-d40480301962'`;
console.log("BAND:", band);
const flights = await sql`
  SELECT f.origin_market, f.cost_low, f.cost_high, m.region
  FROM planner_flight_cost f
  JOIN planner_origin_markets m ON m.city = f.origin_market
  WHERE f.destination_id = '488adb47-5327-43e2-8206-d40480301962'
  ORDER BY m.region, f.cost_high
`;
console.log("FLIGHTS:", flights.length);
flights.forEach(f => console.log(`  ${f.region} | ${f.origin_market} | ${f.cost_low}-${f.cost_high}`));
await sql.end();
