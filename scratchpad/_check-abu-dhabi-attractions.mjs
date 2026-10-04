import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const dest = await sql`SELECT id FROM destinations WHERE slug = 'abu-dhabi'`;
const rows = await sql`SELECT slug, title, experience_type, status FROM experiences WHERE destination_id = ${dest[0].id} ORDER BY experience_type`;
console.log(rows);
await sql.end();
