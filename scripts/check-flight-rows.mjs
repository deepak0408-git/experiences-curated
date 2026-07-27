import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT pfc.*, d.name as dest_name FROM planner_flight_cost pfc JOIN destinations d ON d.id = pfc.destination_id`;
console.log(rows);
await sql.end();
