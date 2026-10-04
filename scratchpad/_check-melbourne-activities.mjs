import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const dest = await sql`SELECT id FROM destinations WHERE slug = 'melbourne-au'`;
const rows = await sql`SELECT slug, title, subtitle, experience_type FROM experiences WHERE destination_id = ${dest[0].id} AND experience_type = 'activity' AND status = 'published'`;
console.log(rows);
await sql.end();
