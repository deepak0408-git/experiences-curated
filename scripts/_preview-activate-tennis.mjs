import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// TEMPORARY local preview only — founder-approved, scoped to the
// Australian Open row only. Flips the two publication gates on so the
// founder can click through the real quiz/result flow on localhost while
// ChatGPT runs the independent regression in parallel. NOT a real
// activation/ratification decision — revert via
// _preview-deactivate-tennis.mjs when the founder says so. Nothing is
// deployed; this only affects what the local dev server renders.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const [row] = await sql`
  update tennis_ticket_intelligence_edition_status
  set activated_at = now(), activated_by = 'local-preview-temporary', catalogue_ratified = true
  where sporting_event_id = '1ced8699-d5ce-49fb-add4-6ebc6f251ec6'
  returning sporting_event_id, activated_at, catalogue_ratified
`;
console.log("Temporarily activated for local preview:", row);
console.log("Revert with _preview-deactivate-tennis.mjs when done.");
await sql.end();
