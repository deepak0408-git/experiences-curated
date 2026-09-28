// Test-insert only — per CLAUDE.md, never a matching delete script.
//
// Backfills the ticket_intelligence_season_passes row that the Dodo
// webhook would have written for a real test-mode purchase, but didn't —
// the webhook never fired because Dodo's test-mode webhook has no way to
// reach localhost:3000 (no tunnel configured). Payment itself succeeded on
// Dodo's side: payment_id pay_0NoZX2jcwdNFwmlydtFMz, 28 Sep 2026,
// deepak0408@gmail.com, via /api/checkout/dodo-season-pass.
//
// Values given directly by the founder 28 Sep 2026 (not invented):
// email, status active, edition_season [2026, 2027], price paid US$10,
// currency USD, dodo_order_id = the real payment_id above.
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });
const sql = postgres(process.env.DATABASE_URL, { max: 1 });

const [row] = await sql`
  INSERT INTO ticket_intelligence_season_passes
    (email, edition_season, dodo_order_id, dodo_product_id, price_tier, price_paid, currency, status)
  VALUES
    ('deepak0408@gmail.com', ARRAY[2026, 2027]::smallint[], 'pay_0NoZX2jcwdNFwmlydtFMz', 'pdt_0NoZIdoLaL3GxoWvIsg6D', 'standard', 10.00, 'USD', 'active')
  ON CONFLICT (email, dodo_product_id) DO NOTHING
  RETURNING *
`;

console.log(row ? "Inserted:" : "Skipped (already exists):", row ?? "");
await sql.end();
