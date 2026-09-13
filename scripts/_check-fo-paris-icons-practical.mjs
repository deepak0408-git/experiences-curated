import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const [row] = await sql`SELECT practical_info FROM experiences WHERE slug = 'paris-icons-eiffel-tower-seine-arc-de-triomphe'`;
console.log(JSON.stringify(row.practical_info, null, 2));
await sql.end();
