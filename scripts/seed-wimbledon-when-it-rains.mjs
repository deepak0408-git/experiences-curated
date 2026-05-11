import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents } from "../schema/database.ts";

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

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const slug = "wimbledon-when-it-rains-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-rain-delay.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-rain-delay.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Get Wimbledon 2026 sporting event ─────────────────────────────────────

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "The Championships, Wimbledon 2026",
    slug: "wimbledon-2026",
    sport: "tennis",
    tournamentSeries: "Wimbledon",
    editionYear: 2026,
    destinationId: LONDON_ID,
    venueName: "All England Lawn Tennis and Croquet Club",
    venueAddress: "Church Road, Wimbledon, London SW19 5AE",
    startDate: "2026-06-29",
    endDate: "2026-07-12",
    recurrence: "annual",
    ticketingUrl: "https://www.wimbledon.com/tickets",
  })
  .onConflictDoNothing()
  .returning({ id: sportingEvents.id, name: sportingEvents.name });

let wimbledonEventId;
if (event) {
  wimbledonEventId = event.id;
  console.log("✓ Sporting event created:", event.name, "→", wimbledonEventId);
} else {
  const [existing] = await db
    .select({ id: sportingEvents.id })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, "wimbledon-2026"));
  wimbledonEventId = existing?.id;
  console.log("✓ Sporting event already exists, ID:", wimbledonEventId);
}

// ─── 3. Content ───────────────────────────────────────────────────────────────

const bodyContent = `English July is not reliably English July. Wimbledon has been staging its fortnight at the end of June and start of July since 1877, and the weather has been interfering with that plan since roughly the same time. Rain at Wimbledon is not a surprise. It is a context you should be prepared for.

Centre Court has had a retractable roof since 2009. No. 1 Court got one in 2019. When weather moves in on either, the roof takes around ten minutes to close, the lights come on, and play continues. If you're in either stadium when this happens, you stay. The match carries on. This is the part of Wimbledon's weather management that actually works.

Outside these two courts, a different system applies. When rain starts on an outer court, the umpire stops play after the current point finishes. Ground staff pull covers over the court within minutes — this is practiced, and fast. Players go to their chairs or leave the court. The question for spectators then is: for how long?

There's no roof over Courts 2 through 18. There's no schedule for when play resumes, because the schedule depends on when the rain stops and how quickly the grass dries. The AELTC has squeegee crews who clear standing water with noticeable speed, but grass courts don't drain the way hard courts do. A brief shower might mean 30 to 45 minutes. Sustained rain means waiting. In 2024 there was a two-hour delay on a Friday during the tournament. In 2025 rain affected outer court play across several days of the second week. This happens most years in some form.

The refund policy is worth knowing before you go. If less than one hour of play has taken place on your specific court, you're entitled to a full refund. Between one and two hours of play, you receive 50% back. Beyond two hours, no refund applies. For ground passes, the calculation averages play time across all courts covered by the pass — and only applies if you purchased your ticket before 5pm that day. Refunds are based on the referee's record of game time, not how much you personally watched.

During any rain delay the grounds stay open. Food venues run. The Lawn Tennis Museum is covered and worth an hour if the delay stretches. The covered walkways connecting buildings fill up but don't become unpleasant. Large screens around the grounds show BBC coverage, so whatever's happening on the roofed courts is visible from various points outside. There's enough to do during a delay — it just isn't what you came for.

Two things specific to being inside a roofed court when weather arrives: the atmosphere shifts completely when the roof closes. Wimbledon in daylight is green, bright, and specifically itself. Under artificial lights with the roof sealed, it becomes something else — louder, more self-contained, the crowd that was about to disperse now held together inside a closed system. And there's a particular energy to the match that follows. The players re-warm. The crowd re-focuses. Play under the Centre Court roof after a rain delay has a quality that a smooth uninterrupted afternoon doesn't.

Pack a waterproof layer regardless of the morning forecast. The forecast changes.`;

