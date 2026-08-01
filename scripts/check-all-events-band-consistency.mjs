import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const events = await sql`
  SELECT se.id, se.name, se.start_date, se.destination_id, d.name as dest_name
  FROM sporting_events se JOIN destinations d ON d.id = se.destination_id
  WHERE se.pack_status IN ('planned','building','built_hidden','live')
  ORDER BY se.start_date
`;

for (const e of events) {
  const month = new Date(e.start_date).toLocaleDateString("en-US", { month: "short" }).toLowerCase();
  const bands = await sql`
    SELECT DISTINCT seasonal_band FROM planner_flight_cost WHERE destination_id = ${e.destination_id}
  `;
  const bandList = bands.map(b => b.seasonal_band);
  const hasMatch = bandList.includes(month);
  const flag = bandList.length === 0 ? "NO DATA" : hasMatch ? "OK" : "MISMATCH";
  console.log(`${flag.padEnd(9)} ${e.name} (${e.dest_name}) — start_date month: ${month}, seeded bands: [${bandList.join(", ") || "none"}]`);
}
await sql.end();
