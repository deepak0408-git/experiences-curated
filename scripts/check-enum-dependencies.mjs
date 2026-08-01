import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT c.table_name, c.column_name, c.udt_name
  FROM information_schema.columns c
  WHERE c.udt_name = 'planner_ticket_tier'
`;
console.log(rows);
await sql.end();
