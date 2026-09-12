import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-mani-" + Date.now().toString(36);

const bodyContent = `Maní occupies a small converted house in Jardim Paulistano — three connected rooms in simple white tones, nothing about the room itself announcing that it holds one of São Paulo's most respected kitchens. Chef Helena Rizzo has run it for close to two decades, working in recent years alongside Belgian chef Willem Vandeven, and the restaurant carries a Michelin star along with 95 points on La Liste, the two most-cited independent rankings in the industry.

The cooking is built on Brazilian ingredients — the restaurant states roughly 90% organic sourcing — reworked through contemporary technique rather than presented traditionally. Cashew ceviche and a squid fideuá (a paella-style dish built on tiny toasted pasta instead of rice) are the two dishes that come up most often as signatures, though the menu shifts with what's genuinely in season. You can order a shorter three-course tasting format or opt into the chefs' own longer tasting menu if you want to see the kitchen's full range in one sitting.

Maní is closed Mondays, and hours the rest of the week split into a lunch and dinner service rather than running continuously — a genuine sit-down, reservation-driven restaurant rather than a flexible walk-in spot. Given the room's small scale, that reservation matters more here than at a larger restaurant with more tables to work with.`;

const whyItsSpecial = `São Paulo has no shortage of restaurants chasing international fine-dining templates, and Maní's real distinction is that it never really tried to. Helena Rizzo built a menu around Brazilian ingredients and Brazilian technique long before "hyper-local" became a global restaurant cliché, and the Michelin star and La Liste ranking [confirm what a genuinely large, sustained body of guest opinion already says](https://maps.google.com/?cid=7150229172156127224&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) — this isn't a newly-hyped opening riding a moment, it's a restaurant that's held its standard for years. A cashew ceviche sounds like a small idea on a menu until you understand it as the encapsulation of the whole project: a genuinely native ingredient, treated with real technical seriousness, served without apology for either half of that description.`;

const insiderTips = [
  "Maní is closed on Mondays — if your race-weekend trip only overlaps a Monday for a free dinner slot, book somewhere else that night and plan this one for a Tuesday-through-Sunday evening instead.",
  "The three-course tasting format is the accessible entry point if you're unsure about committing to the full chefs' tasting menu — it still gives you a starter, main, and dessert built by the same kitchen without the longer time and cost commitment.",
];

const whatToAvoid = `Don't show up without a reservation expecting to be seated — the room is genuinely small (three connected spaces in a converted house), and a Michelin-starred kitchen at this scale fills up well ahead, especially on weekend evenings. And don't assume lunch and dinner run as one continuous service — Maní closes between the two, so check the exact hours for the day you're planning to visit rather than assuming an all-afternoon window.`;

const practicalInfo = {
  hours: "Closed Mondays. Tue-Sun: lunch 12:00pm-3:00pm, dinner 8:00pm-11:30pm (hours vary slightly by day — confirm directly when booking)",
  costRange: "Tasting menu around US$120 per person; à la carte options also available at a lower per-dish cost",
  bookingMethod: "Reservations required — book via the restaurant's official website or by phone well ahead, especially for weekend dinner service.",
  website: "https://www.restaurantemani.com.br",
};

const gettingThere = "Rua Joaquim Antunes, 210, Jardim Paulistano, São Paulo. Reachable by taxi/rideshare from Jardins, Itaim Bibi, or Vila Nova Conceição in 10-15 minutes; nearest metro is Faria Lima or Fradique Coutinho on Line 4 (Yellow).";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Maní — Helena Rizzo's Michelin-Starred Kitchen",
      subtitle: "Brazilian ingredients, contemporary technique, one of São Paulo's most sustained fine-dining reputations",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Jardim Paulistano",
      address: "Rua Joaquim Antunes, 210, Jardim Paulistano, 05415-000 São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Restaurant description (Chef Helena Rizzo, collaboration with Willem Vandeven, ~90% organic Brazilian ingredients, cashew ceviche and squid fideuá signature dishes, Michelin star, 95 La Liste points, ~US$120 tasting menu) sourced from Michelin Guide's own official listing and TheWorlds50Best's discovery profile, 11 Sep 2026. Address and hours (closed Mondays, split lunch/dinner service) sourced from aggregator listing data cross-checked against Michelin Guide, 11 Sep 2026. Real Google Maps rating confirmed via Places API, 11 Sep 2026: 4.5/2,162 reviews.",
      sport: ["formula_one"],
      moodTags: ["upscale", "distinctive", "romantic"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
      googleMapsRating: "4.5",
      googleMapsReviewCount: 2162,
      googleMapsUrl: "https://maps.google.com/?cid=7150229172156127224&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #12 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
