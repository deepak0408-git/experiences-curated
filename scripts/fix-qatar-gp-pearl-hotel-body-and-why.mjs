// Qatar GP 2026 — fix qatar-gp-pearl-hotel-mtymuro9 (Marsa Malaz Kempinski, The Pearl)
// Enhances bodyContent and whyItsSpecial with real resort research (rooms,
// dining, spa, beach, sports facilities) from kempinski.com + corroborating
// sources, and removes the raw star-rating/review-count sentences from both
// fields per founder instruction 14 Sep 2026 (standing rule going forward:
// never embed rating/review count directly in body or why_its_special —
// see memory feedback_no_rating_review_count_in_body_or_why.md).
// Sources: kempinski.com/en/marsa-malaz-kempinski-the-pearl-doha (via search
// index, direct fetch blocked 403), kempinski.com restaurants-bars page,
// forbestravelguide.com hotel listing + 2023 Star Awards press release.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-pearl-hotel-mtymuro9";

const bodyContent = `Marsa Malaz Kempinski sits on its own private island within The Pearl-Qatar, the man-made archipelago that's become Doha's most polished address for waterfront living. It's the genuine resort choice for a Qatar GP trip, a real alternative to basing yourself in a Lusail marina tower for proximity or a West Bay high-rise for the skyline.

Scale is the first thing that separates it from a standard city hotel. There are 281 rooms and suites, each with a balcony or terrace facing either the Gulf or The Pearl, starting around 75 square metres, which puts them among the largest standard rooms in Doha rather than just a line in a brochure. That extra space is worth having if this is a multi-day base rather than somewhere to sleep between sessions.

Eleven restaurants and bars are spread across the property, and they don't repeat each other. El Faro does Spanish tapas with an outdoor terrace. NOZOMI is contemporary Japanese and one of the stronger versions of that concept in the Kempinski portfolio. Al Sufra covers Levantine cooking, Sawa handles the family-friendly European-Mediterranean end, and Public House runs an American casual menu. Bohemia Cigar Lounge and Café Murano cover the evening and lobby side of things. Stay three or four nights and you can eat somewhere different every night without leaving the island.

The Spa by Clarins is a serious operation: 23 treatment rooms across roughly 32,000 square feet, including a private hammam and spa suites built for couples. It's part of what earned the hotel a Forbes Travel Guide Recommended rating in the 2023 Star Awards, an outside judgment rather than the hotel's own copy.

The private beach runs close to 500 feet, long for a city hotel, and the resort actually uses it: watersports, a genuine sense of distance from Doha's density despite being minutes away by car. Two padel courts and a tennis court cover the rest of the daytime, and a kids' club makes this workable as a family base too. Qanat Quartier, Porto Arabia, and Medina Centrale, The Pearl's own dining and retail districts, are a short walk away, so an evening off the property is optional rather than necessary.

Hamad International Airport is about 30 minutes away, and Lusail Circuit is a similar drive in the other direction. This isn't the closest base to the track. It's the one you pick when the trip is a holiday that happens to include a race weekend, not the reverse.`;

const whyItsSpecial = `Most F1 trips treat accommodation purely as circuit logistics: how close, how fast the commute. The Pearl flips that. You're choosing a resort first and accepting a longer transfer as the price of it, and the resort itself has to earn that trade. Eleven restaurants, a genuine wellness spa, a near-500-foot private beach, and rooms nearly double the size of a standard Doha city hotel room aren't a marketing list here, they're the actual argument for staying somewhere further from the track.

For a fan combining the race with real time away rather than a strict in-and-out weekend, that math works. A marina tower wins on convenience. This wins on everything you do outside race hours, which for most multi-day trips is most of the trip. The Forbes Travel Guide recognition is a useful outside check on that, since it's judged the property against an international luxury standard rather than taking the hotel's own word for it.`;

const result = await db
  .update(experiences)
  .set({
    bodyContent,
    whyItsSpecial,
    editorialNote:
      "Sources: kempinski.com (official location/amenities/restaurants), forbestravelguide.com (2023 Star Awards Recommended rating). Google Places API lookup 12 Sep 2026: 4.7/9,903 reviews (kept in dedicated googleMapsRating/googleMapsReviewCount fields only). 14 Sep 2026: enhanced body + why-it's-special with real resort facility research (281 rooms, 11 restaurants incl. El Faro/NOZOMI/Al Sufra, Spa by Clarins 23 treatment rooms, Forbes Travel Guide Recommended 2023) and removed raw star-rating/review-count sentences from both fields per founder instruction — standing rule going forward.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
