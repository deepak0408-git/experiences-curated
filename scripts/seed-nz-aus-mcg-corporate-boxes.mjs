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
const slug = "mcg-corporate-boxes-boxing-day-" + Date.now().toString(36);

const imageKey = "experiences/hero/MCG Corporate Boxes Boxing Day.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - MCG Corporate Boxes Boxing Day.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `Corporate boxes at the MCG sit on Level 3 of the Shane Warne and Ponsford Stands, and for the Boxing Day Test against New Zealand they come in three sizes: 12-14, 16-18, and 20-22 seats. Every box gets padded armchair seating, beer/wine/soft drinks included in the price, grazing-style buffet catering through the day, a dedicated staff member, air conditioning, an in-suite television, and parking passes. Spirits and premium wines sit outside the base package and are charged separately.

Pricing is genuinely tiered by day, which matters more than it sounds. Day one — the marquee session, the one with six-figure crowds and the biggest occasion — runs from roughly $995 to $1,180 per person depending on box size (12-14 seater at $11,940 ex GST works out to $995pp; 20-22 seater at $19,900 ex GST is around $995-905pp depending on exact headcount). Day three, further into the match once the pitch has started to wear and the result is less certain, drops to a flat $795 per person across every box size — a real, meaningful difference for a five-day match where the cricket on day three can be just as compelling as day one. As of this writing, day one's 20-22 seater boxes are 50% sold and the 12-14 seater is 80% sold; day three still has more room across all three sizes.

This isn't official Cricket Australia or MCG hospitality — it's sold through Dynamic Business Events, a Melbourne-based corporate hospitality reseller that packages boxes across major MCG fixtures including the Boxing Day Test, ODIs, and the Big Bash. Payment terms run 7 days from invoice and are negotiable for larger bookings, and a 1.9% surcharge applies to card payments (EFT or cheque avoids it). Dietary requirements need at least five business days' notice to accommodate properly.

For a group booking a box on this scale, the trade-off against buying individual Reserve seats is straightforward: you're paying a real premium for a private, catered, climate-controlled room with a dedicated host, rather than a public grandstand seat — worth it for a group planning to make a full day of Boxing Day rather than just watch the cricket.`;

const whyItsSpecial = `A corporate box removes the two things that make a full day at a packed Boxing Day Test genuinely hard work — standing in queues for food and drink, and being at the mercy of the weather and crowd noise around you — and replaces them with a private room that's still, unmistakably, inside the ground on the day New Zealand's tour reaches its biggest single crowd of the whole series. The day-by-day pricing split is the detail worth acting on: day one costs roughly 25% more per person than day three for the same box, same inclusions, same view, which makes day three the sharper booking for anyone who wants the corporate-box experience without paying the day-one premium purely for the occasion rather than the cricket.`;

const insiderTips = [
  "Book a day-three box instead of day one if budget matters — pricing drops from roughly $995pp to a flat $795pp across every box size, for the same inclusions and the same Level 3 Shane Warne/Ponsford Stand location.",
  "Confirm dietary requirements with Dynamic Business Events at least five business days ahead of the match — this is the stated minimum notice period for the catering team to accommodate them properly.",
];

const whatToAvoid = "Don't assume corporate box pricing includes spirits or premium wine — the base package covers beer, wine, and soft drinks only, and anything beyond that is charged separately, which can meaningfully change your total cost if your group expects an open bar in the fullest sense. Avoid paying by credit card without checking the surcharge first — Dynamic Business Events applies a 1.9% fee on Visa/Mastercard/Amex payments that EFT or cheque avoids entirely, worth knowing before you commit to a payment method on a booking this size.";

const practicalInfo = {
  hours: "Boxes open with gates, generally around 2 hours before play on Boxing Day itself (26 Dec 2026) through day five (30 Dec 2026)",
  costRange: "Day one: approximately AU$995pp (12-14 seater, ex GST) down to around AU$905-995pp for larger boxes. Day three: flat AU$795pp across all box sizes. Full-day, all-inclusive except spirits/premium wine.",
  bookingMethod: "Sold through Dynamic Business Events (dynamic.com.au), a Melbourne-based MCG hospitality reseller — not official Cricket Australia or MCG packages. Register interest online or by phone; boxes are sold on a first-come basis and fill unevenly by day and size.",
  howToBook: "For this specific Boxing Day fixture, call Dynamic Business Events directly on 1300 660 509 rather than relying on the online enquiry form alone — as of mid-August 2026, day one's 12-14 seater box is already 80% sold and the 20-22 seater is 50% sold, so a phone call gets you a live read on what's actually still available before you commit to a day or box size. Ask specifically about day three pricing (a flat $795pp versus day one's roughly $995pp) if budget is a factor — the reseller doesn't always lead with this comparison unprompted. Payment terms (7 days from invoice) are negotiable for larger group bookings if you ask.",
  website: "https://mcgcorporatebox.melbourne, https://www.dynamic.com.au",
  reservationsRequired: true,
};

const gettingThere = "See the separate MCG venue experience for full transport directions — Jolimont or Richmond stations, or trams 70/75. Corporate box parking passes are included in the package.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "MCG Corporate Boxes — Boxing Day Hospitality",
      subtitle: "Day three costs 20% less per person than day one, for the same box and inclusions",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Yarra Park",
      address: null,
      heroImageUrl,
      heroImageAlt: "Private corporate box interior overlooking the MCG playing field",
      heroImageCredit: "EchidnaLives, CC BY-SA 4.0 (Wikimedia Commons)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: mcgcorporatebox.melbourne (Mercury Principle, cricket page), dynamic.com.au live 2026 Boxing Day Test Day 1 and Day 3 corporate box listings (Australia v New Zealand, pricing/availability captured 16 Aug 2026 — will change as boxes sell). This is third-party reseller pricing, not official Cricket Australia/MCG pricing; flagged in copy. No official MCG hospitality pricing published as of this date.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["luxury", "hospitality", "group-experience"],
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
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 8 })
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
