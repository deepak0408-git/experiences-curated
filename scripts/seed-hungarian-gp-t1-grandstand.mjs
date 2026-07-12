import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "t1-grandstand-hungaroring-" + Date.now().toString(36);

const bodyContent = `The Hungaroring's Turn 1 is a tight right-hander at the end of the pit straight. It's where Nelson Piquet passed Ayrton Senna around the outside, sideways, on lap 68 of the very first Hungarian Grand Prix in 1986, a race that pulled 200,000 spectators from across the Eastern Bloc and held the F1 attendance record for nearly a decade. The T1 Grandstand (formerly known as Gold 4) sits right on that corner.

What you get from here isn't a panorama. It's a close, repeated view of the same piece of track, over and over, for 70 laps: cars arriving hot off DRS, braking later than looks sane, and occasionally getting it wrong. Because of the slope through this section, your view back up the main straight is restricted, so this isn't the stand for watching a car build a gap. It's the stand for watching what happens when that gap gets closed.

Turn 1 doesn't reward patience the way a long straight does. It rewards being in exactly the right seat when someone commits to a move that doesn't quite work. The grandstand itself is unremarkable, scaffold stands, plastic seating, a decent view of the big screen for replays. What it has is proximity to the one corner on this lap where overtaking still genuinely happens, on a circuit that's earned its reputation as one of the hardest places on the calendar to pass.`;

const whyItsSpecial = `Most of the Hungaroring is a technical, twisting circuit where cars get strung out and stay strung out. Turn 1 is the exception, and it's been the exception since the track's first race. The Piquet-Senna move in 1986 wasn't a lucky pass, it was a driver reading a gap nobody else saw and going for it on the outside of a corner that doesn't usually forgive that. Forty years later, it's still the corner drivers point to when asked where a Hungaroring race can actually change. Sitting in the T1 Grandstand means watching for that same moment, lap after lap, knowing it might not come, and that the one time it does will be worth every one that didn't.`;

const insiderTips = [
  "Bring earplugs or noise-cancelling headphones for the braking zone, the compression of engine noise this close to Turn 1 is louder than most other grandstands on the circuit.",
  "Arrive well before support races start, this stand fills from the front rows first and getting a clear sightline over the barrier matters more here than in wider, tiered stands.",
];

const whatToAvoid = `Don't book this stand expecting to track a car's pace across a lap, the restricted view up the main straight means you'll see the braking and the corner exit, not the buildup. If you want to watch a full straight-to-corner sequence, the Chicane 4 Grandstand gives a longer sightline across several corners instead.`;

const practicalInfo = {
  hours: "Gates typically open around 8am on race day; grandstand seating is allocated and holds for the full session",
  costRange: "Mid-tier grandstand pricing, check tickets.formula1.com or f1hungary.com for current-year prices",
  bookingMethod: "Book directly via tickets.formula1.com/en/f1-3277-hungary or f1hungary.com/en/tickets. T1 (formerly Gold 4) is one of the circuit's most requested stands for race day specifically, weekend passes covering Thu-Sun sell out faster than single-day tickets.",
  website: "https://tickets.formula1.com/en/f1-3277-hungary",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "T1 Grandstand — Where Hungaroring Races Get Decided",
      subtitle: "Turn 1's braking zone, site of F1's most replayed outside pass, on the one corner where overtaking still happens.",
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
      editorialNote: "Sources: en.wikipedia.org/wiki/1986_Hungarian_Grand_Prix, f1hungary.com/en/ticket-info/grandstand-t1-2, f1hungary.com/en/the-history-of-hungaroring. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["dramatic", "historic", "high-stakes"],
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
