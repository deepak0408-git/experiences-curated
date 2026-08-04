import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-maxwell-food-centre-" + Date.now().toString(36);

const bodyContent = `Maxwell Food Centre, on the edge of Chinatown, is the hawker centre Singaporeans themselves point visitors toward when Lau Pa Sat feels too built for tourists. Its anchor stall is Tian Tian Hainanese Chicken Rice, holder of a Michelin Bib Gourmand since 2016, the guide's recognition for genuinely excellent food at real hawker prices, and famous enough to have been visited by both Gordon Ramsay and the late Anthony Bourdain. A small plate starts at S$5, a whole chicken for sharing runs S$24, and the queue outside Tian Tian is a fixture of the stall's own reputation, not a sign something's gone wrong.

Beyond Tian Tian, Maxwell holds a genuine spread of Michelin Guide-recognised stalls covering different Singaporean food traditions, not just chicken rice, and reviewers consistently rate it above other hawker centres specifically for the combination of low prices and real quality, not one or the other. It's cash-first at most stalls and gets busy fast, arrive with an actual plan for seating, not a wander-and-decide approach, or you'll lose a table before you've chosen what to eat.

It's a genuinely walkable stop from Chinatown accommodation and a short MRT ride from Marina Bay, making it a realistic lunch or early-dinner option before a session rather than a full separate outing.`;

const whyItsSpecial = `Maxwell earns its reputation the way Michelin's Bib Gourmand is supposed to work: real food, real prices, no dressing up for visitors. Tian Tian's queue isn't manufactured hype, it's the honest result of a stall that's been consistently excellent long enough for two of the world's most recognisable chefs to show up and confirm it. I'd point a first-timer here over Lau Pa Sat specifically if the priority is eating the way Singapore actually eats, not the more atmospheric, more tourist-oriented version a few MRT stops away. Both are legitimate, they're just answering different questions.`;

const insiderTips = [
  "Go for Tian Tian specifically, but expect a real queue, it's not exaggerated for effect, this is genuinely one of the most consistently busy stalls in Singapore.",
  "Bring cash, most stalls here are cash-only, and secure a table before joining any queue since seating fills fast during peak lunch and dinner hours.",
];

const whatToAvoid = `Don't wander in without a plan expecting to browse leisurely, tables fill quickly and browsing while others queue behind you is a fast way to lose your seat. If Tian Tian's queue looks long, several other Michelin-recognised stalls in the same centre are worth trying instead rather than waiting an hour for one specific dish.`;

const practicalInfo = {
  hours: "Tian Tian Hainanese Chicken Rice: daily 10am-7:30pm; centre-wide hours vary by stall",
  costRange: "S$5-9 for chicken rice (small to large); most other stalls in a similar S$4-10 range",
  bookingMethod: "Walk-in only, cash preferred at most stalls — arrive outside peak lunch (12-1:30pm) or dinner (6:30-8pm) hours to shorten the wait.",
  howToBook: "",
  website: "https://maxwellfoodcentre.com/tian-tian-hainanese-chicken-rice/, https://guide.michelin.com/us/en/singapore-region/singapore/restaurant/tian-tian-hainanese-chicken-rice",
  reservationsRequired: false,
};

const gettingThere = "Located at 1 Kadayanallur Street, on the edge of Chinatown. Nearest MRT: Chinatown or Tanjong Pagar, roughly 10 minutes' walk to Marina Bay Street Circuit.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Maxwell Food Centre — the locals' hawker pick",
      subtitle: "Tian Tian's Michelin Bib Gourmand chicken rice, and the hawker centre Singaporeans actually recommend",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Chinatown",
      address: "1 Kadayanallur Street, Singapore 069184",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Tian Tian Michelin Bib Gourmand status (since 2016) confirmed via guide.michelin.com official listing. Ratings/reviews cross-referenced via Tripadvisor. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["local-food", "authentic"],
      interestCategories: ["dining"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-01",
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
