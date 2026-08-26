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
const slug = "adelaide-oval-stadium-club-deck-" + Date.now().toString(36);

const imageKey = "experiences/hero/Adelaide Oval Stadium Club The Deck.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - Adelaide Oval Stadium Club The Deck.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `Adelaide Oval runs two distinct premium tiers above general admission and Reserved Grandstand, both on Level 3 of the Eastern Grandstand, and they suit different kinds of day.

The Deck sits on a semi-open terrace directly above the Hill, with its own outdoor seating bay looking straight down onto the historic mound and the ground beyond it — genuinely one of the better vantage points at the whole venue, since you get the atmosphere of the Hill's setting without giving up a proper seat. It's an all-inclusive grazing menu with canapes and food stations, expanded spread at the main break, and beer, wine, soft drinks, coffee and tea included from the deck bar. Seating is at unreserved bar tables rather than fixed positions, which suits a social day more than one where you want to sit still for a session. Smart casual dress applies.

Stadium Club, in Section 337 of the same Eastern Grandstand tier, is the more formal option — fixed centre-wing seats with panoramic views behind glass, access to the Rick Davies and John Platten bars, and food options running from an Artisan Burger Bar and Pizza Bar up to two optional add-on dining experiences: the John Halbert Bistro (a 5-hour beverage package included) or the Bespoke Wine Bar & Kitchen (a three-course meal, with drinks purchased separately). The dress code is stricter here too — smart casual minimum, with a collared shirt and dress shoes required for men.

Both tiers price by individual day rather than a flat per-Test rate, and the spread across the four days of this Test is real: Stadium Club runs from $350 per person on day one down to $195 on day four, a genuine 44% drop across the same match. That pattern — premium pricing for the marquee opening days, meaningfully cheaper by the back end — holds across most Australian Test hospitality, and Adelaide is no exception.`;

const whyItsSpecial = `The Deck's location is the argument for choosing it over Stadium Club: it sits directly above the Hill, meaning you get a clear view onto the one part of Adelaide Oval that's genuinely unique among Australian grounds — the grass mound, the heritage scoreboard, the crowd sitting on rugs below you — while still holding your own outdoor bay rather than fighting for space on the grass itself. Stadium Club is the safer, more formal choice for a group that wants a fixed seat and a proper meal rather than a grazing, social afternoon. Neither replaces the other; they're built for different versions of a day at the Test, and the real day-by-day price spread means picking the right day matters as much as picking the right tier.`;

const insiderTips = [
  "Book day four of the Test for Stadium Club if budget is a factor — it runs $195pp against day one's $350pp for the same seats, same access, same views, just fewer marquee-occasion trimmings.",
  "If you want the Bespoke Wine Bar & Kitchen add-on inside Stadium Club, budget separately for drinks — unlike the John Halbert Bistro option, its three-course meal doesn't include a beverage package.",
];

const whatToAvoid = "Don't turn up to Stadium Club underdressed — the venue enforces smart casual as a genuine minimum with a collared shirt and dress shoes required for men, stricter than The Deck's more relaxed smart casual, and this is checked at entry rather than treated as a loose suggestion. Avoid assuming The Deck's unreserved bar-table seating suits everyone in your group equally — if anyone wants to sit through a full session rather than stand and graze socially, Stadium Club's fixed seating is the better fit, and mixing expectations between the two products in one group booking is a common mismatch.";

const practicalInfo = {
  hours: "Gates typically open around 2 hours before the day's play starts; Test day play generally runs approximately 11:00am-6:00pm local time in South Australian summer",
  costRange: "Stadium Club (2026 Adelaide Test, per person): Day 1 $350, Day 2 $325, Day 3 $295, Day 4 $195. The Deck: pricing not published on the general info page — enquire directly.",
  bookingMethod: "Stadium Club is bookable through The Golden Ticket (official reseller) or cricket.com.au's Premium Experiences pages. The Deck is bookable directly through cricket.com.au Premium Experiences. Both require dress code compliance at entry.",
  howToBook: "For Stadium Club specifically, call The Golden Ticket on 0437 490 507 rather than booking through the general online form — day-by-day pricing (a real $155pp gap between day one and day four for the same seats) isn't always surfaced clearly online, and a direct call lets you confirm which days still have Section 337 availability before you commit. For The Deck, call Cricket Australia's Premium Experiences line on 03 9653 8803 — pricing for this specific product isn't published, so you need to ask directly rather than relying on a listed figure; be ready to ask for per-day pricing the same way Stadium Club breaks it down, since day four is very likely cheaper than day one here too even though it isn't listed.",
  website: "https://www.thegoldenticket.com.au/adelaide-test-stadium-club-adelaide-oval-tickets, https://www.cricket.com.au/premium-experiences/experiences/the-deck-adelaide",
  reservationsRequired: true,
};

const gettingThere = "See the separate Adelaide Oval venue experience for full transport directions — the Riverbank footbridge from Adelaide Railway Station, or the free Footy Express tram/bus network on match days.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Adelaide Oval Stadium Club & The Deck",
      subtitle: "Stadium Club drops from $350pp on day one to $195pp on day four — same seats, same view",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "North Adelaide",
      address: null,
      heroImageUrl,
      heroImageAlt: "Premium terrace seating overlooking Adelaide Oval and the Hill",
      heroImageCredit: "Marcus Wallis, Unsplash Licence",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: thegoldenticket.com.au 2026 Adelaide Test Stadium Club listing (live per-day pricing, captured 16 Aug 2026), cricket.com.au Premium Experiences 'The Deck Adelaide' and 'Adelaide Test' pages, adelaideoval.com.au Corporate Suite and Contact Us pages, sacainbusiness.com.au. The Deck's own per-day pricing not published as of this date — flagged in copy; Stadium Club pricing is live and current for this specific 2026-27 Adelaide Test.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["luxury", "hospitality", "scenic"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      bestSeasons: ["dec"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 9 })
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
