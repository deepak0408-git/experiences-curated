import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Backfill purchasers from 23 Jul - 8 Aug 2026 into newsletter_subscribers.
// Requested 9 Aug 2026 -- one-off backfill, same pattern as the 23 Jul 2026
// backfill-newsletter-latest-purchasers.mjs script. Previewed first (47
// purchase rows, 44 distinct emails, 2 already subscribed) and approved.

const rows = await sql`
  SELECT DISTINCT email FROM purchases
  WHERE purchased_at::date BETWEEN '2026-07-23' AND '2026-08-08'
`;

let added = 0, skipped = 0;
for (const { email } of rows) {
  const result = await sql`
    INSERT INTO newsletter_subscribers (email, source)
    VALUES (${email}, 'purchase_backfill')
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;
  if (result.length) {
    console.log(`✓ ${email} added`);
    added++;
  } else {
    console.log(`- ${email} already subscribed, skipped`);
    skipped++;
  }
}

console.log(`\nDone. Added: ${added}, Skipped (already subscribed): ${skipped}`);
await sql.end();
