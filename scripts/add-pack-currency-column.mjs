import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real currency the event's Dodo/Paddle pack is actually priced in --
// single source of truth for grantFreeAccess (writes purchases.currency)
// and LocalCurrencyHint (converts FROM this, not a hardcoded GBP
// assumption). Nullable: events without a pack (or not yet priced) have no
// currency yet. Added 1 Aug 2026 after grantFreeAccess was found
// hardcoding "GBP" for every free-access grant regardless of the event's
// real currency (Hungarian GP is EUR, US Open is USD, etc.) -- purchases
// rows were silently wrong for every non-GBP event.

await sql`
  ALTER TABLE sporting_events
  ADD COLUMN IF NOT EXISTS pack_currency VARCHAR(3)
`;
console.log("✓ pack_currency column added to sporting_events (nullable)");

const rows = await sql`SELECT slug, name, pack_currency FROM sporting_events ORDER BY name`;
console.log("\nCurrent state:");
console.table(rows);

await sql.end();
