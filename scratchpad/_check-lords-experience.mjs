import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const rows = await sql`SELECT slug, title, subtitle, status FROM experiences WHERE title ILIKE '%lord%'`;
console.log(rows);
await sql.end();
