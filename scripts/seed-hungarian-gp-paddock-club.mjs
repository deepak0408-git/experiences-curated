import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "paddock-club-hungaroring-" + Date.now().toString(36);

const bodyContent = `The Paddock Club sits directly above the team garages on the main straight, looking down onto both the start-finish line and the grid. It's F1's own official hospitality product, run by the sport rather than a third-party operator, and it's built around access as much as comfort: daily pit lane walks that take you past the actual team garages, a curated local food menu running all three days, and an open bar that includes champagne rather than treating it as an add-on.

What separates Paddock Club from the tier below it, the Champions Club, is mostly position and access. Champions Club gets you excellent hospitality and a good view; Paddock Club gets you the same, from directly above where the cars are actually being worked on, plus the pit walk. For a circuit like the Hungaroring, where most of the lap is technical and mid-field rather than dramatic, being able to watch the start and the run to the flag from directly above the garages is the single best fixed vantage point at the track.

Weather is a genuine factor here in a way it isn't for most hospitality products: Hungaroring race weekend regularly hits 30°C-plus in late July, and Paddock Club's air-conditioned suite is as much a relief from the heat as it is a viewing position.`;

const whyItsSpecial = `Most premium hospitality at a Grand Prix is a good view plus good catering, interchangeable in spirit from one circuit to the next. Paddock Club's actual differentiator is proximity to the mechanics of the sport itself, not just the racing. Watching a pit stop from the stand versus watching it from thirty metres above the garage where the tyres are already staged is a genuinely different experience, and the daily pit walk is the part that a general admission or grandstand ticket simply cannot replicate at any price.`;

const practicalInfo = {
  hours: "3-day access (Fri-Sun), gates and hospitality suite open ahead of first practice each day",
  costRange: "Premium tier, above Champions Club (approx. €3,670/3 days for 2026) — check f1experiences.com or edgeglobalevents.com for current Paddock Club pricing",
  bookingMethod: "Official F1 hospitality, sold via f1experiences.com and authorised resellers such as edgeglobalevents.com and grandprixevents.com. Includes the daily Aramco Pit Lane Walk.",
  howToBook: `If you're planning on Paddock Club for Hungaroring, book through f1experiences.com directly rather than a reseller markup, it's the official channel and carries F1's own guarantee. Paddock Club packages for mid-season European rounds like Hungary typically go on sale the preceding autumn and the best team-branded suites (McLaren, Ferrari, Red Bull) sell out first, often 4-5 months before race weekend, well ahead of the general public ticket window. If you want a specific team's suite rather than the shared F1 Experiences suite, that's the detail to lock in early, generic Paddock Club access stays available longer than named-team hospitality. Build in the Aramco Pit Lane Walk into your day one plan, it runs at a fixed time each morning and once it's over for the day, it's over.`,
  website: "https://f1experiences.com/2026-hungarian-grand-prix",
  reservationsRequired: true,
};

const insiderTips = [
  "Book the Aramco Pit Lane Walk time slot as early in your first day as you can, it's a fixed daily window and easy to miss if you arrive late from Budapest.",
  "Ask specifically whether your package includes a named team suite or the shared F1 Experiences suite, the atmosphere and access differ and it changes what to expect from the day.",
];

const whatToAvoid = `Don't assume Paddock Club automatically includes a specific team's suite, generic F1 Experiences packages and named-team suites (McLaren, Ferrari, etc.) are sold and priced separately, confirm exactly which you're booking before paying.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Paddock Club — Above the Garages, Inside the Pit Lane",
      subtitle: "F1's own hospitality product, directly over the team garages, with a daily pit lane walk included.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Hungaroring, Mogyoród",
      address: "Hungaroring, 2146 Mogyoród, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Free F1 shuttle buses run from Kerepes HÉV station (reached via M2 metro to Örs vezér tere, then HÉV suburban rail) directly to Gate 3, timed to match train arrivals. Paddock Club guests typically have a dedicated entrance, confirm with your package details.",
      editorialNote: "Sources: f1experiences.com/2026-hungarian-grand-prix, edgeglobalevents.com/f1-paddock-club/hungary, gpdestinations.com/tickets-hungarian-f1-grand-prix. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["premium", "exclusive", "insider"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
