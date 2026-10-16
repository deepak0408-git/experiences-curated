import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Backfills circuit_seating_profile.linked_experience_id for the seats
// whose real standalone experience was written AFTER the initial seating
// seed (16 Oct 2026, grandstand-experience restructure). Direct DB update,
// not a re-run of the original seed script, per the ticket-intelligence-
// researcher skill §2.5's own backfill pattern (Brazilian/US GP precedent).
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";

const UPDATES = [
  { seatName: "Hungaroring", experienceId: "a56d476d-a7c1-4cff-a7f3-5d08ed94263e" },
  { seatName: "Hungaroring Platinum", experienceId: "a56d476d-a7c1-4cff-a7f3-5d08ed94263e" },
  { seatName: "T1", experienceId: "65dc2dae-ac4c-42ff-bc88-be48bd461b1e" },
  { seatName: "Grid 1", experienceId: "7e59b266-3172-4ce5-91d5-ba0e9b464d94" },
  { seatName: "Grid 2", experienceId: "eb6df24a-3f3e-4d52-8ff3-3c9dd4b09f95" },
  { seatName: "Pit Exit 1", experienceId: "46341493-525c-4a47-83aa-99afe22b07ca" },
  { seatName: "Champions Club", experienceId: "752d5d06-1e81-403b-8e57-4f77dd8b57e3" },
];

for (const u of UPDATES) {
  const result = await sql`
    UPDATE circuit_seating_profile
    SET linked_experience_id = ${u.experienceId}, last_verified_date = NOW()
    WHERE sporting_event_id = ${EVENT_ID} AND seat_name = ${u.seatName}
    RETURNING seat_name, linked_experience_id
  `;
  console.log(`✓ ${result[0]?.seat_name ?? u.seatName}:`, result[0]?.linked_experience_id ?? "NOT FOUND");
}

const rows = await sql`
  SELECT seat_name, linked_experience_id FROM circuit_seating_profile WHERE sporting_event_id = ${EVENT_ID} ORDER BY seat_name
`;
console.log("\nFinal state:");
console.table(rows);
console.log(`Seats with linkedExperienceId: ${rows.filter((r) => r.linked_experience_id).length} / ${rows.length}`);

await sql.end();
