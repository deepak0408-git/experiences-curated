import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-grandstand-m-" + Date.now().toString(36);

const bodyContent = `Grandstand M sits on the outside of Turn 1, looking straight down the hill as the field arrives three-wide off the start-finish straight and dives into Interlagos' downhill opening corner — one of the genuine overtaking spots on this circuit, and the place where a first-lap race gets decided or wrecked more often than not. Unlike Grandstand A, M is covered, with numbered reserved seating, so you're not fighting for a sightline or standing through five hours of racing.

The location does two jobs at once. You get the wheel-to-wheel chaos of Turn 1 on lights-out, and because M also has a clear line back toward the main straight and pit exit, you catch cars accelerating out of the pits and setting up their entry into the corner all weekend, not just at the start. Screens along the stand fill in whatever the naked eye misses elsewhere on the lap. Food, drink, and a team-merchandise shop sit within the stand itself, which matters more here than it sounds — reserved seating means you're less likely to lose your spot stepping out.

This is a genuinely popular stand, and it shows in how early it tends to sell. If Turn 1 racing is the specific thing you want to watch — not the general atmosphere of the main straight, not the technical middle sector — M is the answer, but only if you move on it early.`;

const whyItsSpecial = `Grand prix circuits mostly save their real drama for one or two corners, and everywhere else is context. Interlagos' Turn 1 is one of the genuine ones — a downhill, off-camber dive where a driver arriving in fourth can leave in first, or arriving in first can leave in the wall. Grandstand M puts you directly on top of that decision point, covered and seated, which is a rarer combination than it should be at a circuit this size. Most stands make you choose between comfort and drama. This one doesn't ask you to.`;

const insiderTips = [
  "Grandstand M has historically sold out well ahead of race weekend — if Turn 1 is the corner you want, treat the ticket on-sale date as a real deadline, not a soft target, since 'buy it later in the year' has meant 'sold out' more often than not.",
  "Because M sits close to where cars exit the pits as well as Turn 1 itself, arrive for opening practice on Friday if you can — it's the one session where you'll see the pit-exit-to-Turn-1 sequence at a relaxed pace before race-day traffic makes it harder to follow any single car through the corner.",
];

const whatToAvoid = `Don't wait to buy this one — unlike some of the covered mid-tier stands that stay available closer to the date, M has a track record of selling out early precisely because the Turn 1 view is this well known. And don't expect M to give you a clean view of the rest of the lap — it's a corner-specific stand, so if you want to follow a full lap visually rather than one key moment, a stand with a longer sightline down the main straight (see Grandstand A or B) suits that better.`;

const practicalInfo = {
  hours: "Gates open ahead of each day's first on-track session, 6-8 Nov 2026",
  costRange: "Mid-to-upper covered-grandstand pricing (Interlagos' covered stands generally run higher than uncovered options like A or G) — check current pricing directly, as M was already sold out on the official reseller as of Sep 2026",
  bookingMethod: "Buy directly via Formula1.com's official ticketing partner for Brazil, or join the official waitlist/notification list if sold out — see the Ticket Guide elsewhere in this pack for the full buying strategy.",
  website: "https://www.formula1.com/en/racing/2026/brazil",
};

const gettingThere = "Grandstand M sits near Turn 1 on the circuit's main straight side — from the Autódromo train station (CPTM Line 9), follow official race-weekend signage toward the Turn 1/Grandstand M entry gates, roughly a 10-15 minute walk.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand M — Turn 1, Covered and Reserved",
      subtitle: "The downhill first corner where Interlagos races are won and lost on lap one",
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
      editorialNote: "Location/view/coverage description (outside of Turn 1, covered, numbered seating, screens, food/merch on-site) sourced from GrandPrixGrandTours' circuit guide and F1SaoPaulo.com.br's official stands page, 11 Sep 2026. Sold-out status confirmed live on brasilf1.com's own Grandstand M ticket page, 11 Sep 2026 (official reseller) — no live price could be sourced as a result, so costRange is described qualitatively (mid-to-upper covered tier) rather than with an invented figure, per skill's rule against fabricating a precise number when the real one is unpublished/unavailable.",
      sport: ["formula_one"],
      moodTags: ["energetic", "iconic"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
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

  console.log("Experience #3 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
