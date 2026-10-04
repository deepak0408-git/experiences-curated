import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-anting-old-street-mud1yyr2";
const url = "https://maps.google.com/?cid=7260776528161238238&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";

const [row] = await db.select({ editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const newEditorialNote = row.editorialNote + " Google Places API (New) lookup, 2 Oct 2026: Anting Old Street 4.0/3 reviews — a genuinely thin sample, cited honestly rather than omitted since it's the correct, confirmed match for the place (verified via place ID match against the founder-supplied Maps link).";

await db.update(experiences)
  .set({
    googleMapsRating: "4.0",
    googleMapsReviewCount: 3,
    googleMapsUrl: url,
    editorialNote: newEditorialNote,
  })
  .where(eq(experiences.slug, SLUG));

console.log("Updated googleMapsRating/ReviewCount/Url and editorialNote for", SLUG);

await client.end();
