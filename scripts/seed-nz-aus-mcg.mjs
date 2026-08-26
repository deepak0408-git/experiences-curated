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

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "mcg-boxing-day-test-" + Date.now().toString(36);

const imageKey = "experiences/hero/MCG Boxing Day at the G.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - MCG Boxing Day at the G.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `The Boxing Day Test is Australian cricket's biggest single date, and for New Zealand it's a rare one. The Black Caps have played only three Boxing Day Tests at the MCG in history — 1973, 1980, and 1987 — and this 2026 fixture is the first time they've had the slot since. The 1987 match is still talked about: Richard Hadlee took ten wickets and pushed Australia to their last pair, but No. 11 Mike Whitney survived Hadlee's final over to force a draw, denying New Zealand a rare win on Australian soil. That's the history this Test steps into.

The ground itself has hosted Test cricket since 1877 and now holds just over 100,000 people, making it the largest cricket stadium in the world by capacity. The current Boxing Day record is 94,199 on day one of the 2025 Australia-India Test, beating the 91,112 mark set in 2013 — Boxing Day at the MCG reliably draws bigger opening-day crowds than almost any other day of cricket played anywhere. Since 2017, the ground has rebuilt its drop-in pitch system after a run of criticism that the square had gone flat and lifeless; the current pitches are grown off-site in steel trays and lowered into place before the season, and the venue has been explicit that the goal now is genuine pace and bounce for the quicks early, with something for batters once the shine wears off — a five-year fix aimed squarely at making Boxing Day Tests less predictable again.

Two train stations serve the ground. Jolimont, on the northern side, is a five-minute walk through Yarra Park and the closer option from the CBD via the Hurstbridge or Mernda lines. Richmond, on the southern side, is a slightly longer walk past Punt Road Oval to the Great Southern Stand — useful if you're coming from the Dandenong, Frankston, or Sandringham lines. Trams 70 and 75 run along Flinders Street and Wellington Parade respectively, both stopping within a short walk of the gates.`;

const whyItsSpecial = `A Boxing Day Test against New Zealand is a genuinely rare fixture — three times in the ground's history before this tour, the last one 39 years ago. That scarcity matters: this isn't a routine slot on the calendar the way an Ashes Boxing Day Test has become. It's also the one day of this entire series where the size of the crowd itself becomes part of the experience — nowhere else on the tour will you stand among six figures of people on the first morning of a Test match. The MCG's recent pitch overhaul means this isn't a foregone conclusion of a contest either; the venue has deliberately built pace and bounce back into the square specifically so days like this produce cricket worth the crowd. If New Zealand's touring support wants one day that captures what this tour is actually for, it's this one.`;

const insiderTips = [
  "Arrive well before the scheduled start on Boxing Day itself — gates and security queues at Jolimont and Gate 3 move slowly once the crowd builds past 60,000, and day one regularly sells out or comes close.",
  "Richmond Station's exit past Punt Road Oval is the quieter route out after play — most of the crowd funnels toward Jolimont and the CBD, so Richmond avoids the worst of the post-match crush.",
];

const whatToAvoid = "Don't book accommodation assuming Boxing Day traffic will be light — central Melbourne hotels and short-term rentals near the ground get booked out well in advance specifically because of this fixture, regardless of which two teams are playing, so this isn't a last-minute booking window. Avoid relying on rideshare pickup directly outside the ground after play finishes; designated pickup zones are well away from the stadium gates and the walk to a car can take longer than just using the train.";

const practicalInfo = {
  hours: "Gates typically open around 2 hours before play; Boxing Day Test play generally runs approximately 10:30am-5:30pm local time (Melbourne summer), subject to official scheduling closer to the match",
  costRange: "General admission from approximately AU$40-60 for Boxing Day itself (highest-demand day of the series); Reserved seating higher — no 2026-27 series-specific pricing published yet",
  bookingMethod: "Tickets via cricket.com.au or Ticketek once the international season allocation opens — Boxing Day is consistently the highest-demand single day of Australian home summers, so early booking matters more here than at any other fixture on this tour. General admission and Reserved Grandstand are the two public tiers; see the separate Ticket Guide and MCG Corporate Boxes experience for hospitality options.",
  howToBook: "",
  website: "https://www.mcg.org.au, https://www.cricket.com.au/tickets/venues/melbourne-cricket-ground",
  reservationsRequired: false,
};

const gettingThere = "Train: Jolimont Station (Wellington Parade, East Melbourne), 5-minute walk through Yarra Park, served by Hurstbridge/Mernda lines from the CBD. Alternative: Richmond Station, slightly longer walk past Punt Road Oval to the Great Southern Stand, served by Dandenong/Frankston/Sandringham/Glen Waverley lines. Tram: routes 70 (Flinders St) and 75 (Wellington Parade) both stop within walking distance of the ground.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The MCG — Boxing Day at the 'G'",
      subtitle: "New Zealand's first Boxing Day Test here since 1987, on a rebuilt pitch built for a contest",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Yarra Park",
      address: "Brunton Ave, Richmond VIC 3002, Australia",
      heroImageUrl,
      heroImageAlt: "Wide exterior view of the Melbourne Cricket Ground (MCG) from across the Yarra River",
      heroImageCredit: "DXR, CC BY-SA 4.0 (Wikimedia Commons)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: mcg.org.au attendances page, ESPNcricinfo/Sportskeeda Boxing Day attendance record reporting (Dec 2025), ESPNcricinfo 1987 NZ-Australia MCG Test coverage (Hadlee/Whitney), mcg.org.au drop-in pitch page, mcg.org.au getting-here page, Metro Trains Jolimont station page. Verified 16 Aug 2026. No 2026-27 series ticket pricing published as of this date.",
      googleMapsRating: "4.7",
      googleMapsReviewCount: 30516,
      googleMapsUrl: "https://maps.google.com/?cid=7158295506658046713",
      sport: ["cricket"],
      moodTags: ["iconic-venue", "atmosphere", "must-see"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["dec"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 3 })
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
