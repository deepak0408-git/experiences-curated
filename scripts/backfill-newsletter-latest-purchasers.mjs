import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Backfill the latest 2 purchasers (by purchased_at) into newsletter_subscribers.
// Requested 23 Jul 2026 -- one-off backfill, not a standing sync mechanism.
const latest = await sql`
  SELECT email FROM purchases ORDER BY purchased_at DESC LIMIT 2
`;

for (const { email } of latest) {
  const result = await sql`
    INSERT INTO newsletter_subscribers (email, source)
    VALUES (${email}, 'purchase_backfill')
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;
  console.log(result.length ? `✓ ${email} added` : `- ${email} already subscribed, skipped`);
}

await sql.end();
