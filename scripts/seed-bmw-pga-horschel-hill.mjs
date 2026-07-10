import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "horschel-hill-big-screen-social-spot-" + Date.now().toString(36);

const bodyContent = `Horschel Hill sits between the 1st and 18th tees, named for two-time BMW PGA champion Billy Horschel, and it's built for a completely different kind of spectating than the grandstands elsewhere on the course. There's no single hole to watch here. Instead, there's a big screen showing coverage from around the West Course, and a sloped, grassy vantage point where you can sit back with a drink and follow the tournament without committing to one location for the day.

It's free with general admission, which puts it at the opposite end of Wentworth's spectrum from the Championship Pavilion's premium tiers. No reserved seating, no food service, just a relaxed hill and a screen, which makes it the natural gathering point for anyone who wants to watch golf socially rather than plant themselves at a single grandstand for hours.

Because it sits between two of the course's busiest tees, it also works as a meeting point if your group splits up to watch different holes during the day, everyone knows where the hill is, and everyone can find the big screen from a distance.`;

const whyItsSpecial = `Every golf tournament needs somewhere for fans who don't want to commit to a single grandstand seat for six hours, and Horschel Hill is that place at Wentworth. I appreciate that it's unpretentious, no premium tier, no reserved anything, just grass and a screen, at an event that otherwise leans hard into hospitality tiers and Championship Villages.

Naming it after Horschel is a nice touch too, a nod to a two-time champion rather than a sponsor, in an event where nearly everything else carries a brand name. It's a small signal that Wentworth still has room for something simple among all the premium packaging.`;

const practicalInfo = {
  hours: "Open throughout tournament days during spectator hours, no separate access required.",
  costRange: "Free with general admission grounds ticket.",
  bookingMethod: "No booking needed — walk in as part of general admission access, located between the 1st and 18th tees.",
  website: "https://www.europeantour.com/dpworld-tour/bmw-pga-championship-2026/tickets-packages/",
  reservationsRequired: false,
};

const gettingThere = "Located between the 1st and 18th tees, close to the main spectator entrance and the Championship Village — well signposted.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Horschel Hill — The Big Screen Social Spot",
      subtitle: "A free, unreserved hillside spot between the 1st and 18th tees, with a big screen showing the whole course.",
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
        "Use Horschel Hill as your group's meeting point if you're planning to split up and watch different holes during the day — it's central and easy for everyone to find again.",
        "This is the most relaxed viewing spot on the course — bring a picnic blanket or portable chair if you want to settle in for a longer stretch rather than standing.",
      ],
      whatToAvoid: "Don't expect close-up views of any single hole here — this is a big-screen, general-atmosphere spot rather than a place to watch live shots up close, so pair it with time at an actual grandstand if you want to see golf in person rather than on a screen.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: todays-golfer.com best places to watch BMW PGA Championship (Horschel Hill named for Billy Horschel, located between 1st and 18th tees, big screen coverage). Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["free", "relaxed", "social"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
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
