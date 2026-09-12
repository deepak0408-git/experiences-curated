import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-first-timer-guide-" + Date.now().toString(36);

const bodyContent = `São Paulo is enormous — genuinely one of the largest cities in the world by metro population — and a first-time visitor's biggest adjustment isn't language or culture, it's scale. The practical setup that works best: stay in one of the well-connected, well-established neighborhoods (Jardins, Itaim Bibi, Pinheiros, Vila Madalena, or right on Avenida Paulista), and lean on rideshare apps rather than trying to hail anything on the street.

Uber and the Brazilian app 99 are both widely used, genuinely affordable (roughly R$15-30 for most trips between central neighborhoods), and the standard way locals and visitors alike get around after dark. The basic safety habits that matter: confirm the license plate and driver photo match what the app shows before getting in, sit in the back, and wait for your ride inside a building rather than out on the open street. Never hail a street taxi — one of the most common scams in the city involves rigged meters or drivers refusing to use the meter at all and quoting an inflated flat fare instead.

For getting to Interlagos specifically, the São Paulo Metrô app (or Moovit, which covers the whole transit network) helps you plan the Line 9 route to the Autódromo stop — see the Getting to Interlagos experience elsewhere in this pack for the full route. A Bilhete Único transit card is worth buying on day one regardless of how much you plan to use the metro, since it also works on the city's bus network.

General safety in São Paulo follows the same logic as any large global city: stick to well-established areas, use rideshare rather than walking alone late at night in unfamiliar neighborhoods, and keep valuables low-key rather than displayed. None of this is unique to São Paulo — it's standard big-city practice, and the vast majority of a race-weekend visit in the areas covered by this pack is genuinely straightforward.`;

const whyItsSpecial = `Every big city generates its own version of "is it safe" anxiety for first-time visitors, and São Paulo gets more of that than it probably deserves relative to how most visitors actually experience it. The honest answer is that a trip built around Jardins, Itaim Bibi, Vila Madalena, and Interlagos itself — which is exactly what this pack covers — sits well within the city's most straightforward, well-connected areas. Knowing the two or three real, specific precautions (rideshare over street taxis, confirm the plate, stay in the established neighborhoods) does more for an actual first-time visitor than a vague sense of unease ever will.`;

const insiderTips = [
  "Download both Uber and 99 before you arrive — 99 sometimes has shorter wait times or lower prices depending on the neighborhood and time of day, and having both gives you a genuine fallback if one app is slow to find a driver.",
  "Buy a Bilhete Único card on your first day even if you're mostly using rideshare — it works across both the metro and bus network, and having it ready removes one thing to figure out on race day itself when you're trying to get to Interlagos on time.",
];

const whatToAvoid = `Don't hail a street taxi under any circumstances, even one that looks official — rigged meters and inflated flat-fare scams are a real, well-documented issue specifically with unregulated street taxis in this city, and rideshare apps exist precisely to avoid this problem. And don't wait for your rideshare out on the open sidewalk, especially after dark — wait inside a lobby, restaurant, or shop and time your exit to when the car actually arrives, standard practice locals and safety guides both recommend consistently.`;

const practicalInfo = {
  hours: "N/A — general orientation guide",
  costRange: "Rideshare: roughly R$15-30 for most trips between central neighborhoods. Bilhete Único: loaded with credit as needed, standard city transit fares apply.",
  bookingMethod: "Download Uber and 99 before arrival; buy a Bilhete Único card at any metro station.",
  website: "https://www.uber.com/global/en/cities/sao-paulo",
};

const gettingThere = "N/A — this experience covers city-wide orientation, not a single location.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "First-Timer's Guide to São Paulo",
      subtitle: "Rideshare over taxis, established neighborhoods, and the two apps worth downloading before you land",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "São Paulo (city-wide)",
      address: "São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Rideshare safety guidance (confirm plate/photo, back seat, wait indoors, never street taxis, rigged-meter scam warning) sourced from BrazilSafeTravel's dedicated Uber-safety guide and multiple safety-focused travel sites, cross-checked, 11 Sep 2026. Recommended neighborhoods (Jardins, Itaim Bibi, Pinheiros, Vila Madalena, Avenida Paulista) sourced from BeforeYouGoTravels' 2026 São Paulo safety assessment, consistent with this pack's own accommodation recommendations. Rideshare pricing (R$15-30 typical) sourced from the same safety-guide research pass.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["culture"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "free",
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

  console.log("Experience #23 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
