import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const rows = await sql`SELECT slug, name, homepage_slot FROM destinations WHERE homepage_slot IS NOT NULL`;
console.log(rows);
await sql.end();
