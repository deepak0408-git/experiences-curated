import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "narendra-modi-stadium-" + Date.now().toString(36);

const bodyContent = `Narendra Modi Stadium seats 132,000 people, which makes it not just the largest cricket ground on earth but the largest sporting arena of any kind anywhere in the world. It sits in Motera, on the banks of the Sabarmati River, entirely rebuilt from the old Motera Stadium and reopened in 2021 with 11 different pitches cut from different soil types, an Olympic-size pool, and a 55-room clubhouse. Nothing about it is modest.

It's also, for India specifically, the site of one of the most painful nights in the country's recent cricket history. On 19 November 2023, this stadium hosted the Cricket World Cup final, India against Australia, in front of 92,453 people, still the largest attendance ever recorded for an ODI. India had gone unbeaten through the entire tournament. Australia chased down 241 with six wickets in hand, winning a record sixth World Cup title, with Travis Head's century doing most of the damage. Reports from the ground described the crowd going largely silent as the result became clear, a genuinely unusual thing to happen in a stadium built to hold more people than almost any other sports venue on the planet.

That result has nothing directly to do with the Test format this pack covers, and Australia's record in the shorter format doesn't predict how a five-day Test here will play out. But walking into this specific ground, for this specific rivalry, carries a weight that a neutral stadium wouldn't. The pitch itself is generally rated good for both batting and bowling, offering pace and bounce for quicks with some assistance for spin through the middle overs, a genuinely balanced surface rather than one that favours a single discipline.

For the final Test of this pack's three-city stretch, and the last of the whole five-match series, Ahmedabad closing things out at the scene of India's most-watched cricketing defeat in recent memory adds a layer of stakes that goes beyond the scoreline.`;

const whyItsSpecial = `Most grounds earn their reputation slowly, over decades of matches. This one earned its most famous night in a single evening, in front of the largest crowd ever assembled for a one-day international, watching India lose the biggest trophy in the sport on home soil to the exact opponent arriving for this Test series. You don't need to have been there in 2023 to feel that history when you walk in for a Test here. The scale alone, 132,000 seats, is disorienting in a way no other cricket ground in the world can replicate, and that scale is precisely what made the silence after Australia won so widely remembered.`;

const insiderTips = [
  "The Gujarat Cricket Association runs organized stadium tours on non-match days, covering the dressing rooms, presidential suites, and Hall of Fame museum — worth doing if you're in Ahmedabad before the Test itself starts.",
  "Because this ground is genuinely enormous, factor in real walking time and queueing once inside — getting from the gates to a seat, or to concessions and back, takes noticeably longer here than at a normal-sized stadium.",
];

const whatToAvoid = `Don't assume 2023's ODI result tells you anything meaningful about how this Test will go — format, squad, and conditions are different enough that using the World Cup final as a form guide is a mistake, even if it's the ground's most famous moment. Don't underestimate the stadium's sheer size when planning your day — with 132,000 seats, sightline quality and distance from concessions/exits varies enormously by stand, so check your specific section's location relative to entrances before matchday, not after.`;

const gettingThere = `About 8km from Sardar Vallabhbhai Patel International Airport; well-connected by road via SG Highway and Ashram Road, with on-site parking, though arriving early is essential given the venue's scale.`;

const practicalInfo = {
  address: "Narendra Modi Stadium, Motera, Ahmedabad, Gujarat 380005, India",
  costRange: "2027 Test pricing not yet announced; recent international fixtures here have ranged from budget general seating to premium hospitality boxes well into five figures (INR)",
  bookingMethod: "Tickets released via BookMyShow or the Gujarat Cricket Association's own channels closer to the match date.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Narendra Modi Stadium — World's Largest Cricket Ground",
      subtitle: "132,000 seats, and the exact ground where Australia silenced India's World Cup final crowd in 2023.",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Motera",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: Wikipedia (2023 Cricket World Cup final), Outlook India venue guide, Yahoo Sports pitch report, Al Jazeera crowd-reaction reporting. Google Places API lookup confirmed rating/review count same date (4.6/26,398).",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 26398,
      googleMapsUrl: "https://maps.google.com/?cid=12364473804001350445",
      sport: ["cricket"],
      moodTags: ["worlds-largest", "final-test", "history"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "INR",
      bestSeasons: ["feb", "mar"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences).values({ experienceId: result.id, sportingEventId: EVENT_ID }).onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
