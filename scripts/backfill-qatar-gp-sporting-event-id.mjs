// Backfill: qatar-grand-prix's 22 experiences were seeded with the correct
// sportingEventExperiences join-table row but never got the legacy direct
// experiences.sportingEventId FK column set (the seed scripts' insert
// omitted it). sync-algolia.mjs reads that legacy FK, not the join table, to
// resolve eventIsHidden/eventName — so all 22 were indexed as
// eventIsHidden:false while the event itself is still isHidden:true, a live
// public-search leak. This is a one-time backfill for the existing 22 rows;
// sync-algolia.mjs itself is intentionally left unchanged per founder
// direction (14 Sep 2026) — root-cause fix deferred, backfill only for now.

import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";

const before = await sql`
  SELECT COUNT(*)::int as total, COUNT(e.sporting_event_id)::int as with_fk
  FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = ${QATAR_GP_EVENT_ID} AND e.status != 'archived'`;
console.log("Before:", before[0]);

const result = await sql`
  UPDATE experiences e
  SET sporting_event_id = ${QATAR_GP_EVENT_ID}
  FROM sporting_event_experiences see
  WHERE see.experience_id = e.id
    AND see.sporting_event_id = ${QATAR_GP_EVENT_ID}
    AND e.status != 'archived'
    AND e.sporting_event_id IS NULL
  RETURNING e.id, e.title`;

console.log(`\n✓ Backfilled ${result.length} experiences:`);
result.forEach((r) => console.log(`  ${r.title}`));

const after = await sql`
  SELECT COUNT(*)::int as total, COUNT(e.sporting_event_id)::int as with_fk
  FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = ${QATAR_GP_EVENT_ID} AND e.status != 'archived'`;
console.log("\nAfter:", after[0]);

await sql.end();
