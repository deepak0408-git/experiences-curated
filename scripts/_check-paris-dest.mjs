import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT id, name, slug FROM destinations WHERE name ILIKE '%paris%'`;
console.log(rows);
await sql.end();
