import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "ahmedabad-thali-manek-chowk-" + Date.now().toString(36);

const bodyContent = `A proper Gujarati thali is a genuinely different eating experience from most Indian regional cuisine: a rotating spread of small dishes, sweet, savoury, and spiced all served together, refilled continuously rather than plated once, built around the idea that a meal should cover every flavour note at once rather than build toward one.

Agashiye, the rooftop restaurant inside The House of MG heritage hotel in the old city, is the polished, sit-down version done properly. The menu rotates daily rather than staying fixed, running through dishes like dhokla, handvo, undhiyu, and kadhi depending on what's being served that day, and it draws a strong, large-sample rating befitting its reputation as one of the city's defining thali experiences. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=9843088710605933462)

For the after-dark version of Ahmedabad's food identity, Manek Chowk transforms from a daytime jewellery market into one of India's most legendary street food destinations once the sun goes down, typically from around 8pm onward. Crispy fafda, bhaji pav, Gujarati-style street pizza, kulfi, and masala chaas all get served from stalls packed into the same square, and it carries an enormous, consistently strong review base reflecting decades of the same reputation. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=2624470188742443591)

Between the two, you get both ends of how Gujarat actually eats: a formal, rotating thali in a heritage setting, and a loud, crowded night market built entirely around snacking your way through a dozen different stalls.`;

const whyItsSpecial = `Gujarati food has a real identity, sweeter and more varied per meal than most regional Indian cuisines, and it's poorly served by being lumped in as generic "Indian food" the way it often is outside the state. Agashiye and Manek Chowk show two genuinely different, equally legitimate versions of that identity: one formal and curated, one chaotic and street-level. Trying both in the same trip gives a more honest sense of what Gujarat actually eats than either one alone would.`;

const insiderTips = [
  "Agashiye's thali menu changes daily rather than staying fixed — if you have a preference for a specific dish, call ahead to check what's being served that day rather than assuming a set menu.",
  "Manek Chowk gets genuinely packed from around 9-10pm onward — arrive closer to 8pm when it first transforms from market to food street if you want to move through the stalls without heavy crowds.",
];

const whatToAvoid = `Don't arrive at Manek Chowk expecting the daytime jewellery market atmosphere — it's an entirely different scene after dark, and going earlier in the afternoon means missing the street food entirely. Don't treat a Gujarati thali like a fixed-price buffet you eat once through — the format is built around repeated small refills, and rushing through it in one pass misses both the pacing and much of what's on offer.`;

const gettingThere = `Agashiye is inside The House of MG on Bhadra Road, opposite the Sidi Saiyyed Mosque in the old city; Manek Chowk is a short walk away in the same old-city area.`;

const practicalInfo = {
  hours: "Agashiye serves lunch and dinner by reservation; Manek Chowk's food market runs from roughly 8pm into the late night.",
  costRange: "Agashiye's thali runs at a heritage-restaurant price point, roughly ₹800-1,200 per person; Manek Chowk street food is inexpensive, most items ₹30-150",
  bookingMethod: "Agashiye takes reservations, recommended given its reputation; Manek Chowk is walk-in only, no booking needed.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Gujarati Thali & Manek Chowk Street Food",
      subtitle: "A rotating heritage-hotel thali, then a jewellery market that becomes a food street after dark.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Old City",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: Outlook Traveller Gujarati food guide, Bino/Justdial Manek Chowk guides. Multi-venue dining piece — 2 named venues, each with a real Google Places API rating lookup (Agashiye 4.6/6,295; Manekchowk Food Market 4.4/50,942), same date. No single top-level googleMapsRating set — see MULTI_VENUE_RATINGS entry.",
      sport: ["cricket"],
      moodTags: ["local-food", "street-food", "thali"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "INR",
      bestSeasons: ["feb", "mar"],
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
