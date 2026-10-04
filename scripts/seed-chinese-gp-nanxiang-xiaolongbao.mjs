// Nanxiang Xiaolongbao (budget/casual dining) — Chinese GP 2027. Sources:
// en.wikipedia.org/wiki/Nanxiang, en.wikipedia.org/wiki/Nanxiang_Steamed_Bun_Restaurant,
// en.wikipedia.org/wiki/Xiaolongbao (neutral, well-sourced); thatsmags.com
// Nanxiang day-trip article (Rihuaxuan/Huang Mingxian 1871 founding,
// Changxinglou 1900, corroborated by jiemian.com/sohu.com Chinese sources);
// jiading.gov.cn official government xiaolongbao guide (Guyi Garden
// Restaurant's crab-roe specialty, Changxinglou's Renmin Street 75 address
// and 7:00-20:00 hours). Google Places API (New) lookups, 23 Sep 2026 +
// 2 Oct 2026: Shanghai Guyi Garden Restaurant 4.0/38 reviews (the one rated
// venue); Rihuaxuan and Changxinglou both confirmed real/operating but each
// returned only 1 Google review — too thin to cite as a rating, so both are
// named as historic originals without a googleMapsRating. CORRECTS a prior
// factual error: earlier draft stated "Guyi Garden Restaurant, founded
// 1871" as the original venue — the 1871 founding actually belongs to
// Rihuaxuan; Guyi Garden Restaurant is a separate, real, well-regarded but
// not historically-original restaurant near the garden's south gate.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-nanxiang-xiaolongbao-" + Date.now().toString(36);

const bodyContent = `Every Shanghai visitor eventually eats xiaolongbao, the city's signature soup dumpling. What most don't realize is that the dish wasn't invented downtown — it traces back to Nanxiang, a town now inside Jiading District, close enough to Shanghai International Circuit to make a genuinely easy stop before or after a race weekend.

The dumpling itself dates to 1871, when Huang Mingxian, running a dim sum shop called Rihuaxuan on what's now Renmin Street in Nanxiang's old town, reworked an older tradition of soup-filled buns into something more refined: a thinner wrapper around a filling built partly from solid pork-skin aspic that melts into liquid soup during steaming. In 1900, a relative of the Rihuaxuan family opened a second shop nearby, Changxinglou, which later expanded into central Shanghai as what's now known as the Nanxiang Steamed Bun Restaurant beside Yu Garden — the dish's most famous downtown home. But Rihuaxuan and Changxinglou, both still standing in Nanxiang's old town today, are where the recipe actually started.

How you eat it matters as much as where. Lift a dumpling carefully by the pleated top — by hand with chopsticks, or set on a spoon — then nibble a small opening in the side to let the steam and broth escape before eating it whole. The classic pairing is a dip of Zhenjiang black vinegar with a few thin shreds of fresh ginger, used lightly rather than as a soak, to cut through the richness of the pork and the soup without masking it. Most Nanxiang restaurants also serve a simple side — a light soup or a plate of stir-fried greens — specifically because xiaolongbao itself is rich enough that a second heavy dish feels like too much.

Nanxiang is one of Shanghai's oldest settlements, established during the Liang Dynasty in 505 AD, roughly 1,500 years before Formula 1 ever came to Shanghai. Its old town still has the twin pagodas and the classical Guyi Garden that give the area its character beyond the food. Just outside the garden's south gate sits Guyi Garden Restaurant, a well-established name in its own right, known locally for its seasonal crab roe xiaolongbao when crab is in season — a genuinely well-reviewed, currently-operating option if Rihuaxuan or Changxinglou have a wait.

This is a genuinely budget-friendly stop: dumplings are inexpensive street-level or casual-dining food across China, and Nanxiang's old town doesn't charge circuit-adjacent or tourist-trap prices for the privilege of eating where the dish began. Pair it with a walk through the old town itself and it's a half-day that costs very little and delivers a real piece of food history most race-weekend visitors to Shanghai never find.`;

const whyItsSpecial = `A lot of "authentic food" claims in tourist cities are marketing, not history. This one is genuinely both. Nanxiang isn't styled to look like the birthplace of xiaolongbao — it actually is, a fact documented back to 1871 at Rihuaxuan and recognized in 2014 as National Intangible Cultural Heritage. For a race-weekend visitor already staying near Jiading, that's a rare alignment: the historically correct answer to "where should I eat dumplings" and the geographically convenient answer happen to be the same town. Most trips to Shanghai involve a deliberate detour to chase food history like this; this one barely requires one.`;

