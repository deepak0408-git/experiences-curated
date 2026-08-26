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
const slug = "mcg-boxing-day-seating-comparison-" + Date.now().toString(36);

const imageKey = "experiences/hero/MCG Boxing Day Seating Comparison.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - MCG Boxing Day Seating Comparison.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `The MCG's four main stands each answer a different question. The Ponsford Stand, on the ground's western side, is generally rated the best value seat in the house for cricket specifically — its lower tier, section M30, sits close enough to read field settings and bowlers' lines without paying for a suite, and it picks up shade earlier in the afternoon than the eastern side of the ground. The Members' Reserve, adjoining the Southern Stand, is genuinely excellent cricket viewing but needs an MCC or AFL membership to access — not something you can simply buy a ticket for as a visitor. The Great Southern Stand is the biggest of the four and the one most likely to have a ticket available for a match this size, but its upper tier puts you a long way from the field; if you're offered a Southern Stand seat, ask specifically for the lower bowl, not "Southern Stand" as a category, because the difference in distance from play is significant.

Elevation matters more at the MCG than at most grounds because of its sheer width. The general advice from seasoned MCG cricket-goers is to aim for the lower-to-mid tier rather than ground level — enough height to read the field as a whole, not so much that individual players become hard to pick out. For a Boxing Day Test specifically, day one and two general admission has sold out roughly two weeks in advance in recent years, and reserved seating for the same two days has followed the same pattern — by contrast, days four and five of the same Test regularly still have good availability close to the match itself, because a five-day contest that's already six days old draws a smaller, more committed crowd.

Shade is a real consideration in a Melbourne summer. The Olympic Stand and the northern side of the Members' Reserve pick up shade through the afternoon session, while the open upper tiers on the southern and eastern sides get full sun through the hottest part of the day. Morning sessions starting around 10:30am put the sun behind the western stands first, so anyone in the Ponsford Stand gets a shaded start before the sun tracks around.

None of this changes the honest starting point: for a fixture the size of Boxing Day against New Zealand, "any seat" beats no seat, and general admission — wherever it ends up being located, which the MCG confirms only about 24 hours before a match — is genuinely the most atmospheric way to watch cricket here if you're prepared to arrive early and stand or sit informally.`;

const whyItsSpecial = `The mistake most first-time MCG visitors make is treating "reserved seating" as a single tier, when in practice a Southern Stand upper-level ticket and a Ponsford Stand lower-level ticket can be the same nominal price category and completely different experiences of the same match. Boxing Day against New Zealand is a fixture where knowing this actually changes what you book, not just where you happen to sit: day one sells out fast and gives you little control over placement, while days four and five open up real choice at a lower price, on a pitch that's usually turning enough by then to produce properly contested cricket. The stadium is built at a scale where the wrong seat genuinely costs you the ability to read the game, not just comfort — that's worth knowing before you buy, not after.`;

const insiderTips = [
  "If offered a Great Southern Stand ticket without a specific tier listed, ask for the lower bowl — the upper tier puts you significantly further from play and is the seat most visitors regret after the fact.",
  "Days four and five of the Boxing Day Test consistently have better ticket availability and lower prices than days one and two of the same match, based on the pattern from recent MCG Boxing Day Tests — a genuinely useful trade-off if your budget or plans are flexible on which day to attend.",
];

const whatToAvoid = "Don't assume general admission will be available for the marquee days of this Test — in the most recent Boxing Day Tests at the MCG, GA has not been offered at all for days one through four, with reserved seating the only public option on those days, so budget for a reserved ticket rather than planning around a GA fallback. Avoid booking a seat on the open upper tiers of the southern or eastern stands for an afternoon session without sun protection — those sections get little to no shade through the hottest part of a Melbourne summer day, unlike the Ponsford Stand and Members' Reserve's northern side.";

const practicalInfo = {
  hours: "GA seating locations (on the rare match where GA is offered) are confirmed by the venue only around 24 hours before the event — check mcg.org.au directly close to the date rather than relying on older information",
  costRange: "No 2026-27 series-specific pricing published; based on recent Boxing Day Tests, expect reserved seating from roughly AU$60-90 for outer sections up to several hundred dollars for premium lower-tier positions, varying significantly by day",
  bookingMethod: "Tickets via Ticketmaster.com.au or Ticketek, with seat/section selectable at booking for reserved tiers. Check the MCG's own seating map (mcg.org.au) before buying to confirm which stand and tier a listed section actually falls in.",
  howToBook: "",
  website: "https://www.mcg.org.au/plan-a-visit/seating-and-ticket-information/seating-maps, https://www.ticketmaster.com.au/cricket",
  reservationsRequired: false,
};

const gettingThere = "See the separate MCG venue experience for full transport directions — Jolimont or Richmond stations, or trams 70/75.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Sit: MCG Boxing Day Comparison",
      subtitle: "Why 'Southern Stand' isn't one seat, and why day four is the smarter buy than day one",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Yarra Park",
      address: null,
      heroImageUrl,
      heroImageAlt: "View across the MCG stands from the outfield during a Test match",
      heroImageCredit: "Richard Munckton, CC BY 2.0 (Wikimedia Commons)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: mcg.org.au seating maps page, shadedseats.com MCG shade guide, numberanalytics.com MCG seating plans guide, khelnow.com/wionews/thestatesman BGT 2024-25 sellout reporting, general Boxing Day 2025-26 availability reporting (day 1-2 sold out, day 4-5 available pattern). Verified 16 Aug 2026. No 2026-27 series-specific pricing or GA confirmation published as of this date — both flagged explicitly in copy.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["practical-guide", "strategy", "insider-knowledge"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
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
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 6 })
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
