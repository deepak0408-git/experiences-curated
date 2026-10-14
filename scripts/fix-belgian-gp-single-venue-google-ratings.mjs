import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Google ratings for Belgian GP's 5 genuine single-venue experiences,
// confirmed directly by the founder from live Google Maps screenshots,
// 12 Oct 2026 — not WebSearch-derived (WebSearch results conflicted across
// secondary aggregators and couldn't be confirmed as Google-sourced
// specifically; see conversation). The remaining 15 Belgian GP experiences
// are grandstands/corners (not a distinct Google-rated place), multi-venue
// roundups (Street Food, Ardennes Beyond — need MULTI_VENUE_RATINGS
// treatment, not a single top-line rating), or otherwise out of scope for
// today's sweep per founder direction.
const UPDATES = [
  {
    id: "bfd5e48d-dcba-4951-a006-23fa2a588dee", // Domino Steak House, Spa
    googleMapsRating: "4.3",
    googleMapsReviewCount: 680,
    googleMapsUrl: "https://maps.app.goo.gl/ARyCyzXTQW3xSAGZ9",
  },
  {
    id: "644b621d-75d5-4981-8bdb-f052ddf81c85", // Van der Valk Hotel Spa — Place Royale
    googleMapsRating: "4.2",
    googleMapsReviewCount: 2024,
    googleMapsUrl: "https://maps.app.goo.gl/JvR87wVF8cpsaCvx7",
  },
  {
    id: "6ecde867-c9f7-40c4-b173-519ea139394d", // Romantik Hotel Le Val d'Amblève
    googleMapsRating: "4.7",
    googleMapsReviewCount: 461,
    googleMapsUrl: "https://maps.app.goo.gl/ysWYZRgaB2CQG7Q87",
  },
  {
    id: "1ca53bb0-083a-48e0-a34e-0b2a85fac3b5", // Spa-Francorchamps — Track Experiences & Driving Days
    googleMapsRating: "4.7",
    googleMapsReviewCount: 24342,
    googleMapsUrl: "https://maps.app.goo.gl/sBVE7f8noiDeddjD8",
  },
  {
    id: "88f15c8f-52d6-42e0-a4f2-c3c63a88a28e", // Stavelot — Abbey, Circuit Museum & Town
    googleMapsRating: "4.2",
    googleMapsReviewCount: 2618,
    googleMapsUrl: "https://maps.app.goo.gl/hXKUW8BwDDdyhtqQ8",
  },
];

for (const u of UPDATES) {
  await db.update(experiences)
    .set({
      googleMapsRating: u.googleMapsRating,
      googleMapsReviewCount: u.googleMapsReviewCount,
      googleMapsUrl: u.googleMapsUrl,
    })
    .where(eq(experiences.id, u.id));
  console.log(`✓ ${u.id} rating updated: ${u.googleMapsRating} (${u.googleMapsReviewCount})`);
}

await client.end();
