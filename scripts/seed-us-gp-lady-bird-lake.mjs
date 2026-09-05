import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin
const EVENT_SLUG = "united-states-grand-prix";
const slug = "us-gp-lady-bird-lake-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Lady Bird Lake sits right through the middle of downtown Austin, 416 acres of water anchoring the city's outdoor life in a way few American downtowns manage — locals hike, bike, paddle, birdwatch, and fish here as a genuine daily habit, not just a tourist stop. A hike-and-bike trail circles almost the entire lower two-thirds of the lake, built along the shoreline back in the 1970s when the lake was still called Town Lake, with two pedestrian-only bridges connecting different stretches of the loop.

On the water, several operators rent kayaks, canoes, and stand-up paddleboards directly on the lake, starting around $20. Rowing Dock is one of the most consistently well-reviewed options for exactly this. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=13386823019124805516&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). Zilker Park Boat Rentals and Texas Rowing Center both offer similar hourly and daily rates if Rowing Dock isn't convenient to your specific spot on the lake. None of these need advance booking on a normal day, though weekend afternoons get busy enough that showing up isn't a bad idea if you have a specific time window in mind.

The lake's edge is also home to something genuinely unique: the Congress Avenue Bridge bat colony, roughly 1.5 million Mexican free-tailed bats, the largest urban bat colony in the world. They emerge nightly from mid-March through early November, so late-October race weekend sits right at the tail end of the season — still active, but worth confirming the exact emergence is still happening before building an evening around it, since the very end of the season can vary year to year. When they are flying, the display runs 30-45 minutes, typically starting within 30 minutes of sunset in warm weather (later, up to 40 minutes after, in cooler damp conditions) — arrive on the bridge about an hour before sunset to actually get a spot to watch from.`;

const whyItsSpecial = `Most Grand Prix cities give you a choice between the racing and everything else — Lady Bird Lake is one of the rare spots where "everything else" is genuinely active rather than passive sightseeing. Paddling past downtown's skyline from water level, or walking a stretch of trail locals use every single day, gives you a real sense of how Austin actually lives day to day, not just how it presents itself to visitors during a big event weekend. The bat colony adds something no other F1 host city has anywhere close to an equivalent for — a genuine natural phenomenon, not a manufactured attraction, sitting a few minutes' walk from South Congress.`;

const insiderTips = [
  "Late-October sits right at the tail end of bat season (mid-March through early November) — check a local source (batsinaustin.com or austinbats.org publish nightly updates) the day of your visit to confirm the colony is still actively emerging before planning an evening around it.",
  "Arrive on the Congress Avenue Bridge about an hour before sunset if you want an actual viewing spot — the display itself only runs 30-45 minutes, and the best vantage points fill in well before the bats actually appear.",
];

const whatToAvoid = `Don't assume the bat colony is guaranteed to perform on any given night this late in the season — this isn't a scheduled show, it's a wild colony near the natural end of its active period, and some late-season nights may be quieter or the colony may have already begun departing for the winter. Don't try to fit a full kayak/paddleboard session into a tight window around race sessions — factor real time for getting to the lake, renting gear, and paddling at a relaxed pace, rather than treating it as a 30-minute add-on between track sessions.`;

const gettingThere = `Central, walkable from Downtown and South Congress hotels; the bat-viewing bridge sits right at the South Congress Avenue crossing over the lake.`;

const practicalInfo = {
  hours: "Trail open daily, dawn to dusk generally; kayak/paddleboard rentals typically run daytime hours; bat emergence happens nightly in-season, roughly 30 minutes before to 40 minutes after sunset",
  costRange: "Trail access free; kayak/paddleboard rentals start around US$20/hour; bat viewing from the bridge is free",
  bookingMethod: "No booking needed for the trail or bat viewing — both are free, public, and open access. Kayak/paddleboard rentals are typically walk-up, though calling ahead is sensible on a busy weekend.",
  website: "https://www.rowingdock.com, https://austintexas.gov/page/lady-bird-lake",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Lady Bird Lake — Paddle, Walk, and Catch the Bats",
      subtitle: "A 416-acre lake through the middle of downtown, with the world's largest urban bat colony on its edge",
      slug,
      experienceType: "natural_wonder",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Downtown / South Congress",
      address: "Lady Bird Lake, Austin, TX",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: austintexas.gov Lady Bird Lake page, rowingdock.com (rental operator detail), statesman.com + austinbattours.com (bat season March-early Nov, emergence timing, colony size 1.5M, largest urban colony in the world). Late-October sits at the tail of bat season — flagged clearly rather than implying guaranteed peak viewing, correcting an earlier assumption made when this was briefly considered as its own separate experience (later folded into Lady Bird Lake per user's locked list decision). Single primary subject (the lake) with one named venue reference (Rowing Dock, real Google Places lookup 4.8/2,051) — not treated as full multi-venue since it's not a roundup of interchangeable options. No Concierge trigger, no affiliate opportunity identified. Verified 5 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["outdoors", "active", "nature"],
      interestCategories: ["outdoors"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
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
