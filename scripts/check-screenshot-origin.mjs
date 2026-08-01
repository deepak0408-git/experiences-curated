import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
// URL from screenshot had "&ori..." truncated - check what origin gives $790 over with $1000 budget at 3 days
const BELGIAN_DEST_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const rows = await sql`SELECT origin_market, cost_low, cost_high FROM planner_flight_cost WHERE destination_id = ${BELGIAN_DEST_ID} AND seasonal_band = 'jul' ORDER BY cost_high LIMIT 10`;
console.log(rows);
await sql.end();
