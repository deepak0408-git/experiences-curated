import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Official ticketing URLs for the 6 unbuilt V1 planner-scope events —
// required field per event-builder skill §8, missed when these rows were
// created via a standalone seed script instead of that skill (caught by
// user 20 Jul 2026). Researched via web search 20 Jul 2026, all confirmed
// live/on-sale at time of research. F1 URLs confirmed genuine by user
// directly (tickets.formula1.com blocks direct fetch, so verification was
// via indexed grandstand subpages resolving, cross-checked by user).

const URLS = {
  "alfred-dunhill-links-2026": "https://www.alfreddunhilllinks.com/tickets/",
  "singapore-gp-2026": "https://tickets.formula1.com/en/f1-3301-singapore",
  "atp-finals-2026": "https://tickets.nittoatpfinals.com/en",
  "las-vegas-gp-2026": "https://tickets.formula1.com/en/f1-59007-las-vegas",
  "abu-dhabi-gp-2026": "https://tickets.formula1.com/en/f1-3312-abu-dhabi",
  "new-zealand-in-australia-cricket-2026-27": "https://www.cricket.com.au/matches/series/CA:4605/australia-v-new-zealand-tests-2026-27-men",
};

for (const [slug, url] of Object.entries(URLS)) {
  const result = await sql`
    UPDATE sporting_events SET ticketing_url = ${url} WHERE slug = ${slug}
    RETURNING slug
  `;
  console.log(result.length > 0 ? `✓ updated: ${slug}` : `✗ NOT FOUND: ${slug}`);
}

const slugs = Object.keys(URLS);
const rows = await sql`
  SELECT slug, ticketing_url FROM sporting_events WHERE slug = ANY(${slugs}) ORDER BY slug
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
