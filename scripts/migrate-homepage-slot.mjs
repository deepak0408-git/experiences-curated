import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const client = postgres(process.env.DIRECT_URL, { ssl: "require" });

await client`
  ALTER TABLE sporting_events
  ADD COLUMN IF NOT EXISTS homepage_slot smallint;
`;

// Seed current carousel state: Wimbledon = slot 1, Belgian GP = slot 2
await client`
  UPDATE sporting_events SET homepage_slot = 1 WHERE slug = 'wimbledon-2026';
`;
await client`
  UPDATE sporting_events SET homepage_slot = 2 WHERE slug = 'belgian-gp-2026';
`;

console.log("✓ homepage_slot column added");
console.log("✓ wimbledon-2026 → slot 1");
console.log("✓ belgian-gp-2026 → slot 2");

await client.end();
