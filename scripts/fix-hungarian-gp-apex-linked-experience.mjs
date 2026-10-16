import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Fix: Apex 1 and Apex 2 still pointed at the now-archived "Where to Sit"
// experience (32aa24f0-...) after that experience was archived 16 Oct 2026.
// Apex 1/2 were deliberately NOT carried forward to a new standalone
// experience (founder decision — 5 main grandstands + Chicane + Paddock/
// Champions + GA only) — clearing linked_experience_id so they correctly
// fall back to the general Ticket Guide via getFallbackTicketExperienceSlug,
// instead of silently pointing at an archived row.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";

const result = await sql`
  UPDATE circuit_seating_profile
  SET linked_experience_id = NULL, last_verified_date = NOW()
  WHERE sporting_event_id = ${EVENT_ID} AND seat_name IN ('Apex 1', 'Apex 2')
  RETURNING seat_name, linked_experience_id
`;
console.log("✓ Cleared:", result);

await sql.end();
