import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "szimpla-kert-jewish-quarter-" + Date.now().toString(36);

const bodyContent = `Szimpla Kert opened in 2002 on Kertész utca as the first ruin bar in Budapest, before moving in 2004 to its current home at Kazinczy utca 14, a derelict block of old homes and a former stove factory that was scheduled for demolition. The four founders saved it instead, and the layout still shows its scars on purpose: mismatched furniture, peeling walls, a bathtub repurposed as seating, art installations bolted onto crumbling plaster, all inside what used to be an actual condemned building.

That original idea, take a building nobody wanted and fill it with secondhand furniture and cheap drinks rather than renovate it into something polished, spawned the entire ruin bar scene that now defines District VII's nightlife. Szimpla is still the reference point, a sprawling, multi-room, multi-courtyard maze that somehow includes a farmers' market on Sunday mornings alongside the nightly drinking crowd.

Hours run late and split by area: the First Bar opens from noon (9am Sundays), the Garden Bar from 3pm (9am Sundays), and the whole place runs until 4am most nights, 5am on Sundays. It's less a single bar than a small self-contained neighbourhood you wander through, one room leading unexpectedly into a courtyard, into another room, into a rooftop space.`;

const whyItsSpecial = `Most cities that become known for a "scene" have it happen organically, then commercialise it into something safer and more polished within a decade. Szimpla is unusual in that it's still, genuinely, the original building, run in something close to the original spirit, twenty-plus years after four people decided a condemned stove factory was worth saving instead of demolishing. Every ruin bar in Budapest since has been compared to it. Visiting the actual original, rather than a newer imitation, is the difference between seeing where an idea started and seeing where it ended up.`;

const insiderTips = [
  "Go on a Sunday morning if you can fit it in, the farmers' market inside Szimpla is a genuinely different experience from the nightly bar crowd and worth seeing both sides of the same space.",
  "Budget more time than you think, the venue's maze of rooms and courtyards means a quick one drink stop rarely stays quick, people tend to wander for hours without meaning to.",
];

const whatToAvoid = `Don't expect a quiet drink, Szimpla is loud, crowded, and genuinely chaotic most nights, especially weekends. If you want the ruin bar aesthetic without the crowd, some of the newer, smaller bars nearby in the Jewish Quarter offer a calmer version of the same idea.`;

const practicalInfo = {
  hours: "Mon-Sat 12:00-04:00 (First Bar) / 15:00-04:00 (Garden Bar); Sun 09:00-05:00 (both, including farmers' market)",
  costRange: "Budget to moderate, drinks are inexpensive by Western European standards",
  bookingMethod: "No reservation, walk in. Arrive earlier in the evening if you want to explore before it gets busy, later evenings and weekends draw the biggest crowds.",
  website: "https://en.wikipedia.org/wiki/Szimpla_Kert",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Szimpla Kert — The Original Ruin Bar, Still Standing",
      subtitle: "A condemned stove factory turned bar in 2004 that started the entire Budapest ruin bar scene.",
      slug,
      experienceType: "activity",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Jewish Quarter, District VII",
      address: "Kazinczy utca 14, 1075 Budapest, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Central District VII location, walkable from Astoria or Deák Ferenc tér metro stops.",
      editorialNote: "Sources: en.wikipedia.org/wiki/Szimpla_Kert, ruinbarsbudapest.com/history-of-szimpla-kert-ruin-bar-budapest, budapest-trip.com/guides/szimpla-kert-guide. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["lively", "eclectic", "iconic"],
      interestCategories: ["nightlife"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: false,
      availability: "perennial",
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
