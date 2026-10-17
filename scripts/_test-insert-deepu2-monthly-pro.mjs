import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// TEST DATA — inserted 17 Oct 2026 to manually verify the Ticket
// Intelligence Annual-Pro gate (hasActiveAnnualProForEvent /
// hasActiveAnnualPro, seasonPassAccess.ts) correctly does NOT unlock for a
// MONTHLY Pro subscriber — this row is the negative-case control, paired
// with a separate annual-Pro test row for the positive case.
// INSERT ONLY — per CLAUDE.md's standing rule (27 Sep 2026), no matching
// delete script exists or will be written for this row.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EMAIL = "deepu2_2000@yahoo.com";

const result = await sql`
  INSERT INTO pro_subscriptions
    (email, paddle_subscription_id, paddle_customer_id, paddle_price_id, billing_cycle, status, current_period_end)
  VALUES
    (${EMAIL}, ${"TEST-SUB-" + Date.now()}, 'TEST-CUSTOMER', 'TEST-PRICE-MONTHLY', 'monthly', 'active', NOW() + INTERVAL '30 days')
  ON CONFLICT (paddle_subscription_id) DO UPDATE SET
    status = 'active',
    current_period_end = NOW() + INTERVAL '30 days'
  RETURNING id, email, billing_cycle, status, current_period_end
`;
console.log("Inserted/updated test Pro subscription:", JSON.stringify(result[0], null, 2));

await sql.end();
