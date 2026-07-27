import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

const events = await sql`
  SELECT se.id, se.name, se.slug, se.destination_id
  FROM sporting_events se
  WHERE se.slug IN ('belgian-gp-2026', 'italian-gp-2026', 'abu-dhabi-gp-2026', 'us-open-2026')
`;

for (const days of [3, 4, 7]) {
  console.log(`\n=== tripLengthDays = ${days} ===`);
  for (const event of events) {
    const [hotel] = await sql`SELECT cost_low, cost_high FROM planner_hotel_tier_cost WHERE destination_id = ${event.destination_id} AND tier = 'general'`;
    const [ticket] = await sql`SELECT cost_low, cost_high FROM planner_ticket_tier_cost WHERE sporting_event_id = ${event.id} AND tier = 'general'`;
    const [band] = await sql`SELECT local_travel_low, local_travel_high, food_per_day_low, food_per_day_high FROM planner_destination_bands WHERE destination_id = ${event.destination_id}`;
    const [flight] = await sql`SELECT cost_low, cost_high FROM planner_flight_cost WHERE destination_id = ${event.destination_id}`;

    if (!hotel || !ticket || !band || !flight) {
      console.log(`${event.name}: MISSING DATA`);
      continue;
    }

    const low = Number(flight.cost_low) + Number(hotel.cost_low) * days + Number(ticket.cost_low) + Number(band.local_travel_low) * days + Number(band.food_per_day_low) * days;
    const high = Number(flight.cost_high) + Number(hotel.cost_high) * days + Number(ticket.cost_high) + Number(band.local_travel_high) * days + Number(band.food_per_day_high) * days;
    const mid = (low + high) / 2;

    console.log(`${event.name}: $${low.toLocaleString()}–$${high.toLocaleString()} (typical: $${Math.round(mid).toLocaleString()})`);
  }
}

await sql.end();
