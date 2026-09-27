import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// TEST DATA — inserted 27 Sep 2026 to manually verify the Ticket
// Intelligence result page's purchase-gate flow for Mexico City GP while
// testing locally in Dodo test_mode (no webhook tunnel to localhost, so the
// real payment.succeeded webhook never fires). Same pattern as
// scripts/_test-insert-singapore-gp-ticket-intelligence-purchase.mjs.
// INSERT ONLY — per CLAUDE.md's standing rule (27 Sep 2026), no matching
// delete script exists or will be written for this row.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a"; // Mexico City Grand Prix 2026
const EMAIL = "deepak0408@gmail.com";

// Arbitrary but valid answers across the 6 real rubric questions (q6/Q6
// duration question was removed — see ticket-intelligence-researcher
// skill §4).
const TEST_ANSWERS = {
  q1: "overtaking",
  q2: "fixed",
  q3: "preferred",
  q4: "solo_friends",
  q5: "fan_zones",
  q7: "balanced",
};

const result = await sql`
  INSERT INTO purchases
    (email, sporting_event_id, product_type, paddle_order_id, paddle_customer_id, paddle_price_id, price_tier, price_paid, currency, status, ticket_intelligence_answers)
  VALUES
    (${EMAIL}, ${EVENT_ID}, 'ticket_intelligence', ${"TEST-" + Date.now()}, 'TEST-CUSTOMER', 'pdt_0NoNoIdiSNtJbUluYBEYS', 'standard', '10.00', 'USD', 'active', ${sql.json(TEST_ANSWERS)})
  ON CONFLICT (email, sporting_event_id, product_type) DO UPDATE SET
    ticket_intelligence_answers = EXCLUDED.ticket_intelligence_answers,
    status = 'active'
  RETURNING id, email, product_type, paddle_order_id
`;
console.log("Inserted/updated test purchase:", JSON.stringify(result[0], null, 2));

await sql.end();
