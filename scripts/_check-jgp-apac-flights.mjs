import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT f.origin_market, f.cost_low, f.cost_high, m.region
  FROM planner_flight_cost f
  JOIN planner_origin_markets m ON m.city = f.origin_market
  WHERE f.destination_id = '9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9'
    AND f.edition_year = 2027 AND f.seasonal_band = 'apr'
    AND m.region = 'Asia-Pacific'
  ORDER BY f.cost_low ASC
`;
rows.forEach(r => console.log(`${r.origin_market.padEnd(15)} low=${r.cost_low}  high=${r.cost_high}`));
await sql.end();
