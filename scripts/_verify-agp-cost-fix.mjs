import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

const rows = await sql`
  SELECT f.origin_market, om.region, f.cost_low, f.cost_high
  FROM planner_flight_cost f
  JOIN destinations d ON d.id = f.destination_id
  JOIN planner_origin_markets om ON om.city = f.origin_market
  WHERE d.name ILIKE '%melbourne%' AND f.seasonal_band = 'apr' AND f.edition_year = 2027
    AND om.region = 'Asia-Pacific' AND f.origin_market != 'Melbourne'
  ORDER BY f.cost_low
`;
const low = Math.min(...rows.map((r) => Number(r.cost_low)));
const high = Math.max(...rows.map((r) => Number(r.cost_high)));
console.log(`APAC range (apr 2027 only): US$${low}-US$${high}`);
for (const r of rows) console.log(`  ${r.origin_market.padEnd(15)} US$${r.cost_low}-${r.cost_high}`);
await sql.end();
