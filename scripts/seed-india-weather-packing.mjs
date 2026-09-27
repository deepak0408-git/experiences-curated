import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "india-weather-packing-" + Date.now().toString(36);

const bodyContent = `This tour runs across three genuinely different climates, and packing for one city won't serve you well in the next.

Nagpur in late January is the trickiest of the three because of the swing within a single day, not the average. Daytime highs run around 29°C, comfortable in short sleeves, but mornings drop to around 11°C, genuinely cold by Indian standards, cold enough that a Test match's early session can feel like a different season from its last. A proper jacket or fleece for the first hour or two of play, packed away by mid-morning, is the right approach, not a single outfit for the whole day.

Chennai in late January/early February is milder and steadier: daytime temperatures around 30°C, overnight lows around 21°C, with real humidity off the Bay of Bengal that Nagpur doesn't have. Layering matters less here than breathable fabric does. The coastal breeze picks up through the afternoon and genuinely cools the evening sessions, but it's humidity, not cold, that's the main discomfort factor.

Ahmedabad in late February/early March is the hottest and driest of the three, and it's climbing fast toward the pre-monsoon heat that defines Gujarat's spring. Average highs by early March run around 33-36°C, with humidity dropping to some of the lowest levels of the year, meaning direct sun exposure is the real risk rather than mugginess. Days at Narendra Modi Stadium's exposed stands in this heat call for genuine sun protection, not just a hat.

Across all three, the general packing list holds: breathable, light-coloured clothing for daytime, a warmer layer specifically for Nagpur mornings, sunscreen and a hat for all three (especially Ahmedabad), and a reusable water bottle, since most grounds restrict bringing in sealed bottled drinks but allow refillable ones through security.`;

const whyItsSpecial = `A trip built around three cities with three different climates is easy to under-plan for if you pack once for "India in winter" as a single idea. The honest version of this pack's practical value is exactly this kind of specific, city-by-city detail, not generic advice that technically applies everywhere and specifically helps nowhere. Knowing that Nagpur mornings genuinely need a jacket while Ahmedabad afternoons genuinely need serious sun protection changes what goes in your bag before you leave home, not what you improvise once you're already uncomfortable.`;

const insiderTips = [
  "Pack one genuine warm layer specifically for Nagpur's early mornings (around 11°C) even if the rest of your trip is warm-weather clothing — it's the one real cold-weather requirement across all three cities.",
  "Bring a refillable water bottle rather than relying on buying sealed bottles at each ground — most stadiums restrict bringing in sealed drinks but allow empty refillable bottles through security, and Ahmedabad's dry heat in particular makes steady hydration genuinely important.",
];

const whatToAvoid = `Don't pack as if all three cities share one climate — a single-season wardrobe built around Chennai's mild humidity will leave you cold in Nagpur's mornings and overheated in Ahmedabad's dry March sun. Don't underestimate Ahmedabad's dry heat because the temperature numbers look similar to Chennai's — with humidity dropping to some of the lowest levels of the year by March, sun exposure and dehydration are real risks in a way Chennai's muggier air doesn't create in the same way.`;

const gettingThere = `This is a planning reference, not a bookable location — see this pack's city-specific Getting There experiences for transit detail.`;

const practicalInfo = {
  bookingMethod: "Not applicable — this is a packing and weather reference, not a bookable experience.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "India in January-February — Weather & What to Pack",
      subtitle: "Cold Nagpur mornings, humid Chennai afternoons, dry Ahmedabad heat — three climates, one trip.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: null,
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: Wanderlog (Nagpur January weather), Climatestotravel.com (Chennai climate), Weather-Atlas/Climate-Data.org (Ahmedabad March climate). Planning/reference piece — no venue to rate.",
      sport: ["cricket"],
      moodTags: ["weather", "packing", "planning"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "INR",
      bestSeasons: ["jan", "feb", "mar"],
      advanceBookingRequired: false,
      availability: "event_only",
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
