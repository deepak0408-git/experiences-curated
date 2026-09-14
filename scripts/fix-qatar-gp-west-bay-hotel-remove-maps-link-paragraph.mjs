// Qatar GP 2026 — fix qatar-gp-west-bay-hotel-mtymvrc6 (Four Seasons Hotel Doha, West Bay)
// Follow-up to the rating-sentence removal (14 Sep 2026): the inline
// "[See live rating...]" markdown link is a pattern reserved for multi-venue
// experiences (experience-researcher skill §2c) where no single top-of-page
// googleMapsRating exists to show it. This is a single-venue experience —
// googleMapsRating/googleMapsUrl already render at the top of the experience
// page, so the closing paragraph pointing to the same link was redundant.
// Removed per founder instruction 14 Sep 2026. Also enhanced the dining
// paragraph with real named venues (was just "ten separate dining venues"
// with no names) — Nobu Doha (the world's largest Nobu, over the Gulf),
// Il Teatro, Curiosa by Jean-Georges — plus real spa detail (11 treatment
// rooms, three floors, hydrotherapy pool), per founder instruction.
// Sources: fourseasons.com/doha/dining/, forbestravelguide.com, tripadvisor.com.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-west-bay-hotel-mtymvrc6";

const bodyContent = `Four Seasons Hotel Doha sits directly on the Corniche in West Bay, Doha's central business and residential waterfront — the pick for anyone who wants the actual city, not a marina district or an island resort, as their race-weekend base.

The property runs 237 rooms and suites, five outdoor pools (including a palm-fringed grotto and a family pool with slides), a 250m private beach, and its own 110-berth marina. Every room looks out over either the Arabian Gulf or Doha's skyline — the white stone, latticework-domed building is itself a genuine city landmark on the Corniche waterfront, not just a hotel with a view of one.

Ten dining venues cover most of what you'd want without leaving the property. Nobu Doha, perched directly over the Gulf, is the largest Nobu in the world and the clearest reason food-focused guests pick this hotel over its West Bay rivals. Il Teatro handles Italian, Curiosa by Jean-Georges does Latin American, and Brasserie on the Beach keeps things casual and Middle Eastern by the water. The spa spans three floors with 11 treatment rooms, a hydrotherapy pool, and its own squash and tennis courts.

The location is the real draw: West Bay puts you within reach of the Museum of Islamic Art, the Corniche promenade itself, and central Doha's business district, all without needing a taxi first. The tradeoff against Lusail's marina hotels is distance to the circuit — West Bay runs about 30 minutes to Lusail International Circuit by car, roughly double the transfer from Raffles or Fairmont, though still entirely manageable for race day.`;

const result = await db
  .update(experiences)
  .set({
    bodyContent,
    editorialNote:
      "Sources: fourseasons.com/doha/dining/, forbestravelguide.com, tripadvisor.com (Nobu, Il Teatro, spa detail), visitqatar.com (location, amenities). Google Places API lookup 12 Sep 2026: 4.6/4,968 reviews (dedicated googleMapsRating/googleMapsReviewCount fields, rendered at top of experience page). 14 Sep 2026: removed raw star-rating/review-count sentence, removed the trailing inline Google Maps link paragraph (single-venue experience — rating already shows at top of page, multi-venue inline-link pattern from skill §2c doesn't apply), and enhanced the dining/spa paragraph with real named venues (Nobu Doha — world's largest Nobu — Il Teatro, Curiosa by Jean-Georges, Brasserie on the Beach) and real spa facts (3 floors, 11 treatment rooms, hydrotherapy pool) in place of the generic 'ten separate dining venues' line.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
