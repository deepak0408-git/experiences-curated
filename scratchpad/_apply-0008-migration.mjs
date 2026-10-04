import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

await sql`ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "homepage_slot" smallint`;
console.log("Migration 0008 applied: destinations.homepage_slot added.");

const check = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'destinations' AND column_name = 'homepage_slot'`;
console.log(check);

await sql.end();
