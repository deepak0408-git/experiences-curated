import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const [row] = await sql`SELECT id, status, practical_info FROM experiences WHERE slug = 'montmartre-neighborhood'`;
console.log(JSON.stringify(row, null, 2));
await sql.end();
