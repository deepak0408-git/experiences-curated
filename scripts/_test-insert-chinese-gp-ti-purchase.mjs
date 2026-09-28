import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// TEST ROW — Ticket Intelligence purchase for chinese-grand-prix, founder's
// own email, to check the unlocked result page in-browser. INSERT ONLY, per
// CLAUDE.md's standing rule — no matching delete script exists or will be
// written; if this row needs removing, the founder does it directly.
//
// Fake/placeholder fields (paddleOrderId/paddleCustomerId/paddlePriceId) are
// clearly marked TEST- prefixed so this row is never mistaken for a real
// Dodo/Paddle transaction during any future audit or reconciliation.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese Grand Prix 2027
const EMAIL = "deepak0408@gmail.com";

// Plausible quiz answers so the result page has something real to score
// against (REQUIRED_ANSWER_KEYS in result/page.tsx: q1,q2,q3,q4,q5,q7).
const TEST_ANSWERS = {
  q1: "overtaking",
  q2: "flexible",
  q3: "preferred",
  q4: "solo_friends",
  q5: "fan_zones",
  q7: "balanced",
};

const [row] = await sql`
  INSERT INTO purchases
    (email, sporting_event_id, product_type, paddle_order_id, paddle_customer_id, paddle_price_id, price_tier, price_paid, currency, status, ticket_intelligence_answers)
  VALUES
    (${EMAIL}, ${EVENT_ID}, 'ticket_intelligence', ${"TEST-chinese-gp-ti-" + Date.now()}, 'TEST-customer', 'TEST-price-id', 'standard', 10.00, 'USD', 'active', ${sql.json(TEST_ANSWERS)})
  RETURNING id, email, sporting_event_id, product_type, price_paid, currency
`;

console.log("Inserted test purchase row:", row);
await sql.end();
