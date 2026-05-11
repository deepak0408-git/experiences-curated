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
const slug = "wimbledon-outer-courts-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-court-17.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-court-17.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Get Wimbledon 2026 sporting event ─────────────────────────────────────

await db
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
  .onConflictDoNothing();

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "wimbledon-2026"));

const wimbledonEventId = event?.id ?? null;
console.log("✓ Sporting event ID:", wimbledonEventId);

// ─── 3. Content ───────────────────────────────────────────────────────────────

const bodyContent = `The Wimbledon Grounds Pass is one of the most undervalued tickets in sport. For £30 during the first eight days of the tournament, it gives you full access to the grounds and unreserved seating on Courts 3 through 18 — the outer courts where the draw gets worked through in the early rounds, where seeds who will appear on Centre Court later in the week still have to earn it.

There are no bad seats on the outer courts. The stands are small. On Court 14 or Court 15, three rows back is genuinely three rows from the baseline — close enough to hear the impact on every forehand, to see topspin kick on a second serve, to understand the physical scale of professional tennis in a way that a stadium seat never quite delivers.

The experience here is structured differently from the show courts. You find a seat, and it's yours as long as you stay. Leave to wander, and you lose it. Most people settle into a rhythm: a match or two on one court, then a walk to the Hill to see what's happening on the big screen, then back to a different court in the afternoon when the light is long and the shadows are good.

What you see on the outer courts during the first week covers the full range of the professional game. A seed who drew badly at the wrong stage. Two qualifiers who have never played a grass match this well and may not again. A doubles pair with a shot combination that makes no sense until the third set. The outer courts during Days 1-6 are where tennis shows you what it actually is when the cameras aren't all pointing at one place.

The best courts for specific players during the early rounds are Courts 4 and 5, where the higher seeds often appear when they're not yet on Centre Court. Check the day's order of play on the Wimbledon app before you enter — matches are assigned courts each morning, and knowing where to go first saves time.

Court 2 needs a separate reserved ticket, but Courts 3 through 18 are all yours with a grounds pass. Court 2 has a particular reputation — the "Graveyard of Champions," in the tournament's phrase — for seedings falling there unexpectedly. The outer courts don't have that narrative weight. They have something else: a proximity that the designated show courts simply can't match.

A full day works like this. At Gate 3 by 9am for the queue. Inside by 10am. Matches start at 11am. Walk three or four courts in the morning, checking what's on. Somewhere around noon, lunch and a circuit of the Hill. Back to the outer courts for the afternoon session. Then the decision about whether to try for a returned Show Court ticket at the resale kiosk.

On that last point: returned tickets for Centre Court, Court 1, and Court 2 go on sale throughout the day from the kiosk inside the grounds at £10 each. It's not guaranteed — it depends on the day and the draw — but if you're inside on a grounds pass and the right day lines up, it's worth asking a steward for the kiosk location.

Food logistics matter here. The on-site kiosk queues run 20-30 minutes by midday on peak days. The official strawberries — around £4 for 500g — are worth buying once, but for everything else, packing your own food is significantly cheaper and simpler. The outer courts experience rewards staying put and watching; constantly queuing for food works against that.

The outer courts have their strongest days during Days 3-7 of the tournament. Day 1 and 2 crowds are the largest of the fortnight. Day 8 onwards, the draw thins and outer courts start to go quiet. Targeting the middle of the first week gives you the widest spread of matches, the most manageable queue, and the best chance of catching someone who'll be in the second week.`;

