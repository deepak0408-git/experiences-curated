import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT * FROM planner_destination_bands WHERE destination_id = 'f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50'`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
