import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-strip-at-night-" + Date.now().toString(36);

const bodyContent = `Every other Grand Prix on the calendar happens where it happens because a circuit already existed there. Las Vegas is the opposite: Liberty Media, F1's owner, spent roughly $500 million buying land and building a permanent pit and paddock facility specifically to run a race down a street that wasn't built for one. This is the first Grand Prix Liberty has promoted itself rather than handing to a third-party promoter, and the entertainment-first approach shows in nearly every decision about how the weekend is built — night sessions timed to show off the Strip lit up, a concert stage inside the T-Mobile Zone, hospitality products named after casino landmarks. The race is a Liberty Media product as much as a sporting event, built to sell hospitality, broadcast rights, and the city's own brand at once.

That context changes how the Strip itself is worth experiencing during race week, separate from anything happening on track. Vegas's resorts are built for night viewing — the Strip's landmark recreations (the Eiffel Tower at Paris, the New York skyline at New York-New York, the canals of Venice) are designed to be seen after dark, when neon and LED lighting do the work sunlight can't. The STRAT's observation deck, at 1,149 feet, gives a view across the entire glowing Strip from above, genuinely different from the street-level walk. The High Roller Ferris Wheel does something similar closer to the ground, lit in shifting neon as it turns.

Pedestrian bridges cross Las Vegas Boulevard at several points along the Strip, keeping foot traffic separated from vehicle lanes — useful year-round, and specifically useful during race week when the road itself may be closed anyway. Walking the Strip after dark during race week means doing it alongside a genuine spectacle built on top of the usual one: race cars, concert stages, and fan zones layered onto a street that was already designed to be seen exactly this way at night.`;

const whyItsSpecial = `Understanding why this race exists changes how you experience the week around it. Liberty Media didn't drop a circuit into Las Vegas, it built the entire event as a piece of entertainment the city was already built to host — the Strip's night lighting, its landmark recreations, its culture of spectacle were all already there, and the race was designed to sit inside that rather than compete with it. I'd tell anyone walking the Strip during race week to notice how deliberately the two things reinforce each other: the neon was built for tourists decades before F1 arrived, and the race was built, quite literally, to run through it rather than around it. That's a genuinely different premise than any other Grand Prix on the calendar.`;

const insiderTips = [
  "The STRAT's observation deck gives a full-Strip view from above that's genuinely different from any street-level vantage point — worth booking for one evening during race week specifically to see the circuit's full layout lit up against the wider Strip.",
  "Pedestrian bridges crossing Las Vegas Boulevard are the safer, faster way to cross during race week even where the road itself isn't closed — they keep you separated from both vehicle traffic and the densest street-level crowds.",
];

const whatToAvoid = `Don't assume the Strip's lighting and landmark spectacle is a race-weekend addition — it's the city's permanent, year-round design, and treating it as a temporary F1 decoration undersells both the race and the city that hosts it. Don't try to walk the full Strip end-to-end in one night during race week expecting normal pedestrian speed — road closures, race-week crowds, and the sheer scale of the Strip itself make a shorter, more deliberate route through 2-3 landmark areas a more realistic plan than covering the whole thing.`;

const practicalInfo = {
  hours: "The Strip's lighting and landmark displays run nightly year-round; STRAT observation deck typically open until midnight or later, hours vary by day",
  costRange: "Walking the Strip is free. STRAT observation deck admission from roughly US$20-30; High Roller from roughly US$25-35 per ride",
  bookingMethod: "No booking needed to walk the Strip. STRAT and High Roller tickets available at their respective venues or via thestrat.com and caesars.com/linq/high-roller.",
  howToBook: "",
  website: "https://thestrat.com, https://www.caesars.com/linq/high-roller",
  reservationsRequired: false,
};

const gettingThere = "The Las Vegas Strip, Las Vegas Boulevard. Use pedestrian bridges at major intersections to cross safely, especially useful during race-week crowds and road closures.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Strip at Night — Why This Race Was Built as a Show",
      subtitle: "A $500M bet on entertainment, and the neon spectacle the race was built to run through",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "The Strip",
      address: "Las Vegas Strip, Las Vegas Blvd, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from sportico.com and deadline.com Liberty Media investment/strategy coverage, thecurrent.com direct-to-consumer analysis, tripadvisor.com and followthepiper.com Strip-at-night walking guides. Verified 29 Aug 2026. No googleMapsRating fields — this is a general Strip-atmosphere experience, not tied to one named venue.",
      sport: ["formula_one"],
      moodTags: ["iconic", "free"],
      interestCategories: ["sightseeing"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-29",
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
