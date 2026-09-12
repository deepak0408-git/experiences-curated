import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-hotel-emiliano-" + Date.now().toString(36);

const bodyContent = `Hotel Emiliano sits on Rua Oscar Freire, the single most fashionable shopping street in São Paulo, in the middle of Jardins — the neighborhood most F1 teams and paddock regulars already choose when they're in town for the weekend. Just 57 rooms, which is small for a 5-star property in a city this size, and that scale shows in the service: guests consistently describe staff who remember names and preferences by the second day, not just polished formality.

Rooms lean sleek and modern — wood paneling, clean-lined Charles Eames furniture, marble bathrooms — rather than the ornate, heavy-fabric look some luxury hotels default to. Every room comes with a minibar, premium bedding, an in-room espresso maker, and a safe; the bathrooms run to bidets and proper toiletries, not an afterthought. The spa runs two outdoor jacuzzis and a full steam room, and there's a 24-hour fitness center for anyone keeping a routine through race weekend. There's no pool, which is the one real gap in the amenity list if that matters to you — but there is a rooftop helipad, which tells you plainly what tier of guest this hotel is built around.

The location does real work beyond prestige. Oscar Freire itself is lined with the city's highest-end shopping and several of its best restaurants, so you're not choosing between a great hotel and a great neighborhood — Jardins gives you both, and it's also one of the more straightforward parts of the city to reach Interlagos from, without the longer commute some outer neighborhoods carry.`;

const whyItsSpecial = `A hotel doesn't need to be the biggest or the flashiest to be the right one for a race weekend — it needs to get several things right at once: a location that doesn't add friction to your days, a level of service that holds up when the city is unusually busy with visiting fans and teams, and rooms that let you actually rest before an early gate time. Emiliano's small scale is what makes all three work together; a 57-room hotel can staff for genuine attentiveness in a way a 300-room tower can't, and its Jardins address puts you closer to São Paulo's best restaurants than to anything resembling a tourist strip. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=2095398092371252788&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) if you want to see what recent guests are actually saying before booking.`;

const insiderTips = [
  "Race weekend is one of São Paulo's highest-demand hotel periods of the year — a 57-room property this well-regarded books out its best rooms months ahead, so treat this as a lock-it-in-early decision rather than something to shop around on closer to the date.",
  "There's no pool here, which is the one amenity gap in an otherwise complete 5-star offering — if a pool matters to your stay, confirm this before booking rather than assuming a hotel at this price point automatically has one.",
];

const whatToAvoid = `Don't assume Oscar Freire's retail-street reputation means it's a loud, tourist-trafficked strip — it's upscale and genuinely quiet in the evenings compared to nightlife-heavy areas like Vila Madalena, so don't rule it out if you're looking for calm rather than buzz. And don't book expecting resort-style amenities across the board — the spa and fitness facilities are genuinely excellent, but there's no pool and no expansive grounds; this is a boutique city hotel, not a resort property, and expectations should be set accordingly.`;

const practicalInfo = {
  hours: "Standard hotel check-in/check-out (verify exact times directly with the property when booking)",
  costRange: "Rates typically start around US$290-360+ per night depending on room category and season; expect race-weekend premium pricing",
  bookingMethod: "Book directly via SLH (Small Luxury Hotels of the World, the Emiliano's affiliated network) or through major booking platforms.",
  website: "https://slh.com/hotels/emiliano-sao-paulo",
};

const gettingThere = "Located on Rua Oscar Freire in Jardins. The nearest metro stations are Consolação or Oscar Freire on Line 4 (Yellow); reaching Interlagos requires a transfer to Line 9 (Esmeralda) — see the Getting to Interlagos experience elsewhere in this pack for the full route.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Hotel Emiliano — Jardins' Boutique Luxury Pick",
      subtitle: "57 rooms on São Paulo's most fashionable street, favored by F1 teams themselves",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Jardins",
      address: "Rua Oscar Freire, 384, Jardins, 01426-001 São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Property description (57 rooms, Oscar Freire location, Eames furniture/marble bathrooms, spa with 2 outdoor jacuzzis + steam room, 24hr fitness, no pool, rooftop helipad) sourced from Oyster.com's detailed hotel review, cross-checked against SLH's own official hotel page, 11 Sep 2026. Guest sentiment (9.1/10 'Wonderful', 443 reviews, praise for attentive staff) sourced from aggregator review data cited in the same Oyster.com piece. Real Google Maps rating confirmed via Places API lookup, 11 Sep 2026: 4.8/2,203 reviews, matched to 'Emiliano Sao Paulo, an SLH Hotel'. Price range (~US$290-360+/night) sourced from Expedia listing data, 11 Sep 2026 — flagged as a starting-rate estimate, not a confirmed race-weekend rate. Affiliate opportunity: flagging for founder — this property should be checked for a real Booking.com listing to add a bookingLinks entry; not constructed here per standing rule that affiliate URLs are never built independently.",
      sport: ["formula_one"],
      moodTags: ["luxurious", "stylish"],
      interestCategories: ["accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
      googleMapsRating: "4.8",
      googleMapsReviewCount: 2203,
      googleMapsUrl: "https://maps.google.com/?cid=2095398092371252788&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #8 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
