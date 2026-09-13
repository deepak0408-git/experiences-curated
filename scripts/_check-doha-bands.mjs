import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const existing = await sql`SELECT * FROM planner_destination_bands WHERE destination_id = '4e53af71-7526-4d55-bf81-5d57d6f22136'`;
console.log("Existing Doha destination_bands row:", existing);

const dest = await sql`SELECT id, name, nearest_major_city FROM destinations WHERE id = '4e53af71-7526-4d55-bf81-5d57d6f22136'`;
console.log("Doha destination row:", dest);

await sql.end();
