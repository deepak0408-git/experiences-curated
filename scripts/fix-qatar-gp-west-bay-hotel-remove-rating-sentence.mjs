// Qatar GP 2026 — fix qatar-gp-west-bay-hotel-mtymvrc6 (Four Seasons Hotel Doha, West Bay)
// Same issue as qatar-gp-pearl-hotel-mtymuro9: bodyContent stated the raw
// star rating/review count as prose ("4.6 on Google from 4,968 reviews...").
// Standing rule (see memory feedback_no_rating_review_count_in_body_or_why.md,
// 14 Sep 2026): never embed rating/review count directly in body or
// why_its_special — those live only in the dedicated googleMapsRating/
// googleMapsReviewCount fields + the live in-body link. Light touch here:
// the body already had real facility detail (237 rooms, 10 dining venues,
// 5 pools, 250m beach, 110-berth marina) — this is a tighten, not a rewrite.
// whyItsSpecial had no rating sentence, so it is unchanged.

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

The property runs 237 rooms and suites, ten separate dining venues, five outdoor pools (including a palm-fringed grotto and a family pool with slides), a 250m private beach, and its own 110-berth marina. Every room looks out over either the Arabian Gulf or Doha's skyline — the white stone, latticework-domed building is itself a genuine city landmark on the Corniche waterfront, not just a hotel with a view of one.

The location is the real draw: West Bay puts you within reach of the Museum of Islamic Art, the Corniche promenade itself, and central Doha's business district, all without needing a taxi first. The tradeoff against Lusail's marina hotels is distance to the circuit — West Bay runs about 30 minutes to Lusail International Circuit by car, roughly double the transfer from Raffles or Fairmont, though still entirely manageable for race day.

[See live rating and reviews on Google Maps](https://maps.google.com/?cid=14528869250272066171&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) for a fuller picture from guests who've actually stayed here.`;

const result = await db
  .update(experiences)
  .set({
    bodyContent,
    editorialNote:
      "Sources: fourseasons.com, forbestravelguide.com, visitqatar.com (location, amenities). Google Places API lookup 12 Sep 2026: 4.6/4,968 reviews (kept in dedicated googleMapsRating/googleMapsReviewCount fields only, not stated as prose). Chose Four Seasons over W Doha (locked list named both) as the more distinctly landmark/Corniche-located option. 14 Sep 2026: removed raw star-rating/review-count sentence from bodyContent per founder instruction — standing rule (see feedback_no_rating_review_count_in_body_or_why.md).",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
