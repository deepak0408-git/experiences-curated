import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const deleted = await sql`DELETE FROM planner_flight_cost WHERE origin_market = 'unspecified' RETURNING destination_id, seasonal_band`;
console.log(`Deleted ${deleted.length} rows`);
await sql.end();
