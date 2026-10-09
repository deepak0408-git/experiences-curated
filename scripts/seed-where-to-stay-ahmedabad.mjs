import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "where-to-stay-ahmedabad-" + Date.now().toString(36);

const bodyContent = `Ahmedabad splits into a genuinely useful three-way choice for this trip: stay near the Sabarmati riverfront for stadium convenience, out toward SG Highway for a more contemporary hotel scene, or in the old city if you'd rather wake up inside the heritage district you're probably visiting anyway.

Hyatt Regency Ahmedabad, on Ashram Road in Usmanpura, sits along the Sabarmati and is a genuinely convenient, well-rated base for the stadium side of the city, with a large, consistent review base behind it. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14566658954486663914)

Novotel Ahmedabad, out at Iscon Cross Roads on the Sarkhej-Gandhinagar Highway, carries the strongest rating and largest review count of the three options here, and it's a solid pick if you'd rather be near the city's more contemporary retail and dining strip than the older riverfront core. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10027319061442142519)

The House of MG is the distinctive choice: a heritage hotel inside a converted early-20th-century haveli in the old city, opposite the Sidi Saiyyed Mosque, putting you a short walk from the pols and stepwell architecture covered elsewhere in this pack. It has a smaller but genuinely strong review base, and it's the pick if you want your stay itself to be part of the old-city experience rather than just a base for reaching it. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=2366808760588866536)`;

const whyItsSpecial = `Ahmedabad is the one city in this pack where a heritage hotel is a genuinely credible option alongside the standard international chains, because the old city itself is one of the trip's real highlights, not just a side excursion. Choosing The House of MG over a generic riverside chain hotel means starting and ending each day inside the architecture you came to see, rather than commuting to it. That's a real, distinctive choice this city offers that Nagpur and Chennai don't.`;

const insiderTips = [
  "If you're planning to spend a half-day exploring the old city's pols and stepwells (see the dedicated experience in this pack), basing yourself at The House of MG cuts that commute to a walk instead of a taxi ride.",
  "Hyatt Regency's Ashram Road location keeps you closer to the Sabarmati Ashram and the stadium side of the city than either of the other two options — worth weighing if minimizing matchday travel is your main priority.",
];

const whatToAvoid = `Don't book purely on brand recognition without checking the actual distance to whichever side of the city your trip is weighted toward — Ahmedabad's old city, riverfront, and SG Highway commercial strip are genuinely separate parts of town, not walking distance from each other. Don't assume a heritage hotel like The House of MG has the same room count or amenity range as a large international chain — it's a smaller, characterful property, book well ahead if that's the pick, since availability is more limited than at a 200+ room hotel.`;

const gettingThere = `Hyatt Regency and the riverfront hotels are a reasonable ride from Motera Stadium via the metro or SG Highway; The House of MG is in the old city, further from the stadium but close to the heritage sites covered elsewhere in this pack.`;

const practicalInfo = {
  bookingMethod: "Book directly or through a major aggregator — The House of MG in particular has limited rooms and should be booked well ahead of the Test dates given its smaller heritage-property size.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay in Ahmedabad for the Test",
      subtitle: "The riverfront for stadium convenience, or a converted haveli inside the old city itself.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Ashram Road / Old City / SG Highway",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Multi-venue accommodation piece — 3 named hotels, each with a real Google Places API rating lookup (Hyatt Regency Ahmedabad 4.4/14,581; Novotel Ahmedabad 4.6/22,016; The House of MG 4.5/3,811), same date. No single top-level googleMapsRating set — see MULTI_VENUE_RATINGS entry.",
      sport: ["cricket"],
      moodTags: ["where-to-stay", "hotels", "heritage"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "INR",
      bestSeasons: ["feb", "mar"],
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