const practicalInfo = {
  hours: "Guyi Garden Restaurant: 8:00 AM–7:00 PM (lobby service ends around 4 PM on weekdays — no full dinner service). Changxinglou: 7:00 AM–8:00 PM. Rihuaxuan: hours not published by any source found — call ahead or check on arrival.",
  costRange: "Budget — dumplings are inexpensive casual dining across Nanxiang's old town, well below downtown tourist-district pricing",
  bookingMethod: "Walk-in — no reservation typically needed at Guyi Garden Restaurant, Rihuaxuan, or Changxinglou.",
  website: "https://en.wikipedia.org/wiki/Nanxiang, https://en.wikipedia.org/wiki/Nanxiang_Steamed_Bun_Restaurant, https://en.wikipedia.org/wiki/Xiaolongbao",
};

const gettingThere = "Nanxiang sits within Jiading District, a short taxi or local transit ride from Shanghai International Circuit — genuinely convenient for a pre- or post-race weekend stop, unlike the city's other historic food districts, which require a longer trip into central Shanghai.";

const insiderTips = [
  "Rihuaxuan and Changxinglou, both on or near Renmin Street in the old town, are the two genuinely original shops — Rihuaxuan from 1871, Changxinglou from 1900 — and each gets a steady stream of locals rather than tour groups, so don't expect a polished tourist setup at either.",
  "Order the black vinegar and ginger on the side if it doesn't come automatically, and use it lightly — a quick dip, not a soak — or it overwhelms the broth you're actually there for.",
];

const whatToAvoid = "Don't confuse Nanxiang the town with the Nanxiang Steamed Bun Restaurant beside Yu Garden downtown — the downtown restaurant (a branch that grew out of Changxinglou) is a famous, real destination in its own right, but it's a different location from the actual birthplace town this experience covers, and conflating the two means visiting the wrong place if the goal is Nanxiang itself. Don't bite straight into a fresh-steamed dumpling — the broth inside is genuinely hot enough to burn, so nibble a small opening first and let the steam escape before eating it whole.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Nanxiang — Where Xiaolongbao Actually Began",
      subtitle: "The real birthplace of Shanghai's soup dumpling, sitting inside Jiading District, a short trip from the circuit.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Nanxiang, Jiading District",
      address: "Nanxiang Old Town, Jiading District, Shanghai, China (multiple restaurants — Rihuaxuan and Changxinglou on/near Renmin Street, Guyi Garden Restaurant near the garden's south gate; see body for details)",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from en.wikipedia.org/wiki/Nanxiang, en.wikipedia.org/wiki/Nanxiang_Steamed_Bun_Restaurant, en.wikipedia.org/wiki/Xiaolongbao (neutral, well-documented history); thatsmags.com Nanxiang day-trip article (Rihuaxuan/Huang Mingxian 1871 founding, Changxinglou 1900, corroborated by jiemian.com/sohu.com Chinese sources); jiading.gov.cn official government xiaolongbao guide (Guyi Garden Restaurant's crab-roe specialty, Changxinglou's Renmin Street 75 address and 7:00-20:00 hours). Google Places API (New) lookups: Shanghai Guyi Garden Restaurant 4.0/38 reviews (23 Sep 2026, kept as the one rated venue); Rihuaxuan and Changxinglou both confirmed real/operating but each returned only 1 Google review (2 Oct 2026) — too thin to cite as a rating, named as historic originals without a googleMapsRating instead. Vinegar/ginger pairing and eating technique via WebSearch of general xiaolongbao food-culture sources. CORRECTS a prior factual error: earlier draft stated 'Guyi Garden Restaurant, founded 1871' — the 1871 founding actually belongs to Rihuaxuan; Guyi Garden Restaurant is a separate, real, well-regarded but not historically-original restaurant.",
      googleMapsRating: "4.0",
      googleMapsReviewCount: 38,
      googleMapsUrl: "https://maps.google.com/?cid=10783418574595664570&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["cultural", "authentic"],
      interestCategories: ["dining", "culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
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
