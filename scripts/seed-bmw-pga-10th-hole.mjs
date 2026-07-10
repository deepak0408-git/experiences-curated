import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "10th-wentworth-cliffhanger-par-3-" + Date.now().toString(36);

const bodyContent = `The 10th at Wentworth is only 174 yards, which on a scorecard looks like the easiest hole on the course. It isn't. The green sits on top of a steep slope, more like a shelf cut into the hillside than a fairway landing spot, guarded by trees on the right and a bunker directly in front. A field of heather runs between tee and green, and the only real way in is through a narrow corridor that forces you either over or around a single tree planted almost deliberately in the way on the left side.

It's the kind of hole that punishes a good swing hit slightly wrong far more than it punishes a bad swing hit lucky. Players who normally treat a 174-yard par 3 as a routine par opportunity have to actually think here, because there's very little green to work with and even less room for error left or short. Miss right into the trees and you're chipping out sideways. Miss long or into the front bunker and the two-tiered slope does the rest of the damage to your card.

For spectators, this is one of the better holes to stand at for exactly that reason. You're watching some of the best players in the world hit into a target that looks generous from 150 yards away on television and looks genuinely tight in person. The heather framing the hole is also just good to look at in September light, which isn't nothing on a long day at the course.`;

const whyItsSpecial = `A lot of golf courses have one showpiece hole and then a string of solid-but-forgettable ones around it. Wentworth's 10th earns its reputation by being quietly vicious rather than dramatically so, there's no water hazard, no crowd of Instagram photos, just a green that's genuinely hard to hit and even harder to hold. I like holes like this more than the obviously spectacular ones, because they tell you something true about a player's ball-striking rather than their nerve under a big crowd.

Watching it live changes how you read a scorecard afterward. A par here isn't a formality the way a par-3 often is on tour, it's a small relief, and you can see it on a player's face walking off the green.`;

const practicalInfo = {
  hours: "Accessible throughout tournament play, Thursday to Sunday, following the general admission walking routes around the West Course.",
  costRange: "Included with general admission grounds tickets.",
  bookingMethod: "No separate ticket needed beyond general admission — walk the course to the 10th tee or green, and arrive between groups if you want an unobstructed view of the tee shot.",
  website: "https://www.europeantour.com/dpworld-tour/bmw-pga-championship-2026/tickets-packages/",
  reservationsRequired: false,
};

const gettingThere = "Follow the general admission walking routes from the Championship Village toward the West Course's back nine — the 10th tee is a moderate walk from the main entrance, well signposted during tournament week.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The 10th — Wentworth's Cliffhanger Par 3",
      subtitle: "Only 174 yards, but a green perched on a hillside shelf that turns a routine par into a genuine test.",
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
        "Stand near the tee rather than the green if you want to see the actual shot-shaping decision players have to make around the tree on the left — the green-side view mostly just shows the result.",
        "This hole is far less crowded than the marquee holes (18th, Championship Village), making it one of the easier spots to get a close, unobstructed view without arriving hours early.",
      ],
      whatToAvoid: "Don't rush past the 10th assuming a par 3 isn't worth stopping for — the margin for error here is smaller than the yardage suggests, and it's one of the better places to see genuine tour-level precision up close without a grandstand crowd blocking your view.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: golfpass.com Wentworth West Course hole-by-hole guide, thegolfpilgrim.com Wentworth West review, golfshake.com Wentworth West review (174 yards, two bunkers right of green). Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["scenic", "tactical", "quiet"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
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
