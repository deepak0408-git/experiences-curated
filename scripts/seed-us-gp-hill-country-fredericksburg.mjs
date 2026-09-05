import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin
const EVENT_SLUG = "united-states-grand-prix";
const slug = "us-gp-hill-country-fredericksburg-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Circuit of the Americas sits inside Austin itself — a 15-20 minute drive from downtown, not a satellite venue requiring its own day trip the way some F1 host cities work. The genuine "extend your trip" excursion here is Texas Hill Country, specifically Fredericksburg, about 90 minutes west of Austin via US-290.

Fredericksburg itself has a real, specific founding story: German settler John O. Meusebach led just over a hundred colonists into a valley between two creeks in 1846, naming it Friedrichsburg to honor Prince Frederick of Prussia — later anglicized to Fredericksburg. That German heritage is still genuinely visible, not just marketed — traditional architecture, authentic German restaurants, an annual Oktoberfest, and Main Street shops carrying real German imports like hand-painted beer steins and nutcrackers. Main Street itself runs a deliberate no-chains policy: every shop in the National Historic District is locally owned, over 100 boutiques, galleries, and specialty stores including Fischer & Wieser Specialty Foods, known regionally for its jams and sauces.

The wine is the other half of the trip, and it's genuinely serious, not a novelty add-on. US-290 between Fredericksburg and Johnson City holds the highest concentration of wineries anywhere in Texas — more than 25 on that single stretch. William Chris Vineyards, in nearby Hye, is widely regarded as one of the state's most terroir-driven producers, known specifically for dry reds. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=8340357450874169407&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). Becker Vineyards, on Becker Farms Road just outside Fredericksburg proper, is one of the region's most award-decorated producers and a genuine anchor stop for most Hill Country wine trips. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=940047473408781090&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA).

A realistic day trip covers 3-5 wineries, lunch, and a walk down Main Street, and gets you back to Austin by evening — genuinely doable as a single day between race sessions if your schedule has a gap, or as the centerpiece of an extra day tacked onto either end of the race weekend.`;

const whyItsSpecial = `Since COTA sits inside Austin itself, this pack doesn't need a Spa-to-Brussels or Silverstone-to-London style satellite-city day trip — but that doesn't mean there's nothing worth leaving the city for. Fredericksburg and the Hill Country wine trail give F1 visitors something genuinely different from anything Austin itself offers: real 19th-century German settlement history, a specific and serious wine industry most visitors don't associate with Texas at all, and a slower, rural counterpoint to a weekend otherwise built around speed and crowds. It's the trip that proves Texas Hill Country deserves its own reputation, independent of whatever brought you to Austin in the first place.`;

const insiderTips = [
  "If wine tasting is the priority and driving between multiple wineries yourself isn't appealing, a wine shuttle or private tour operator (several run specifically along Highway 290) removes the driving-and-tasting conflict entirely — worth the cost if your group plans to visit more than 2-3 wineries.",
  "Main Street's strict no-chain-store policy means every shop here is genuinely local — worth browsing with real intent rather than rushing through, since nothing you'll find is a franchise you could see anywhere else.",
];

const whatToAvoid = `Don't plan to drive yourself between more than 2-3 wineries in one day if you intend to actually taste at each — Texas doesn't have a public transit option along the wine trail, and self-driving limits how much you can genuinely enjoy versus a shuttle or tour. Don't treat this as a rushed half-day trip squeezed between morning and afternoon race sessions — the 90-minute each-way drive alone eats 3 hours of a day, so this only really works as either a full dedicated day or an extra day added before/after the race weekend itself.`;

const gettingThere = `90 minutes from Austin via US-290 West. A rental car or private driver is the practical way to visit multiple wineries in one day, since there's no public transit connecting them.`;

const practicalInfo = {
  hours: "Most wineries and Main Street shops open late morning through early evening; specific hours vary by venue",
  costRange: "Wine tastings typically run US$15-25 per person per winery; Main Street browsing is free; lunch and wine purchases add to the day's total",
  bookingMethod: "No booking required for Main Street shopping. Most wineries accept walk-ins for tastings, though calling ahead on a weekend is sensible, especially if visiting as a larger group.",
  website: "https://www.visitfredericksburgtx.com, https://wineroad290.com",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Texas Hill Country & Fredericksburg — Wine Country Day Trip",
      subtitle: "25+ wineries on one highway, a German-founded town, and a genuine reason to leave Austin for a day",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Fredericksburg",
      address: "Fredericksburg, TX",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: visitfredericksburgtx.com German Heritage page (Meusebach founding story, 1846, Prince Frederick of Prussia naming, Main Street no-chains policy), texashighways.com + wineroad290.com (25+ wineries on US-290, William Chris Vineyards terroir reputation, Becker Vineyards award history). MULTI-VENUE (William Chris Vineyards, Becker Vineyards individually named) — requires MULTI_VENUE_RATINGS['us-gp-hill-country-fredericksburg'] entry with venueCount: 2, added in this same session. Corrected a Google Places disambiguation issue on Becker Vineyards — initial query returned 2-3 similarly-named listings at different addresses (464 Becker Farms Rd vs 307 US-87 vs a Main Street tasting annex); verified via a follow-up address-specific query that 464 Becker Farms Rd (4.6/813) is the actual main vineyard/tasting room, not a duplicate or secondary listing. William Chris Vineyards real Google Places lookup: 4.8/2,750. No Concierge trigger, no affiliate opportunity identified. Verified 5 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["wine", "history", "day-trip"],
      interestCategories: ["culture", "food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
    .onConflictDoNothing();

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
