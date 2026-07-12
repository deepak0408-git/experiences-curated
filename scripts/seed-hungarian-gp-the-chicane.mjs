import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "the-chicane-hungaroring-" + Date.now().toString(36);

const bodyContent = `Turns 6 and 7 are the slowest part of the Hungaroring lap, a tight left-right chicane guarded by tall sausage kerbs that punish anyone who gets greedy with the exit. Drivers call it the corner that can undo a whole lap. Carry too much speed in, or clip too much kerb on the way out, and the car steps out of line just enough to cost time through the next sector, sometimes damage the floor doing it.

This isn't a corner built for a dramatic overtake, the way Turn 1 is. It's a corner built for watching precision fail in real time. From the grandstand here you watch cars arrive at wildly different speeds depending on how well the driver read the exit of Turn 5, and you watch some of them get it wrong, a wide line, a locked wheel, a moment where the whole lap goes from clean to scrappy.

The Hungaroring earned its reputation as one of the hardest circuits to pass on partly because of sections like this one, tight, technical, unforgiving of mistakes but not offering many chances to capitalise on someone else's. If Turn 1 is where races get decided, the chicane is where they quietly get lost, lap by lap, corner by corner, well before the grandstand crowds at the final turn ever notice.`;

const whyItsSpecial = `Every circuit has a corner fans queue up for and a corner only the real students of the sport bother watching closely. At the Hungaroring, the chicane is the second kind. Nothing about it looks dramatic on a broadcast, there's no big screen replay of a chicane mistake the way there is for a Turn 1 lock-up. But sit here for a session and you start to see the race differently: not as a series of overtakes, but as a series of small, compounding errors, most of which happen right here. It's a stand for people who want to understand why a driver lost four tenths, not just watch who gained a place.`;

const insiderTips = [
  "Bring binoculars if you have them, the chicane sits mid-circuit and the natural terrain here means most general viewing spots are further from the apex than at Turn 1 or the final corner.",
  "Watch Turn 5 as cars set up for the chicane, not just the chicane itself, a bad line into Turn 5 is usually what causes the visible mistake at Turns 6-7.",
];

const whatToAvoid = `Don't expect overtaking here, this section rewards clean driving rather than punishing it into passing opportunities. If you want a stand where positions actually change hands, T1 Grandstand or the Apex Grandstand at Turn 14 are better bets.`;

const practicalInfo = {
  hours: "Gates typically open around 8am on race day; general viewing area, some grandstand seating available depending on year's ticket map",
  costRange: "Varies by exact grandstand allocation near this section, check tickets.formula1.com for current-year options",
  bookingMethod: "Check the current grandstand map at f1hungary.com/en/map-of-grandstands before booking, seating near Turns 6-7 shifts slightly year to year depending on which stands are designated Chicane 1-4.",
  website: "https://tickets.formula1.com/en/f1-3277-hungary",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Chicane — Where Hungaroring Laps Quietly Fall Apart",
      subtitle: "Turns 6-7, the slowest, most technical section of the lap, where clean driving separates from scrappy in real time.",
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
      gettingThere: "Free F1 shuttle buses run from Kerepes HÉV station (reached via M2 metro to Örs vezér tere, then HÉV suburban rail) directly to Gate 3, timed to match train arrivals.",
      editorialNote: "Sources: driver61.com/circuit-guide/hungaroring, racefans.net/f1-information/going-to-a-race/hungaroring-circuit-information, f1technical.net. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["technical", "insider", "understated"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
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
