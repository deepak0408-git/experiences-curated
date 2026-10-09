import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9"; // US Open 2026
const slug = "atlantic-city-day-trip-" + Date.now().toString(36);

const bodyContent = `Atlantic City sits about 130 miles south of Flushing, and the honest math matters before you commit a day to it: NJ Transit's express Route 319 runs direct from Port Authority Bus Terminal, with one stop each at Newark Penn Station and Journal Square, taking roughly 2.5 hours each way. Round-trip, that's five hours on a bus — which leaves a real day trip with something closer to six or seven hours on the ground, not a full day. Worth knowing before you book it as a half-measure between Open sessions.

What you get for that five hours of travel is the thing most visitors actually come for: the Boardwalk itself, 4.5 miles of it, built in 1870 as the first boardwalk in America and still completely free to walk end to end. It runs past nine operating casinos, salt-water taffy shops that have been selling the same product since the 1880s, and a beach that's free and open to the public year-round — genuinely unusual for a city this built-up, and the thing that separates Atlantic City from a pure casino town.

Steel Pier anchors the boardwalk's entertainment end — an amusement pier with 20-plus rides, including The Wheel, a 227-foot observation wheel with climate-controlled gondolas that give you the clearest ocean view on the whole strip. Entry to the pier itself is free; you pay per ride or buy a day pass once you're there, and hours shift by season and day of week, so check steelpier.com before you go rather than assume it matches a summer schedule in September. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=6350702435765894223)

A few blocks off the boardwalk, the Absecon Lighthouse is the taller, quieter alternative — New Jersey's tallest lighthouse, built in 1857, with 228 spiral steps up to a 360-degree view of the city and the Atlantic. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=9894674730341596305) It's a genuinely different pace from the boardwalk's noise, and most visitors skip it entirely, which is part of the appeal if you want twenty minutes of quiet.

The nine casinos — Hard Rock, Ocean, Borgata, Caesars, Tropicana, Bally's, Resorts, Harrah's, and Golden Nugget — are the other half of the trip, and they're open 24 hours regardless of what day you arrive. You need to be 21 to get onto any gaming floor, with ID checks genuinely enforced, not a formality; the rest of each casino (restaurants, shops, the Ocean's boardwalk-facing pool deck) is open to everyone.

The real trick to the economics here: most casino-run bus lines, not just NJ Transit, bundle a cash or slot-play voucher into the ticket price specifically to get you onto their floor once you arrive — real offers from third-party operators run $25-30 in free play against a $40-50 round-trip fare, which can functionally cover most of the day's travel cost if you're going to spend an hour at a slot machine anyway. NJ Transit's own excursion round-trip runs $49.75 and stays valid for 10 days, which also means you don't have to come back the same day if your Open schedule allows a longer trip.`;

const whyItsSpecial = `Atlantic City doesn't pretend to be New York's genteel neighbor, and that's exactly the point of sending a day trip here instead of somewhere prettier. It's loud, it's unapologetic about running on gambling money, and the Boardwalk has been doing the same job — give people somewhere to walk, eat taffy, and spend a few dollars by the ocean — since 1870, longer than almost anything else on the East Coast still operating in its original form. A week and a half of tennis in Queens is its own kind of intense, controlled environment: reserved seats, ballot queues, a schedule you're building your whole trip around. Atlantic City is the opposite register entirely, somewhere you can lose track of the time of day on purpose. The five-hour round trip is a real cost, and this isn't the pick for someone chasing maximum efficiency. It's the pick for someone who wants one day of their US Open trip to feel like it isn't about the US Open at all.`;

const insiderTips = [
  "A casino bus ticket's bundled slot-play credit (typically $25-30) often costs less net than NJ Transit's own fare once you redeem it on the floor — compare the total cost of a casino-operator bus against NJ Transit's $49.75 excursion fare before booking, not just the sticker price.",
  "NJ Transit's excursion round-trip ticket stays valid for 10 days, not just the day of travel — if your US Open trip runs long, you can ride down on an early, less crowded bus and return on a later date instead of committing to a strict same-day round trip.",
];

const whatToAvoid = `Don't assume Steel Pier's rides run on a full summer schedule in early September — hours shift by day of week and the season is winding down from peak by the Open's dates, so check steelpier.com directly before building your afternoon around it. Don't try to do Atlantic City as an add-on to an Open match day — the five-hour round trip alone eats more than half a typical grounds day, and arriving tired from an early-morning session undercuts the point of the trip. Treat it as its own dedicated rest day instead.`;

const gettingThere = `NJ Transit Route 319 express bus from Port Authority Bus Terminal, direct to Atlantic City, roughly 2.5 hours, one stop each at Newark Penn Station and Journal Square Transportation Center. Buy tickets via the NJ Transit app before boarding — drivers cannot issue round-trip excursion tickets on board.`;

const practicalInfo = {
  hours: "Boardwalk and beach open 24/7; Steel Pier and casinos vary by season — confirm Steel Pier hours before visiting; casinos run 24 hours",
  costRange: "Boardwalk and beach free; Steel Pier rides individually priced; Absecon Lighthouse $7 adult admission; casino floor free (21+ with ID)",
  bookingMethod: "NJ Transit Route 319 runs hourly from Port Authority; buy on the NJ Transit app before boarding. Excursion round-trip $49.75, valid 10 days. Several third-party casino bus operators (Martz, Starr Tours, OurBus) run competing routes from NYC with $25-30 in bundled slot-play credit — compare current offers before booking either way.",
  website: "https://www.visitatlanticcity.com, https://steelpier.com, https://www.abseconlighthouse.org",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Atlantic City: A Full Day Away from the Tennis",
      subtitle: "A 4.5-mile boardwalk, nine casinos, and a free ride home paid for by a $25 slot voucher",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Atlantic City, NJ",
      address: "Atlantic City Boardwalk, Atlantic City, NJ 08401",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from NJ Transit official site, Steel Pier official site, Absecon Lighthouse official site, Visit Atlantic City, legalgamblingages.com. Google Places API lookups for Steel Pier and Absecon Lighthouse ratings, 5 Oct 2026.",
      googleMapsReviewCount: null,
      sport: ["tennis"],
      moodTags: ["nightlife", "unwind", "quirky"],
      interestCategories: ["day-trip", "entertainment"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["aug", "sep"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-10-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
