import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-anting-neighborhood-mue5lzhx";
const MUSEUM_URL = "https://maps.google.com/?cid=484129483494367895&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";

const OLD_INLINE = " [See live rating and reviews on Google Maps](https://maps.google.com/?cid=484129483494367895&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)";

const [row] = await db.select({ bodyContent: experiences.bodyContent, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(OLD_INLINE)) {
  console.error("Inline link not found — aborting");
  process.exit(1);
}

const newBody = row.bodyContent.replace(OLD_INLINE, "");
const newEditorialNote = row.editorialNote + " Switched from multi-venue inline-link pattern to a single top-level googleMapsRating/Url (header display) since only one of the two newly-introduced stops (Shanghai Auto Museum) has a real rating — German Town has none, so a multi-venue setup implying two rated venues was misleading.";

await db.update(experiences)
  .set({
    bodyContent: newBody,
    googleMapsRating: "4.5",
    googleMapsReviewCount: 90,
    googleMapsUrl: MUSEUM_URL,
    editorialNote: newEditorialNote,
  })
  .where(eq(experiences.slug, SLUG));

console.log("Switched to single-venue rating: Shanghai Auto Museum 4.5/90, shown via top-level fields (header), removed inline body link.");

await client.end();
