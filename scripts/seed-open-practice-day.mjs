import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "263faaad-ceed-4355-acb7-9f2073cb1028";
const EVENT_ID = "ccb585a6-3cdb-40ce-999e-a1d455854301";
const slug = "open-practice-day-royal-birkdale-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/Practice-Day-at-Royal-Birkdale.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Practice Day at Royal Birkdale.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `The first thing you notice on a practice day is how much space there is. The same course that holds 30,000 people on a Saturday feels like a private club on Monday or Tuesday. You can stand at the 6th tee box as Rory McIlroy works through his irons. You can walk straight to the 18th grandstand and sit wherever you like. Nobody is crushing in behind you at the ropes.

This is what practice days are for. Not the competition, not the scoreboard — the access.

The Open 2026 has four practice days at Royal Birkdale, each with a distinct character. Sunday 12 July is a soft opening — gates come up, the course opens for exploration, and the Spectator Village begins trading, with Wimbledon men's final and Scottish Open broadcasts running simultaneously on the big screens. It is the quietest of the four days, the one for people who want the full course to themselves before the players have even arrived.

Monday 13 July is the Last-Chance Qualifier: a 12-player strokeplay competition for the final Open spot. These are not household names, but the stakes are everything — a chance to play in the most historic major in golf, gone if you bogey the 18th. The format makes for a particular kind of intensity that you will not find during the championship rounds. Stand on any hole and the players are grinding in a way that the established field rarely lets you see.

Tuesday 14 July is the busiest practice day and the one to choose if you want maximum player access. The full 156-man field is present, working through their pre-championship routines on the course. This is also the day of the Heroes Classic — past Champion Golfers and invited guests playing a short-format challenge on the links. Watching a former Open champion play a fun-format game, relaxed and unguarded, is a different kind of golf from anything you will see during the tournament.

Wednesday 15 July is The Eve — the last practice session before the championship begins Thursday morning. Players are tighter, focused, working specific holes and specific shots. The mood shifts. There is less of the loose warmth of Monday and Tuesday; what you get instead is a glimpse of concentration, of competitors mentally settling into the course.

Royal Birkdale itself rewards the walking. The course runs north through the sandhills and back south, with each hole sitting in its own corridor of rough and dune — a design that gives the layout its famous fairness (there are very few blind shots at Birkdale) but also means that every hole feels self-contained. On a practice day you can walk the full 18 in roughly three hours, lingering where you want, doubling back to watch a group finish a hole you enjoyed, without being swept along by the crowd.

The Spectator Village is open on all four days. Food stalls, The Open Shop, and the big screens are all operating — so the practical experience is close to a championship day, minus the noise and the pressure on the queues. The R&A operates the course cashless, so bring a card. The park-and-ride is the sensible transport option; road parking near the club is extremely limited on all event days, practice included.

General admission practice day tickets start at £30 for Sunday 12 July, rising to around £75 for Wednesday. Ticket Plus upgrades are available on Monday through Wednesday and give access to The Links private zone, the gourmet food area, and the grandstand platform by the 4th green.`;

const whyItsSpecial = `The Open's practice days have a reputation among regular attenders that doesn't travel far beyond them. Most people going to Royal Birkdale for the first time are going to a championship day — they've bought the expensive ticket for Thursday through Sunday. Practice days sell out too, but they sell out after the championship rounds. The people who know, go Monday or Tuesday.

What you get that you cannot buy on a championship day is proximity. Tournament golf at this level is managed proximity — you are always behind a rope, always at a distance calibrated by security and crowd logistics. On a practice day, the ropes are still there, but the crowds are thin enough that you can move with a group for several holes, stand front-row without pushing, and watch without the person in front of you being the only thing between you and the golfer.

The Last-Chance Qualifier on Monday is genuinely compelling, and it is almost entirely overlooked. These are players trying to qualify for the 154th Open Championship, often by a single shot across a full day's golf. The emotional register is completely different from the tournament proper. And because it is not the main event, you can follow a group from hole to hole without working against 20,000 other people doing the same thing.

