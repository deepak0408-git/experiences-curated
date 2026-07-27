import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const deleted = await sql`DELETE FROM planner_sessions WHERE id = '50ca02ea-f15d-40d9-908c-41c915d85e2c' RETURNING id, email, gate_action, budget_min, budget_max`;
console.log(deleted);
await sql.end();
