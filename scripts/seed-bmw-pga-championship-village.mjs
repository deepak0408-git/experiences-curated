import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "championship-village-show-stage-" + Date.now().toString(36);

const bodyContent = `No other golf pack we've built has anything like this. The Open Championship is weather, dunes, and a closing hole. Wentworth adds a full festival on top of the golf, and the Championship Village is where that becomes obvious the moment you walk in. It's themed around BMW and MINI, with a Ryder Cup photo opportunity worked into the layout, and it sits close enough to the 18th green and the Show Stage that you can move between watching golf and watching a live set without really planning for it.

The Show Stage itself runs concerts on the weekend, and 2026 already has The Kooks confirmed to headline Saturday, September 19, the first headline act announced for what BMW PGA is billing as the third Rolex Series event of the season. Live entertainment also runs through the week in the Fan Village beyond the main stage, mostly acoustic and lower-key acts rather than full headline sets, so there's music here from Thursday through Sunday, not just on the big weekend night.

The practical effect of all this is that Wentworth doesn't ask you to choose between "watching golf" and "having a day out." You can catch a group finishing on 18, wander into the Village for food and the BMW/MINI displays, and still be back at the ropes in time for the next big name coming through. It changes the rhythm of the day compared to a straight golf tournament, and it's part of why this event pulls in a crowd that isn't purely golf purists.`;

const whyItsSpecial = `I went back and forth on whether to include something this far from the actual golf in a pack built around watching a tournament. What settled it is that Wentworth itself doesn't treat the Village as an afterthought bolted onto the golf, it's positioned right next to the 18th and built into the day's rhythm on purpose. Calling this event the "Festival of Golf" isn't just marketing language layered on top of a normal tournament; the schedule is genuinely built around it.

For a first-time visitor especially, knowing the concerts and themed zones exist changes how you plan the day. You're not just following a leaderboard around a golf course, you're deciding when to dip out and catch a set, which is a different kind of day than any other event in this pack's expansion so far.`;

const practicalInfo = {
  hours: "Championship Village open throughout tournament days (Thu-Sun); Show Stage headline concerts run Saturday evening, with lower-key live music and acoustic acts through the rest of the week.",
  costRange: "Included with general admission grounds tickets — no separate concert ticket required for the Show Stage.",
  bookingMethod: "Access is included with any tournament grounds ticket. Check the official BMW PGA Championship site closer to the date for the confirmed 2026 Show Stage lineup beyond the already-announced Kooks headline slot.",
  website: "https://www.europeantour.com/dpworld-tour/bmw-pga-championship-2026/tickets-packages/",
  reservationsRequired: false,
};

const gettingThere = "The Championship Village sits close to the 18th green, near the main spectator entrance — well signposted from the moment you enter the grounds.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Championship Village & The Show Stage",
      subtitle: "BMW and MINI zones, a Ryder Cup photo spot, and live concerts — the Festival of Golf part of the tournament.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Wentworth Club, Virginia Water",
      address: "Wentworth Club, Wentworth Drive, Virginia Water, Surrey GU25 4LS",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "The Kooks are confirmed to headline the Show Stage on Saturday, September 19, 2026 — if a big Saturday-night set matters to your trip, build your day around being near the stage by early evening.",
        "Live music runs through the week in the Fan Village beyond the main Saturday headline slot, so there's still something to catch on the quieter practice and early tournament days.",
      ],
      whatToAvoid: "Don't assume the Village is a minor add-on you can skip — the crowd and energy shift noticeably here compared to the rest of the course, and missing it means missing a real part of what makes this event different from a standard golf tournament.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: europeantour.com DP World Tour article confirming The Kooks as 2026 Saturday Show Stage headliner, bmw-golfsport.com and europeantour.com ticketing pages on Championship Village and Fan Village live entertainment. Verified 10 Jul 2026 — note 2026 lineup beyond The Kooks not yet fully announced, flagged in copy rather than assumed.",
      sport: ["golf"],
      moodTags: ["festival", "social", "entertainment"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-10",
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
