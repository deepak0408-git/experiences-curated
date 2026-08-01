import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const row = await sql`SELECT local_travel_note, food_note FROM planner_destination_bands WHERE destination_id = 'd4d2ed49-0217-441d-8d1f-38c9b03db2ca'`;
console.log(row);
await sql.end();
