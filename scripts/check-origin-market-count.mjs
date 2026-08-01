import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const [count] = await sql`SELECT count(*) FROM planner_origin_markets`;
console.log("Total origin markets:", count.count);

const [flightCount] = await sql`SELECT count(DISTINCT origin_market) FROM planner_flight_cost WHERE destination_id = '101b815a-ba64-4484-aad6-63721a44ed85'`;
console.log("Distinct origin markets with a Belgian Ardennes flight row:", flightCount.count);
await sql.end();
