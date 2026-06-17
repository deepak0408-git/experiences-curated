import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

await sql`ALTER TABLE sporting_events ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false`;
console.log("✓ is_hidden column added to sporting_events");

await sql.end();
