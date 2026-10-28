import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { revalidateCacheTags } from "./_lib/revalidate-cache.mjs";
import { CACHE_TAGS } from "./_lib/cache-tags.mjs";

// Activates US Open 2027 Tennis Ticket Intelligence on PRODUCTION — same
// pattern as _activate-wimbledon-ticket-intelligence.mjs. Founder's
// explicit instruction, 28 Oct 2026: activate now for visual UAT
// (production exposure explicitly acknowledged and accepted by the
// founder), deactivate again once that UAT window is complete (see
// _deactivate-us-open-ticket-intelligence.mjs, written alongside this
// script for that follow-up step — never delete this row, only flip
// activated_at back to null / catalogue_ratified back to false).
//
// KNOWN, ACCEPTED STATE AT ACTIVATION TIME: the seeded description_text on
// all 31 options is still the handoff's draft "DRAFT —" wording, and
// 12,080 of 15,552 possible quiz outcomes use the ported generalized
// fallback explanation text, which is the frozen implementation baseline
// but not individually founder-approved (only the 16/48 exact-reference
// passages are). The founder explicitly accepted this for the UAT window.

const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const [event] = await sql`SELECT edition_year FROM sporting_events WHERE id = ${US_OPEN_EVENT_ID}`;
if (!event) throw new Error("US Open sporting_events row not found — stop, do not activate.");

const [{ c: optionCount }] = await sql`
  SELECT count(*)::int c FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${US_OPEN_EVENT_ID}
`;
if (optionCount !== 31) throw new Error(`Expected exactly 31 US Open option rows, found ${optionCount} — stop, do not activate.`);

const result = await sql`
  INSERT INTO tennis_ticket_intelligence_edition_status (sporting_event_id, reviewed_edition_year, activated_at, activated_by, catalogue_ratified)
  VALUES (${US_OPEN_EVENT_ID}, ${event.edition_year}, now(), 'founder-explicit-production-activation-2026-10-28-visual-uat', true)
  ON CONFLICT (sporting_event_id) DO UPDATE SET
    reviewed_edition_year = EXCLUDED.reviewed_edition_year,
    activated_at = EXCLUDED.activated_at,
    activated_by = EXCLUDED.activated_by,
    catalogue_ratified = EXCLUDED.catalogue_ratified
  RETURNING *
`;
console.log("US Open Ticket Intelligence activated:", result[0]);

await sql.end();

await revalidateCacheTags([CACHE_TAGS.TENNIS_TICKET_INTELLIGENCE, CACHE_TAGS.TRIP_INTELLIGENCE_TENNIS]);
