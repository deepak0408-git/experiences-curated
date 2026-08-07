import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-gianduja-chocolate-" + Date.now().toString(36);

const bodyContent = `Gianduja is Turin's invention — a blend of chocolate and roasted hazelnuts, created during the Napoleonic era when cocoa was scarce in the city and bulking it out with locally-abundant hazelnuts turned necessity into what became the region's defining confection. It's the direct ancestor of the hazelnut-chocolate spreads that later became globally famous, but the original, and still the best version to actually taste, is a wrapped dark chocolate sweet with a gianduja ganache centre.

Turin takes this seriously enough that it functions as a real, walkable food trail through the city's historic chocolate shops and cafés, sitting alongside the aperitivo and bicerin traditions as part of the same broader food identity — this is a city that has genuinely built its culinary reputation on precision with a small number of specific things, chocolate among them.

This pairs naturally with a Piazza San Carlo aperitivo evening or a visit to Caffè Al Bicerin — Turin's chocolate culture, coffee culture, and aperitivo culture aren't separate experiences, they're facets of the same civic habit of taking small, specific pleasures seriously and doing them consistently well.`;

const whyItsSpecial = `The detail worth carrying with you is the origin story — gianduja exists because of a cocoa shortage, not despite one, and that's a genuinely different creation story from most confections, which tend to be born from abundance rather than constraint. For a visitor who's spent the trip watching the best tennis players in the world compete at the literal top of their craft, there's a real parallel in Turin's food culture: precision and specificity, applied consistently, rather than scale or excess. Tasting an actual gianduja sweet, from a shop that's made them for generations, is a small but genuine way to understand that same civic instinct.`;

const insiderTips = [
  "Look specifically for gianduja as a standalone wrapped sweet, not just gianduja-flavoured items — the original form, dark chocolate around a gianduja ganache centre, is the thing to actually seek out.",
  "Pair a chocolate-shop stop with your Piazza San Carlo aperitivo or Caffè Al Bicerin visit — they're within easy walking distance of each other in central Turin and represent the same food-culture thread.",
];

const whatToAvoid = `Don't settle for gianduja-flavoured mass-market products from a generic souvenir shop — seek out one of Turin's genuine historic chocolate makers for the real thing, since the difference in quality between an authentic version and a tourist-shop imitation is significant.`;

const practicalInfo = {
  hours: "Standard shop hours — varies by chocolatier.",
  costRange: "Individual gianduja sweets typically inexpensive; gift boxes vary by chocolatier and quantity.",
  bookingMethod: "Walk-in.",
  howToBook: "",
  website: "",
  reservationsRequired: false,
};

const gettingThere = "Central Turin — historic chocolate shops concentrated around the city centre, walkable from Piazza San Carlo.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Gianduja — Turin's chocolate invention",
      subtitle: "Born from a Napoleonic-era cocoa shortage, still made the same way in the city's historic chocolate shops",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Centro",
      address: "Central Turin, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Gianduja origin story (Napoleonic-era cocoa shortage) confirmed via artnouveau.club and slowfoodtravelers.com, cross-checked for consistency. Verified 4 Aug 2026.",
      sport: [],
      moodTags: ["local-icon", "food-culture"],
      interestCategories: ["dining"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
