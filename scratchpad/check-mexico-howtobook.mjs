import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const rows = await sql`
  SELECT title, practical_info->>'howToBook' as htb, practical_info->>'bookingMethod' as bm
  FROM experiences WHERE id = '41cf34c3-c937-4e8b-8ab9-029224f3f6d1'
`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
