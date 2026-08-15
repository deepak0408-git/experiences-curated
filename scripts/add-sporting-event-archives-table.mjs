import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const client = postgres(process.env.DIRECT_URL, { ssl: "require", prepare: false });

await client`
  CREATE TABLE IF NOT EXISTS "sporting_event_archives" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "sporting_event_id" uuid NOT NULL REFERENCES "sporting_events"("id"),
    "season_year" smallint NOT NULL,
    "pdf_url" text NOT NULL,
    "json_url" text NOT NULL,
    "archived_at" timestamp NOT NULL DEFAULT now()
  );
`;

await client`
  CREATE UNIQUE INDEX IF NOT EXISTS "sporting_event_archives_event_season_idx"
    ON "sporting_event_archives" ("sporting_event_id", "season_year");
`;

console.log("✓ sporting_event_archives table created");
await client.end();
