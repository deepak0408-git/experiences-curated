import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const events = await sql`
  SELECT se.id as event_id, se.name as event_name, se.slug, se.destination_id, d.name as dest_name
  FROM sporting_events se LEFT JOIN destinations d ON d.id = se.destination_id
  WHERE se.pack_status IN ('planned','building','built_hidden','live')
  ORDER BY se.start_date
`;

for (const e of events) {
  const [hotel] = await sql`SELECT count(*) FROM planner_hotel_tier_cost WHERE destination_id = ${e.destination_id}`;
  const [ticket] = await sql`SELECT count(*) FROM planner_ticket_tier_cost WHERE sporting_event_id = ${e.event_id}`;
  const [band] = await sql`SELECT count(*) FROM planner_destination_bands WHERE destination_id = ${e.destination_id}`;
  const [flight] = await sql`SELECT count(*) FROM planner_flight_cost WHERE destination_id = ${e.destination_id}`;
  console.log(`${e.event_name} (${e.dest_name}): hotel=${hotel.count} ticket=${ticket.count} bands=${band.count} flight=${flight.count}`);
}
await sql.end();
