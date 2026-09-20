import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca";

const rows = await sql`
  SELECT f.origin_market, f.cost_low, f.cost_high, m.region
  FROM planner_flight_cost f
  JOIN planner_origin_markets m ON m.city = f.origin_market
  WHERE f.destination_id = ${DESTINATION_ID} AND f.edition_year = 2027 AND m.region = 'Europe'
  ORDER BY f.cost_high DESC
`;
for (const r of rows) {
  console.log(`${r.origin_market.padEnd(20)} low=${r.cost_low} high=${r.cost_high}`);
}
await sql.end();