const whyItsSpecial = `Wimbledon's rain has produced some of the most memorable tennis in the tournament's history — not despite the weather but partly because of what it creates. The long rain delay that compresses the schedule, forcing a match to finish under lights into the evening. The crowd that was about to leave, now held together inside a sealed Centre Court. The point that should have ended the set, played three hours later in a completely different atmosphere.

There's something specific about being at Wimbledon in the rain that a sun-drenched day doesn't provide. In good weather it's easy — the food is good, the grass is bright, everything works. In the rain, you're waiting alongside everyone else, sharing something uncertain. The crowd in a rain delay has a quality that a smooth Wimbledon afternoon doesn't. Something slightly suspended, like a held breath. And when play resumes, particularly indoors under lights, the intensity in the stadium is different from what it would have been without the interruption.

The rain also reveals something about who's there for the tennis versus who came for the event. A sustained delay thins out the crowd that was principally there for the strawberries. What remains in the stands when play finally resumes tends to care more.

This experience applies to every ticket type and every day of the fortnight. Preparing for rain isn't pessimism — it's the thing that keeps a rained-out day from being a wasted one. Know the refund thresholds. Know where to shelter. Know that the best Wimbledon sessions sometimes start two hours late and finish under lights.`;

const insiderTips = [
  "Check the AELTC's rain and curtailment policy at wimbledon.com before you attend — knowing the refund thresholds in advance avoids frustration at the gate.",
  "Less than 1 hour of play on your specific court = full refund; 1–2 hours = 50%; more than 2 hours, no refund. Ground pass holders: average play time across covered courts, purchased before 5pm only.",
  "During an outer court rain delay, move to food venues early — the covered areas fill up fast once rain is confirmed. The Museum is an underused shelter option for delays over an hour.",
  "Inside Centre Court or No. 1 Court when the roof closes: stay in your seat. The roof takes around 10 minutes to close and the match continues. Leaving to shelter is unnecessary and loses your seat.",
  "Pack a waterproof layer regardless of the morning forecast — Wimbledon weather changes fast in the afternoon and the grounds offer limited unscheduled shelter.",
  "Rain on a forecast day often means a shorter Queue the following morning — the deterrent effect keeps some regulars away. If you were planning to Queue, don't let a grim forecast change your plans.",
];

const whatToAvoid = `Don't leave the grounds during a rain delay expecting to return — once you exit you've lost your place for the day. Don't wait in the queue for covered food venues when rain starts; move early or head to the Museum instead. Don't assume that because Centre Court has a roof the rest of the grounds are sheltered — only Courts 1 and Centre have roofs; every other court is exposed. And don't write off a rain-delayed day — some of the most atmospheric Wimbledon sessions start two hours late.`;

const practicalInfo = {
  hours: "Outer court play stops immediately with rain; Centre Court and No. 1 Court continue under roof. Evening play possible until 11pm on roofed courts.",
  costRange: "Your existing match ticket covers the day regardless of weather. Refunds: full if <1hr play, 50% if 1–2hrs, none beyond 2hrs.",
  bookingMethod: "N/A — applies to all ticket and ground pass holders.",
  reservationsRequired: false,
  website: "https://www.wimbledon.com/en_GB/atoz/raincheck_policy.html",
};

const gettingThere = `Applies to anyone already inside the AELTC grounds. For entry: District Line to Southfields (Zone 3), 15-minute walk; or Wimbledon station then shuttle bus or 25-minute walk. Church Road, Wimbledon, London SW19 5AE.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "When It Rains at Wimbledon",
      subtitle: "What actually happens when the weather closes in — roof protocol, the refund policy, and how to make a rain day work",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId ?? null,
      neighborhood: "Wimbledon, SW19",
      address: "All England Lawn Tennis and Croquet Club, Church Road, Wimbledon, London SW19 5AE",
      heroImageUrl,
      heroImageAlt: "Wimbledon ground crew in green uniforms assembled on Centre Court during a rain delay, 2007 Championships",
      heroImageCredit: "Public domain, via Wikimedia Commons",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Roof close times (~10 min) from The US Sun and Green & Purple. Refund policy (full <1hr, 50% 1-2hrs, none >2hrs) from wimbledon.com official raincheck policy and Sportskeeda. Ground pass refund conditions (before 5pm, average play time) from wimbledon.com. Centre Court roof installation date (2009), No. 1 Court (2019). 2024 and 2025 rain delay incidents from ATP Tour and LobAndSmash. Verified April 2026.",
      moodTags: ["authentic", "iconic", "social"],
      interestCategories: ["sport", "culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      budgetMinCost: "50",
      budgetMaxCost: "120",
      bestSeasons: ["jun", "jul"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-04-25",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

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
