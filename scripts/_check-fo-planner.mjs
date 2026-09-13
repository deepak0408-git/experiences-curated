import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const t = await sql`SELECT * FROM planner_ticket_tier_cost WHERE sporting_event_id = 'e6f2b585-196e-4842-8648-753a40979f4f'`;
console.log("TICKETS:", t);
const h = await sql`SELECT * FROM planner_hotel_tier_cost WHERE destination_id = '488adb47-5327-43e2-8206-d40480301962'`;
console.log("HOTELS:", h);
await sql.end();
