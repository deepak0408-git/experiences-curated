import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "where-to-stay-chennai-" + Date.now().toString(36);

const bodyContent = `Chennai's advantage over Nagpur is that "close to the stadium" and "a good place to actually stay" aren't in tension the way they are at Jamtha. Mylapore, Alwarpet, and Triplicane are all genuine neighbourhoods with their own food scenes and temples, and all sit within a short, easy ride of Chepauk.

The Savera, in Mylapore, is the pick if you want to be inside one of Chennai's most characterful old neighbourhoods, walking distance from the Kapaleeshwarar Temple and Mylapore's dense cluster of filter-coffee institutions, while still being a short, direct ride from the ground. It's a long-established, large hotel with a genuinely strong, well-attested rating from a large review base. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10344314026042806147)

The Raintree, on St Mary's Road in Alwarpet, sits a little further from the temple district but closer to Chennai's contemporary restaurant scene, and it draws a strong rating in its own right. Alwarpet and Mylapore are effectively neighbouring areas, so the practical difference for a stadium trip is small; the real difference is which version of Chennai you'd rather come back to each evening. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16922013127636600180)

If you'd rather base yourself somewhere with more shopping and a wider spread of restaurants within walking distance, Grand Chennai by GRT in T. Nagar is further from the ground than the other two but sits in Chennai's busiest commercial district, with the city's biggest concentration of shops and eateries on your doorstep. It carries the strongest review base of the three options here. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=15677491373146475541)`;

const whyItsSpecial = `Unlike Nagpur, where the honest advice is to accept a commute either way, Chennai genuinely rewards picking a neighbourhood you'd want to spend evenings in, because several of them are both close to Chepauk and worth exploring in their own right. Mylapore in particular gives you a working, centuries-old temple neighbourhood alongside your Test match, not just a hotel bed near a ground. That's a real point of difference in this pack, not every host city in this series offers a stay that doubles as its own cultural experience.`;

const insiderTips = [
  "Mylapore and Alwarpet are close enough to each other that choosing between The Savera and The Raintree is really a choice of neighbourhood character, not stadium convenience — both put you at a similar distance from Chepauk.",
  "If Test match tickets have you at the ground most of the day, T. Nagar's extra distance matters less than it sounds — you'll mostly be exploring your neighbourhood in the evening, when T. Nagar's shopping and food scene has more to offer than a quieter residential area.",
];

const whatToAvoid = `Don't assume every hotel advertised as "near Marina Beach" is actually close to Chepauk specifically — Marina Beach itself runs for several kilometres, and a hotel at the far end of it can be a considerably longer ride to the stadium than one in Mylapore or Triplicane proper. Don't book a budget Triplicane guesthouse purely for proximity without checking recent reviews carefully — the area has a wide spread of quality at the lower price tiers, and proximity alone doesn't guarantee a comfortable multi-night stay.`;

const gettingThere = `Mylapore, Alwarpet, and Triplicane are all within a 10-20 minute auto-rickshaw or taxi ride of Chepauk; T. Nagar is a somewhat longer ride, roughly 20-30 minutes depending on traffic.`;

const practicalInfo = {
  bookingMethod: "Book directly or through a major aggregator (Booking.com, MakeMyTrip) — expect rates to rise as the Test match date approaches, particularly in Mylapore and Alwarpet given their proximity to the ground.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay in Chennai for the Test",
      subtitle: "Mylapore's temples, Alwarpet's restaurants, or T. Nagar's shopping — all a short ride from Chepauk.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Mylapore / Alwarpet / T. Nagar",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Multi-venue accommodation piece — 3 named hotels, each with a real Google Places API rating lookup (The Savera, Mylapore, 4.2/17,784; The Raintree, St Mary's Road, 4.4/6,188; Grand Chennai by GRT, T. Nagar, 4.5/17,849), same date. No single top-level googleMapsRating set — see MULTI_VENUE_RATINGS entry.",
      sport: ["cricket"],
      moodTags: ["where-to-stay", "hotels"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "INR",
      bestSeasons: ["jan", "feb"],
      advanceBookingRequired: true,
      availability: "event_only",
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
