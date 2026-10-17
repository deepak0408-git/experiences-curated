import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// TEST DATA — inserted 17 Oct 2026 to manually verify the Ticket
// Intelligence Annual-Pro gate's per-event date boundary
// (hasActiveAnnualProForEvent, seasonPassAccess.ts) — scenario 3: a
// currentPeriodEnd that covers SOME but not ALL F1 events, to confirm
// access is granted per-race (event.endDate < currentPeriodEnd), not
// blanket-unlocked just because the subscription itself is active.
//
// Updates this email's existing active subscription row to
// current_period_end = 30 Apr 2027 — expected to still unlock the picker
// page's "already subscribed" messaging (that check only looks at
// subscription validity, not any specific race) and still unlock Ticket
// Intelligence for any race whose endDate is before 30 Apr 2027, but NOT
// for a race after that date.
// INSERT ONLY in spirit — per CLAUDE.md's standing rule (27 Sep 2026), no
// delete script exists or will be written; this is an UPDATE of a row this
// same test-insert lineage created, not a delete of anything else.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EMAIL = "deepu2_2000@yahoo.com";

const result = await sql`
  UPDATE pro_subscriptions
  SET billing_cycle = 'annual',
      status = 'active',
      current_period_end = '2027-04-30T23:59:59Z'
  WHERE email = ${EMAIL} AND status = 'active'
  RETURNING id, email, billing_cycle, status, current_period_end
`;
console.log("Updated test Pro subscription(s):", JSON.stringify(result, null, 2));

await sql.end();
