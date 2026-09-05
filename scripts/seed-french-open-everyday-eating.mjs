import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "everyday-parisian-eating-baguette-jambon-beurre";

const bodyContent = `Skip past the tasting menus for a moment. The food that actually defines a Paris day, the one nearly every Parisian eats without thinking about it, is a baguette with butter and ham, wrapped in paper, eaten on the move or on a park bench. It's called jambon-beurre, and Parisians buy roughly three million of them a day. It has its own nickname — "le Parisien" — because it basically is Paris, condensed into a sandwich.

The construction is deliberately minimal: a crusty baguette, sliced lengthwise, a thick layer of good butter, a few slices of quality ham. Nothing else. That simplicity is the point — with only three ingredients, there's nowhere for a mediocre boulangerie to hide, and a genuinely good jambon-beurre tells you everything about the quality of the bread and the butter in a single bite. Expect to pay €4-7 at most boulangeries and cafés; a "gourmet" version at a higher-end address can run €13-15, though purists will tell you that misses the point of a sandwich built on affordability as much as flavor.

The baguette itself is a serious civic institution in Paris, not just a shape of bread. The city runs an actual annual competition, the Grand Prix de la Baguette de Paris, now in its 33rd year, judging baguettes on appearance, taste, baking, crumb and alveolation. The winner gets a cash prize and the more unusual honor of supplying the French president's residence, the Élysée Palace, for the following year. The 2026 winner was Fournil Didot in the 14th arrondissement, baked by Sithamparappillai Jegatheepan — a genuine trek from Roland-Garros, but worth knowing about if chasing the officially "best" baguette in Paris that year matters to you.

Closer to the stadium, Boulangerie Patisserie à la Flûte Enchantée in Passy, in the 16th arrondissement itself, is well regarded locally for exactly this kind of everyday baking — a realistic stop on the way to or from a match day rather than a special trip. The habit itself, grabbing a sandwich from whichever boulangerie is nearest and eating it standing up or on a bench, is the actual experience worth having, more than any single named address.`;

const whyItsSpecial = `Every food guide to Paris eventually points you toward a Michelin star. Almost none of them stop to explain the sandwich the entire city actually eats for lunch. That gap is the argument for this entry existing at all — the jambon-beurre isn't a lesser experience standing in the shadow of fine dining, it's a genuinely different and equally real slice of how Paris eats, one that costs less than a coffee at a tourist café and tells you more about the city's food culture in one bite than a five-course tasting menu might.

I like that a whole official competition exists purely to crown the best baguette in Paris, judged the same way you'd judge anything with real craft behind it — appearance, crumb structure, bake. That a sandwich costing under €10 comes from a bread taken seriously enough to have its own annual civic championship says something true about this city that the luxury restaurants, as good as they are, don't quite capture.`;

const insiderTips = [
  "A genuinely good jambon-beurre only has three ingredients — baguette, butter, ham — so quality is impossible to fake; if it tastes ordinary, the boulangerie's basics (bread, butter) aren't good, which tells you something worth knowing before ordering anything else there.",
  "Skip the €13-15 'gourmet' versions unless a specific ingredient genuinely interests you — the sandwich's whole appeal is built on an everyday €4-7 price point, and paying triple for it defeats what makes it worth trying in the first place.",
];

const whatToAvoid = `Don't buy a jambon-beurre from a train-station or airport kiosk expecting the real version — mass-produced versions cut corners on both the butter and the bread that make the genuine article worth eating, and a bad one anywhere will undersell the entire tradition. And don't assume every boulangerie sells an equally good baguette just because it's French — quality genuinely varies street to street in Paris, which is exactly why the city runs an annual competition to settle the question; if a baguette tastes flat or overly soft, that boulangerie simply isn't a good one, regardless of how charming the storefront looks.`;

const practicalInfo = {
  address: "Boulangerie Patisserie à la Flûte Enchantée, Passy, 75016 Paris (nearest well-regarded option to the stadium)",
  website: "https://www.paris.fr",
  hours: "Most boulangeries open early morning (07:00-08:00) through early evening; many close one day a week, typically Monday",
  costRange: "€4-7 for a standard jambon-beurre; €13-15 for a gourmet version",
  bookingMethod: "Walk in — no reservation needed at any boulangerie.",
  reservationsRequired: false,
};

const gettingThere = `Boulangeries are everywhere in the 16th arrondissement — no special trip required. Boulangerie Patisserie à la Flûte Enchantée sits in Passy, a short walk or Métro ride (Passy or La Muette, Line 9) from the stadium area.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Everyday Parisian Eating — Baguette & Jambon-Beurre",
      subtitle: "Three million sandwiches a day, and the civic institution behind the bread itself",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "16th arrondissement / Passy",
      address: "Passy, 75016 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Jambon-beurre facts (~3M/day, €4-7 standard price, 'le Parisien' nickname) from Tripadvisor jambon-beurre roundup and Timeout. Grand Prix de la Baguette 2026 winner (Fournil Didot, 14th arr., baker Sithamparappillai Jegatheepan) from Wikipedia (Concours de la meilleure baguette de Paris) and paris.fr official press release. Local 16th-arr. boulangerie recommendation from Tripadvisor/Yelp roundups of Passy-area bakeries. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      moodTags: ["authentic", "casual", "local"],
      interestCategories: ["food_and_drink", "culture_and_history"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      budgetMinCost: "4",
      budgetMaxCost: "7",
      bestSeasons: ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],
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
