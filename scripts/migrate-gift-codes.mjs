import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const client = postgres(process.env.DIRECT_URL, { ssl: "require" });

await client`
  CREATE TABLE IF NOT EXISTS gift_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(12) NOT NULL UNIQUE,
    generated_by_email VARCHAR(255) NOT NULL,
    sporting_event_id UUID REFERENCES sporting_events(id),
    claimed_by_email VARCHAR(255),
    claimed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

await client`CREATE UNIQUE INDEX IF NOT EXISTS gift_codes_code_unique ON gift_codes(code)`;
await client`CREATE INDEX IF NOT EXISTS gift_codes_generated_by_idx ON gift_codes(generated_by_email)`;

console.log("✓ gift_codes table created");
await client.end();
