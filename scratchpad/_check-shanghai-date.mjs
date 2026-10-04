import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const result = await sql`SELECT id, name, start_date, end_date, pre_trip_brief_live_at FROM sporting_events WHERE id = '09254d18-a22f-4032-ac05-b7c26a9c3057'`;
console.log(JSON.stringify(result, null, 2));
process.exit(0);
