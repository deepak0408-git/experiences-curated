import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "263faaad-ceed-4355-acb7-9f2073cb1028";
const EVENT_SLUG = "open-championship-2026";
const slug = "open-links-festival-hub-" + Date.now().toString(36);

// ─── 1. Resolve sporting event (already exists) ───────────────────────────────

const [existing] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

const eventId = existing?.id;
console.log("✓ Sporting event found, ID:", eventId);

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Most people at The Open spend the day on their feet — queuing for a lukewarm pie, losing their group in a crowd of 30,000, circling the course without anywhere to sit down and actually watch. The Links changes the calculation.

The Links is the festival-style area that comes with a Ticket Plus upgrade, positioned close to the par-3 4th green. Think of it as your base for the day: a private zone with a mix of undercover and outdoor seating where you can catch your breath, watch what's happening across the course on large screens, and then head back out. It is not a grandstand you are anchored to — it is somewhere to return to.

The food is better than anything in the general Spectator Village. The £25 voucher included with your Ticket Plus covers gourmet food trucks operating within the private area, and the private bar handles drinks separately. There are also private toilets, which matters more than it sounds after a few hours in a British summer crowd.

The dedicated viewing platform beside the 4th green is the specific centrepiece. The 4th at Royal Birkdale is a 203-yard par 3, tight and exposed — the kind of hole where the whole field's afternoon can shift in a single shot. From the platform, you are close enough to read faces. On a course where the crowds thin out between the grandstands, this is a proper vantage point with a roof over your head.

A complimentary park-and-ride pass is included, which removes one of the bigger logistical headaches of attending. The course operates cashless throughout, so the £25 food voucher goes further than it might otherwise — everything else you spend on food and drink in the general areas requires a card anyway.

The Spectator Village, open to all ticketholders, is worth knowing about even if you have Ticket Plus. It has giant screens, a kids play area, fish and chips, noodles, dumplings, Greek street food, and The Open Shop stocking BOSS, adidas, and Peter Millar. If you are travelling with people on different ticket types, the village is the natural meeting point.

Championship days run Thursday 16 to Sunday 19 July 2026. Practice days are Monday 13 to Wednesday 15 July. General admission starts at £30 on the opening practice day, rising to £150 for Sunday's final round. Ticket Plus ranges from £125 on Monday to £300 on Sunday — Friday and Sunday are sold out at Ticket Plus level, but Wednesday remains available.`;

const whyItsSpecial = `General admission at The Open is genuinely good — you can walk the course, get close to the ropes, and stand five feet from the world's best players for most of the day. But it has a structural problem: there is nowhere to stop. No base, no guaranteed seat, no food outlet that isn't a queue. After three or four hours you start making compromises about which holes to see because your legs have given up.

The Links solves this without tipping into the kind of over-managed hospitality where the golf becomes background noise. You still have course access. You still walk the fairways. The difference is that you have somewhere to come back to — covered seating, a proper viewing platform for one of the course's more precise and drama-prone holes, and food that doesn't require you to queue behind 200 other people.

The par-3 4th is an underrated place to watch. It is not the 18th, where the grandstands are heaving and the atmosphere is overwhelming. It is quieter than that — intense in a different way. Watching a field of 156 players navigate a hole that requires precision rather than power over four days tells you something specific about the championship that the 18th crowds don't.

The waitlist is real and moves. People upgrade, weather forecasts change plans, and the R&A does release additional availability. If you have a general admission ticket and want to upgrade, calling the Experience Team directly gets you further than waiting for something to appear online.`;

const insiderTips = [
  "The £25 food voucher is loaded to your Ticket Plus pass and works only at the gourmet trucks inside The Links — it does not cover the private bar, so bring a card for drinks.",
  "Arrive when gates open (two hours before first tee) to claim the best outdoor seating in The Links before the day's groups reach the 4th hole — by mid-morning the undercover spots are taken.",
];

const whatToAvoid = `Don't treat The Links as your fixed base for the entire day — it has screens, but watching the whole championship on a screen from a tent defeats the point of being at The Open. Use it to recover, then get back on the course. And don't upgrade to Ticket Plus on a Sunday expecting flexibility — Sunday is sold out and if you find a resale ticket, you will pay a significant premium. Wednesday at £160 Ticket Plus is the sensible alternative if your priority is The Links experience rather than the final round.`;

const gettingThere = `Take Merseyrail from Liverpool Central to Birkdale station (approx. 40 minutes, Northern Line to Southport). The course is an 8-minute walk from Birkdale station. Ticket Plus includes a complimentary park-and-ride pass if you are driving — follow signs for The Open park-and-ride from the M57/A570. Do not attempt to park near the course; road closures are extensive on championship days.`;

const practicalInfo = {
  hours: "Gates open 2 hours before first tee time; The Links operates throughout the day",
  costRange: "Ticket Plus from £125 (practice days) to £300 (Sunday final round). General admission £30–£150.",
  bookingMethod: "Book via theopen.com — Ticket Plus includes access to The Links; limited availability remains.",
  howToBook: "Friday and Sunday Ticket Plus are sold out as of June 2026, but the R&A maintains a waitlist — call +44 (0)1334 460090 or email Experiences@TheOpen.com directly. Existing general admission ticketholders can upgrade to Ticket Plus through the same contact; this is not prominently advertised on the website but the Experience Team will process it. Wednesday practice day at £160 Ticket Plus is the best value remaining — the course is less crowded, player access is closer, and The Links has more breathing room than any championship day. If buying for a group with mixed ticket types, the general Spectator Village works as a meeting point for everyone.",
  website: "https://www.theopen.com/tickets-and-hospitality/2026/ticket-plus",
  reservationsRequired: true,
};

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Links — Festival Hub at The Open",
      subtitle: "Ticket Plus turns your day into a base camp: covered seating, food trucks, and a grandstand beside the 4th green.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId ?? null,
      neighborhood: "Royal Birkdale",
      address: "Royal Birkdale Golf Club, Waterloo Road, Southport, PR8 2LX",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: theopen.com/tickets-and-hospitality/2026/ticket-plus (Ticket Plus details, pricing, availability), theopen.com/tickets-and-hospitality/spectator-guide (Spectator Village facilities), todays-golfer.com (general admission pricing). Verified 16 Jun 2026. Friday and Sunday Ticket Plus sold out at time of writing. GTG affiliate opportunity: GTG sells Open Championship hospitality packages — check for affiliate link.",
      moodTags: ["fan_zone", "hospitality"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 2,
      budgetTier: "splurge",
      budgetCurrency: "GBP",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
