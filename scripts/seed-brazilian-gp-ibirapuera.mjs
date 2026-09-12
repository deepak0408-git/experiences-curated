import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-ibirapuera-park-" + Date.now().toString(36);

const bodyContent = `Ibirapuera is São Paulo's answer to Central Park, and it works the way those big civic parks are supposed to — genuinely used by residents for running, cycling, and Sunday family time, not preserved as a scenic backdrop for visitors. Entry is free, and the park stays open around the clock on weekends, 5am to midnight on weekdays.

Three institutions inside the park are worth planning around. The Museum of Modern Art (MAM) runs pay-what-you-wish admission, Tuesday through Sunday, 10am-6pm, showing Brazilian modern art alongside a sculpture garden worth walking even if you skip the interior. The Oca — a striking domed pavilion, one of Oscar Niemeyer's contributions to the park's modernist architecture — hosts rotating major art and science exhibitions rather than a fixed collection, so what's on when you visit is worth checking ahead. The Afro Brasil Museum covers Black Brazilian history and culture in serious depth, charges R$15 regular admission, and runs free on Saturdays and Wednesdays — genuinely one of the more substantive museum experiences in the city, not a token cultural stop.

The Ibirapuera Planetarium, Brazil's first, runs immersive astronomy shows on weekends for R$20 — worth booking ahead rather than showing up and hoping for a spot. Bike rental kiosks sit near the main entrances, running R$15-25 per hour, and the park's paved paths make cycling a genuinely good way to cover its scale, which is considerable — this isn't a park you fully see on foot in an hour.`;

const whyItsSpecial = `A lot of "green space near the city center" recommendations are really just "somewhere quiet to sit for twenty minutes." Ibirapuera earns [its extraordinarily high, extraordinarily well-attested rating](https://maps.google.com/?cid=14669175105504732481&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) by being something closer to a genuine cultural district wrapped in parkland — three real museums, a planetarium, and Niemeyer architecture, all inside a space residents actually use every single day rather than reserve for tourists. It's the rare park where you could spend a full day and not run out of things worth doing, and still have room left over just to sit under a tree.`;

const insiderTips = [
  "The Oca's exhibitions rotate, so check what's actually showing before you go — the building itself is worth seeing regardless, but a major touring exhibition can be the difference between a quick stop and a genuine half-day visit.",
  "The Afro Brasil Museum is free on both Wednesdays and Saturdays — if your schedule allows any flexibility, timing a visit to one of those two days turns a genuinely worthwhile R$15 museum into a free one.",
];

const whatToAvoid = `Don't assume the whole park is free to fully experience — entry itself costs nothing, but the museums, planetarium, and any special exhibitions at the Oca carry their own separate admission, so budget for at least one or two of those if you want more than a walk through the grounds. And don't try to see everything in one visit unless you're planning a full day — the park's scale means MAM, the Oca, the Afro Brasil Museum, and the planetarium genuinely can't all be done justice in a rushed few hours.`;

const practicalInfo = {
  hours: "Park: 5am-midnight weekdays, 24 hours weekends. MAM: Tue-Sun 10am-6pm. Afro Brasil Museum: check current hours, closed Mondays typical for São Paulo museums. Planetarium shows run weekends — book ahead.",
  costRange: "Park entry free. MAM: pay-what-you-wish. Afro Brasil Museum: R$15 (free Wed & Sat). Planetarium: R$20. Bike rental: R$15-25/hour.",
  bookingMethod: "No booking needed for park entry or MAM; book planetarium shows ahead online where possible, especially on weekends.",
  website: "https://parqueibirapuera.org",
};

const gettingThere = "Nearest metro stations are Ibirapuera (Line 5, Lilac) or a combination of bus routes from Paulista Avenue; also walkable (15-20 minutes) from parts of Vila Nova Conceição and Itaim Bibi.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Ibirapuera Park",
      subtitle: "Three museums, a planetarium, and Niemeyer architecture inside São Paulo's answer to Central Park",
      slug,
      experienceType: "natural_wonder",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Ibirapuera",
      address: "Av. Pedro Álvares Cabral, s/n, Vila Mariana, 04094-050 São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Park hours, museum details (MAM pay-what-you-wish/hours, Afro Brasil Museum pricing/free days, Oca exhibition format, Planetarium pricing/booking), and bike rental pricing all sourced from Audiala's dedicated Ibirapuera Park guide, cross-checked against NextStopBrazil's things-to-do piece, 11 Sep 2026. Real Google Maps rating confirmed via Places API, 11 Sep 2026: 4.8/297,716 reviews — an exceptionally large, well-attested sample.",
      sport: ["formula_one"],
      moodTags: ["relaxing", "cultural", "active"],
      interestCategories: ["culture", "nature"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
      googleMapsRating: "4.8",
      googleMapsReviewCount: 297716,
      googleMapsUrl: "https://maps.google.com/?cid=14669175105504732481&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #15 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
