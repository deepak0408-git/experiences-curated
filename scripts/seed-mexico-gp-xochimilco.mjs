import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-xochimilco-" + Date.now().toString(36);

const bodyContent = `Xochimilco is what's left of the canal system that once covered the Aztec capital of Tenochtitlán, and it's the closest thing Mexico City has to a floating festival you can book by the hour. A trajinera — a flat-bottomed, brightly painted boat, poled along the canals rather than motored — is the standard way to see it, and the experience is less a scenic boat ride than a slow-moving party: vendors in smaller boats pull up alongside yours selling quesadillas, micheladas, and snacks, while roving mariachi bands can be hired to play directly from their own boat for a set price per song.

The official 2026 regulated rate is 750 pesos per hour per boat (not per person) — most trajineras carry a group, so splitting that cost across your party makes it genuinely affordable. If you'd rather not book a whole boat, shared trajineras run from Embarcadero Nuevo Nativitas at roughly 45 pesos for a 30-minute one-way trip or 90 pesos for a full hour round trip, per person. Most operators require a two-hour minimum booking, and two to three hours is the recommended window to actually enjoy the canals rather than feel rushed.

There are two main embarcaderos (launch points), and which one you pick genuinely changes the experience: Nuevo Nativitas is the more tourist-oriented, busier option, while Cuemanco is quieter and more local. Weekends, especially Sunday, are genuinely crowded and festive — if a lively, packed-canal atmosphere with music from every direction sounds appealing, that's the day to go. If you'd rather a calmer, more contemplative version of the same canals, an early weekday morning is a completely different experience on the same water.

A few practical realities worth knowing before you go: trajineras run cash-only, so bring small bills for food, drinks, and any mariachi hire. Cell signal is spotty once you're out on the canals, so download music or podcasts in advance if you want a soundtrack beyond whatever floats by. And bathroom access is limited once you're on the water — use the facilities at the embarcadero before boarding, not after.`;

const whyItsSpecial = `Most cities with a historic canal system have turned it into something quiet and reverent — a gondola ride, a slow contemplative float. Xochimilco goes the opposite direction entirely, and that's exactly what makes it worth doing. This is Tenochtitlán's actual surviving waterway repurposed into a genuinely loud, colorful, moving party, complete with a floating economy of food vendors and mariachi bands competing for your attention from boat to boat. It's simultaneously a real piece of Aztec-era infrastructure and one of the most unpretentious, purely fun things to do in the entire city — a combination that's harder to find than it sounds.`;

const insiderTips = [
  "The official 750 peso/hour rate is per boat, not per person — if you show up without a pre-booked reservation, know this rate and expect to negotiate from it, since walk-up pricing without a reference point is where visitors commonly overpay.",
  "Choose your embarcadero deliberately: Nuevo Nativitas for a busier, more classically touristy scene, Cuemanco if you want a quieter, more local version of the same canals — they're genuinely different experiences on the same water system.",
];

const whatToAvoid = `Don't use the Belem dock — locals and repeat visitors consistently point to it as the one where operators overcharge tourists the most, sometimes claiming a posted rate is "per person" when it's actually per boat, which can double what you end up paying versus the real regulated rate. Nuevo Nativitas or Cuemanco are the more reliably fair-priced starting points. And don't drink heavily while you're on the water — it's a genuinely easy environment to overdo it in given how freely vendor boats sell micheladas and beer throughout the trip, but intoxication on a boat with open sides and no real supervision is a real, avoidable safety risk, not just a buzzkill warning.`;

const practicalInfo = {
  hours: "Most embarcaderos operate daytime hours, roughly 9am-6pm — weekday mornings are noticeably calmer than weekend afternoons",
  costRange: "750 MXN per hour per boat (official regulated rate) — shared trajineras from Embarcadero Nuevo Nativitas run 45-90 MXN per person depending on route/duration",
  bookingMethod: "Book online in advance for weekends/holidays for instant confirmation and fixed pricing — walk-up booking at the embarcadero is also possible but involves per-boat pricing and some negotiation.",
  website: "https://www.casagoliana.com/blog/xochimilco-trajineras-guide",
};

const gettingThere = "Reachable via Metro Tren Ligero (light rail) to Xochimilco station, followed by a short taxi or walk to your chosen embarcadero — allow real travel time, as Xochimilco sits well south of central Mexico City.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Xochimilco & the Trajinera Canals",
      subtitle: "A floating party on Tenochtitlán's surviving waterways — mariachi, tacos, and a slow-poled boat",
      slug,
      experienceType: "activity",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Xochimilco",
      address: "Embarcadero Nuevo Nativitas, Xochimilco, Ciudad de México",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Pricing (750 MXN/hour regulated rate, shared trajinera pricing), embarcadero comparison, and cash-only/practical detail sourced from CasaGoliana.com's 2026 Xochimilco guide and SlightNorth.com's boat guide, Sep 2026. Google rating via Places API lookup, retried with more specific query per skill guidance after a bare 'Xochimilco' search returned no rating (borough-level entity, not a rateable single venue) — Embarcadero Nuevo Nativitas 4.4/16,370 reviews used as the real, addressable launch point. What to Avoid rebuilt 6 Sep 2026 after both original avoids were found to restate bodyContent verbatim — replaced with 2 genuinely new avoids: the Belem dock overcharging risk and the per-person/per-boat pricing scam mechanic (sourced from ForTheRoadTravels.com's Xochimilco scam-avoidance guide, 6 Sep 2026), and on-water alcohol safety (sourced from general Xochimilco visitor-safety guides, 6 Sep 2026) — neither previously mentioned in this experience.",
      sport: ["formula_one"],
      moodTags: ["festive", "colorful", "group-friendly"],
      interestCategories: ["culture", "activity"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "MXN",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
      googleMapsRating: "4.4",
      googleMapsReviewCount: 16370,
      googleMapsUrl: "https://maps.google.com/?cid=18227576249178908905&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #19 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
