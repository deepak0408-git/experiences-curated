import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "ffec74ad-80de-41e6-a003-919e30ce6f06"; // Perth
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "fremantle-day-trip-from-perth-" + Date.now().toString(36);

const bodyContent = `Fremantle is a 25-minute train ride from Perth city, on a line that runs every 10-15 minutes most of the day, so there's no need to plan around a timetable — just turn up at Perth Station and go. It's also a genuinely different place from Perth itself: a working port town with 19th-century limestone buildings, not a suburb dressed up for tourists — and it's a genuine side trip, not something to squeeze around the cricket. Most fans on a multi-day Test don't watch all five days from the stadium; picking one day off to spend in Fremantle instead is enough time to see the real version of it.

Fremantle Prison is the anchor. Western Australia's only UNESCO World Heritage-listed site, built by convict labour starting in 1855 and used as a working prison until 1991, it's the most complete convict-era site in the country and the tours make that history concrete rather than just old — you walk actual cell blocks, see the gallows, and hear specific stories the free Gatehouse and museum sections don't cover. The standard Convict Prison Tour runs about an hour and covers the main cell blocks; the Torchlight Tour, run in the evening, gets into the prison's darker history in a way daylight tours don't attempt. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=757117554126056474&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Fremantle Markets, a Federation Romanesque brick-and-limestone hall on South Terrace dating to 1897, is the other fixed point — but only on Friday, Saturday, Sunday, and public holiday Mondays, which matters for anyone planning around the Test's Wednesday-to-Sunday span. Inside, it's fresh produce, local makers, and a genuinely old building doing the job it was built for rather than a rebranded shed. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=13328626842243273876&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Little Creatures Brewing sits on the harbour a short walk from the town centre, in a converted boatshed and crocodile farm, and it's worth the walk even if you're not there for the beer — the building itself, with its open warehouse feel and water views, is part of why it's one of the most visited breweries in the country. Brewery tours run several times daily and include a tasting; even without booking one, the public bar and restaurant are open to walk-ins. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=1864054459948406266&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

A loop that works: markets in the morning (if your day falls on a Friday-Monday), Fremantle Prison over lunch, then Little Creatures for the afternoon before the train back. December is Fremantle's hottest, driest stretch of the year, and the town has almost no shade cover between the station and the harbour — plan around the middle of the day if you're prone to overheating, and carry water regardless.`;

const whyItsSpecial = `Perth's own hottest, driest weather on this whole tour makes Fremantle the better day trip of the two Western Australian legs, not despite the heat but because of how it's built around it — a port town with wide verandahs, harbour breeze, and a beer garden at the end of it rather than an inland walking circuit with no relief. What makes it worth the train fare specifically is the prison. Most cities selling a "historic quarter" day trip are selling atmosphere; Fremantle Prison is the real, complete, UNESCO-listed thing, still standing because it worked as a prison until 1991, not because someone preserved it as a museum piece decades after the fact. That's a rare kind of authenticity, and the surrounding town, markets and brewery included, earns its reputation by actually using its heritage buildings rather than just photographing them.`;

const insiderTips = [
  "Fremantle Markets only open Friday through Sunday plus public holiday Mondays — check which day of the Test you're planning to spend away from the ground before building your loop around them.",
  "The Torchlight Tour at Fremantle Prison runs in the evening and covers different, darker material than the standard daytime Convict Prison Tour — worth doing if you're staying in Fremantle or Perth overnight rather than day-tripping back immediately.",
];

const whatToAvoid = "Don't try to fit both the standard Convict Prison Tour and the Tunnels Tour into a single quick visit — the Tunnels Tour alone runs long, needs advance booking, and has a minimum age of 12, so it doesn't suit a casual add-on to a half-day itinerary. Don't assume you can buy same-day Prison tour tickets on arrival for every tour type — online bookings for the Torchlight and Tunnels tours close at 3pm the day before, so those two specifically need planning ahead even if the standard day tours are more flexible.";

const practicalInfo = {
  hours: "Fremantle Prison: Gatehouse/museum free daily; guided tours run at set times, check fremantleprison.com.au for the day's schedule. Fremantle Markets: Fri-Sun + public holiday Mondays, Yard 8am-6pm, Hall 9am-6pm. Little Creatures: open daily, brewery tours run at set times (11am, 1pm, 3pm most days).",
  costRange: "Fremantle Prison guided tours AU$25-30 adult (Tunnels Tour AU$70, 12+); Fremantle Markets free entry; Little Creatures brewery tour AU$35pp including tasting, or free to browse the public bar",
  bookingMethod: "Book Fremantle Prison tours at fremantleprison.com.au — Torchlight and Tunnels tours must be booked online by 3pm the day before, standard day tours have some walk-up availability. Little Creatures brewery tours book at littlecreatures.com.au. Markets are walk-in, no booking needed.",
  howToBook: "",
  website: "https://fremantleprison.com.au, https://fremantlemarkets.com.au, https://www.littlecreatures.com.au/locations/fremantle/",
  reservationsRequired: false,
};

const gettingThere = "Trains run from Perth Station to Fremantle Station roughly every 10-15 minutes, taking about 25 minutes, on the Fremantle line. Fremantle Prison, the Markets, and Little Creatures are all within a 10-20 minute walk of the station, roughly in a line toward the harbour.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Fremantle — A Day Trip from Perth",
      subtitle: "A UNESCO prison, century-old markets, and a harbourside brewery, 25 minutes by train",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Fremantle",
      address: null,
      heroImageUrl: null,
      heroImageAlt: null,
      heroImageCredit: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: fremantleprison.com.au (tour prices, booking cutoffs, UNESCO/convict-history facts), transperth.wa.gov.au and lovetravellingblog.com (train frequency/duration Perth-Fremantle), fremantlemarkets.com.au and inherit.dplh.wa.gov.au (Markets hours, 1897 heritage building history), littlecreatures.com.au and visitfremantle.com.au (brewery tour times/price). Google Places API lookups: Fremantle Prison (4.7/4,206), Fremantle Markets (4.4/17,625), Little Creatures Brewing (4.4/5,252), all captured 16 Aug 2026 — real, well-attested ratings. Multi-venue experience — no single googleMapsRating on this row, live per-venue rating links written inline in bodyContent per skill §2c.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["heritage", "relaxed", "coastal"],
      interestCategories: ["culture", "history", "food_drink"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["dec"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 15 })
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
