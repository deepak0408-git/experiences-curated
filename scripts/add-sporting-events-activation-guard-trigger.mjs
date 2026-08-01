import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Hard DB-level guard against the 20 Jul 2026 incident's root mechanism: a
// row inserted with isHidden = false directly (bypassing any application
// code, curator UI, or the isTestEvent flag) immediately satisfies every
// isHidden-gated email cron on its next scheduled run — no human step in
// between. Application-level discipline (remembering to seed isHidden: true)
// already failed once; this makes the unsafe state impossible to write,
// not just documented as forbidden. See feedback_no_adhoc_writes_against_prod.md
// and feedback_test_event_isolation_flag.md for the incident this follows.
//
// Two rules, enforced together:
// 1. INSERT must always have isHidden = true. A brand-new event can never
//    be born live — matches the existing CLAUDE.md standing rule ("Always
//    seed new sporting events with isHidden: true"), now enforced in the DB
//    instead of relying on every future script/agent remembering it.
// 2. Any row with isHidden = false must also have activated_at set
//    (not NULL). This matches exactly how the one legitimate activation
//    path (saveHomepageSlots in app/curator/events/actions.ts) already
//    works — it always sets isHidden: false and activatedAt together in
//    the same UPDATE. A raw UPDATE that flips isHidden to false without
//    also setting activatedAt (exactly what a disposable test script did
//    on 20 Jul 2026) is now rejected at the database level.

await sql`
  CREATE OR REPLACE FUNCTION guard_sporting_events_activation()
  RETURNS TRIGGER AS $$
  BEGIN
    IF TG_OP = 'INSERT' AND NEW.is_hidden = false THEN
      RAISE EXCEPTION 'sporting_events: a new event must always be inserted with is_hidden = true. Activate it afterward via an explicit UPDATE (isHidden: false + activatedAt set together), the same path /curator/events uses.';
    END IF;

    IF NEW.is_hidden = false AND NEW.activated_at IS NULL THEN
      RAISE EXCEPTION 'sporting_events: is_hidden cannot be set to false without also setting activated_at in the same statement. This is what makes an event visible to every isHidden-gated email cron — both fields must be set together, matching saveHomepageSlots'' own activation logic.';
    END IF;

    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`;
console.log("✓ guard_sporting_events_activation() function created");

await sql`
  DROP TRIGGER IF EXISTS sporting_events_activation_guard ON sporting_events
`;
await sql`
  CREATE TRIGGER sporting_events_activation_guard
  BEFORE INSERT OR UPDATE ON sporting_events
  FOR EACH ROW
  EXECUTE FUNCTION guard_sporting_events_activation();
`;
console.log("✓ sporting_events_activation_guard trigger installed (BEFORE INSERT OR UPDATE)");

await sql.end();
