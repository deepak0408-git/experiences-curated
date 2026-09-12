import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-hospitality-paddock-club-" + Date.now().toString(36);

const bodyContent = `F1 Paddock Club sits directly above the team garages on the main straight, and the position is the whole point — you're looking straight down at pit lane and the start-finish line, not watching it on a screen from somewhere else at the circuit. The package runs all-inclusive: curated local menus, an open bar with spirits, champagne, wine and beer, a guided one-day paddock tour, a daily pit lane walk to watch teams practice stops up close, and a scheduled appearance from an F1 insider — a driver, a team executive, or a media figure, timing announced closer to the weekend. It's genuinely sold out well ahead of the 2026 race, which tells you something about how this specific circuit's Paddock Club is regarded relative to less in-demand rounds on the calendar.

Champions Club sits one tier below and covers a real gap between grandstand and full Paddock Club rather than feeling like a diluted version of it. Gourmet canapés and a proper lunch service, an open bar, and two things worth naming specifically: an exclusive Grid Walk paired with a Championship Trophy photo op on Friday or Saturday — you're standing among the actual cars on the grid, and photographed next to the real World Championship trophies, not a replica — plus a one-time guided tour of the Paddock itself led by an expert host. It's the tier built for someone who wants real access and a genuine "were you actually there" moment without paying Paddock Club's premium.

Both tiers include reserved seating with sightlines onto the main straight and grid, so neither is purely a lounge experience disconnected from the racing — you can watch sessions from your seat and step into the hospitality space between them. Brazil's Paddock Club and Champions Club both run as 3-day packages only; there's no single-day hospitality product at Interlagos.`;

const whyItsSpecial = `Most hospitality tiers at most circuits sell the same three things with different fonts: better food, a better view, a nicer bathroom. Champions Club's Grid Walk and Trophy photo breaks that pattern — it's a specific, ownable moment that a grandstand ticket, or even Paddock Club's own daily rhythm, doesn't automatically include in the same form. Standing on the actual grid before a session, next to the real trophies rather than a marketing prop, is the kind of thing people describe years later, not just "the food was good." Interlagos' own Paddock Club selling out this far ahead says something too — teams and drivers have talked for years about how loud and committed the Brazilian crowd is, and that reputation clearly extends to the people willing to pay for the best seat to watch it from.`;

const insiderTips = [
  "F1 Paddock Club for Brazil 2026 was already showing sold out on F1 Experiences' own site well ahead of the race — if this tier matters to you, treat the on-sale window as the real deadline, the same buying-urgency pattern that's hit several individual grandstands at this specific circuit.",
  "Champions Club's Grid Walk and Trophy photo happens on one specific day (Friday or Saturday, confirmed closer to the weekend) — if you're only attending part of the weekend, confirm which day it falls on before locking in your travel dates, since missing that one day means missing the tier's signature moment.",
];

const whatToAvoid = `Don't assume Champions Club is simply "Paddock Club but cheaper" — it's a genuinely different package built around one standout moment (the Grid Walk and Trophy photo) rather than Paddock Club's all-weekend access and daily pit lane walks, so pick based on which specific experience you actually want, not just budget. And don't wait to decide — both tiers are 3-day-only with no single-day option, so there's no way to test the experience with a smaller commitment first; the decision has to be made for the full weekend up front.`;

const practicalInfo = {
  hours: "Access follows the full 3-day race weekend schedule, 6-8 Nov 2026; Grid Walk/Trophy photo scheduled for one specific day, confirmed closer to the event",
  costRange: "Premium hospitality tickets for major F1 rounds typically run from the low thousands (Champions Club-tier) into the $6,000-8,000+ range per person for Paddock Club on a 3-day basis — exact 2026 Brazil pricing was not published on official pages at time of research, both tiers showing sold out",
  bookingMethod: "Book via F1 Experiences (the official Paddock Club/Champions Club operator) or an authorized reseller — check current availability directly, as both tiers were sold out as of Sep 2026 for the 2026 race weekend.",
  website: "https://f1experiences.com/2026-brazilian-grand-prix",
};

const gettingThere = "Paddock Club and Champions Club entrances are on the main straight side of the circuit, accessed via dedicated hospitality gates — full directions and transfer details are provided directly by F1 Experiences to ticket holders ahead of the event.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Paddock Club & Champions Club — Hospitality Tiers",
      subtitle: "A grid walk with the real trophies, or a straight-down view onto pit lane from above the garages",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Interlagos",
      address: "Autódromo José Carlos Pace, Av. Senador Teotônio Vilela, 261, Interlagos, 04329-030 São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Paddock Club inclusions (position above garages, all-inclusive catering/open bar, daily pit lane walk, one-day paddock tour, F1 insider appearance) sourced from F1Experiences' own official 2026 Brazil Paddock Club package page, 11 Sep 2026 — confirmed sold out on that same page. Champions Club inclusions (canapés/lunch, open bar, Grid Walk + Championship Trophy photo, one-time guided paddock tour) sourced from RaceExperiences.com's Champions Club package listing, cross-referenced with F1Experiences' Champions Club page, 11 Sep 2026. Price range is a general F1-hospitality-market estimate (recent signals across major rounds), not a Brazil-specific confirmed figure, since neither tier displayed live 2026 pricing — both were sold out at time of research; flagged accordingly in copy rather than presented as confirmed. Concierge-worthy: yes — genuine VIP hospitality tier with real lead-time trap (sold out) — howToBook left for a follow-up pass once a real contact/booking-window fact beyond 'sold out, check resellers' can be sourced.",
      sport: ["formula_one"],
      moodTags: ["luxurious", "exclusive"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #5 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
