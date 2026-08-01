import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// One-time backfill for events that already have real Dodo/Paddle pricing
// wired (PACK_PRICING in app/event-pack/[slug]/page.tsx + packPricing.ts
// for Bahrain GP). Values derived directly from each event's real
// earlyBirdDisplay/standardDisplay currency symbol (£/$/€), not guessed.
// Events without pricing yet stay NULL -- an honest gap, not a default.
//
// SCOPED TO 6 OF 10, 1 Aug 2026: wimbledon-2026, belgian-gp-2026,
// open-championship-2026, india-in-england-cricket-2026 excluded --
// these 4 have is_hidden=false + activated_at=NULL (pre-existing data gap
// from before the activation-guard trigger existed), which makes ANY
// update to their row fail the guard. Fixing that needs activated_at AND
// newsletter_announced_at set together (a real risk: leaving
// newsletter_announced_at null while backdating activated_at would fire
// the newsletter cron for all 4 on its next run) -- user explicitly said
// to leave those 4 alone for now and not touch their currency either.
// Revisit once that's resolved separately.

const CURRENCY_BY_SLUG = {
  "us-open-2026": "USD",
  "hungarian-gp-2026": "EUR",
  "italian-gp-2026": "EUR",
  "bmw-pga-championship-2026": "GBP",
  "australia-in-south-africa-cricket-2026": "USD",
  "bahrain-grand-prix": "USD",
};

for (const [slug, currency] of Object.entries(CURRENCY_BY_SLUG)) {
  const result = await sql`
    UPDATE sporting_events SET pack_currency = ${currency} WHERE slug = ${slug}
    RETURNING slug, pack_currency
  `;
  if (result.length === 0) {
    console.log(`⚠ ${slug}: no matching row found`);
  } else {
    console.log(`✓ ${slug} -> ${currency}`);
  }
}

const rows = await sql`SELECT slug, name, pack_currency FROM sporting_events ORDER BY name`;
console.log("\nFinal state:");
console.table(rows);

await sql.end();
