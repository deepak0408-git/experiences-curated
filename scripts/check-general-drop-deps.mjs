import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT table_name, column_name, udt_name
  FROM information_schema.columns
  WHERE udt_name IN ('planner_tier', 'planner_ticket_tier')
`;
console.log(rows);
await sql.end();
