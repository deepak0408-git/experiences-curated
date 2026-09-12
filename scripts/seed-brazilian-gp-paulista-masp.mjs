import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-paulista-masp-" + Date.now().toString(36);

const bodyContent = `Avenida Paulista is the closest thing São Paulo has to a single defining street — a long, skyscraper-lined boulevard that functions as financial district, cultural strip, and public square all at once. On Sundays, the avenue closes to cars from 7am to 4pm, and the transformation is real: cyclists, joggers, street performers, and vendors take over what's normally a traffic artery, and it becomes one of the genuinely best free things to do in the city on a weekend morning.

MASP anchors the avenue both physically and symbolically — a raised concrete slab suspended over an open plaza, instantly recognizable brutalist architecture that's been photographed as a symbol of the city for decades. Inside, the collection runs deep into European painting for a Southern Hemisphere museum: Picasso, Van Gogh, Gauguin, and Degas sculptures sit alongside a serious Brazilian modern art collection. Hours run Tuesday through Sunday (closed Mondays) — Tuesday 10am-8pm, Wednesday and Thursday 10am-6pm, Friday 10am-9pm, weekends 10am-6pm. Entry is free on both Tuesdays and Wednesdays; Sunday admission runs R$35 for adults, R$17 for seniors and students, free for children 9 and under.

Underneath the raised museum building itself, the MASP Antique Market runs every Sunday, 8am-5pm — genuine antiques, collectibles, and crafts spread across the open plaza the building's own architecture creates. It's a natural pairing with the car-free avenue and a museum visit: market first, museum during the free-if-Tuesday-or-Wednesday window or paid on a Sunday, then a walk down the closed avenue.

Trianon Park sits directly across the street from MASP — a dense, forested pocket park with cobbled paths, a genuinely different feeling from the open plaza and traffic of the avenue itself, worth the ten minutes it takes to cross into it.`;

const whyItsSpecial = `Most "iconic street" recommendations in most cities are really just a place to take a photo and move on. Avenida Paulista does something more interesting on a Sunday specifically — the same street that's pure financial-district hustle on a Tuesday becomes public space by design, car-free and full of the actual city rather than tourists looking at it. MASP's own building does the same trick architecturally: a museum that's also, quite literally, a piece of open civic space underneath it, holding a weekly antiques market rather than sitting empty. [The museum's own extraordinarily large and consistently strong rating](https://maps.google.com/?cid=16790816505338285473&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) reflects both things at once — a serious collection and a genuinely well-loved civic landmark.`;

const insiderTips = [
  "Time a visit for Tuesday or Wednesday if the museum itself is your priority — both days are free entry, and Tuesday's extended 8pm closing gives you the longest window of the week to see the collection.",
  "The MASP Antique Market runs only on Sundays, 8am-5pm, directly underneath the museum building — combine it with the avenue's car-free Sunday morning for the single best few-hour block on Paulista.",
];

const whatToAvoid = `Don't plan a car-free-avenue Sunday visit around a Monday — the avenue's pedestrian closure is Sundays only (7am-4pm), and MASP itself is closed entirely on Mondays, so a Monday visit gets you neither. And don't assume Sunday is the cheapest day to see MASP's collection — Sunday actually carries the R$35 admission fee; Tuesday and Wednesday are the genuinely free days, a detail easy to get backwards if you're assuming weekends are typically the "free museum day" the way some cities run it.`;

const practicalInfo = {
  hours: "MASP: Tue 10am-8pm, Wed-Thu 10am-6pm, Fri 10am-9pm, Sat-Sun 10am-6pm, closed Mon. Avenue car-free: Sundays 7am-4pm. Antique Market: Sundays 8am-5pm.",
  costRange: "MASP: free Tue & Wed; R$35 adults / R$17 seniors-students other days; free for children 9 and under. Avenue and antique market: free to walk.",
  bookingMethod: "No booking required for the avenue or market; MASP tickets can be bought at the door or online in advance for busier weekend slots.",
  website: "https://masp.org.br/en",
};

const gettingThere = "MASP sits directly on Avenida Paulista at the Trianon-MASP metro station (Line 2, Green) — one of the most centrally located and easily reached major attractions in the city.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Avenida Paulista & MASP",
      subtitle: "A car-free Sunday avenue, a museum suspended over an antiques market, and Picasso underneath both",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Bela Vista / Paulista",
      address: "Av. Paulista, 1578, Bela Vista, 01310-200 São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "MASP hours, free-day policy (Tue/Wed), Sunday pricing, and Sunday Antique Market hours (8am-5pm under the building) sourced from US News Travel's official visitor guide and Wikipedia's MASP Antique Market entry, cross-checked, 11 Sep 2026. Car-free Sunday avenue closure (7am-4pm) sourced from earlier destination-level research for this pack (Lonely Planet), corroborated across multiple sources. Trianon Park's direct proximity across from MASP sourced from Lonely Planet's São Paulo things-to-do feature. Real Google Maps rating confirmed via Places API, 11 Sep 2026: 4.7/112,358 reviews.",
      sport: ["formula_one"],
      moodTags: ["cultural", "iconic", "relaxing"],
      interestCategories: ["culture"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
      googleMapsRating: "4.7",
      googleMapsReviewCount: 112358,
      googleMapsUrl: "https://maps.google.com/?cid=16790816505338285473&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #16 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
