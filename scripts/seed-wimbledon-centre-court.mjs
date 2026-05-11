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
const slug = "wimbledon-centre-court-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-centre-court.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-centre-court.jpg");
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

const bodyContent = `Wimbledon's Centre Court holds just under 15,000 people. It doesn't feel like it. The geometry pulls you toward the surface — the court itself is small, the grass intensely bright on a sunny afternoon, the players closer than you expect. The stadium is intimate in a way that its capacity doesn't suggest.

There are four seating levels. Level 100 is court level: the lowest ring of seats, where you're close enough to hear the sound the ball makes coming off strings. Level 200 is where most people picture themselves when they imagine Wimbledon — mid-height, clear sightlines, the crowd noise coming from all directions. Level 300 sits higher and trades atmosphere for perspective; you read the court geometry more clearly from up there, see the angles players are working. Level 500 is near bird's-eye and genuinely useful for watching serving patterns, less so for following the ball in short exchanges.

The Royal Box sits mid-level on the south side. It works as an orientation landmark from anywhere in the stadium — once you've located it, you know where you are.

A note on afternoon sun: gangways 109, 111, 112, 114, and 115 on Level 100 catch direct afternoon sun in July. So do 210 and 211 on Level 200. If your ticket puts you in those blocks, bring sunscreen or spend the afternoon squinting. The retractable roof — installed in 2009 — closes in under ten minutes when weather requires it. When it does, the atmosphere shifts. The stadium becomes a sealed chamber with its own climate, noticeably louder. For anyone who grew up watching rain stop play at Wimbledon, it still surprises.

Getting in is the harder conversation. There are three routes, and they differ in cost, uncertainty, and what you're trading for each.

The public ballot is the cheapest. Applications open each autumn, close 31 December, and results arrive in February. Around one in ten applicants gets tickets. The court and day are assigned — you have no say — and the order of play isn't announced until the evening before, so you won't know who's on until the night before your visit. Face-value Centre Court tickets in the first week run roughly £60–£120.

The Queue releases around 500 Centre Court tickets each morning from the in-person queue on Church Road. These are the day's unsold allocation. For Centre Court in the first week, that means camping out the previous evening. In the second week, as the draw narrows and public interest concentrates on fewer remaining matches, arrival times shift earlier still.

Debenture seats are a different category. Debenture holders buy a block of five consecutive years of tickets directly from the AELTC and may resell them freely — making them the only legally traded secondary-market tickets at Wimbledon. They occupy much of Levels 200 and 300. Secondary market prices for 2026 run from around £2,195 for first-round Centre Court to £9,495 for the Men's Final, typically sold in pairs. Debenture holders also access the Renshaw Restaurant and Debenture Lounge.

Whatever route gets you there, the first time the roof closes over you mid-match is worth experiencing once.`;

const whyItsSpecial = `Most major sports venues are designed to announce themselves from the outside. Centre Court is the opposite. It sits inside the AELTC grounds, reached after you've already passed through the gates, and the first time you actually sit down, the scale surprises you. It's smaller than you think. The grass is greener. The players are closer.

What's hard to convey until you've been there is how much the surface affects what you're watching. Centre Court is grass, which means the ball skids, bounces stay low, and rallies have a different character from hard courts or clay. Watching serve-and-volley tennis at grass-court pace, from Level 200, with 14,000 people around you, is not the same as watching it on a screen. Not even approximately.

I've never been entirely sure the ballot is fair — the 1-in-10 figure has always seemed optimistic about how it feels to apply for eight consecutive years — but the alternatives all cost significantly more. The Queue produces its own community around it; the debenture market is honest about what it is. Both are legitimate routes to the same seat.

What the experience doesn't have is a bad seat. Level 500 looks down at a steep angle and loses some intimacy, but the court is completely legible. Level 100 is physical — you feel rather than watch the game. Level 200, centre section, with the afternoon sun behind you, is the consensus sweet spot for a first visit, and the consensus is right.`;

const insiderTips = [
  "The ballot closes 31 December each year — set a calendar reminder now; the date is easy to miss in the autumn rush.",
  "Level 200 centre section, non-sun-facing gangways, is the best seat for a first visit — clear sightlines, good atmosphere, no squinting.",
  "Gangways 109, 111, 112, 114, 115 on Level 100 and 210, 211 on Level 200 face afternoon sun — check your block before July heat settles in.",
  "Debenture resale is the only legal secondary market; tickets from other sources risk being counterfeit and won't scan at the gate.",
  "If rain comes in, stay in your seat — the roof closes in under ten minutes and play continues. Leaving is almost always the wrong call.",
  "Order of play is announced around 6pm the evening before each day — check the Wimbledon app then, not the morning of.",
];

const whatToAvoid = `Don't book debenture tickets through non-specialist resellers without verifying they hold actual debentures — counterfeits exist and the AELTC has no mechanism to authenticate them at the gate. Don't try to read the draw too far ahead: a second-week seat could feature a world number 1, or whoever's left. Don't pick sun-facing gangways without checking the afternoon forecast, particularly early in the tournament when matches run past 7pm. And don't leave your seat when rain starts — that's the old Wimbledon. The roof means the match continues.`;

const practicalInfo = {
  hours: "Play typically 11am–7pm or later; Centre Court programme usually begins 1pm on main show days",
  costRange: "Ballot/Queue face value £60–£120 (first week). Debenture resale £2,195–£9,495+ per ticket.",
  bookingMethod: "Ballot: apply annually, closes 31 December. Queue: no booking, first come first served. Debentures: via authorised resellers.",
  reservationsRequired: true,
  website: "https://www.wimbledon.com/en_GB/tickets/index.html",
};

const gettingThere = `District Line to Southfields (Zone 3), then a 15-minute walk up Wimbledon Park Road — the locals' route, avoids most crowd congestion. Alternatively, District Line or National Rail to Wimbledon station, then shuttle bus or 25-minute walk. From central London, Southfields adds about 5 minutes versus Wimbledon but saves 10–15 on the walk in. AELTC address: Church Road, Wimbledon, London SW19 5AE.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Centre Court",
      subtitle: "What it's actually like to sit inside the most famous tennis court in the world — and the three ways to get there",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId ?? null,
      neighborhood: "Wimbledon, SW19",
      address: "Church Road, Wimbledon, London SW19 5AE",
      heroImageUrl,
      heroImageAlt: "Centre Court at the All England Lawn Tennis Club during the 2022 Wimbledon Championships, showing the grass court and packed stands",
      heroImageCredit: "Photo by Peter Menzel, CC BY-SA 2.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Seating level detail and sun gangway information from ticket-compare.com seating guide and Wikipedia Centre Court article. Ticket pricing from wimbledondebentureholders.com (debenture resale) and wimbledon.com (ballot). Capacity from AELTC official site. Roof installation date from Wikipedia. Verified April 2026.",
      moodTags: ["electric", "iconic", "social"],
      interestCategories: ["sport", "culture"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      budgetMinCost: "60",
      budgetMaxCost: "120",
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
