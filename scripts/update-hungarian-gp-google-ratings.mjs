import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Backfills real Google Maps ratings for the 6 single-venue, genuinely
// rateable Hungarian GP experiences — found missing in the hub-and-spoke
// build's §4b-1 audit, 16 Oct 2026. Real Places API (New) lookups, not
// invented, per experience-researcher skill §2c. All 6 matches confirmed
// against the row's own real street address before writing.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const UPDATES = [
  { id: "07205ca7-5528-470c-b9c3-05af68eab44b", title: "Szimpla Kert", googleMapsRating: "4.6", googleMapsReviewCount: 75457, googleMapsUrl: "https://maps.google.com/?cid=2771757573889662372" },
  { id: "1cec44b6-8c15-4ff5-ae93-b485dee66b06", title: "Széchenyi Thermal Bath", googleMapsRating: "4.2", googleMapsReviewCount: 67496, googleMapsUrl: "https://maps.google.com/?cid=14681949227417674770" },
  { id: "a5b5a60e-8d24-42f1-a0e7-077e114d53fe", title: "Gödöllő (Hotel Queen Elizabeth)", googleMapsRating: "4.5", googleMapsReviewCount: 972, googleMapsUrl: "https://maps.google.com/?cid=13430295451171718170" },
  { id: "e1d2dcdf-e17e-40c1-bcf3-39465e440cd6", title: "Gettó Gulyás", googleMapsRating: "4.6", googleMapsReviewCount: 17162, googleMapsUrl: "https://maps.google.com/?cid=14030660410251791828" },
  { id: "ee6ca54b-203b-43e6-8b85-bd3c61f760c5", title: "Stand25 Bisztró", googleMapsRating: "4.5", googleMapsReviewCount: 2296, googleMapsUrl: "https://maps.google.com/?cid=8339739398985646421" },
  { id: "f809c882-3cc0-4088-bd60-cf5b11c3481c", title: "Four Seasons Gresham Palace", googleMapsRating: "4.8", googleMapsReviewCount: 4408, googleMapsUrl: "https://maps.google.com/?cid=4256537124122161487" },
];

for (const u of UPDATES) {
  const [result] = await db
    .update(experiences)
    .set({
      googleMapsRating: u.googleMapsRating,
      googleMapsReviewCount: u.googleMapsReviewCount,
      googleMapsUrl: u.googleMapsUrl,
      updatedAt: new Date(),
    })
    .where(eq(experiences.id, u.id))
    .returning({ title: experiences.title, googleMapsRating: experiences.googleMapsRating });
  console.log(`✓ ${u.title}:`, result);
}

await client.end();
