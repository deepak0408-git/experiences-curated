import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-grandstand-a-" + Date.now().toString(36);

const bodyContent = `Grandstand A sits on the banked entry into the start-finish straight, taking advantage of Interlagos' bowl-shaped layout — from your seat you can see cars working through the infield section before they come howling past uphill on the main straight itself. It's uncovered, bleacher-style seating, which is the honest reason it's one of the cheaper tickets at the circuit. It's also, by wide agreement among people who've sat here more than once, the loudest and most fun grandstand in the venue.

That reputation isn't about the racing view — Grandstand M or B give you a cleaner look at the cars. It's about what happens around you. A Grandstand crowds skew younger and rowdier than the covered premium stands, and the atmosphere runs the full weekend: singing, drums, flags, strangers becoming friends by Saturday afternoon. Food and drink near the stand itself is limited, but vendors walk the aisles selling snacks and beer straight to your seat, so you're not stuck making a long walk mid-session if you don't want to.

The tradeoff is real, not cosmetic. Bleacher seating means no back support and no shade — São Paulo in November can turn from overcast to full sun within an hour, and there's nowhere to hide from either rain or heat once a session starts. Bring what you need with you; once you're in your row for a session, getting back out and finding your way back in is not something you want to be doing repeatedly.`;

const whyItsSpecial = `Every grand prix has a stand where the ticket is cheap and the experience is loud, and every grand prix also has people who'll tell you the expensive covered seats are the only way to actually watch a race. Grandstand A at Interlagos is the case against that. You give up backrests and shade; what you get back is a bowl-shaped sightline into the infield most premium stands don't have, and a crowd that treats race weekend like the festival it actually is in this city. Brazilian fans are famous across the paddock for exactly this kind of noise — drivers have said as much on record for years — and A Grandstand is where a first-timer gets the fullest dose of it without paying for a suite. Sometimes the cheap seat is the good seat. This is one of those times.`;

const insiderTips = [
  "Grandstand A sold out well ahead of the 2026 race weekend on the official resale/ticket platform — if you want this specific stand, budget for buying early in the on-sale window rather than assuming it'll still be available a few months out.",
  "Because there's no shade and no cover, check the actual forecast in the days immediately before the race rather than packing based on a seasonal average — a clear morning and a downpour by mid-afternoon are both genuinely common outcomes for a São Paulo November weekend.",
];

const whatToAvoid = `Don't assume "cheaper" means "worse view of the racing" here — Grandstand A's elevated position on the bowl genuinely shows you more of the track than several pricier covered stands, so don't upgrade purely on the assumption that price tracks quality of sightline. And don't plan on a mid-session food run to somewhere better than what's walked to your seat — leaving your row to find better food means fighting your way back through a packed bleacher, and most people who try it end up missing the exact moment they left to avoid missing.`;

const practicalInfo = {
  hours: "Gates open ahead of each day's first on-track session, 6-8 Nov 2026",
  costRange: "Roughly US$280-290 for the 3-day weekend as of the most recent secondary-market pricing seen (2026 season) — treat this as an estimate, not an official figure; confirm current pricing on the official ticketing site before buying",
  bookingMethod: "Buy directly via Formula1.com's official ticketing partner for Brazil, or an authorized reseller — see the Ticket Guide elsewhere in this pack for the full buying strategy.",
  website: "https://www.formula1.com/en/racing/2026/brazil",
};

const gettingThere = "Grandstand A sits on the main straight side of the circuit — from the Autódromo train station (CPTM Line 9) it's a roughly 10-15 minute walk to the nearest entry gate serving this stand; official signage on race weekend directs ticket holders to the correct gate for their grandstand letter.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand A — The Loud Seat",
      subtitle: "Uncovered, cheap, and by far the rowdiest grandstand at Interlagos",
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
      editorialNote: "Location/view description (banked entry to start-finish straight, bowl-layout infield sightline, uncovered bleacher seating) sourced from GrandPrixGrandTours and F1Experiences' 'where to watch' blog features, 11 Sep 2026. Sold-out status confirmed live on brasilf1.com's own Grandstand A ticket page, 11 Sep 2026 (official reseller, showing 'Sold out' with no live price). Price estimate (~US$280-290 / 1,580 BRL for 3-day) sourced from GPDestinations' 2026 budget-planner page, a secondary aggregator, not the official site — flagged as an estimate in copy per skill's sourcing-confidence rule since it could not be corroborated on the official site (already sold out there).",
      sport: ["formula_one"],
      moodTags: ["energetic", "social", "budget-friendly"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
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

  console.log("Experience #2 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
