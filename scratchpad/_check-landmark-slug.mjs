import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const rows = await sql`SELECT slug, title, booking_links FROM experiences WHERE title ILIKE '%landmark london%'`;
console.log(rows);
await sql.end();
