import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// TEST DATA — inserted 17 Oct 2026 to manually verify the Ticket
// Intelligence Annual-Pro gate (hasActiveAnnualProForEvent /
// hasActiveAnnualPro, seasonPassAccess.ts) correctly DOES unlock for an
// ANNUAL Pro subscriber whose currentPeriodEnd covers the test event's
// date — this is the positive-case test, paired with
// scripts/_test-insert-deepu2-monthly-pro.mjs (negative case).
//
// Updates (not re-inserts) this email's existing active subscription
// row(s) to billing_cycle = 'annual' with current_period_end = 16 Oct
// 2027, rather than inserting a new row — the prior monthly test script
// generated a fresh paddle_subscription_id per run, so its ON CONFLICT
// never matched an existing row across runs; this script matches on email
// + status instead to avoid leaving behind more orphan test rows.
// INSERT ONLY in spirit — per CLAUDE.md's standing rule (27 Sep 2026), no
// delete script exists or will be written; this is an UPDATE of a row this
// same test-insert lineage created, not a delete of anything else.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EMAIL = "deepu2_2000@yahoo.com";

const result = await sql`
  UPDATE pro_subscriptions
  SET billing_cycle = 'annual',
      status = 'active',
      current_period_end = '2027-10-16T23:59:59Z'
  WHERE email = ${EMAIL} AND status = 'active'
  RETURNING id, email, billing_cycle, status, current_period_end
`;
console.log("Updated test Pro subscription(s):", JSON.stringify(result, null, 2));

await sql.end();
