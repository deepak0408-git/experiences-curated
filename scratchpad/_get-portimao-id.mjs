import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const rows = await sql`SELECT id, name, slug, nearest_airport_iata FROM destinations WHERE slug = 'portimao-portugal'`;
console.log(rows);
await sql.end();
