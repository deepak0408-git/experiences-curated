import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "marina-beach-kapaleeshwarar-" + Date.now().toString(36);

const bodyContent = `Marina Beach runs for nearly 12km along the Bay of Bengal, from Fort St. George in the north down to Besant Nagar in the south, and it's genuinely India's longest beach and among the longest urban beaches anywhere in the world. It's also close to Chepauk, which makes it an easy stop before or after a session rather than a dedicated excursion.

It isn't a swimming beach in the way a resort coastline is, the currents are considered unsafe for casual swimming and lifeguard coverage is limited, so treat it as a place to walk, watch, and eat rather than a beach day. It's genuinely crowded, drawing around 30,000 visitors on weekdays and up to 50,000 on weekends, and evenings are when it comes alive: vendors, kite flyers, families, and a steady stream of street food along the promenade. Early morning is the calmer alternative if you'd rather see it without the crowds.

A short ride inland, Kapaleeshwarar Temple in Mylapore is one of Chennai's most significant Shiva temples, built in the 7th century, destroyed by the Portuguese in the mid-16th century, and rebuilt shortly after by the Vijayanagara kings. Its Dravidian-style architecture centres on two gopurams (gateway towers), the eastern one rising 120 feet, considerably taller than the western entrance. It's an active place of worship, not a museum piece, and it draws one of the strongest, most consistently high ratings of any site in this pack. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14638908208995687305)

Pairing the two makes for a natural half-day: the temple in the cooler morning hours, Marina Beach for the golden-hour crowd and street food as the evening builds toward sunset over the Bay of Bengal.`;

const whyItsSpecial = `These two sites, five minutes apart in feel even if not in distance, capture something Chennai does better than most Indian cities: an unbroken line between an active 7th-century temple still central to daily religious life and a modern civic beach that tens of thousands of ordinary Chennai residents use every single evening. Neither is staged for visitors. The temple functions as a temple; the beach functions as the city's actual public square. Seeing both on the same day gives you Chennai as its residents actually experience it, not a curated version of either.`;

const insiderTips = [
  "Visit Kapaleeshwarar Temple in the morning, when it's calmer and cooler, and save Marina Beach for late afternoon into sunset, when the promenade genuinely comes alive with vendors and crowds.",
  "Don't plan to swim at Marina Beach — the currents are considered unsafe for casual swimming and lifeguard presence is limited, so treat it as a walking and food destination, not a beach day.",
];

const whatToAvoid = `Don't visit the temple in shorts or sleeveless tops expecting easy entry — like most active South Indian temples, Kapaleeshwarar has a modest dress-code expectation, and non-Hindu visitors should also confirm current access to the inner sanctum before arriving, as some areas are restricted. Don't come to Marina Beach expecting a quiet, scenic coastline — it's a genuinely dense, crowded civic space most of the day, which is part of its character but not what a "beach" implies if you're picturing somewhere secluded.`;

const gettingThere = `Both sites are in central Chennai, a short auto-rickshaw or taxi ride from Chepauk and most Mylapore/Triplicane hotels; Mylapore's Luz metro station serves the temple directly.`;

const practicalInfo = {
  hours: "Marina Beach is open 24 hours, best visited early morning or from late afternoon; Kapaleeshwarar Temple is typically open roughly 5am-noon and 4pm-9pm, split around midday closure — confirm current timings before visiting.",
  bookingMethod: "Both are free, walk-in sites with no advance booking required.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Marina Beach & Kapaleeshwarar Temple",
      subtitle: "India's longest urban beach and a 7th-century Shiva temple, both a short ride from Chepauk.",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Mylapore / Marina Beach",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: Wikipedia (Marina Beach), chennai.nic.in, TravelTriangle/Holidify/Chennaites Kapaleeshwarar Temple guides. Multi-venue piece — 2 named sites, each with a real Google Places API rating lookup (Marina Beach 4.3/66,678; Kapaleeshwarar Temple 4.8/12,985), same date. No single top-level googleMapsRating set — see MULTI_VENUE_RATINGS entry.",
      sport: ["cricket"],
      moodTags: ["beach", "temple", "sightseeing"],
      interestCategories: ["culture", "nature"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "INR",
      bestSeasons: ["jan", "feb"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences).values({ experienceId: result.id, sportingEventId: EVENT_ID }).onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
