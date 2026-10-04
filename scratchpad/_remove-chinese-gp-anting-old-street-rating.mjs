import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-anting-old-street-mud1yyr2";

const [row] = await db.select({ editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const newEditorialNote = row.editorialNote.replace(
  " Google Places API (New) lookup, 2 Oct 2026: Anting Old Street 4.0/3 reviews — a genuinely thin sample, cited honestly rather than omitted since it's the correct, confirmed match for the place (verified via place ID match against the founder-supplied Maps link).",
  " Google Places API (New) lookup, 2 Oct 2026: Anting Old Street resolved to 4.0/3 reviews (place ID confirmed against founder-supplied Maps link) — sample too thin to cite as a rating, so googleMapsRating/ReviewCount/Url deliberately left unset."
);

await db.update(experiences)
  .set({
    googleMapsRating: null,
    googleMapsReviewCount: null,
    googleMapsUrl: null,
    editorialNote: newEditorialNote,
  })
  .where(eq(experiences.slug, SLUG));

console.log("Cleared googleMapsRating/ReviewCount/Url for", SLUG);

await client.end();