const whyItsSpecial = `There's a version of Wimbledon that is expensive, prescribed, and seen from a distance. A debenture seat on Centre Court, or a hospitality package, or a ballot ticket for the finals. These aren't bad ways to see the tournament. But they're not the way most tennis fans first understood what Wimbledon actually is.

The outer courts are the other version. Close, contingent, and open to anyone who joins the queue early enough. What you get on Court 12 or Court 14 isn't a lesser experience — it's different access. You are near enough to the players to see what television doesn't show: the adjustment of grip between points, the way a player's body language shifts when the match starts going against them, the exchange between a player and their coach during a changeover when something needs to change.

The Grounds Pass pricing has an elegance to it that feels intentional: £30 for the first week, dropping to £20 in the second when fewer outer court matches are available. This is a tournament that has maintained this pricing structure for decades while running one of the most commercially successful sporting events in the world. The decision to keep a genuinely affordable daily ticket is worth noting.

What the outer courts give you, beyond the tennis, is Wimbledon as a place rather than an event. The show courts tell you about the tennis. The outer courts tell you about the grass, the particular quality of a summer afternoon in SW19 when something remarkable is happening three rows from where you're sitting.`;

const insiderTips = [
  "Check the day's order of play on the Wimbledon app before entering — matches are assigned courts each morning, and Courts 4-5 often host the first seeds' early-round matches.",
  "Arrive at Gate 3 before 9am on peak first-week days to guarantee a grounds pass — position around 2,000 is where passes typically run out.",
  "When a match ends on an outer court, seats free up fast — move quickly if you're standing at the back edge waiting for a spot.",
  "The returned-ticket kiosk for Show Court upgrades (£10) is inside the grounds; ask a steward at the gate where it is when you arrive.",
  "Days 3-7 of the tournament are the outer courts' best days: the draw is full, Day 1-2 crowds have settled, and you'll see players who'll feature in the second week.",
  "Re-entry is allowed the same day but you forfeit any seat you were holding on the outer courts — factor this in before leaving for lunch.",
  "Pack your own food and water; on-site kiosk queues run 20-30 minutes by midday on peak days, and bringing your own is meaningfully cheaper.",
];

const whatToAvoid = `Don't plan an outer courts day for Day 9 onwards — the draw has thinned by then and many outer courts will have little or nothing scheduled. Don't leave your outer court seat mid-match if you plan to return; there's no reserved seating and someone will take it immediately. Avoid bags over 40cm x 30cm x 30cm — the gate check is strict and enforced consistently. Don't mistake proximity for a lesser experience: on a small outer court, three rows from the baseline is closer than a row-three Centre Court seat ever gets you to the players.`;

const practicalInfo = {
  hours: "Queue from approximately 9am at Gate 3. Gates open 10am. Outer court matches from 11am. Centre and No. 1 Court from 1:30pm. Grounds close in the evening.",
  costRange: "£30 Days 1-8, £25 Days 9-11, £20 Days 12-14. Returned Show Court upgrade tickets £10 at in-grounds kiosk (when available).",
  bookingMethod: "Physical queue at Gate 3, Church Road. No advance or online purchase.",
  reservationsRequired: false,
  website: "https://www.wimbledon.com/tickets",
};

const gettingThere = `District Line to Southfields (Zone 3), then a 12-minute walk east to Gate 3 on Church Road. Southfields is marginally closer to the queue than Wimbledon station, and there's a convenience store on Wimbledon Park Road for last-minute food. From Wimbledon station, bus 493 runs directly to the grounds. Residential permit zones in SW19 are enforced during the Championships — driving is not a realistic option.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Outer Courts",
      subtitle: "A £30 grounds pass puts you three rows from the baseline on Courts 3 to 18 — closer than any show court seat",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId,
      neighborhood: "SW19, Wimbledon",
      address: "All England Lawn Tennis and Croquet Club, Church Road, Wimbledon, London SW19 5AE",
      heroImageUrl,
      heroImageAlt: "Spectators watching a match on Court 17 at Wimbledon from the small outer court stands",
      heroImageCredit: "Photo by Clavecin, Public Domain",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Verified against official Wimbledon grounds pass information (2026 guide via greenandpurple.com), court access confirmed via ticket-compare.com and official AELTC site. Pricing current as of 2026 published rates. Best-days guidance based on tournament draw structure.",
      moodTags: ["electric", "authentic", "adventurous"],
      interestCategories: ["sports"],
      pace: "active",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "GBP",
      budgetMinCost: "20",
      budgetMaxCost: "30",
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
