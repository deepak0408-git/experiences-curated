import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const events = await sql`
  SELECT se.id, se.name, se.start_date, se.destination_id, d.name as dest_name
  FROM sporting_events se JOIN destinations d ON d.id = se.destination_id
  WHERE se.id IN (
    'b1816396-6d71-4693-a53f-05bccb2d8a8e', -- Belgian GP (jul)
    'b93770c0-3d96-4e81-b3d0-c1e3a788fd8e', -- Italian GP (sep)
    '8f45cb75-f205-458b-8f31-48551e6d7cb8', -- Abu Dhabi GP (dec)
    '91f298a3-ca22-49c3-9c8e-5a200f0026c9'  -- US Open (sep)
  )
`;

const originMarket = "New York City";
for (const e of events) {
  const month = new Date(e.start_date).toLocaleDateString("en-US", { month: "short" }).toLowerCase();
  const rows = await sql`
    SELECT origin_market, seasonal_band, cost_low, cost_high FROM planner_flight_cost
    WHERE destination_id = ${e.destination_id} AND origin_market = ${originMarket}
    ORDER BY seasonal_band
  `;
  const match = rows.find(r => r.seasonal_band === month);
  console.log(`\n${e.name} (${e.dest_name}) — event month: ${month}`);
  console.log(`  All rows for this destination/origin:`, rows.map(r => `${r.seasonal_band}=$${r.cost_low}-${r.cost_high}`).join(", "));
  console.log(`  ✓ Correctly matched row: ${match ? `${match.seasonal_band}=$${match.cost_low}-${match.cost_high}` : "NONE FOUND"}`);
}
await sql.end();
