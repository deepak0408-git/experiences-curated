import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

try {
  await client`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS concierge_outreach_pre_trip_sent_at timestamp,
    ADD COLUMN IF NOT EXISTS concierge_outreach_post_trip_sent_at timestamp
  `;
  console.log("✓ Columns added to purchases table");
} catch (e) {
  console.error("✗ FAILED:", e.message);
} finally {
  await client.end();
}
