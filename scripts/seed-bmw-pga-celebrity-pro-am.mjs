import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "celebrity-pro-am-wentworth-" + Date.now().toString(36);

const bodyContent = `The Celebrity Pro-Am is Wentworth's traditional curtain-raiser, played the Wednesday before the tournament proper begins, and it's the one day where the sport and entertainment worlds actually share a golf course rather than just a marketing tagline. Recent years have paired DP World Tour professionals with a genuine mix of names: Andy Murray, Gareth Bale, Ben Stokes, Lando Norris, Tom Holland, and Michael McIntyre have all played in editions of this event, alongside footballers like Eden Hazard, John Terry, and Jordan Pickford, and cricketers James Anderson and Ollie Pope.

The format runs as two shotgun starts, morning groups from 8:00am and afternoon groups from 1:30pm, which means the whole West Course fills with groups simultaneously rather than the usual staggered tee-time procession of a normal tournament round. It's a different atmosphere entirely, looser, louder, and considerably less serious than the golf that follows from Thursday onward.

General admission for the Pro-Am has sold out in recent years, alongside Friday, Saturday, and Sunday, which tells you this isn't a quiet warm-up day people skip. If you're the kind of fan who wants a glimpse of athletes from outside golf on a golf course, doing something they're not actually elite at, this is the day for it.`;

const whyItsSpecial = `I like the Pro-Am precisely because it doesn't try to be serious golf, and it doesn't pretend to be. Watching Lando Norris or Ben Stokes attempt a tour-level course is a genuinely different pleasure than watching Rory McIlroy do it, you're watching talented people be merely competent rather than exceptional, and there's something honest and fun about that.

It also tells you something real about this event's identity. The Open Championship doesn't have a day like this, and it doesn't need one, its appeal is tradition and the coastline. Wentworth built its reputation partly on this crossover between sport and celebrity, and the Pro-Am is where that's most visible before a single competitive shot is struck.`;

const practicalInfo = {
  hours: "Wednesday before the tournament — morning shotgun start 8:00am BST, afternoon shotgun start 1:30pm BST.",
  costRange: "Included with general admission grounds tickets for the Wednesday date — check availability early, as Pro-Am day general admission has sold out in recent years.",
  bookingMethod: "Buy general admission tickets for the Wednesday Pro-Am date specifically through the official BMW PGA Championship ticketing site — this is a separate ticket date from the Thursday-Sunday tournament rounds.",
  website: "https://www.europeantour.com/dpworld-tour/bmw-pga-championship-2026/tickets-packages/",
  reservationsRequired: false,
};

const gettingThere = "Same access as tournament days — via Longcross or Virginia Water station, then a short walk or shuttle to the main spectator entrance.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Celebrity Pro-Am at Wentworth",
      subtitle: "A Wednesday shotgun-start curtain-raiser pairing pros with names like Murray, Bale, Stokes and Norris.",
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
        "The shotgun start means groups are spread across the entire course simultaneously — check the published tee sheet on the day to find which holes your favourite pairings will be playing rather than waiting at one spot.",
        "Pro-Am general admission has sold out in recent years alongside the tournament days — buy your Wednesday ticket as early as the rest of your tournament tickets, not as an afterthought.",
      ],
      whatToAvoid: "Don't expect tournament-level golf from the celebrity side of the pairings — this is a fun, loose exhibition day, not a serious competitive round, and it's worth enjoying on those terms rather than judging it against Thursday's play.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: golfmonthly.com BMW PGA Celebrity Pro-Am tee times, europeantour.com DP World Tour articles confirming celebrity lineups across recent years (Andy Murray, Gareth Bale, Ben Stokes, Lando Norris, Tom Holland, Michael McIntyre, Eden Hazard, John Terry, James Anderson, Ollie Pope), skysports.com on Murray/MacIntyre pairing, press.bmwgroup.com on Pro-Am as traditional curtain-raiser. Note: specific 2026 celebrity lineup not yet announced at time of writing — written generically per past-years pattern rather than naming unconfirmed 2026 participants. Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["fun", "social", "celebrity"],
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
