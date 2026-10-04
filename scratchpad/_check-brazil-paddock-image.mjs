import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const rows = await sql`SELECT title, slug, hero_image_url FROM experiences WHERE title ILIKE '%paddock%' ORDER BY title`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
