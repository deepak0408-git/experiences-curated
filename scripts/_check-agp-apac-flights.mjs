import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

const rows = await sql`
  SELECT f.origin_market, om.region, f.cost_low, f.cost_high, f.seasonal_band, f.edition_year
  FROM planner_flight_cost f
  JOIN destinations d ON d.id = f.destination_id
  LEFT JOIN planner_origin_markets om ON om.city = f.origin_market
  WHERE d.name ILIKE '%melbourne%'
  ORDER BY om.region, f.cost_low
`;
console.log(rows.length, "rows");
for (const r of rows) {
  console.log(`${(r.origin_market ?? "").padEnd(22)} ${(r.region ?? "?").padEnd(15)} US$${r.cost_low}-${r.cost_high} (${r.seasonal_band}, ${r.edition_year})`);
}
await sql.end();
