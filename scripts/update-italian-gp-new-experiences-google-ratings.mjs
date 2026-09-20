import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Backfills googleMapsRating/googleMapsReviewCount/googleMapsUrl for the 6
// Italian GP experiences seeded this session without a Google Places lookup
// (skipped at seed time for speed, per Phase B build task). All 6 represent
// the Autodromo Nazionale Monza venue itself (the circuit, its grandstands,
// and orientation content about it) — a single real Google Places Text
// Search lookup for "Autodromo Nazionale Monza" (Places API, live call, 19
// Sep 2026) returned one shared venue record (Monza Circuit, 4.6 stars,
// 20,426 reviews as of this lookup), applied to all 6 rows the same way
// MULTI_VENUE_RATINGS-adjacent sibling events share one venue rating across
// multiple grandstand/orientation experiences at the same physical site.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const RATING = {
  googleMapsRating: "4.6",
  googleMapsReviewCount: 20426,
  googleMapsUrl: "https://maps.google.com/?cid=7232357645184902706&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
};

const SLUGS = [
  "italian-gp-arrival-queue-guide-mu7cja19",
  "italian-gp-first-timer-guide-mu7ckouk",
  "italian-gp-ga-lesmo-ascari-mu7cpo5e",
  "italian-gp-grandstand-1-centrale-mu7cn5ry",
  "italian-gp-grandstand-5-piscina-mu7cogcs",
  "monza-inside-the-venue-mu7cm8il",
];

for (const slug of SLUGS) {
  const [row] = await db
    .update(experiences)
    .set(RATING)
    .where(eq(experiences.slug, slug))
    .returning({ title: experiences.title, slug: experiences.slug });
  console.log(row ? `✓ ${row.title} (${row.slug})` : `✗ not found: ${slug}`);
}

await client.end();
