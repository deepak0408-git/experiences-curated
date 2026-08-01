import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";
import crypto from "crypto";

const sql = postgres(process.env.DIRECT_URL);

// Verifies the trigger installed in add-sporting-events-activation-guard-trigger.mjs
// against 4 cases, using one disposable fake destination + fake event rows,
// deleted at the end regardless of outcome. isTestEvent: true throughout —
// this fake row must never be visible to any real cron even if a test step
// unexpectedly succeeds.

const testDestId = crypto.randomUUID();
const testEventId = crypto.randomUUID();

let passed = 0;
let failed = 0;

function report(label, ok, detail) {
  if (ok) { console.log(`✓ ${label}`); passed++; }
  else { console.log(`✗ ${label} — ${detail}`); failed++; }
}

try {
  await sql`
    INSERT INTO destinations (id, name, slug, country_code, region, currency)
    VALUES (${testDestId}, 'TRIGGER TEST — DO NOT PUBLISH', 'trigger-test-do-not-publish', 'ZZ', 'Test', 'USD')
  `;

  // Case 1: INSERT with is_hidden = false must be REJECTED
  try {
    await sql`
      INSERT INTO sporting_events (id, name, slug, sport, tournament_series, edition_year, destination_id, start_date, end_date, is_hidden, is_test_event, pack_status)
      VALUES (${testEventId}, 'TRIGGER TEST EVENT', 'trigger-test-event', 'other', 'Trigger Test', 2099, ${testDestId}, '2099-01-01', '2099-01-02', false, true, 'planned')
    `;
    report("Case 1: INSERT isHidden=false rejected", false, "insert succeeded, should have thrown");
    await sql`DELETE FROM sporting_events WHERE id = ${testEventId}`;
  } catch (e) {
    report("Case 1: INSERT isHidden=false rejected", e.message.includes("must always be inserted with is_hidden = true"), e.message);
  }

  // Case 2: INSERT with is_hidden = true must SUCCEED (the normal seed path)
  try {
    await sql`
      INSERT INTO sporting_events (id, name, slug, sport, tournament_series, edition_year, destination_id, start_date, end_date, is_hidden, is_test_event, pack_status)
      VALUES (${testEventId}, 'TRIGGER TEST EVENT', 'trigger-test-event', 'other', 'Trigger Test', 2099, ${testDestId}, '2099-01-01', '2099-01-02', true, true, 'planned')
    `;
    report("Case 2: INSERT isHidden=true succeeds", true);
  } catch (e) {
    report("Case 2: INSERT isHidden=true succeeds", false, e.message);
  }

  // Case 3: UPDATE isHidden=false WITHOUT activatedAt must be REJECTED
  try {
    await sql`UPDATE sporting_events SET is_hidden = false WHERE id = ${testEventId}`;
    report("Case 3: UPDATE isHidden=false without activatedAt rejected", false, "update succeeded, should have thrown");
  } catch (e) {
    report("Case 3: UPDATE isHidden=false without activatedAt rejected", e.message.includes("cannot be set to false without also setting activated_at"), e.message);
  }

  // Case 4: UPDATE isHidden=false WITH activatedAt together must SUCCEED (matches saveHomepageSlots)
  try {
    await sql`UPDATE sporting_events SET is_hidden = false, activated_at = now() WHERE id = ${testEventId}`;
    report("Case 4: UPDATE isHidden=false + activatedAt together succeeds", true);
  } catch (e) {
    report("Case 4: UPDATE isHidden=false + activatedAt together succeeds", false, e.message);
  }
} finally {
  await sql`DELETE FROM sporting_events WHERE id = ${testEventId}`;
  await sql`DELETE FROM destinations WHERE id = ${testDestId}`;
  console.log("\n✓ disposable test rows cleaned up");
}

console.log(`\n${passed} passed, ${failed} failed`);
await sql.end();
process.exit(failed > 0 ? 1 : 0);
