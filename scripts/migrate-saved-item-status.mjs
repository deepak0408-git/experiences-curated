import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const client = postgres(process.env.DIRECT_URL, { ssl: "require" });

await client`
  DO $$ BEGIN
    CREATE TYPE "saved_item_status" AS ENUM ('to_do', 'booked', 'done');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$
`;

await client`
  ALTER TABLE "saved_items"
    ADD COLUMN IF NOT EXISTS "status" "saved_item_status" NOT NULL DEFAULT 'to_do'
`;

await client`
  ALTER TABLE "saved_items"
    ADD COLUMN IF NOT EXISTS "notes" text
`;

// Drop the old reaction column (replaced by status in the schema)
await client`
  ALTER TABLE "saved_items"
    DROP COLUMN IF EXISTS "reaction"
`;

console.log("Migration complete: saved_item_status enum + status column added, reaction column dropped");
await client.end();
