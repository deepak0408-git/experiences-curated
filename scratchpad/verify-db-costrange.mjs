import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const rows = await sql`SELECT title, status, practical_info->>'costRange' as cost FROM experiences WHERE id = 'd0b3c33a-66d1-4e30-acda-d0d4981182a5'`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
