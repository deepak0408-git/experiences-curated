// Links circuit_seating_profile rows to their dedicated experience write-up,
// when one exists, so the Ticket Intelligence result page can show a
// "Read the full write-up" link under the matched seat's "Why this fits
// you" section. Added 27 Sep 2026 per founder request.
//
// Most seats have no dedicated write-up (only a handful of named stands get
// their own experience per event) — those stay linked_experience_id: NULL
// and the result page falls back to that event's general "Ticket Guide" /
// "Where to Sit" experience instead (see getFallbackTicketExperienceSlug in
// app/ticket-intelligence/[slug]/_lib/getSeatingData.ts).
//
// Run: node --experimental-strip-types scripts/seed-ticket-intelligence-linked-experiences.mjs

import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

// seatName (exact circuit_seating_profile.seat_name) -> experience slug.
// Verified by matching each event's real seed data against its own
// published fan_experience rows, 27 Sep 2026.
const LINKS = [
  // Brazilian GP
  { eventSlug: "brazilian-grand-prix", seatName: "Grandstand A", experienceSlug: "brazilian-gp-grandstand-a-mtx6nzu0" },
  { eventSlug: "brazilian-grand-prix", seatName: "Grandstand M", experienceSlug: "brazilian-gp-grandstand-m-mtx6pll2" },
  { eventSlug: "brazilian-grand-prix", seatName: "Heineken Village – Field", experienceSlug: "brazilian-gp-heineken-village-mtxwby4o" },
  { eventSlug: "brazilian-grand-prix", seatName: "Heineken Village – Star", experienceSlug: "brazilian-gp-heineken-village-mtxwby4o" },
  { eventSlug: "brazilian-grand-prix", seatName: "Paddock Club", experienceSlug: "brazilian-gp-hospitality-paddock-club-mtx6t3tb" },

  // United States Grand Prix
  { eventSlug: "united-states-grand-prix", seatName: "Main Grandstand", experienceSlug: "us-gp-main-grandstand-mtnarnxn" },
  { eventSlug: "united-states-grand-prix", seatName: "Paddock Club", experienceSlug: "us-gp-paddock-club-mtnaymp3" },
  { eventSlug: "united-states-grand-prix", seatName: 'Turn 1 "Big Red"', experienceSlug: "us-gp-turn-1-big-red-mtnau7yl" },
  { eventSlug: "united-states-grand-prix", seatName: "Turn 15 — Stadium Section", experienceSlug: "us-gp-turn-15-stadium-mtnawame" },
  { eventSlug: "united-states-grand-prix", seatName: "General Admission", experienceSlug: "us-gp-general-admission-mtnb3iak" },
  { eventSlug: "united-states-grand-prix", seatName: "Champions Club", experienceSlug: "us-gp-champions-club-mtnb0s29" },
];

async function run() {
  let updated = 0;
  for (const link of LINKS) {
    const result = await sql`
      UPDATE circuit_seating_profile csp
      SET linked_experience_id = e.id
      FROM sporting_events se, experiences e
      WHERE csp.sporting_event_id = se.id
        AND se.slug = ${link.eventSlug}
        AND csp.seat_name = ${link.seatName}
        AND e.slug = ${link.experienceSlug}
      RETURNING csp.id
    `;
    if (result.length === 0) {
      console.warn(`⚠ No match for ${link.eventSlug} / "${link.seatName}" -> ${link.experienceSlug}`);
    } else {
      updated += result.length;
    }
  }
  console.log(`Linked ${updated} of ${LINKS.length} seat rows.`);

  const rows = await sql`
    SELECT se.slug AS event_slug, csp.seat_name, e.title AS linked_experience_title
    FROM circuit_seating_profile csp
    JOIN sporting_events se ON se.id = csp.sporting_event_id
    LEFT JOIN experiences e ON e.id = csp.linked_experience_id
    ORDER BY se.slug, csp.seat_name
  `;
  console.table(rows);

  await sql.end();
}

run();
