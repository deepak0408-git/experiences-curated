import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "the-approach-james-tanner-" + Date.now().toString(36);

const bodyContent = `The Approach sits directly beside the 18th fairway, positioned specifically to watch both the tee shot and the approach on Wentworth's famous risk-reward par 5, whether a player is going for the green in two or laying up short of the water. It's a more relaxed format than some of the tournament's other premium packages: a casual lounge with reserved tables for 2, 4, 6 or 8 guests, rather than a formal sit-down structure.

The food is the real draw here. James Tanner, a chef known for classic British cooking built around seasonal ingredients, curates food stations that run across the day, breakfast through afternoon fare, alongside a complimentary bar. It's designed to be flexible rather than scheduled, you're not locked into a set lunch sitting, which suits a day where you might want to duck out to watch a group finish and come back rather than sit through a fixed meal service.

At £540 per person, it sits at the more accessible end of Wentworth's premium hospitality tiers while still putting you in one of the best positions on the course for the tournament's signature hole.`;

const whyItsSpecial = `What makes The Approach worth calling out separately from Wentworth's other 18th-green hospitality is the informality. A lot of premium golf hospitality assumes you want a fixed schedule: arrive, sit, eat, watch. This package is built the opposite way, food stations you can visit on your own time, a casual lounge rather than assigned seating for a meal service, which matters on a day where the golf itself doesn't run to a schedule you can plan a lunch around.

Being beside the fairway rather than at the green itself is also a genuine difference, not just a lesser version of a green-side seat. You see the decision a player makes on their second shot before you see the result, which is arguably the more interesting moment on this hole.`;

const practicalInfo = {
  hours: "Full-day access during tournament hours per your ticket date; food stations run breakfast through afternoon.",
  costRange: "From £540 per person (2026 pricing).",
  bookingMethod: "Book online via the official BMW PGA Championship hospitality pages, or call 020 7989 6500 — premium hospitality typically requires advance purchase.",
  howToBook: "Book The Approach as early as you can once tickets open — at £540 per person it's one of the more accessible premium tiers at Wentworth, and tables for larger groups (6 or 8) tend to go first if you're planning to bring friends or colleagues. If watching the 18th's risk-reward decision matters most to you, ask specifically for a table nearer the fairway rather than further back in the lounge, since the format is casual enough that positioning can vary.",
  website: "https://www.europeantour.com/dpworld-tour/bmw-pga-championship-2026/tickets-packages/",
  reservationsRequired: true,
};

const gettingThere = "Located beside the 18th fairway on the West Course — follow hospitality signage from the main spectator entrance.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Approach by James Tanner",
      subtitle: "A casual hospitality lounge beside the 18th fairway, with food stations from chef James Tanner.",
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
        "The format is flexible rather than scheduled — use that to duck out and watch a group finish on 18, then come back to the food stations, rather than committing to a fixed meal sitting.",
        "Tables for larger groups (6 or 8 guests) tend to sell out first if you're planning a group outing — book early if you want the bigger table sizes.",
      ],
      whatToAvoid: "Don't confuse this with a green-side seat — you're beside the fairway, which means you see the second-shot decision rather than the outcome at the green itself. If you specifically want to watch balls land, this isn't the closest vantage point on the hole.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: eventmasters.co.uk BMW PGA Championship 2026 The Approach package page, europeantour.com 2024/2025/2026 tickets-packages pages confirming James Tanner chef curation, £540pp 2026 pricing, casual lounge format with tables for 2/4/6/8. Verified 10 Jul 2026. Note: also surfaced a separate 'Champions Club' tier not in the locked 18-experience list — flagging for user awareness, not adding without confirmation.",
      sport: ["golf"],
      moodTags: ["premium", "casual", "culinary"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "GBP",
      bestSeasons: ["sep"],
      advanceBookingRequired: true,
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
