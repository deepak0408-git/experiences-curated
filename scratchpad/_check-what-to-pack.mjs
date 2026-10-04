import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const rows = await sql`SELECT slug, title, experience_type FROM experiences WHERE title ILIKE '%what to pack%'`;
console.log(rows);
await sql.end();
