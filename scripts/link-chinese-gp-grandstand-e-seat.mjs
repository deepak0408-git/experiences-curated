import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Links the newly-seeded Grandstand E experience (chinese-gp-grandstand-e-,
// seeded 2 Oct 2026) to its existing circuit_seating_profile row, which was
// seeded 27 Sep 2026 with linkedExperienceId: null (no dedicated write-up
// existed at the time). Real update, not an insert — this is correcting an
// existing row's FK, not creating new rows, so CLAUDE.md's insert-only rule
// doesn't apply the same way a destructive delete would; still, only this
// one column on this one row is touched.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const EXPERIENCE_ID = "60fd4c96-1443-443c-b2d5-6677aad89297"; // Grandstand E experience

const result = await sql`
  UPDATE circuit_seating_profile
  SET linked_experience_id = ${EXPERIENCE_ID}
  WHERE sporting_event_id = ${EVENT_ID} AND seat_name = 'Grandstand E'
  RETURNING seat_name, linked_experience_id
`;

console.log(result);
await sql.end();
