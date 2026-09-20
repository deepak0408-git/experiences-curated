import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Backfills googleMapsRating/googleMapsReviewCount/googleMapsUrl for the 2
// genuinely single-venue Italian GP experiences that had none: Hotel de la
// Ville (Monza) and the Alfa Romeo Museum (Arese). Real Google Maps ratings
// and short links supplied directly by the founder, 19 Sep 2026 (WebSearch
// could not surface a direct cid link or a reliably-sourced review count for
// either venue, so the founder provided both ratings and review counts
// directly rather than an estimated/aggregator figure).
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const RATINGS = {
  "hotel-de-la-ville-monza-mqzdvzcf": {
    googleMapsRating: "4.7",
    googleMapsReviewCount: 1211,
    googleMapsUrl: "https://maps.app.goo.gl/HhoNEvmEb5H7ey7W7",
  },
  "alfa-romeo-museum-arese-mrc6n1w8": {
    googleMapsRating: "4.8",
    googleMapsReviewCount: 13092,
    googleMapsUrl: "https://maps.app.goo.gl/nCMnAh1XkeWYheDLA",
  },
};

for (const [slug, rating] of Object.entries(RATINGS)) {
  const [row] = await db
    .update(experiences)
    .set(rating)
    .where(eq(experiences.slug, slug))
    .returning({ title: experiences.title, slug: experiences.slug });
  console.log(row ? `✓ ${row.title} (${row.slug})` : `✗ not found: ${slug}`);
}

await client.end();
