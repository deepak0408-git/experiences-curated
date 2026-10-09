import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "chennai-filter-coffee-dosa-" + Date.now().toString(36);

const bodyContent = `Chennai runs on filter coffee, brewed slowly through a two-chamber steel filter and served with milk in a tumbler-and-dabara set, and on a small handful of dishes, idli, dosa, and vada, done at a level of consistency you don't find everywhere else in India.

Ratna Cafe, on Triplicane High Road, is the classic reference point. It's known for its idli-sambar and coffee served with genuinely unlimited refills, a real point of local pride rather than a marketing line, and it draws one of the largest, most consistent review bases of any traditional South Indian eatery in the city. It's a working, no-frills mess-style restaurant, not a polished cafe, and that's exactly the appeal. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16484723391347348095)

Murugan Idli Shop, now a small chain but rooted in Chennai, built its name on genuinely fluffy idlis and a filter coffee served the traditional way. It's a fair comparison point to Ratna Cafe if you want to try two well-regarded versions of the same basic meal and form your own opinion on which does it better, a debate Chennai locals have happily for hours. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16122206053461308279)

Either spot works as a genuine breakfast before a day at Chepauk or a late-morning stop between sessions. The meal itself is inexpensive, fast, and about as authentically Chennai as anything you'll eat during this trip.`;

const whyItsSpecial = `Filter coffee and dosa are the kind of food that's easy to get a mediocre version of anywhere, and genuinely hard to get right, which is exactly why Chennai's reputation for it matters. These aren't tourist recreations of South Indian food, they're places locals have been eating at for decades, priced and run the way a neighbourhood breakfast spot should be. For a Test match trip built mostly around cricket and monuments, this is the one experience that's just about eating something Chennai actually does better than most of the country.`;

const insiderTips = [
  "Ask for coffee 'meter' style if you want to watch it poured tumbler-to-dabara from height — it's a real technique that cools and froths the coffee, not just theatre, and most traditional spots will do it without being asked twice.",
  "Go before 10am or you'll likely be choosing from a shorter breakfast-only menu window before the lunch service switch — idli, dosa, and vada are typically morning specialities at both of these places.",
];

const whatToAvoid = `Don't expect a sit-down, leisurely cafe experience at either spot — both are fast-turnover, functional eateries built for quick breakfast service, not a place to linger for an hour with a laptop. Don't judge Chennai filter coffee by a diluted, overly milky version served at a generic hotel breakfast buffet — the real thing at a dedicated spot like these two is a genuinely different, stronger drink.`;

const gettingThere = `Ratna Cafe is on Triplicane High Road, a short walk or auto-rickshaw ride from Chepauk; Murugan Idli Shop has multiple Chennai locations, check the nearest branch to your hotel or the stadium.`;

const practicalInfo = {
  bookingMethod: "Walk-in only — no reservations at either, expect a short wait during peak breakfast hours (8-10am).",
  costRange: "A full meal (idli/dosa plus coffee) typically runs ₹100-200 per person at either spot",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Chennai's Filter Coffee & Dosa Trail",
      subtitle: "Unlimited idli-sambar at Ratna Cafe, or Murugan's fluffy version — Chennai's real breakfast debate.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Triplicane",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: TheQuint/LBB filter coffee roundups, Uber Chennai food guide. Multi-venue dining piece — 2 named venues, each with a real Google Places API rating lookup (Ratna Cafe 4.0/17,127; Murugan Idli Shop 4.0/15,090), same date. No single top-level googleMapsRating set — see MULTI_VENUE_RATINGS entry.",
      sport: ["cricket"],
      moodTags: ["breakfast", "local-food", "coffee"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
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
