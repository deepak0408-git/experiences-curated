import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const rows = await sql`SELECT slug, title, booking_links FROM experiences WHERE slug LIKE '%london-rest-day%' OR title ILIKE '%borough market%'`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
