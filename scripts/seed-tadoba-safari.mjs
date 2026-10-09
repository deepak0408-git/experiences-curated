import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "tadoba-tiger-safari-" + Date.now().toString(36);

const bodyContent = `Tadoba-Andhari Tiger Reserve is the honest reason to build a rest day into your Nagpur stop. It's Maharashtra's oldest and largest national park, and it has one of the highest tiger-sighting rates of any reserve in India, which matters because plenty of tiger reserves sell the dream and deliver a long, sighting-free drive instead.

The nearest gate, Kolara, is about 115-120km from Nagpur, roughly 2-2.5 hours by road, and it's the zone most naturally reached from the city and its airport. Other gates (Moharli, Navegaon, Pangdi-Zari) sit further out, up to 190km and 4 hours away, and cover different forest terrain and tiger territories, but for a trip built around a Nagpur Test match, Kolara is the sensible choice.

Calling this a "day safari" is accurate but worth being honest about: with roughly 2-2.5 hours each way plus a 3-4 hour safari slot inside the park, you're looking at a genuinely long day, easily 8-10 hours door to door. It's entirely doable if you leave before dawn, and plenty of visitors do exactly that, but if your Nagpur schedule already has you at the ground some of the same days, an overnight near the park on a rest day between sessions is the more comfortable version of this trip, not a luxury.

One thing to plan around early: safari permits for the core zones need to be booked online, and the booking window runs from 90 to 120 days ahead for the best slots, dropping to a shorter 4-45 day window at a higher price closer to the date. Given the Nagpur Test lands in late January, well inside tiger-viewing season but before peak activity picks up from February onward, book the permit as soon as your travel dates are fixed rather than treating it as something to sort out once you land.`;

const whyItsSpecial = `A five-Test tour puts you in Nagpur for the better part of a week, and there's genuinely little else in the city itself once you've seen the ground. Tadoba solves that problem properly rather than just filling time, it's a real, high-percentage chance at seeing a wild tiger, not a token wildlife stop tacked onto a cricket trip. What makes it worth the long day specifically is the sighting rate: this isn't one of the reserves where you spend four hours in a jeep and see deer. It's one of the more reliable big-cat parks in the country, and for most travellers on this tour, it's the only wildlife encounter the whole trip offers.`;

const insiderTips = [
  "Book your safari permit the moment your Nagpur travel dates are confirmed — the best-priced booking window opens 90-120 days ahead, and waiting until you're closer to the date pushes you into a shorter, more expensive booking tier.",
  "Kolara gate is the practical choice for a Nagpur-based trip (about 2-2.5 hours each way) — Moharli and the other gates cover different tiger territories but add up to two hours of extra driving each way for a day trip.",
];

const whatToAvoid = `Don't book this as a same-day round trip if you're also due at the stadium that evening or the next morning — an 8-10 hour day including a pre-dawn start leaves very little margin if the return drive runs long. Don't expect peak tiger activity in late January the way you would in the February-May window; sightings are still genuinely good, but the reserve's own busiest, most active season starts about a month after the Nagpur Test wraps up.`;

const gettingThere = `About 115-120km from Nagpur to the Kolara gate, roughly 2-2.5 hours by road. Most visitors hire a car and driver for the full day rather than self-driving, given the pre-dawn safari start times.`;

const practicalInfo = {
  hours: "Morning safari slots typically start at dawn; afternoon slots run into early evening — exact gate times shift slightly by season",
  costRange: "Core-zone safari permits run roughly ₹4,575-5,575 on the standard 4-45 day booking window (weekday/weekend), or ₹7,575-11,575 if booked 60-120 days ahead; buffer-zone permits are around ₹4,075",
  bookingMethod: "Book online in advance through Maharashtra Forest Department's official safari booking portal or a registered tour operator — core-zone slots for popular dates fill up inside the 90-120 day window.",
  website: "https://maharashtratourism.gov.in/wildlife/tadoba-andhari-tiger-reserve/",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Tadoba-Andhari Tiger Reserve — Day Safari from Nagpur",
      subtitle: "A 2-2.5 hour drive to one of India's most reliable tiger reserves, if you're honest about the day it costs.",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Kolara Gate",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: Maharashtra Tourism official page, HolidaysDNA/BigCatsIndia/CulturalSafariTours booking guides, TadobaNationalPark.in. Google Places API lookup confirmed rating/review count same date (primary listing, 4.5/4,571 reviews — other returned entries had negligible review counts and were not used).",
      googleMapsRating: "4.5",
      googleMapsReviewCount: 4571,
      googleMapsUrl: "https://maps.google.com/?cid=4722919303931757777",
      sport: ["cricket"],
      moodTags: ["wildlife", "rest-day", "safari"],
      interestCategories: ["nature"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "splurge",
      budgetCurrency: "INR",
      bestSeasons: ["jan"],
      advanceBookingRequired: true,
      advanceBookingDays: 90,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences).values({ experienceId: result.id, sportingEventId: EVENT_ID }).onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
