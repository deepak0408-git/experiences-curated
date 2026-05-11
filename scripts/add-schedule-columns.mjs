import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL, { ssl: "require", prepare: false });

await sql`
  ALTER TABLE saved_items
    ADD COLUMN IF NOT EXISTS scheduled_at  TIMESTAMP,
    ADD COLUMN IF NOT EXISTS duration_minutes INTEGER
`;

console.log("✓ added scheduled_at and duration_minutes to saved_items");
await sql.end();
