import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "gir-national-park-" + Date.now().toString(36);

const bodyContent = `Gir National Park is the only place on Earth where Asiatic lions still live in the wild, a genuinely unique wildlife claim rather than marketing language. It's about 360km from Ahmedabad, roughly 7-8 hours by road, which puts it firmly out of day-trip range and into proper 2-day territory: drive down and settle in on day one, safari at dawn on day two, and either drive back that evening or add a third day if your schedule allows.

Only jeep safaris operate here, there's no canter or elephant safari option, and the park is divided into zones, some core lion territory, others buffer zones, that you don't get to choose yourself. The forest department assigns your zone automatically when you book. Permits open exactly 90 days ahead and sell out fast during December and January, so this needs booking the moment your Ahmedabad Test dates are confirmed, not closer to the trip.

The genuinely good news for a late February/early March visit: this actually sits inside one of the two best windows for lion sightings, the dry season from December through mid-February draws lions to shrinking waterholes, and March through May keeps sightings strong as the dry conditions continue, with early morning safaris showing the highest activity. A trip timed around the Ahmedabad Test lands close to peak conditions rather than off-season.

Morning safaris run 6:15-6:45am to 9:15-9:45am depending on the season, and pricing for Indian residents runs roughly ₹5,500-8,000 inclusive of permit, jeep, and guide, with foreign nationals paying considerably more, around ₹15,500-17,500. Each permit covers up to six people, though the vehicle and guide are booked separately on top of that.`;

const whyItsSpecial = `A five-Test tour that ends in Ahmedabad gives you a genuine excuse to see something the rest of the world can't see anywhere else: a wild lion that isn't African. That's not a small distinction. Gir is the sole surviving wild population of the Asiatic lion, a subspecies that once ranged across the Middle East and South Asia and now exists nowhere but here. Ending a cricket trip with two days chasing that specific, singular wildlife experience is a genuinely different kind of souvenir than another stadium or another temple, no matter how good those are individually.`;

const insiderTips = [
  "Book your safari permit the moment your Ahmedabad travel dates are locked in — the 90-day booking window fills fast for December and January, and late February/March slots also move quickly given how good sightings are in this period.",
  "Request the earliest possible morning safari slot rather than an afternoon one — lion activity is consistently reported as highest in the early morning hours, particularly as the dry season progresses toward March.",
];

const whatToAvoid = `Don't plan this as a rushed round trip squeezed around Test match days — between the 7-8 hour drive each way and the safari itself, treat it as a genuine 2-day (minimum) commitment separate from your cricket schedule, not something to combine with a matchday. Don't assume you can choose your safari zone — the forest department assigns it automatically, so temper expectations if you'd specifically hoped for one zone's territory over another; sighting quality varies less by zone than by timing and season.`;

const gettingThere = `About 360km/7-8 hours by road from Ahmedabad. Most visitors hire a car and driver for the full round trip rather than self-driving, given the distance and the pre-dawn safari start times.`;

const practicalInfo = {
  hours: "Morning safaris: 6:15-6:45am to 9:15-9:45am (season-dependent); evening safaris: 3:00-3:30pm to 6:00-6:30pm. Park generally open October to mid-June, closed during monsoon.",
  costRange: "₹5,500-8,000 for Indian residents (permit, gypsy, guide inclusive); ₹15,500-17,500 for foreign nationals/NRIs; additional camera fees (₹200 Indians / ₹1,400 foreigners) and guide charges (₹400-700)",
  bookingMethod: "Book online through the Gujarat Forest Department's official safari booking portal exactly 90 days ahead of your visit date — popular dates sell out fast.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Gir National Park — 2-Day Asiatic Lion Safari from Ahmedabad",
      subtitle: "The only place on Earth with wild Asiatic lions, and late Feb-March is close to peak sighting season.",
      slug,
      experienceType: "multi_day",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Sasan Gir",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: GirNationalPark.in/JungleSafariTourism booking guides, FrenzyHolidays/ChampionTraveler best-time guides. Google Places API lookup confirmed rating/review count same date (4.6/7,830).",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 7830,
      googleMapsUrl: "https://maps.google.com/?cid=9303280088188057888",
      sport: ["cricket"],
      moodTags: ["wildlife", "safari", "multi-day"],
      interestCategories: ["nature"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "splurge",
      budgetCurrency: "INR",
      bestSeasons: ["feb", "mar"],
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
