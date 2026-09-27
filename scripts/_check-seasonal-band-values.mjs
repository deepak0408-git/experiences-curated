import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT DISTINCT seasonal_band FROM planner_flight_cost ORDER BY seasonal_band`;
console.log(rows.map((r) => r.seasonal_band));
await sql.end();
