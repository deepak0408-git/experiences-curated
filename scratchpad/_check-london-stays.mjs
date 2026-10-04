import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const dest = await sql`SELECT id FROM destinations WHERE slug = 'london-gb'`;
const rows = await sql`SELECT id, slug, title, status, published_at FROM experiences WHERE destination_id = ${dest[0].id} AND experience_type = 'accommodation' AND status = 'published' ORDER BY published_at DESC`;
console.log(rows);
await sql.end();
