import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "marche-president-wilson";

const bodyContent = `Marché Président Wilson runs down Avenue du Président-Wilson for roughly 700 metres, Wednesday and Saturday mornings, 7am to about 2pm, and it's Paris's largest open-air food market — genuinely the biggest one in the city, not just the biggest in this arrondissement. It sits between the Eiffel Tower and the Palais de Tokyo, in the 16th's more central stretch rather than out toward Auteuil, which makes it a realistic morning stop whether you're staying near the stadium or in central Paris for the tournament.

The character of the market comes directly from the neighborhood around it. This is the ritzy end of the 16th, embassies and Haussmannian facades lining wide sidewalks, and the market reflects that: renowned merchants, genuinely excellent fish, meat, cheese, and organic wine, prices that run higher than markets in less affluent arrondissements. Go early, before 9am if possible, and you'll spot working chefs and restaurateurs alongside the usual Saturday-morning residents, stocking up on the same produce that'll turn up on a menu somewhere in the city that evening.

It's also, for what it's worth, a genuinely photogenic market — flowers alongside produce, wide Haussmannian streetscape as a backdrop, none of the cramped, chaotic energy of markets in eastern Paris. That's not a criticism. It's simply a different, more composed kind of market experience, closer to browsing than hunting for a bargain.

Marché Auteuil, in the more residential heart of the Auteuil neighborhood itself, runs the same Wednesday/Saturday schedule on a smaller, more local scale — worth knowing about as the closer-to-the-stadium alternative if you're staying specifically in the Auteuil area and want the everyday version rather than the flagship one.`;

const whyItsSpecial = `A big city market tells you things a restaurant never will — what's actually in season, what the professionals are buying, what a neighborhood eats on an ordinary Wednesday rather than what a menu decided to sell you. Président Wilson does that at the largest possible scale in Paris, in one of its wealthiest corners, which produces a market experience that's less about finding a bargain and more about seeing what genuinely excellent produce looks like when price isn't the primary constraint.

For a Roland-Garros trip specifically, this is the antidote to two straight weeks of stadium food and hotel breakfasts. An early Wednesday or Saturday morning here, before a match session starts, buying fruit and cheese for a picnic lunch to eat courtside later, is a small but real way to eat like an actual Parisian rather than a tourist passing through, on a morning that would otherwise just be dead time before the tennis starts.`;

const insiderTips = [
  "Arrive before 9am to see the market at its best — working chefs and restaurateurs shop here early, and the produce selection is at its freshest before the later Saturday-morning crowds arrive.",
  "Buy picnic ingredients here for a match day rather than relying entirely on stadium concessions — fruit, cheese and bread from this market, eaten between sessions, is a genuinely better and cheaper lunch than most in-stadium options.",
];

const whatToAvoid = `Don't expect bargain prices — Président Wilson sits in one of Paris's wealthiest districts and prices reflect that; if a lower-cost market matters more than this one's specific quality and atmosphere, Marché Auteuil or a market in a less affluent arrondissement will suit better. And don't visit outside its Wednesday/Saturday morning hours expecting to catch even a partial version of it — this is a strictly scheduled twice-weekly market, not a permanent market hall, and the street reverts to ordinary traffic the rest of the week.`;

const practicalInfo = {
  address: "Avenue du Président-Wilson, 75016 Paris, France",
  website: "https://www.paris.fr",
  hours: "Wednesday and Saturday, 07:00-14:00",
  costRange: "Free to browse; produce prices run above average for Paris given the affluent surrounding neighborhood",
  bookingMethod: "No booking required — walk up during market hours.",
  reservationsRequired: false,
};

const gettingThere = `Iéna or Alma-Marceau (Métro Line 9) are both a short walk from the market, which runs along Avenue du Président-Wilson between the Eiffel Tower and the Palais de Tokyo.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Marché Président Wilson",
      subtitle: "Paris's largest open-air market, twice a week, between the Eiffel Tower and the Palais de Tokyo",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "16th arrondissement",
      address: "Avenue du Président-Wilson, 75016 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Market details (700m length, Wed/Sat 07:00-14:00, largest open-air market in Paris) from sortiraparis.com and tripadvisor.com. Google rating verified via Places API: 4.6/202 reviews. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 202,
      googleMapsUrl: "https://maps.google.com/?cid=6375327434372118041",
      moodTags: ["authentic", "vibrant", "local"],
      interestCategories: ["food_and_drink", "culture_and_history"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      bestSeasons: ["may"],
      advanceBookingRequired: false,
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
