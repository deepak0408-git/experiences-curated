// Test-insert only — per CLAUDE.md, never a matching delete script.
//
// Inserts one test purchases row (productType: ticket_intelligence) for
// Mexico City GP 2026, for deepak0408@gmail.com — so per-event gating can
// be verified against a REAL purchases row (not the season-pass table),
// after the season-pass test row is removed. Requested by founder 28 Sep
// 2026, to check per-event access still works correctly on its own once
// the season pass is out of the picture.
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });
const sql = postgres(process.env.DATABASE_URL, { max: 1 });

const MEXICO_CITY_GP_EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a"; // CLAUDE.md

const [row] = await sql`
  INSERT INTO purchases
    (email, sporting_event_id, product_type, paddle_order_id, paddle_price_id, price_tier, price_paid, currency, status)
  VALUES
    ('deepak0408@gmail.com', ${MEXICO_CITY_GP_EVENT_ID}, 'ticket_intelligence', 'test_order_deepak_mexico_ti_1', 'pdt_0NoNoIdiSNtJbUluYBEYS', 'standard', 10.00, 'USD', 'active')
  ON CONFLICT (email, sporting_event_id, product_type) DO NOTHING
  RETURNING *
`;

console.log(row ? "Inserted:" : "Skipped (already exists):", row ?? "");
await sql.end();
