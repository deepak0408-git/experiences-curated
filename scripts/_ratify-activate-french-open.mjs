import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { revalidateCacheTags } from "./_lib/revalidate-cache.mjs";
import { CACHE_TAGS } from "./_lib/cache-tags.mjs";

const FO = "e6f2b585-196e-4842-8648-753a40979f4f";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const before = await sql`SELECT * FROM tennis_ticket_intelligence_edition_status WHERE sporting_event_id = ${FO}`;
console.log("Before:", before[0]);

const result = await sql`
  UPDATE tennis_ticket_intelligence_edition_status
  SET activated_at = now(), activated_by = 'founder-explicit-authorization-2026-10-23', catalogue_ratified = true
  WHERE sporting_event_id = ${FO}
  RETURNING *
`;
console.log("After:", result[0]);

// Confirm AO's own row is untouched by this update (scoped by sporting_event_id, but verify anyway).
const ao = await sql`SELECT * FROM tennis_ticket_intelligence_edition_status WHERE sporting_event_id = '1ced8699-d5ce-49fb-add4-6ebc6f251ec6'`;
console.log("AO edition status (should be unchanged):", ao[0]);

await sql.end();

// Without this, the "has Ticket Intelligence" gate on Trip Intelligence /
// the event pack hub stayed stale for up to an hour after this exact
// activation ran, 23-24 Oct 2026 — see
// feedback_unstable_cache_tags_and_revalidation memory.
await revalidateCacheTags([CACHE_TAGS.TENNIS_TICKET_INTELLIGENCE, CACHE_TAGS.TRIP_INTELLIGENCE_TENNIS]);
