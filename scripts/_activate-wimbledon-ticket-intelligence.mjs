import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Activates Wimbledon 2027 Tennis Ticket Intelligence on PRODUCTION — the
// founder explicitly confirmed this is a real, intentional production
// activation (not a dev/preview workaround), 25 Oct 2026, after the
// original task's own instruction to never activate against production
// without explicit confirmation of exactly that. Founder's own stated
// intent: activate now for ChatGPT's independent acceptance testing,
// deactivate again once testing is complete (see
// _deactivate-wimbledon-ticket-intelligence.mjs, written alongside this
// script for that follow-up step — never delete this row, only flip
// activatedAt back to null / catalogueRatified back to false).

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const [event] = await sql`SELECT edition_year FROM sporting_events WHERE id = ${WIMBLEDON_EVENT_ID}`;
if (!event) throw new Error("Wimbledon sporting_events row not found — stop, do not activate.");

const [{ c: optionCount }] = await sql`
  SELECT count(*)::int c FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID}
`;
if (optionCount !== 25) throw new Error(`Expected exactly 25 Wimbledon option rows, found ${optionCount} — stop, do not activate.`);

const result = await sql`
  INSERT INTO tennis_ticket_intelligence_edition_status (sporting_event_id, reviewed_edition_year, activated_at, activated_by, catalogue_ratified)
  VALUES (${WIMBLEDON_EVENT_ID}, ${event.edition_year}, now(), 'founder-explicit-production-activation-2026-10-25', true)
  ON CONFLICT (sporting_event_id) DO UPDATE SET
    reviewed_edition_year = EXCLUDED.reviewed_edition_year,
    activated_at = EXCLUDED.activated_at,
    activated_by = EXCLUDED.activated_by,
    catalogue_ratified = EXCLUDED.catalogue_ratified
  RETURNING *
`;
console.log("Wimbledon Ticket Intelligence activated:", result[0]);

await sql.end();
