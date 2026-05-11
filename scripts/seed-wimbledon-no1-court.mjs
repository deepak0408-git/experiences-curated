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
const slug = "wimbledon-no1-court-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-no1-court.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-no1-court.jpg");
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

const bodyContent = `No. 1 Court sits directly behind Centre Court, reached through the same gate complex, and is easy to underrate. The naming — it's No. 1 in sequence, not prestige, a historical convention — contributes to this. But with 11,430 seats, a retractable roof installed in 2019, and floodlights that allow play until 11pm, it's a fully modern stadium that regularly hosts better matches than the one next door.

The reason is the draw. Centre Court is where the top seeds play their openers — the marquee names scheduled early to move them through the first week without drama. By rounds two and three, the defending champion might be on Court 1 playing someone who's pushed their way into genuine contention. The seeds who enter the draw at round two, ranked 9 through 32 and often the most dangerous players in the bracket, find themselves here for exactly the matches where things go wrong. That's frequently where the tournament's most interesting tennis happens.

The seating geometry is different from Centre Court. The court sits slightly more enclosed, and the debenture seats — occupying the front 17 rows — are positioned at roughly a 45-degree angle to the playing surface rather than directly end-on or side-on. A significant number of regular Wimbledon attendees regard this as the best live perspective for watching tennis: you see the whole court at once, the angles, the movement, the positioning before a player has decided what to do next. Things that disappear from a camera frame or a straight sideline view are visible from this angle.

Like Centre Court, the roof closes in around ten minutes when rain arrives. Both courts have floodlights for evening play. On days when the schedule runs into the evening — common in the first week, when rain on the outer courts compresses the programme — No. 1 Court can run until 11pm. Night tennis at Wimbledon, under lights with the roof sealed, has a particular quality that sunny afternoon sessions don't. The crowd stays. The atmosphere tightens. The light is different.

Getting in follows the same routes as Centre Court: the public ballot (same annual application, same approximate odds, court and day assigned randomly), the Queue (a portion of day tickets released each morning), and the debenture resale market. Debenture pricing is considerably lower: £875 for doubles matches in the second week, up to £2,390 for Quarter Finals. Still significant, but meaningfully different from Centre Court equivalents.

The honest comparison: Centre Court carries the history, the Royal Box, the ritual. No. 1 Court has the better first-week matches more often than people expect, a viewing angle that experienced Wimbledon-goers specifically seek out, and a price — across every route in — that reflects its lower profile without reflecting its quality.`;

const whyItsSpecial = `There's a tendency, among people who haven't been to Wimbledon, to treat any ticket that isn't Centre Court as a lesser thing. The naming doesn't help — "No. 1 Court" sounds like second place. It isn't.

No. 1 Court is where the tennis is often more interesting. The draw sends established names to Centre Court for tidy first-round wins; Court 1 gets the players doing something, working their way through a quarter of the draw where anything can happen. In the first week of any Wimbledon, the third-round upset that everyone talks about for a year — the match that derails a title favourite and changes the shape of the draw — is at least as likely to happen here as anywhere else. It happened here in 2023. It happens most years.

The 45-degree viewing angle matters more than it sounds. You're not watching through a camera lens or from directly behind a baseline — you're reading the whole court at once. The movement patterns before the ball is struck, the serve directions, the way a player positions themselves before they know where the next shot is going: all of this is visible from that angle in a way that a conventional sideline view doesn't provide.

Practically: the queue for No. 1 Court runs shorter than Centre Court on most days. The debenture lounge access is the same. The tennis is frequently as good. The ticket price, whether ballot face value or debenture resale, is meaningfully lower. For a first-time Wimbledon visitor who receives a No. 1 Court ticket in the ballot, this is not a consolation prize.`;

const insiderTips = [
  "Debenture seats in the front 17 rows sit at a 45-degree angle to the court — many experienced Wimbledon regulars consider this the best live perspective for reading tennis.",
  "Floodlights allow play until 11pm; check the order of play for evening sessions, which have a different atmosphere from afternoon matches.",
  "The Queue releases Court 1 day tickets each morning alongside Centre Court — expect a shorter line, though demand grows in the second week as doubles finals move here.",
  "Rounds 2 and 3 on Court 1 are often the best value for marquee tennis — top-30 seeds playing before the draw thins out significantly.",
  "The ballot covers both Centre Court and No. 1 Court in the same application — court and day are assigned; you cannot specify a preference.",
  "If your ticket runs into an evening session under the roof and floodlights, stay — night Wimbledon on Court 1 is worth the later finish.",
];

const whatToAvoid = `Don't treat a No. 1 Court ticket as a fallback — rounds 2 and 3 scheduled here regularly feature better competitive tennis than Centre Court on the same day. Don't assume the Queue for Court 1 is proportionally shorter in the second week; as doubles finals and mixed events move here, demand patterns shift. Don't sit expecting a straight end-on view — the geometry places you at an angle regardless of your seat; the viewing perspective is a feature, not a limitation.`;

const practicalInfo = {
  hours: "Play typically begins 11am or 1pm; evening sessions possible until 11pm on roof-covered nights",
  costRange: "Ballot/Queue face value ~£50–£85. Debenture resale £875 (doubles, week 2) to £2,390 (Quarter Finals).",
  bookingMethod: "Same ballot as Centre Court (closes 31 December annually); Queue (no booking, morning release); Debentures via authorised resellers.",
  reservationsRequired: true,
  website: "https://www.wimbledon.com/en_GB/tickets/index.html",
};

const gettingThere = `District Line to Southfields (Zone 3), then 15-minute walk. No. 1 Court is adjacent to Centre Court within the AELTC grounds — follow signs from the main gate area. The court entrance is clearly marked from the Tea Lawn. AELTC address: Church Road, Wimbledon, London SW19 5AE.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "No. 1 Court at Wimbledon",
      subtitle: "The second show court — 11,000 seats, retractable roof, and where the best first-week matches usually end up",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId ?? null,
      neighborhood: "Wimbledon, SW19",
      address: "Church Road, Wimbledon, London SW19 5AE",
      heroImageUrl,
      heroImageAlt: "No. 1 Court at Wimbledon during the 2022 Championships, showing the enclosed stadium interior",
      heroImageCredit: "Photo by Neil Tilbrook, CC BY 2.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Capacity (11,430) and debenture seat position (front 17 rows, 45-degree angle) from ticket-compare.com seating guide. Pricing (£875–£2,390) from wimbledondebentureholders.com and wimbledondebentureowners.com. Roof installation date (2019) and floodlight play-until-11pm from rockethospitality.com debenture guide. Ballot and Queue processes mirror Centre Court per wimbledon.com. Verified April 2026.",
      moodTags: ["electric", "authentic", "social"],
      interestCategories: ["sport", "culture"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      budgetMinCost: "50",
      budgetMaxCost: "85",
      bestSeasons: ["jun", "jul"],
      advanceBookingRequired: true,
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
