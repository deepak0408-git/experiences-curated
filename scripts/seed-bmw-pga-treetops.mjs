import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "treetops-elevated-viewing-platform-" + Date.now().toString(36);

const bodyContent = `Treetops sits on the 14th hole, and it's built exactly the way the name suggests: a raised, multi-level platform above the treeline with its own bar, presented by Buffalo Trace. From up there you get an angle on the course that ground-level general admission simply doesn't offer, plus screens showing the action from elsewhere on the West Course, so you're never fully cut off from what's happening at the 18th or anywhere else while you're planted on the 14th.

The package folds in a handful of small conveniences that add up over a full tournament day: fast-track bag check and priority queue access at the main entrance, a meal voucher (up to £15), two drink vouchers, and fast-track queuing at the Village Bar. None of it is extravagant on its own, but together it removes most of the friction of a long day on your feet, which matters more than people expect by the third day of a tournament.

It's a different kind of hospitality than the Championship Pavilion tiers by the 18th. Those put you close to the tournament's emotional center, the closing hole, the leaderboard drama. Treetops trades that proximity for a genuinely different vantage point and a quieter, less crowded corner of the course, on a hole you wouldn't otherwise get an elevated view of at all.`;

const whyItsSpecial = `Most golf hospitality is really just "better seats near the best hole." Treetops does something different: it puts you somewhere you couldn't get a good view from at ground level at all, on a hole that doesn't get the crowds or attention of the 18th. I think that trade is worth making for anyone who's already seen the big finishing holes on a previous visit, or who just wants a different day than everyone crowding the same three grandstands.

The practical touches, fast-track entry, the meal and drink vouchers, matter more than they sound like they should. A tournament day is long, and anything that removes queuing friction changes how much of the day you actually spend watching golf instead of standing in line for a sandwich.`;

const practicalInfo = {
  hours: "Access throughout tournament days per your ticket package; platform and bar open during spectator hours.",
  costRange: "Premium hospitality package pricing — not published for 2026 at time of writing; check official channels for current rates.",
  bookingMethod: "Book directly through the official BMW PGA Championship ticketing and hospitality pages ahead of the event — premium hospitality packages typically require advance purchase rather than being available on the day.",
  howToBook: "If a quieter, elevated vantage point matters more to you than proximity to the 18th, book Treetops early — premium hospitality at Rolex Series events tends to sell out well before the tournament week, especially for a Saturday or Sunday date. The fast-track bag check and priority entry are worth using from your very first arrival, not just once you're inside, since they cut real time off getting into the grounds on a busy morning. Factor the included meal and drink vouchers into your day's plan rather than buying food elsewhere first — they're only valid within the package.",
  website: "https://www.europeantour.com/dpworld-tour/bmw-pga-championship-2026/tickets-packages/",
  reservationsRequired: true,
};

const gettingThere = "Treetops is located at the 14th hole on the West Course — follow hospitality signage from the main spectator entrance, separate from general admission routes.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Treetops — The Elevated Viewing Platform",
      subtitle: "A raised platform above the 14th hole, with its own bar and a genuinely different angle on the course.",
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
        "Use the fast-track bag check and priority entry from your very first arrival of the day, not just once — it saves real time on a busy tournament morning.",
        "The included meal voucher (up to £15) and two drink vouchers are only valid within the package, so plan to eat and drink here rather than buying elsewhere first.",
      ],
      whatToAvoid: "Don't book Treetops expecting proximity to the 18th green drama — this is a deliberately different, quieter vantage point on the 14th, and it suits someone who wants a fresh angle on the course rather than the marquee finishing-hole atmosphere.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: europeantour.com BMW PGA Championship 2026 tickets/packages page, hospitality package description confirming 14th hole location, fast-track bag check, meal and drink vouchers. 2026 pricing not published at time of writing — flagged in copy rather than guessed. Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["premium", "relaxed", "scenic"],
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
