import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL);
const rows = await sql`
  SELECT body_content, practical_info
  FROM experiences
  WHERE id = '037780a7-2d9b-4ee9-84ac-b4bc094614f2'
`;
console.log(JSON.stringify(rows[0].practical_info, null, 2));
console.log("\n---BODY---\n");
console.log(rows[0].body_content);
await sql.end();
