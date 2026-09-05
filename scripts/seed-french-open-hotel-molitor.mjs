import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "hotel-molitor-paris-luxury-stay";

const bodyContent = `Hotel Molitor wasn't built as a hotel. It opened in 1929 as Piscine Molitor, a public bathhouse and swimming complex designed by architect Lucien Pollet, and for the next sixty years it was where Parisians came to swim, socialize, and play golf — an Art Deco social hub as much as a pool. It closed in the late 1980s, sat empty and increasingly graffiti-covered for two decades (the abandoned pools became legendary among Paris street artists), and reopened in 2014 as a five-star MGallery hotel that kept both original pools intact rather than replacing them.

That's the detail that makes Molitor worth choosing over any other five-star option this close to Roland-Garros: a 46-metre heated outdoor pool and a 1930s indoor pool, both original to the 1929 building, both still the centerpiece of the hotel rather than an afterthought spa amenity. A 5,577-square-foot Clarins spa, fitness studios running Pilates reformer and cycling classes, a seasonal rooftop terrace open through spring, and two restaurants round out the property, but the pools are the reason people specifically seek this hotel out rather than any other MGallery property in Paris.

Rooms run compact by luxury-hotel standards, around 323 square feet, with 40-inch TVs, Nespresso machines, a free minibar, and Clarins toiletries — most looking either onto the pool or out toward the wider city. Pricing spans a genuinely wide range depending on room category: Superior rooms from roughly $494-526 a night up to King rooms at $1,190-1,625, so "luxury" here scales from a comfortable five-star entry point to a proper splurge, not a single fixed price tier.

The location is the other reason this hotel keeps coming up for Roland-Garros specifically: it sits about 700 metres, roughly a 10-minute walk, from the stadium, and a similar distance from Parc des Princes. For a tournament where hotel proximity is genuinely scarce, that's a rare combination of five-star quality and walkable distance.`;

const whyItsSpecial = `Most five-star hotels near a major sporting venue are generic — good rooms, good service, no particular reason to choose this one over an equally competent alternative three blocks away. Molitor has an actual story: a beloved, slightly notorious public pool that Paris lost for twenty years and then got back, reborn as a hotel that had the sense to keep the original pools rather than paving over them for something more conventionally "hotel-shaped."

Staying here during Roland-Garros means a genuinely unusual pairing — spending the morning at the world's most famous clay-court tournament, then coming back to swim laps in a pool that's been part of this same corner of the 16th arrondissement since 1929, decades before the current Court Philippe-Chatrier even existed in its modern form. Very few hotels this close to a Grand Slam venue can offer that kind of layered local history alongside the five-star basics.`;

const insiderTips = [
  "Room pricing varies enormously by category — Superior rooms start around $494-526 a night while King rooms run $1,190-1,625, so specify the exact room type when comparing rates rather than assuming one advertised 'from' price applies across the board.",
  "The rooftop terrace only operates seasonally, typically opening in spring — since Roland-Garros falls in late May/early June, it should be open for the tournament, but confirm current-season opening dates directly with the hotel before counting on it.",
];

const whatToAvoid = `Don't book the cheapest available room expecting pool views or extra space — at roughly 323 square feet, the entry-tier rooms are compact by five-star standards, and pool or city views are tied to specific room categories, not guaranteed at every price point. And don't assume walking distance to Roland-Garros means walking distance to central Paris landmarks — Molitor's location trades proximity to the stadium for genuine distance from the Louvre, Eiffel Tower and other central sightseeing, so factor in taxi or Métro time for non-tennis days.`;

const practicalInfo = {
  address: "13 Rue Nungesser et Coli, 75016 Paris, France",
  website: "https://mgallery.accor.com/en/hotels/7326.html",
  hours: "24-hour reception",
  costRange: "Approx. $494-526/night (Superior) up to $1,190-1,625/night (King), varying by season and demand",
  bookingMethod: "Book directly via mgallery.accor.com or through standard hotel booking platforms (Booking.com, Hotels.com). Book well in advance for tournament dates — rooms this close to Roland-Garros sell out fast once dates are confirmed.",
  reservationsRequired: true,
};

const gettingThere = `A 10-minute (approx. 700m) walk from Stade Roland-Garros. Michel-Ange–Molitor (Métro Lines 9 and 10) is the closest station, directly named for the hotel/pool complex.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Hôtel Molitor — Luxury Stay",
      subtitle: "A 1929 Art Deco bathhouse turned five-star hotel, 10 minutes from Roland-Garros",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "16th arrondissement / Auteuil",
      address: "13 Rue Nungesser et Coli, 75016 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "History (1929 Piscine Molitor, Lucien Pollet architect, 1980s closure, 2014 MGallery reopening) from historichotels.org. Room/pricing detail from Trip.com/Booking.com aggregated listings. Google rating verified via Places API: 4.4/3,167 reviews. Cross-checked against seeded planner_hotel_tier_cost (luxury tier USD $817-1659, splurge $384-707) — roughly consistent. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      googleMapsRating: "4.4",
      googleMapsReviewCount: 3167,
      googleMapsUrl: "https://maps.google.com/?cid=7895323481990577613",
      moodTags: ["luxurious", "historic", "relaxed"],
      interestCategories: ["accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      budgetMinCost: "494",
      budgetMaxCost: "1625",
      bestSeasons: ["may"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: FRENCH_OPEN_EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "→", result.slug, `(${result.status})`);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
