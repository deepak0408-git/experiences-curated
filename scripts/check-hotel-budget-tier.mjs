import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const row = await sql`SELECT cost_low, cost_high FROM planner_hotel_tier_cost WHERE destination_id = '101b815a-ba64-4484-aad6-63721a44ed85' AND tier = 'budget'`;
console.log(row);
await sql.end();
