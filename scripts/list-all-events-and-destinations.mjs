import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const events = await sql`
  SELECT se.id as event_id, se.name as event_name, se.slug, se.sport, se.start_date, se.end_date,
         se.pack_status, se.is_hidden,
         d.id as dest_id, d.name as dest_name, d.nearest_airport_iata
  FROM sporting_events se
  LEFT JOIN destinations d ON d.id = se.destination_id
  ORDER BY se.start_date
`;
console.log(JSON.stringify(events, null, 2));
await sql.end();
