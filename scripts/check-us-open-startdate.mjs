import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const [row] = await sql`SELECT start_date, end_date FROM sporting_events WHERE id = '91f298a3-ca22-49c3-9c8e-5a200f0026c9'`;
console.log(row);
console.log("Computed band:", new Date(row.start_date).toLocaleDateString("en-US", { month: "short" }).toLowerCase());
await sql.end();
