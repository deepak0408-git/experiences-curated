import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import fs from "node:fs";
import path from "node:path";

// Persists the approved 43-option hero_image mapping for Australian Open
// 2027 Tennis Ticket Intelligence. Scoped by (sporting_event_id,
// option_number) — never bare option_id, since option numbers could
// theoretically recur across a future second tennis event. Transactional:
// all 43 updates succeed together or none are applied. Fails loudly
// rather than silently skipping if the row count or any mapped image
// isn't found.

const EXTRACT_DIR = process.argv[2];
if (!EXTRACT_DIR) {
  console.error("Usage: node backfill-ao2027-ticket-hero-images.mjs <path-to-extracted-ZIP-dir>");
  process.exit(1);
}

const SPORTING_EVENT_ID = "1ced8699-d5ce-49fb-add4-6ebc6f251ec6"; // australian-open, 2027 — verified against DB
const manifest = JSON.parse(fs.readFileSync(path.join(EXTRACT_DIR, "manifest.json"), "utf8"));
const uploadResults = JSON.parse(fs.readFileSync(path.join(EXTRACT_DIR, "_upload-results.json"), "utf8"));

const PUBLIC_URL_BY_FILENAME = Object.fromEntries(
  uploadResults.results.map((r) => [path.basename(r.key), r.publicUrl])
);

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// Pre-check: event matches expected slug/edition, and exactly 43 rows exist.
const [event] = await sql`select id, slug, edition_year, sport from sporting_events where id = ${SPORTING_EVENT_ID}`;
if (!event) throw new Error(`Event ${SPORTING_EVENT_ID} not found`);
if (event.slug !== "australian-open" || event.edition_year !== 2027 || event.sport !== "tennis") {
  throw new Error(`Event mismatch: expected australian-open/2027/tennis, got ${event.slug}/${event.edition_year}/${event.sport}`);
}
const [{ count }] = await sql`select count(*)::int as count from tennis_ticket_intelligence_options where sporting_event_id = ${SPORTING_EVENT_ID}`;
if (count !== 43) {
  throw new Error(`Expected exactly 43 rows for this event, found ${count} — aborting, not applying any mapping`);
}
console.log(`Pre-check passed: event verified, exactly 43 option rows found.`);

// Build the full set of 43 updates, resolving each to a verified public URL.
const updates = [];
for (const [optionId, filename] of Object.entries(manifest.option_image_mapping)) {
  const publicUrl = PUBLIC_URL_BY_FILENAME[filename];
  if (!publicUrl) throw new Error(`No verified upload result found for ${filename} (option ${optionId})`);
  updates.push({ optionNumber: parseInt(optionId, 10), publicUrl });
}
if (updates.length !== 43) throw new Error(`Expected 43 mappings, built ${updates.length} — aborting`);

await sql.begin(async (tx) => {
  for (const u of updates) {
    const result = await tx`
      update tennis_ticket_intelligence_options
      set hero_image = ${u.publicUrl}
      where sporting_event_id = ${SPORTING_EVENT_ID} and option_number = ${u.optionNumber}
    `;
    if (result.count !== 1) {
      throw new Error(`Expected to update exactly 1 row for option_number=${u.optionNumber}, affected ${result.count} — rolling back`);
    }
  }
});
console.log(`Transaction committed: 43 option rows updated with hero_image.`);

const [{ nonNullCount }] = await sql`
  select count(*)::int as "nonNullCount" from tennis_ticket_intelligence_options
  where sporting_event_id = ${SPORTING_EVENT_ID} and hero_image is not null
`;
console.log(`Verification: ${nonNullCount}/43 rows now have a non-null hero_image.`);

await sql.end();
