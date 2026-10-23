import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Reverts the temporary local-preview flip from _preview-activate-tennis.mjs
// — restores the Australian Open row to its pre-preview, fail-closed state
// (unactivated, unratified). Run this when the founder says preview is done.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const [row] = await sql`
  update tennis_ticket_intelligence_edition_status
  set activated_at = null, activated_by = null, catalogue_ratified = false
  where sporting_event_id = '1ced8699-d5ce-49fb-add4-6ebc6f251ec6'
  returning sporting_event_id, activated_at, catalogue_ratified
`;
console.log("Reverted to unactivated/unratified:", row);
await sql.end();
