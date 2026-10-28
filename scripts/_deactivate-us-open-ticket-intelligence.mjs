import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Deactivates US Open 2027 Tennis Ticket Intelligence on production — run
// this once the founder confirms the visual UAT window is over. Sets
// activated_at back to NULL and catalogue_ratified back to false, which
// makes the route fail-closed ("Not available yet") again, exactly as it
// was before activation. Never deletes the row or any option/explanation
// data — this only flips the two activation flags. Same pattern as
// _deactivate-wimbledon-ticket-intelligence.mjs.

const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const result = await sql`
  UPDATE tennis_ticket_intelligence_edition_status
  SET activated_at = NULL, catalogue_ratified = false
  WHERE sporting_event_id = ${US_OPEN_EVENT_ID}
  RETURNING *
`;

if (result.length === 0) {
  console.log("No edition_status row found for US Open — nothing to deactivate (it was already inactive).");
} else {
  console.log("US Open Ticket Intelligence deactivated:", result[0]);
}

await sql.end();
