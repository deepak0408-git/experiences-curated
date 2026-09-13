import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT id, title, slug, status, booking_links FROM experiences WHERE slug = 'paris-icons-eiffel-tower-seine-arc-de-triomphe'`;
console.log(rows);
await sql.end();
