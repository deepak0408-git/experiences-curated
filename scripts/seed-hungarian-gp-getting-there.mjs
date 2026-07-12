import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "getting-to-hungaroring-" + Date.now().toString(36);

const bodyContent = `Getting to the Hungaroring from Budapest without a car takes three legs, and none of them are obvious the first time. Start on the M2 red metro line and ride it to its final stop, Örs vezér tere (if you're coming from the M1 or M3 lines, change at Deák Ferenc tér first). At Örs vezér tere, leave the metro and cross to the opposite corner of the intersection through the underpass, you'll find the HÉV suburban rail platform next to a ticket office and shopping centre.

The HÉV trains from this stop run one direction only, toward Gödöllő, Kerepes, and Mogyoród. Stay on until Kerepes station. From there, a free shuttle bus, timed to match train arrivals, takes you the rest of the way to Gate 3. On race day, shuttles run from 7:00 to 13:20 on Friday, until 15:50 on Saturday, and until 14:50 on Sunday, so plan your return around those windows rather than assuming a bus will be waiting whenever you're ready to leave.

The full journey typically takes 60-90 minutes depending on where in Budapest you start. For the way back, shuttles run from near Gate 3 to Gödöllő Railway Station instead of Kerepes, and trains from Gödöllő back to the city are more frequent and more comfortable than the Kerepes route, worth remembering if you're tired at the end of a long race day.`;

const whyItsSpecial = `Most F1 circuits either sit inside a city or require a car to reach at all. The Hungaroring is neither, it's close enough to Budapest for a genuine public transport commute, but the actual route (metro, then suburban rail, then a free shuttle timed to trains) isn't something you'd guess. Getting it right the first time saves real frustration on a hot race morning when the alternative is standing in the wrong queue wondering why the bus you're looking at isn't moving.`;

const insiderTips = [
  "Note that the free shuttle only runs from Kerepes station on the way out, but from Gate 3 to Gödöllő station on the way back, these are two different stations, don't wait at Kerepes expecting a return shuttle.",
  "Build in slack for the shuttle bus queue after the race finishes, tens of thousands of people are trying to leave at once and the walk from the grandstands to Gate 3 alone can take 20-30 minutes.",
];

const whatToAvoid = `Don't assume you can drive and park easily, official guidance and most independent travel guides steer visitors toward the metro-HÉV-shuttle combination specifically because circuit-adjacent parking and road access get heavily congested on race day.`;

const practicalInfo = {
  hours: "Shuttle bus operating hours vary by day: Fri 7:00-13:20, Sat until 15:50, Sun until 14:50 (2025 reference times, confirm current year via f1hungary.com)",
  costRange: "M2 metro and HÉV suburban rail require a standard Budapest public transport ticket (~HUF 350-450 per leg); shuttle bus from Kerepes/Gödöllő to the circuit is free with a valid Grand Prix ticket",
  bookingMethod: "No booking required, standard BKK public transport tickets cover the metro and HÉV legs; the shuttle bus is free but requires a valid race ticket to board.",
  website: "https://www.f1hungary.com/en/metro-train",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to the Hungaroring — Metro, HÉV, and a Free Shuttle",
      subtitle: "M2 to Örs vezér tere, HÉV suburban rail to Kerepes, then a free shuttle to Gate 3. Three legs, one route.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Budapest / Mogyoród",
      address: "M2 Metro to Örs vezér tere, HÉV suburban rail to Kerepes, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "See body content for the full route: M2 metro to Örs vezér tere, HÉV suburban rail toward Gödöllő/Kerepes, free shuttle bus to Gate 3.",
      editorialNote: "Sources: f1hungary.com/en/metro-train, gpdestinations.com/getting-around-hungarian-f1-grand-prix, thef1spectator.com/hungarian-f1-travel-guide/getting-there. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["practical", "logistics"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: false,
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
