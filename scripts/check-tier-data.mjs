import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const hotels = await sql`SELECT d.name, h.tier, h.cost_low, h.cost_high FROM planner_hotel_tier_cost h JOIN destinations d ON d.id = h.destination_id ORDER BY d.name, h.tier`;
console.log("HOTELS:", hotels);
const tickets = await sql`SELECT se.name, t.tier, t.cost_low, t.cost_high FROM planner_ticket_tier_cost t JOIN sporting_events se ON se.id = t.sporting_event_id ORDER BY se.name, t.tier`;
console.log("TICKETS:", tickets);
await sql.end();
