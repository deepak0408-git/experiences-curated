import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const tiers = await sql`SELECT * FROM planner_ticket_tier_cost WHERE sporting_event_id = '14a2fa08-14f4-406d-a6df-5d00ad7998a6'`;
console.log('Monaco ticket tiers:', tiers);

const seats = await sql`SELECT * FROM circuit_seating_profile WHERE sporting_event_id = '14a2fa08-14f4-406d-a6df-5d00ad7998a6'`;
console.log('Monaco seating profile rows:', seats.length);

// look at Canadian GP 2027 tier structure as a same-status-precedent example
const canadaTiers = await sql`SELECT tier, cost_low, cost_high FROM planner_ticket_tier_cost WHERE sporting_event_id = 'f054e849-849e-44a2-85c2-d150d973e1bf'`;
console.log('Canadian GP 2027 tiers (precedent, also packStatus planned):', canadaTiers);

await sql.end();
