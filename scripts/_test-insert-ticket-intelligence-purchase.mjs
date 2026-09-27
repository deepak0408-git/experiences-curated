import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// TEST DATA — inserted 25 Sep 2026 to manually verify the Ticket
// Intelligence result page's purchase-gate flow while testing locally in
// Dodo test_mode (no webhook tunnel to localhost, so the real
// payment.succeeded webhook never fired). Delete this row after testing —
// see the matching _test-delete script.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4"; // Brazilian GP 2026
const EMAIL = "deepak0408@gmail.com";

// Answers matching the screenshot's URL from the earlier test run:
// q1=overtaking&q2=fixed&q3=preferred&q4=solo_friends&q5=fan_zones&q7=balanced
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
