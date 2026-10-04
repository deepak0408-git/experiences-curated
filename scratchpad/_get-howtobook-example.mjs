import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const [row] = await sql`SELECT practical_info->>'howToBook' AS h FROM experiences WHERE title LIKE 'Suzuka%Hospitality%'`;
console.log(row.h);
await sql.end();
