import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-vila-madalena-food-crawl-" + Date.now().toString(36);

const bodyContent = `Vila Madalena is where São Paulo's food and nightlife scene stops being formal. It's the neighborhood built around casual bars, live samba and pagode, cheap-but-good caipirinhas, and a genuine street-life energy that Jardins and Itaim Bibi mostly don't have after dark.

Mercearia São Pedro anchors the scene on Rua Rodésia — a dive bar in the best sense, packed most nights with a mix of locals and visitors, no pretension, just cold beer and a crowd that's there to actually talk to each other. Its full address is Rua Rodésia, 34, Sumarezinho, right at the edge of Vila Madalena proper. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=15197887854314061165&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) — it's held a strong, large-sample rating for years, which tracks with how consistently it comes up in local recommendations.

Bar Astor, on Rua Delfina, 163, is a step more composed — still Vila Madalena casual, but with a more considered cocktail and food menu, the kind of place that works for an actual sit-down dinner rather than just standing-room drinks. It's one of the neighborhood's most consistently well-reviewed spots. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=15113596845384935624&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) for current guest sentiment.

Beyond these two, the neighborhood is genuinely dense with botequim-style bars running rodízio happy-hour deals — small plates, bar snacks, and pitcher-priced drinks rather than a formal menu — so the real move in Vila Madalena is less "book one restaurant" and more "start at one anchor spot and let the night move."`;

const whyItsSpecial = `Jardins and Itaim Bibi both do a version of "nice night out" well, but Vila Madalena does something neither of them offers: a genuinely unstructured evening where the plan is to wander between a few bars rather than commit to one table for the night. It's the neighborhood that best matches what a lot of visiting F1 fans are actually looking for after a long day at the circuit — somewhere loud, social, and cheap enough that you're not calculating the bill between rounds. Both Mercearia São Pedro and Bar Astor have held real, sustained local reputations rather than a viral moment that faded, which is the difference between a neighborhood that's trendy and one that's actually good.`;

const insiderTips = [
  "Mercearia São Pedro gets genuinely packed most nights — arrive earlier in the evening if you want to actually get a seat rather than stand, especially on a weekend during race week when the city's visitor numbers are already elevated.",
  "Treat Vila Madalena as a multi-stop night rather than a single dinner reservation — start at Bar Astor for a proper meal, then move toward Mercearia São Pedro or one of the many nearby botequins for drinks, which is genuinely how locals use the neighborhood.",
];

const whatToAvoid = `Don't expect fine-dining pacing or formality anywhere in this neighborhood — Vila Madalena's whole appeal is casual, loud, and a little chaotic, so if you want a quiet, considered dinner, Jardins or the Maní/Figueira Rubaiyat pairing elsewhere in this pack suits that better. And don't assume every bar takes reservations — most of the genuinely good casual spots here, including both named above, run on a walk-in basis, so plan around potential waits rather than expecting a guaranteed table.`;

const practicalInfo = {
  hours: "Most bars open early evening and run late, typically until 1-2am; specific hours vary by venue and day",
  costRange: "Casual and inexpensive by São Paulo standards — expect roughly US$15-30 per person for drinks and bar food across a night out",
  bookingMethod: "Mostly walk-in — arrive early on weekends if you want to avoid a wait at the most popular spots.",
  website: "https://www.instagram.com/merceariasaopedro, https://www.instagram.com/barastor",
};

const gettingThere = "Vila Madalena has its own metro station on Line 2 (Green), making it one of the more directly transit-accessible nightlife areas in the city. From central hotels, it's typically a single-line trip; from Interlagos, plan for a longer return trip involving a transfer.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Vila Madalena — A Night Out, Bar to Bar",
      subtitle: "Casual, loud, and cheap — São Paulo's most walkable nightlife neighborhood",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Vila Madalena",
      address: "Vila Madalena, São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Neighborhood character and named venues (Mercearia São Pedro, Bar Astor) sourced from multiple aggregator 'best bars in Vila Madalena' lists (Evendo, Yelp), cross-checked, 11 Sep 2026. Both venues confirmed currently operating and located via Google Places API, 11 Sep 2026, with real ratings: Mercearia São Pedro 4.3/3,311 reviews (R. Rodésia, 34, Sumarezinho); Bar Astor Vila Madalena 4.5/3,975 reviews (R. Delfina, 163). Multi-venue experience — inline Google Maps links per venue per skill §2c; add MULTI_VENUE_RATINGS entry (venueCount: 2) to app/experience/[slug]/page.tsx in the same pass as any future edit.",
      sport: ["formula_one"],
      moodTags: ["energetic", "social", "budget-friendly"],
      interestCategories: ["food", "nightlife"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #13 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
