import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Deactivates Wimbledon 2027 Tennis Ticket Intelligence on production —
// run this once the founder confirms ChatGPT's acceptance-testing window
// is over. Sets activated_at back to NULL and catalogue_ratified back to
// false, which makes the route fail-closed ("Not available yet") again,
// exactly as it was before activation. Never deletes the row or any
// option/explanation data — this only flips the two activation flags.

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const result = await sql`
  UPDATE tennis_ticket_intelligence_edition_status
  SET activated_at = NULL, catalogue_ratified = false
  WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID}
  RETURNING *
`;

if (result.length === 0) {
  console.log("No edition_status row found for Wimbledon — nothing to deactivate (it was already inactive).");
} else {
  console.log("Wimbledon Ticket Intelligence deactivated:", result[0]);
}

await sql.end();
