import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-where-to-stay-polanco-" + Date.now().toString(36);

const bodyContent = `Polanco is Mexico City's answer to Beverly Hills, and the comparison isn't just marketing shorthand — this is the neighborhood with the highest concentration of designer shopping, fine dining, and international diplomatic presence in the city, which brings with it a level of visible private security that makes it, alongside Roma Norte, one of the two neighborhoods consistently ranked safest for visitors. If Roma Norte and Condesa are about blending into a real, lived-in part of the city, Polanco is about staying somewhere polished and central to the city's wealthiest commercial district.

Las Alcobas, part of the Luxury Collection, occupies what was originally a private residence, redesigned entirely by Yabu Pushelberg. It's an intimate property by five-star standards — fewer rooms than a typical luxury chain hotel — and has landed on Travel + Leisure's World's Best list in recent years, which reflects a level of service consistency that a newer or larger property often can't match yet. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=9722632997139306258&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

JW Marriott Hotel Mexico City Polanco is the higher-volume, high-rise alternative — a familiar international brand with a genuinely large review base behind its rating, sitting a short walk from Polanco's main restaurant and shopping strip and roughly 10 minutes from the neighborhood's designer retail core. It won't have Las Alcobas' boutique intimacy, but it makes up for that with scale, consistency, and the kind of predictable service a major international chain is built to deliver. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=9426824700812873236&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Polanco sits further from Roma-Condesa and the historic center than either of those neighborhoods sits from each other, so factor in real travel time if you're planning to split your days between Polanco's shopping/dining and the rest of the city's sights. It's also the furthest of the three hotel neighborhoods in this pack from the circuit itself — plan accordingly on race days.`;

const whyItsSpecial = `Every major city has a neighborhood built for people who want the trip to feel effortless rather than immersive, and Polanco is Mexico City's version of that — a place where the shopping, the dining, and the hotel security all operate at an international-luxury standard that doesn't ask you to adjust your expectations for being in Mexico City specifically. That's a legitimate, deliberate choice for a race weekend already packed with sensory overload at the circuit — sometimes the right counterbalance to Foro Sol's noise isn't a quirky boutique hotel, it's a polished, predictable one.`;

const insiderTips = [
  "Book Las Alcobas specifically if boutique intimacy and a smaller room count matter to you — its Travel + Leisure recognition reflects a level of personal service a bigger property like JW Marriott isn't built to replicate, even at a comparable price point.",
  "Polanco sits noticeably further from the circuit than Roma Norte or Condesa — if you're attending all three days of race weekend, factor the extra travel time into your daily schedule rather than assuming Polanco's central-feeling location translates to circuit proximity.",
];

const whatToAvoid = `Don't book here expecting the same walkable, café-hopping character as Roma Norte or Condesa — Polanco's blocks are wider and more commercial, built around shopping and dining destinations rather than a dense network of small independent spots to wander between. And don't assume the whole neighborhood is equally safe and lively late at night just because Polanco has a strong overall safety reputation — the main strips (Avenida Presidente Masaryk, Campos Elíseos, around Parque Lincoln) stay busy and well-lit, but the quieter residential side streets thin out well before midnight, so use a rideshare rather than walking those stretches alone late.`;

const practicalInfo = {
  hours: "N/A — neighborhood and hotel guide",
  costRange: "Both properties sit at the luxury end — Las Alcobas typically the pricier of the two given its boutique positioning, JW Marriott offering more room-type flexibility at a relatively lower nightly rate for the same neighborhood",
  bookingMethod: "Book directly through each hotel's own site, via Booking.com, or through Marriott's own loyalty program for the JW Marriott specifically. Given the Día de Muertos overlap with race weekend, book earlier than usual.",
  website: "https://www.lasalcobas.com, https://www.marriott.com/en-us/hotels/mexpj-jw-marriott-hotel-mexico-city-polanco",
};

const gettingThere = "Polanco is the furthest of this pack's three recommended neighborhoods from the circuit — plan a taxi or rideshare to the nearest Metro Line 9 connection (Auditorio or Polanco stations on Line 7, connecting onward) and budget extra time on race days.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay in Polanco",
      subtitle: "The 'Beverly Hills of CDMX' — polished, secure, and the furthest from the circuit",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Polanco",
      address: "Polanco, Miguel Hidalgo, Mexico City",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [
        { platform: "Booking.com", url: "https://www.booking.com/hotel/mx/las-alcobas.html", pricePoint: "luxury" },
        { platform: "Booking.com", url: "https://www.booking.com/hotel/mx/jw-marriott-mexico-city-polanco.html", pricePoint: "luxury" },
      ],
      editorialNote: "Polanco safety/character sourced from CasaGoliana.com's safest-neighborhoods guide, Sep 2026. Hotel picks (Las Alcobas, JW Marriott Polanco) sourced from Expedia and TravelExperta.com Polanco luxury-hotel roundups; Google ratings via Places API lookup same session (Las Alcobas 4.6/589 reviews, JW Marriott 4.7/6,189 reviews). Multi-venue: MULTI_VENUE_RATINGS entry required, venueCount 2. First What to Avoid replaced 6 Sep 2026 — it restated bodyContent's own 'furthest from circuit' fact verbatim. Replaced with street-level late-night guidance (main strips vs. quieter residential side streets), sourced from TravelInsighter.com and TourInABox.com's Polanco safety guides, 6 Sep 2026 — a more specific, actionable distinction than the neighborhood's general safety reputation already covered elsewhere.",
      sport: ["formula_one"],
      moodTags: ["luxury", "polished", "shopping"],
      interestCategories: ["accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #11 seeded:", result.title, "|", result.id, "|", result.slug);
  console.log("REMINDER: add MULTI_VENUE_RATINGS entry, venueCount=2");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
