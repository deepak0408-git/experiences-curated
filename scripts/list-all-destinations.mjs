import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT id, name, country_code, region, nearest_airport_iata FROM destinations ORDER BY name`;
console.log(rows);
await sql.end();
