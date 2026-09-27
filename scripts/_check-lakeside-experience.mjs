import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT id, slug, title, hero_image_url FROM experiences WHERE slug ILIKE '%lakeside-festival%'`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
