import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const rows = await sql`SELECT body_content, editorial_note FROM experiences WHERE id = '91619345-0b7e-4237-b201-416a5a689aee'`;
console.log(rows[0].body_content);
console.log("\n---EDITORIAL NOTE---\n", rows[0].editorial_note);
await sql.end();
