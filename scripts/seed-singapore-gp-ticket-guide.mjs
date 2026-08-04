import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-ticket-guide-" + Date.now().toString(36);

const bodyContent = `Sixteen grandstands ring the Marina Bay Street Circuit, each with a real, different answer to "what will I actually see." Add two Walkabout tiers and you've got eighteen ways to watch the same race, from S$608 to S$2,498 for three days.

The first decision isn't which stand, it's seat or feet. A grandstand ticket is a fixed, numbered seat for all three days, facing one part of the track. Walkabout gets you standing room and freedom to roam between viewing platforms inside your zone, no seat guaranteed. Zone 4 Walkabout is the cheapest ticket at the race, S$198 Friday climbing to S$368 by Sunday, and it still gets you into the Padang Stage concerts. Premier Walkabout costs more but opens all four zones instead of one.

The sixteen grandstands split into a few real groups. Super Pit (S$2,498) and Pit Grandstand/Turn 2 (S$1,798) sit right where the race starts, where most overtaking happens on lap one — Turn 2 gives a front-on view of the main straight and the first three corners. That's what the top tier buys: proximity and angle, not a fundamentally different race.

The waterfront cluster, Bay, Bayfront, Skyline, Promenade, and Marina Bay, covers the circuit's last, most dramatic stretch. Bay Grandstand is one of the biggest on the entire F1 calendar, 27,000 seats, with cars diving through the tight, wall-lined Turns 18–19 directly beneath you before the final straight. Marina Bay Grandstand watches the same two corners from a different angle, Flyer glowing behind the track. Bayfront and Promenade sit around Turns 16–18, catching braking out of a high-speed straight and the run past the Flyer. Skyline, between Turns 17–18 right before pit entry, is where drivers are most likely to make a mistake under pressure.

The mid-tier stands trade some of that for atmosphere or a specific corner, and some are the better pick. Stamford, at S$608 the cheapest grandstand, sits at the end of the longest straight on the calendar, watching hard braking into Turn 7. Padang (S$738) sits between Turns 9–10, right next to the main concert stage, so the atmosphere never dies between sessions. Republic (S$988) looks onto Turn 5's kink into the first DRS zone and throws in a free Singapore Flyer ride. Connaught (S$738) watches Turn 14, a tight DRS-zone corner with genuine wheel-to-wheel racing. Empress (S$738) sits between Turns 11–12, peak braking across the Anderson Bridge.

Stamford or Padang get real racing and real atmosphere for under a third of Super Pit's price. That's the trade worth knowing before spending more just because a stand sits closer to the start line.

By mid-2026, most 3-day grandstands and every Sunday-inclusive ticket had already sold out, leaving mostly single-day Friday/Saturday options for late buyers. If you're planning ahead, that's the real risk: not the price climbing, but the option disappearing while you're still deciding.`;

const whyItsSpecial = `Most ticket guides for Singapore list prices high to low and let you guess what you're buying. That's backwards here — Marina Bay is a street track where sightlines change completely every few hundred metres, so the same price gap between two stands can mean two different races. Stamford and Padang get you real racing for a third of Super Pit's price; the waterfront stands sell the skyline; the mid-tier stands sell specific corners worth knowing about. None of these are wrong choices, they're different nights out, and knowing which one you're actually buying before you commit S$600 to S$2,500 matters more than another list sorted by price.`;

const insiderTips = [
  "If you want both racing and the Padang Stage concerts (JJ Lin/CORTIS Friday, Zara Larsson/The Killers Saturday, Lana Del Rey/James Arthur Sunday), Padang Grandstand or Zone 4/Premier Walkabout sit closest to the stage without relocating after the flag.",
  "Republic Grandstand ticket holders get a free Singapore Flyer ride on a first-come-first-served basis — not advertised prominently on the main ticket page, worth building into your day.",
];

const whatToAvoid = `Don't assume the priciest stand is automatically the best view — Super Pit and Pit Grandstand cost more than triple Stamford's price mainly for start-line proximity, not a meaningfully different race. And don't wait until close to race week to decide: most 3-day grandstands and every Sunday-inclusive ticket have historically sold out early, leaving only single-day Friday/Saturday tickets for late buyers — the tier disappears, not just the discount.`;

const practicalInfo = {
  hours: "Race weekend sessions run Friday–Sunday, 9–11 Oct 2026, into the evening under floodlights",
  costRange: "S$608–S$2,498 (3-day grandstands); S$198–S$728 (Walkabout, single-day to 3-day)",
  bookingMethod: "Buy directly via tickets.formula1.com or singaporegp.sg — both show live per-grandstand pricing and availability. Most 3-day grandstands and Sunday-inclusive tickets sell out by mid-year, so check early if a specific stand matters.",
  howToBook: "",
  website: "https://tickets.formula1.com/en/f1-3301-singapore, https://singaporegp.sg/en/tickets/general-tickets/grandstands/",
  reservationsRequired: true,
};

const gettingThere = "MRT to Promenade, City Hall, Raffles Place, or Esplanade depending on your grandstand — MRT service is extended to 1am on race weekend.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand or Walkabout — the real ticket decision",
      subtitle: "Sixteen grandstands, two Walkabout tiers, one honest guide to which suits how you want to watch",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "Marina Bay Street Circuit, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from singaporegp.sg official grandstand pages (all 16 stands), tickets.formula1.com, motorsporttickets.com, grandprixgrandtours.com. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "strategic"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: true,
      availability: "event_only",
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
