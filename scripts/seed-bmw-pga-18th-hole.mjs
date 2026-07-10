import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7"; // Surrey / Virginia Water
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b"; // BMW PGA Championship 2026
const slug = "18th-at-wentworth-amphitheatre-finish-" + Date.now().toString(36);

const bodyContent = `The 18th at Wentworth doesn't play like a finishing hole so much as a trap disguised as one. It's a 523-yard par 5, and on paper that should mean an easy two-putt birdie to close a round. In practice, water snakes across the fairway and then wraps down the left side of the green, and the only way to reach it in two is to find a strip of fairway about 300 yards off the tee, squeezed between trees on one side and a ditch on the other. Lay up short and you're playing it safe. Go for it and a miss finds heavy rough, a bunker, or the water itself. Wentworth built one hole that forces every player in the field to make a real decision on national television, and it's the last hole they play.

That's why it keeps producing finishes people remember. In 2024, Billy Horschel, Rory McIlroy, and Thriston Lawrence arrived at 20 under and went back to the 18th for a playoff. Lawrence bogeyed out first. McIlroy and Horschel both found the green in two on the second extra hole, and McIlroy's eagle putt slid just wide. Horschel didn't miss his. He became the first American to win the BMW PGA Championship twice, with an eagle, on the hole built specifically to make eagles this hard.

The green itself sits in a natural amphitheatre, ringed by trees and permanent grandstand seating, which is why it works so well as a stage even outside playoff drama. You can watch a group play the hole from the tee shot through the approach without moving, which isn't true of most holes on this course. The grandstand fills fast on tournament days, particularly Saturday and Sunday afternoons when the leaders are coming through, and it's the one seat at Wentworth where you're guaranteed to see every group's final approach of the day.

If you only watch one hole all weekend, this is the one where the tournament is actually won or lost.`;

const whyItsSpecial = `Most golf courses save their hardest hole for somewhere in the middle of the round, where a bad number doesn't cost as much. Wentworth put its trickiest risk-reward decision on the very last hole, which means every close tournament gets decided here, in front of the biggest crowd of the day. I don't think that's an accident. A par 5 that's reachable in two but genuinely dangerous is rare enough on its own; putting it at 18 turns every Sunday into appointment viewing.

What I find myself coming back to is how honest the hole is about the risk. There's no hidden trick, no blind shot, you can see the water, you can see the sliver of fairway you need to find, and you still have to commit to it under pressure with the tournament on the line. Horschel's 2024 eagle worked precisely because the hole doesn't let you get lucky. You either execute the shot or you don't.`;

const practicalInfo = {
  hours: "Grandstand seating at the 18th green operates daily through the tournament (Thu-Sun), typically reserved until around 4pm each day.",
  costRange: "Included with general admission grounds tickets, subject to grandstand capacity.",
  bookingMethod: "General admission grounds tickets include access to the 18th green grandstand, but seating fills fast, arrive early, especially Saturday and Sunday afternoons when the leaders are due through, and note that grandstand access is typically reserved only until around 4pm.",
  website: "https://www.europeantour.com/dpworld-tour/bmw-pga-championship-2026/tickets-packages/",
  reservationsRequired: false,
};

const gettingThere = "Wentworth Club is a short walk or shuttle from Longcross station, reachable via direct South Western Railway service from London Waterloo (around 46 minutes) — see the Getting to Wentworth experience for the full route.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The 18th at Wentworth — The Amphitheatre Finish",
      subtitle: "A 523-yard par 5 where the tournament gets decided, and the only hole at Wentworth with its own permanent grandstand.",
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
        "Get to the 18th grandstand at least 30-45 minutes before the final groups are due to putt — it's first-come and fills from early afternoon on the weekend.",
        "If you want to see the whole hole play out from tee to green rather than just the approach, the grandstand's higher tiers give you the better sightline over the dogleg — lower rows are better for the green itself but lose the tee shot.",
      ],
      whatToAvoid: "Don't assume you can wander into the 18th grandstand late on Sunday afternoon expecting a seat — this is the single most contested viewing spot on the course once the tournament is coming down to the wire, and it does fill completely. And don't skip this hole to chase a favourite player around the rest of the course all day — whoever you're following will end up here eventually, since every round finishes on 18, so you can always catch them at the green even if you miss earlier holes.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: golfpass.com Wentworth West Course hole-by-hole guide, nationalclubgolfer.com BMW PGA Championship 2025 course guide, golf.com and pgatour.com on the 2024 Horschel/McIlroy/Lawrence playoff, grandstandtickets.com for 18th green grandstand ticketing structure. Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["dramatic", "high-stakes", "iconic"],
      interestCategories: ["sport"],
      pace: "moderate",
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
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
