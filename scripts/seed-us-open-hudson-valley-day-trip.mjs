import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9"; // US Open 2026
const slug = "hudson-valley-day-trip-" + Date.now().toString(36);

const bodyContent = `Grand Central to Beacon runs direct on the Metro-North Hudson Line, no transfer, about 75-90 minutes each way depending on which train you catch — a genuinely manageable round trip that leaves a real five or six hours on the ground, more forgiving than a bus trip south. One-way fares start around $17 off-peak; check the exact peak/off-peak split on mta.info before you book, since Metro-North prices by time of day, not a flat rate.

The anchor here is Dia:Beacon, a contemporary art museum built inside a former Nabisco box-printing factory on the river — 240,000 square feet of unbroken daylight-lit gallery space, which is as much the point as anything hanging inside it. It's an 8-10 minute walk from the train station, no car or taxi needed, and a Beacon Free Loop bus (Monday-Saturday) covers the same route plus Main Street and Mount Beacon if you'd rather not walk both ways. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10299752119681062142) Advance timed tickets are required online — nothing is sold at the door, so book before you leave the city, and the museum closes Tuesday through Thursday, so this only works as a Friday-through-Monday trip.

Main Street itself is the other half of the day, a genuine walkable strip of more than 80 independent shops and restaurants rather than a tourist-facing recreation of one — the Beacon Cheese Shop, the record-shop-and-speakeasy combination at The Vinyl Room, Alps Sweet Shop making the same chocolate it's made since 1922. It's a real town that happens to have become an art-world satellite of the city, not the other way around, and an hour spent just walking it after the museum closes is a legitimate way to spend the back half of the day.

For a longer or more active day, Storm King Art Center sits on the opposite side of the river near Cornwall — 500 acres of outdoor sculpture and earthworks, genuinely one of the best collections of its kind anywhere in the country, with three hours a realistic minimum to see it properly. Getting there without a car is the real catch: Storm King has run a free weekend shuttle from the Beacon station in past summers, but confirm directly on stormking.org/visit before counting on it for your specific dates, since seasonal shuttle service isn't something to assume holds. A taxi or rideshare from Beacon station runs 20-30 minutes each way if the shuttle isn't running.

West Point is visible from the train itself, just across the river near the Garrison stop, and genuinely worth knowing about even if you don't stop — the US Military Academy runs public tours booked online in advance, with a real security step most visitors don't expect: tour reservations require submitting ID information for a background check, and same-day slots close an hour before the tour starts. It's not a spontaneous add-on to a Beacon day; book it as its own separate trip if West Point itself, not just the view, is the draw.`;

const whyItsSpecial = `New York City gives you museums built as museums — purpose-built, white-walled, designed for the art from day one. Dia:Beacon is the opposite kind of building entirely: a Nabisco factory that printed cookie boxes until the 1990s, repurposed with its original industrial skylights still doing the actual job of lighting the art, 240,000 square feet with nothing cramped about it. That scale changes how the work reads. A Richard Serra sculpture that would dominate a normal gallery room just sits there, one of several, with room to actually walk around it. The trip works because Beacon itself hasn't been hollowed out to serve the museum — it's a real town with a real Main Street that existed before the art crowd showed up and would keep existing without them. A day trip built around one great building and one walkable street beats a day trying to cram in three different towns. Pick the one thing worth the 90-minute train ride, and let the rest of the day be unplanned.`;

const insiderTips = [
  "Dia:Beacon is closed Tuesday through Thursday — build this trip around a Friday, Saturday, Sunday, or Monday during your Open visit, or the museum half of the day won't happen at all.",
  "West Point's public tour requires submitting ID for a background check during booking, and same-day reservations close an hour before the tour time — if West Point itself (not just the train-window view) is the goal, book it as its own trip days ahead, not a same-day add-on to Beacon.",
];

const whatToAvoid = `Don't assume Storm King's free shuttle from the Beacon train station is running on your specific dates — it's historically a summer-weekend service, not a year-round guarantee, and the Open's late-August/September dates sit right at the edge of that window. Don't buy a same-day Dia:Beacon ticket expecting to walk up — there's no onsite sales, only advance online timed-entry, and arriving without one means a wasted walk from the station.`;

const gettingThere = `Metro-North Hudson Line direct from Grand Central Terminal to Beacon, roughly 75-90 minutes, hourly service, no transfer required.`;

const practicalInfo = {
  hours: "Dia:Beacon open Friday-Monday, 10am-5pm (closed Tue-Thu); Main Street shops vary by business, most open daily",
  costRange: "Dia:Beacon general admission approx. $20 adult (confirm current price on diaart.org); Metro-North one-way from $17 off-peak; Storm King $25-28 adult depending on day",
  bookingMethod: "Book Metro-North tickets via the MTA app or at Grand Central before boarding. Dia:Beacon requires advance timed-entry tickets online at diaart.org — no in-person sales, and the museum is closed Tuesday-Thursday, so plan around a Friday-Monday visit. If adding Storm King, confirm the current shuttle schedule on stormking.org/visit before relying on it rather than a taxi.",
  website: "https://www.diaart.org, https://www.stormking.org, https://www.westpointtours.com",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Hudson Valley: Beacon, Art, and the River Towns",
      subtitle: "A 90-minute train, a converted Nabisco factory full of art, and a walkable Main Street",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Beacon, NY (Hudson Valley)",
      address: "Dia:Beacon, 3 Beekman Street, Beacon, NY 12508",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from Dia:Beacon official site, MTA Metro-North Hudson Line schedule, Storm King Art Center official site, West Point Tours FAQs. Google Places API lookup for Dia:Beacon rating, 5 Oct 2026.",
      googleMapsReviewCount: null,
      sport: ["tennis"],
      moodTags: ["culture", "unwind", "scenic"],
      interestCategories: ["day-trip", "art-and-culture"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["aug", "sep"],
      advanceBookingRequired: true,
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
