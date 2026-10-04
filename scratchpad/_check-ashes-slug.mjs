import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const rows = await sql`SELECT slug, name, hero_image_url FROM sporting_events WHERE name ILIKE '%ashes%'`;
console.log(rows);
await sql.end();
