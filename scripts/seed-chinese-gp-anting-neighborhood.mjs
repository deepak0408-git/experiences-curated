// Circuit neighborhood: what's actually around Anting — Chinese GP 2027.
// Sources: english.jiading.gov.cn, english.shanghai.gov.cn (official Shanghai/
// Jiading government sources — SAIC Volkswagen history, automotive industry
// context), en.wikipedia.org/wiki/Anting (neutral, population/geography),
// Anting German Town facts (Wikipedia, TIME, Gizmodo, chinawondersguide.com —
// independently corroborated: church landmark-only, Goethe/Schiller statues,
// ~1km walk from Shanghai Automobile City metro station). Shanghai Auto
// Museum facts via en.wikipedia.org/wiki/Shanghai_Auto_Museum (collection,
// pavilions) + trip.com/travelchinaguide.com aggregated listings (hours
// Tue-Sun 9:30am-4:30pm closed Mondays, RMB30 adult ticket, address/metro
// access), cross-checked across sources, not from one. REWRITTEN 2 Oct 2026
// to replace a purely contextual/non-actionable version with real
// bookable/visitable stops (museum + German Town walk) — founder feedback
// that the original gave fans nothing to actually do.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-anting-neighborhood-" + Date.now().toString(36);

const bodyContent = `Shanghai International Circuit didn't land in Anting by accident. This corner of Jiading District has been the real center of China's automotive industry since 1985, when SAIC Volkswagen — the country's first Sino-foreign joint venture car company — set up its original plant here, still Volkswagen's oldest and largest production base in China. Anting has grown into a genuine manufacturing hub around it, with government figures putting more than 1,000 component manufacturers in the area.

That history is something you can actually walk into. The Shanghai Auto Museum sits inside the Auto Expo Park, a 5-minute walk from Anting metro station: 100-plus classic and antique cars across roughly 50 brands and a century of automotive history, including a History Pavilion with milestone vehicles and an Antique Car Pavilion covering 1900-1970. Open Tuesday to Sunday, 9:30am-4:30pm (closed Mondays), adult admission RMB30 — a genuine two-hour stop that fits naturally around a day otherwise built around the circuit.

Anting German Town is the stranger detour, and it's a real, specific place to walk through rather than just a curiosity to read about. Take Metro Line 11 to Shanghai Automobile City station, then it's about a 1km walk (or a short taxi). The town centers on a square with a church — the church itself isn't open to the public, more a landmark than a working building — flanked by statues of Goethe and Schiller, all built in a Bauhaus-influenced northern German architectural style from the early 2000s. It was built to house automotive-industry workers and has been widely reported as significantly underoccupied ever since; there's a bakery, a supermarket, and a few other small businesses, but don't expect real German food or a lively street scene. Go for the architecture and the photos, not a meal.

Anting Old Street, covered elsewhere in this pack, rounds out a full day in the area — a genuine 1,800-year-old river town a short distance from both the museum and German Town, giving you three distinct stops (industrial history, planned-town oddity, ancient river town) all within easy reach of the circuit.`;

const whyItsSpecial = `Most Grand Prix venues sit inside a neighborhood built, at least partly, around hosting visitors — hotels, restaurants, and infrastructure shaped by decades of race weekends. Anting is the opposite kind of place, and that's exactly what makes it worth an actual visit rather than a skim-read. This is real China: a working automotive manufacturing hub you can tour through its own museum, a genuinely odd planned German town built for factory workers that reads more like an urban-planning case study than a tourist stop, and an 1,800-year-old river town a few minutes away. None of it was built for a Formula 1 crowd, and all three stops are real, walkable, and worth your time on a day away from the sessions.`;

const practicalInfo = {
  hours: "Shanghai Auto Museum: Tuesday-Sunday, 9:30 AM-4:30 PM (last entry 4:00 PM), closed Mondays. Anting German Town: no fixed hours — an outdoor district, open to walk through anytime.",
  costRange: "Shanghai Auto Museum: RMB30 adult (~US$4), RMB20 student, free under 1.2m. Anting German Town: free to walk through.",
  bookingMethod: "Shanghai Auto Museum: walk-in, no advance booking needed. Anting German Town: no booking required — self-guided walk.",
  website: "http://english.jiading.gov.cn/",
};

const gettingThere = "Shanghai Auto Museum: Metro Line 11 to Anting Station, then a 5-minute walk. Anting German Town: Metro Line 11 to Shanghai Automobile City station, then about a 1km walk or short taxi (~RMB12 by Didi). Both are a short ride from Shanghai Circuit station on the same line.";

const insiderTips = [
  "Pair the Shanghai Auto Museum with Anting German Town in one afternoon — both sit a short Metro Line 11 ride from the circuit, and together they take maybe three hours including travel, leaving the rest of your day free.",
  "Treat Anting German Town as a photography and architecture stop, not a dining destination — the church is landmark-only (not open to the public), and the handful of shops don't add up to a real German food or retail scene, however striking the buildings look.",
];

const whatToAvoid = "Don't skip the Shanghai Auto Museum assuming it's a minor add-on — it's a genuine 12,000-square-meter collection of 100-plus classic cars, a real two-hour visit, and the one place in Anting that turns the area's automotive history into something you can actually walk through. Don't plan a meal around Anting German Town expecting real German restaurants or a lively street scene — multiple independent reports describe it as significantly underoccupied, and it rewards a photo walk, not a dining plan.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Anting — Inside China's Real Car Country",
      subtitle: "A working automotive hub since 1985, an ancient river town nearby, and one genuinely strange planned German district.",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Anting, Jiading District",
      address: "Shanghai Auto Museum: No. 7565 Boyuan Road, Anting, Jiading District, Shanghai. Anting German Town: centered around the square near Shanghai Automobile City metro station, Anting, Jiading District.",
      heroImageUrl: null,
      googleMapsRating: "4.5",
      googleMapsReviewCount: 90,
      googleMapsUrl: "https://maps.google.com/?cid=484129483494367895&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from english.jiading.gov.cn and english.shanghai.gov.cn (official Shanghai/Jiading government sources — SAIC Volkswagen history, automotive industry figures) and en.wikipedia.org/wiki/Anting (neutral, population/geography). Anting German Town facts independently corroborated across Wikipedia, TIME, Gizmodo, and chinawondersguide.com (church landmark-only status, Goethe/Schiller statues, ~1km walk from Shanghai Automobile City metro station). Shanghai Auto Museum facts via en.wikipedia.org/wiki/Shanghai_Auto_Museum (collection size, pavilions) and trip.com/travelchinaguide.com aggregated listings (hours Tue-Sun 9:30am-4:30pm closed Mondays, RMB30 adult ticket, address/metro access) — cross-checked, not from a single source. FLAG: rewritten 2 Oct 2026 to replace a purely contextual/non-actionable version with real bookable/visitable stops (museum + German Town walk), per founder feedback that the original gave fans nothing to actually do. Google Places API (New) lookup, 2 Oct 2026: Shanghai Auto Museum 4.5/90 reviews (clean match, museum type, exact name) — the only one of the two newly-introduced stops with a distinct Google Places entity. Anting German Town has no separate listing of its own; every search (English and Chinese names, including the more precise 安亭德国镇) resolves to the generic 'Anting' town point with no rating — stated honestly as unrated. Treated as a single-venue-rated experience (top-level googleMapsRating/Url, shown in header) rather than multi-venue, since only one of the two stops has a real rating to cite.",
      sport: ["formula_one"],
      moodTags: ["curious", "off-beat"],
      interestCategories: ["culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "→", result.id, `(${result.slug})`, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
