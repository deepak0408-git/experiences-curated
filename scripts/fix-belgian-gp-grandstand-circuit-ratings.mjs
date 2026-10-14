import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { inArray } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Founder direction, 12 Oct 2026: every grandstand/corner write-up at
// Spa-Francorchamps is physically part of the one circuit venue, not a
// separately Google-rated place — so each uses the Circuit of
// Spa-Francorchamps' own rating (confirmed directly from Google Maps,
// 4.7 / 24,342 reviews) rather than going unrated. Distinct from the 5
// genuinely separate venues (hotels, restaurant, the circuit's own
// "Track Experiences" listing) already rated individually.
const CIRCUIT_RATING = "4.7";
const CIRCUIT_REVIEW_COUNT = 24342;
const CIRCUIT_URL = "https://maps.app.goo.gl/sBVE7f8noiDeddjD8";

const IDS = [
  "3ff418ed-a8d6-46d6-b070-44ad594b4f89", // Eau Rouge / Raidillon — Gold 3 Grandstand
  "346b2125-2f4b-4b82-95ef-7b73c1c2515c", // Pouhon Corner — Silver 3 Grandstand
  "e0c36bc7-2478-41b0-8f85-5cd94f5d5fcb", // The Fan Zone at Raidillon
  "ef526456-69f3-4a80-b96a-5c8f4200072b", // The Kemmel Straight — General Admission
  "a2fe932f-4d96-495a-9e2b-af99da8955a3", // Gold 1: Pit Grandstand
  "415ad447-2dcf-434a-8706-947d1e9ba096", // Les Combes — Grandstands 1-4
  "cde406a7-9ac9-47bd-8662-3c0586390c11", // La Source Hairpin — Gold 7/8/9 Grandstands
  "ae6b94d2-84e5-455a-b143-f4dfc26e5562", // Paddock Club — Belgian Grand Prix
  "fcc5ff87-f014-4814-92d1-b5dbcf10ff4b", // Bus Stop Chicane — Gold 6 & Gold 11
];

await db.update(experiences)
  .set({
    googleMapsRating: CIRCUIT_RATING,
    googleMapsReviewCount: CIRCUIT_REVIEW_COUNT,
    googleMapsUrl: CIRCUIT_URL,
  })
  .where(inArray(experiences.id, IDS));

console.log(`✓ ${IDS.length} grandstand/corner experiences updated with circuit rating ${CIRCUIT_RATING} (${CIRCUIT_REVIEW_COUNT})`);

await client.end();
