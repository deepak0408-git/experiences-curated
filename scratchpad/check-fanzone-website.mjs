import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const rows = await sql`SELECT practical_info->>'website' as website FROM experiences WHERE id = '26f329b5-7724-44b2-9ecd-7e2ec9fc27c2'`;
console.log(rows[0].website);
await sql.end();
