import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "7th-wentworth-grandstand-green-" + Date.now().toString(36);

const bodyContent = `The 7th at Wentworth runs 396 yards downhill off the tee, sweeps around a big dogleg right, then climbs back up to a green set into the hillside with genuine views over the Surrey countryside behind it. It's a good-looking hole even before you get to the green, which is where things get complicated. The putting surface is two-tiered, with the back section sitting a good three feet above the front, and the green lies at an angle across the approach shot that makes club selection harder than the yardage alone suggests.

What makes the 7th worth building time into your day for is the grandstand. It sits right next to the green in a position that also lets you see the tee shot from the same seat, which isn't true of most viewing spots on this course, where you generally have to pick between watching the drive or the approach. Get there early and you can watch a full hole play out, tee to green, without moving.

Because of that dual sightline, this grandstand fills up well before the leaders come through. It's less of a last-minute stop than the 18th, where general admission crowds move through in waves, and more of a plant-yourself-and-stay spot for anyone who wants to properly watch shot-making rather than just catch the outcome.`;

const whyItsSpecial = `A hole that looks scenic from a distance and turns out to be genuinely tricky up close is a rarer combination than golf courses like to admit. The 7th does both: the downhill-then-uphill routing gives you a real view of the Surrey countryside, and the two-tiered green punishes anyone who reads the hole as just a pretty photo opportunity rather than a shot that demands precision.

The grandstand's positioning is what sells it to me. Most golf viewing forces a choice between the drama of the tee shot and the tension of the approach. Here you get both from the same seat, which is exactly the kind of small, practical design detail that separates a genuinely good spectator hole from one that just looks good on a scorecard.`;

const practicalInfo = {
  hours: "Accessible throughout tournament play, Thursday to Sunday.",
  costRange: "Included with general admission grounds tickets.",
  bookingMethod: "No separate ticket required — the grandstand is open to general admission ticket holders, but arrive early since it fills well before the leaders reach the hole.",
  website: "https://www.europeantour.com/dpworld-tour/bmw-pga-championship-2026/tickets-packages/",
  reservationsRequired: false,
};

const gettingThere = "Part of the general admission walking route through the West Course's front nine — follow signage from the main entrance toward the 7th green grandstand.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The 7th — Grandstand Green",
      subtitle: "The one seat at Wentworth where you can watch both the tee shot and the approach without moving.",
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
        "Arrive well before the first tee times if you want a seat with a view of both the tee and the green — this grandstand fills earlier in the day than most others on the course precisely because of that double sightline.",
        "The two-tiered green means an approach shot that lands short can trickle back down a good three feet — watch for players misjudging distance on the front tier, it's one of the more common mistakes here even at tour level.",
      ],
      whatToAvoid: "Don't treat this as a quick stop between other holes — because the grandstand fills early and stays full, you're better off committing to it for a stretch of the day rather than expecting to walk in and out freely.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: todays-golfer.com best places to watch BMW PGA Championship (7th hole grandstand, dual tee/green sightline), various Wentworth West Course guides confirming 396 yards, two-tiered green, dogleg right routing. Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["scenic", "social", "tactical"],
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
