import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "french-open-luxury-dining-bois-de-boulogne";

const bodyContent = `Three restaurants inside or on the edge of the Bois de Boulogne cover the full range of what luxury dining near Roland-Garros actually means, and they're different enough from each other that "pick whichever" undersells the choice.

Le Pré Catelan is the anchor: three Michelin stars, chef Frédéric Anton at the helm since 1997, trained under Joël Robuchon. It sits in a Napoléon III pavilion in the middle of the Bois de Boulogne, and the format is either a three-course lunch or a full 13-course dinner tasting menu, priced around €270. This is the most formal of the three, and the most expensive — a genuine special-occasion restaurant rather than a convenient nearby option. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=11679259978117907140)

La Grande Cascade holds one Michelin star, held continuously since 1965, under chef Frédéric Robert, who came up through L'Ambroisie, Le Vivarois and Lucas-Carton. The setting is a 19th-century pavilion, mirrors and gilt, a terrace and a rotunda, and the menu structure is more flexible than Le Pré Catelan's: set menus at €99, €128, €195 and €245, plus an à la carte option averaging above €60 a dish. It's the restaurant for anyone who wants the Bois de Boulogne grand-dining experience without committing to a full 13-course evening. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=12898947577521561962)

Blanc is the newest and the fastest-rising of the three. Chef Shinichi Sato, previously two-Michelin-starred at Passage 53 and the first Japanese chef in France to hold two stars, opened Blanc in September 2023 at 52 Rue de Longchamp, in the 16th arrondissement proper rather than inside the Bois. It earned its first star in 2024 and its second in March 2025 — an unusually fast climb. The room seats just 30 covers, designed with architects Kengo Kuma & Associates, with a wine list built around Burgundy and running to 1,500 bottles. This is the pick for anyone who wants genuinely cutting-edge cooking rather than grand classical French dining. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=17729534760814418706)

All three sit within a short taxi ride of Roland-Garros, making any of them realistic for a pre- or post-match dinner without an epic cross-city trek.`;

const whyItsSpecial = `Most "luxury dining near the stadium" write-ups default to whichever restaurant is geographically closest. These three are worth the trip specifically because they represent three different arguments for what luxury dining should be: Le Pré Catelan's formal, decades-proven classical French; La Grande Cascade's more flexible grand-setting elegance; Blanc's compact, fast-rising, genuinely new cooking from a chef who's already proven himself at the top level once before.

Blanc in particular is the interesting bet. Two Michelin stars in under two years, from a chef who already knows what running a two-star kitchen takes, in a room designed by one of the world's most respected architecture firms, seating just 30 people a night — that's not an easy reservation, and it won't stay a secret much longer. Anyone building a trip around Roland-Garros 2027 who wants to say they ate there before it became genuinely difficult to book should move now.`;

const insiderTips = [
  "Le Pré Catelan offers a genuinely different, lighter format at lunch (three courses) versus the full 13-course dinner tasting menu — if the point is experiencing the kitchen without the four-hour evening commitment, lunch is the real insider move here.",
  "Blanc seats only 30 covers a night and has gone from one star to two in a single year — book significantly further ahead than the other two, since demand is rising faster than the room can absorb it.",
];

const whatToAvoid = `Don't book Le Pré Catelan expecting a quick pre-match dinner — the 13-course evening tasting menu is a genuine multi-hour commitment, and rushing it defeats the point of a three-Michelin-star kitchen built around pacing. And don't assume La Grande Cascade's lower entry price point (€99 set menu) means a lesser experience than its two neighbors — it's held a Michelin star continuously since 1965, longer than either of the other two restaurants has existed in their current form, and the more accessible menu tiers are a genuine way in, not a compromise.`;

const practicalInfo = {
  address: "Le Pré Catelan: Route de Suresnes, Bois de Boulogne, 75016 Paris. La Grande Cascade: Allée de Longchamp, Bois de Boulogne, 75016 Paris. Blanc: 52 Rue de Longchamp, 75116 Paris.",
  website: "https://leprecatelan.paris, https://www.restaurantsparisiens.com/la-grande-cascade, https://www.blanc-paris.com",
  hours: "Varies by restaurant — all typically closed Sunday-Monday; check individual sites for current lunch/dinner service times",
  costRange: "La Grande Cascade set menus €99-245; Le Pré Catelan tasting menu approx. €270; Blanc pricing on request, comparable two-star tier",
  bookingMethod: "Reserve directly via each restaurant's own site well in advance — all three, especially Blanc, book out weeks ahead during tournament season.",
  reservationsRequired: true,
};

const gettingThere = `All three sit in or beside the Bois de Boulogne, a short taxi ride (10-15 minutes) from Stade Roland-Garros. Le Pré Catelan and La Grande Cascade are both within the Bois itself and not directly Métro-accessible — a taxi or rideshare is the practical option. Blanc, in the 16th arrondissement proper, is a 5-minute walk from Trocadéro (Métro Lines 6, 9).`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Luxury Dining — Bois de Boulogne & the 16th",
      subtitle: "Le Pré Catelan, La Grande Cascade, and Blanc — three Michelin kitchens near the stadium",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "Bois de Boulogne / 16th arrondissement",
      address: "Bois de Boulogne, 75016 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Le Pré Catelan detail (3 Michelin stars, chef Frédéric Anton, €270 menu) from Michelin Guide, leprecatelan.paris, theworlds50best.com. La Grande Cascade (1 star since 1965, chef Frédéric Robert, €99-245 menus) from Michelin Guide and sortiraparis.com. Blanc (chef Shinichi Sato, 2 stars as of Mar 2025, opened Sep 2023, 30 covers) from sortiraparis.com and Michelin Guide. All 3 Google ratings verified via Places API: Le Pré Catelan 4.6/1954, La Grande Cascade 4.6/1402, Blanc 4.6/70 (thin count, flagged per skill §2c). Multi-venue — no single googleMapsRating field; MULTI_VENUE_RATINGS registry entry required, venueCount=3. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      moodTags: ["luxurious", "romantic", "premium"],
      interestCategories: ["food_and_drink"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "EUR",
      budgetMinCost: "99",
      budgetMaxCost: "270",
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
