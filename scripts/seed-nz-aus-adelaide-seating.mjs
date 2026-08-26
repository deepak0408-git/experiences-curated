import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

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

const DESTINATION_ID = "361d539e-4b17-4c9e-88ed-bc12e51cc853"; // Adelaide
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "adelaide-oval-hill-vs-reserve-" + Date.now().toString(36);

const imageKey = "experiences/hero/Adelaide Oval Hill vs Reserve.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - Adelaide Oval Hill vs Reserve.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `The Hill is Adelaide Oval's answer to the question every modern stadium redevelopment eventually asks: what do you keep? When the ground doubled in capacity in 2014, the old grass mound on the northern side survived as the Northern Mound Terrace — still commonly called the Hill — a timber-decked, shaded standing and casual-seating area beneath the heritage scoreboard and a line of Moreton Bay fig trees, holding roughly 3,500 people. It's general admission, first-come-first-served, and genuinely the cheapest way into a Test match here. The trade-off is real: no chairs allowed, no glass or cans (you can buy a drink inside but not bring one in), and you're standing or sitting on a rug rather than in a fixed seat, which for a full five-day Test is a different proposition than for a single T20.

The Reserve — the Western Grandstand's roughly 14,000 seats, plus the Riverbank and Eastern stands on the opposite side — is fixed, ticketed seating with a guaranteed spot, and the character shifts depending on which side you're on. Square-on seats, roughly side-on to the pitch, give the widest view of field placings and are generally rated the best angle for reading a Test match as a tactical contest. Seats behind the bowler's arm, when available, let you see genuine line and length as the ball is released — prized by anyone who actually wants to judge the bowling rather than just watch the outcome. The long-on/long-off ends trade some of that clarity for atmosphere and a better view of anything hit in the air.

Both options share the same basic physics: Adelaide Oval's redevelopment was explicit about keeping every seat with a genuine view of the ground, so even back-row Reserve seats aren't the write-off they'd be at some older stadiums — but the last row and the extreme corners are still the ones locals say to avoid if you have any choice. Shade matters here too. The Hill sits under real trees and picks up natural shade through the afternoon; large parts of the Western and Riverbank stands are also covered, while some open sections on the Eastern side get full sun for a Southern Australian summer's harshest hours.

For this series specifically, Adelaide is the second Test, played entirely in daylight — no pink ball, no evening session — so whichever side you choose, you're watching a full daytime match rather than planning around a twilight start.`;

const whyItsSpecial = `Most Australian grounds gave up their old standing terraces decades ago in favour of an all-seated bowl. Adelaide Oval didn't, and the Hill's survival through a $535 million redevelopment says something real about what this ground values — a cricket crowd that can still turn up with a rug and watch from grass under actual trees, the way generations of Adelaide fans always have, for a fraction of grandstand pricing. That's not nostalgia dressed up as marketing; it's still exactly how a genuine slice of the Test-day crowd here chooses to watch. The Reserve side gives you the opposite: certainty, a specific seat, a specific angle on the game, and for a five-day Test where you might be in the same spot across multiple sessions, that certainty is worth something the Hill can't offer. Neither is the "correct" answer — which one you'd pick says more about what kind of day at the cricket you actually want.`;

const insiderTips = [
  "If you want to actually judge line and length rather than just watch the outcome, ask for a seat behind the bowler's arm when booking Reserve seating — it's the one angle that shows you what the bowler is actually doing, not just where the ball ends up.",
  "The Hill doesn't allow chairs, glass, or cans brought in — bring a rug instead, and buy any drinks once you're inside rather than trying to carry them through the gates.",
];

const whatToAvoid = "Don't book a Hill spot for all five days assuming you'll get the same patch of grass each time — it's first-come-first-served daily, not a held position, so arriving later on a big day like the Saturday can mean a worse spot than the one you had on day one. Avoid the very back row or extreme corner sections of the Reserve stands if you have any choice in seat selection — locals consistently flag these as the weakest sightlines at the ground, even though the venue's 2014 redevelopment was built around giving every seat a genuine view.";

const practicalInfo = {
  hours: "Gates typically open around 2 hours before the day's play starts; Test day play generally runs approximately 11:00am-6:00pm local time in South Australian summer, subject to official scheduling",
  costRange: "Hill (general admission) typically the cheapest tier, from around AU$25-35 per day; Reserved Grandstand higher and varies significantly by stand and row — no 2026-27 series-specific pricing published yet",
  bookingMethod: "Tickets via cricket.com.au or Ticketek. The Hill is sold as general admission; Reserve seating lets you choose a specific stand and section at booking — check adelaideoval.com.au's stadium map first to understand which side suits the angle you want.",
  howToBook: "",
  website: "https://www.adelaideoval.com.au/stadium-map, https://www.cricket.com.au/tickets/venues/adelaide-oval",
  reservationsRequired: false,
};

const gettingThere = "See the separate Adelaide Oval venue experience for full transport directions — the Riverbank footbridge from Adelaide Railway Station, or the free Footy Express tram/bus network on match days.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Sit: Adelaide Oval — The Hill vs. The Reserve",
      subtitle: "A $535 million redevelopment kept the grass mound — here's when to choose it over a fixed seat",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "North Adelaide",
      address: null,
      heroImageUrl,
      heroImageAlt: "The grass Hill terrace at Adelaide Oval with the heritage scoreboard behind it",
      heroImageCredit: "Jono52795, CC BY-SA 3.0 (Wikimedia Commons)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: adelaideoval.com.au stadium map page, adelaideoval.com.au FAQs and Conditions of Entry pages, anybodysfan.com Adelaide Oval food/drinks/bags guide, shadedseats.com Adelaide Oval shade guide, sportskeeda.com bird's-eye-view Test cricket at Adelaide Oval piece, Wikipedia (Adelaide Oval redevelopment). Verified 16 Aug 2026. No 2026-27 series-specific pricing published as of this date. 2026-27 Adelaide Test confirmed daytime/red-ball, not day/night, per curator brief.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["practical-guide", "strategy", "heritage"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["dec"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 7 })
    .onConflictDoNothing();

  console.log("\nExperience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