If you are going to Royal Birkdale for the first time and deciding between a practice day and a championship day, the honest answer is: it depends. If you want the atmosphere — the roars, the leaderboard drama, the collective tension of 30,000 people watching a putt — then championship. If you want the golf, and the course, and the chance to actually experience Royal Birkdale rather than endure a crowd, then practice day.`;

const insiderTips = [
  "The Last-Chance Qualifier on Monday 13 July runs all day — pick up the pairings sheet at the gate and follow one group for the back nine; the tension on individual holes is unlike anything in the main championship.",
  "Arrive at gates open (two hours before first tee) and walk straight to the 18th grandstand — you will have free choice of seating and can watch groups come in from the front row; by mid-morning the good spots go.",
];

const whatToAvoid = `Don't mistake Sunday 12 July for a full practice day — the main player field doesn't arrive until Monday, and Sunday is primarily course exploration and the Spectator Village. It's the right choice if you want a quiet walk of Royal Birkdale, wrong if you've come specifically to watch the world's best players practice. And don't underestimate how quickly Wednesday sells at the Ticket Plus level — it's the last practice day before the championship begins and demand is higher than Monday or Tuesday; if Wednesday Ticket Plus is your target, book it before the championship days.`;

const gettingThere = `Take Merseyrail Northern Line from Liverpool Central to Birkdale station (approximately 40 minutes). The course is an 8-minute walk from Birkdale station exit. Alternatively, follow signs for The Open park-and-ride from the M57/A570 — do not attempt to park near the course on event days.`;

const practicalInfo = {
  hours: "Gates open 2 hours before first tee time. Practice days: Sunday 12 – Wednesday 15 July 2026.",
  costRange: "General admission from £30 (Sunday) to ~£75 (Wednesday). Ticket Plus: £125–£160 on practice days.",
  bookingMethod: "Book general admission or Ticket Plus practice day tickets via theopen.com.",
  howToBook: "Tuesday 14 July is the priority booking for serious attenders — it has the full 156-man field plus the Heroes Classic, and it sells before Monday and Wednesday. If you want a practice day but haven't booked, call the R&A Experience Team on +44 (0)1334 460090 or email Experiences@TheOpen.com — the team occasionally has access to allocations not visible online. Ticket Plus on a practice day (£125–£160) is the better value version of the championship Ticket Plus (£270–£300): same private zone, same 4th green grandstand, same food voucher, far fewer people competing for the outdoor seats. If you are travelling from outside the UK and want to plan a multi-day trip, several official Open travel partners listed on theopen.com bundle Wednesday Ticket Plus with accommodation in Southport or Liverpool — worth comparing against self-booking once you factor in match-week hotel rates.",
  website: "https://www.theopen.com/tickets-and-hospitality/2026/tickets",
  reservationsRequired: true,
};

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Practice Day at Royal Birkdale",
      subtitle: "Walk the fairways before the crowds arrive and get closer to the players than you ever will on a championship day.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Royal Birkdale",
      address: "Royal Birkdale Golf Club, Waterloo Road, Southport, PR8 2LX",
      heroImageUrl,
      heroImageAlt: "Spectators watching play at The Open Championship at Royal Birkdale",
      heroImageCredit: "Richard Stott, Unsplash Licence",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: theopen.com/tickets-and-hospitality/2026/practice-days (practice day schedule and events), theopen.com/tickets-and-hospitality/2026/prices (Ticket Plus pricing), theopen.com/tickets-and-hospitality/2026/tickets (general admission). Verified 16 Jun 2026. Hero image: Richard Stott via Unsplash, The Open 2017 at Royal Birkdale, Unsplash Licence.",
      moodTags: ["insider", "fan_zone"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "GBP",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-16",
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
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
