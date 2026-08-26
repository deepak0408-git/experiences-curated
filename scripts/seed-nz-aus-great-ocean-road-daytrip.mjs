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
const slug = "great-ocean-road-twelve-apostles-daytrip-" + Date.now().toString(36);

const imageKey = "experiences/hero/Great Ocean Road Twelve Apostles.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/Great Ocean Road - Twelve Apostles Golden Hour.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `The Twelve Apostles sit roughly 270-275km west of Melbourne along the coastal route, and the honest number to plan around is 12-13 hours door to door — this is a full day away from the city, not a half-day add-on, and it only really works on a genuine day off from the cricket rather than squeezed around a Test's start or finish. With Boxing Day play running roughly 11am to 6pm and no rest days built into a single Test, that means picking one full day out of the five-day window to skip play entirely, most realistically during the Melbourne leg where the Test itself runs 26-30 December.

Self-driving is technically possible but genuinely not recommended for a first-time visitor — the return leg means driving back into Melbourne on unfamiliar country roads after dark, at the end of a long day, which is a real safety consideration many first-time visitors underestimate. A guided coach tour solves this cleanly: Go West Tours, a family-run operator with 16+ years on this exact route, runs a full-day Great Ocean Road Eco Tour departing Melbourne and returning roughly 12-13 hours later, with a beachside morning tea stop in Torquay, the official Great Ocean Road Memorial Arch, and stops through Port Campbell National Park at the day's main destinations. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=5361473362131534395&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

The Twelve Apostles themselves are limestone sea stacks rising straight out of the Southern Ocean, carved by the same erosion that's slowly claiming the cliffs behind them — several stacks have collapsed within living memory, which is part of why seeing them now rather than assuming they'll always look the same has its own quiet urgency. Two stops nearby round out the day properly rather than treating the Apostles as the only reason to be there: Gibson Steps, a steep 86-step descent to a wide beach directly beneath 70-metre cliffs, puts you at sea level looking up at the same formations from underneath; Loch Ard Gorge, a five-minute drive on, tells a real and specific story — the 1878 wreck of the clipper ship Loch Ard, which killed all but two of the 54 people aboard, with self-guided walks through the gorge where the survivors washed ashore.

December puts the tour in Australia's long-daylight summer stretch, which works in the day's favour — golden-hour light on the Apostles late in the day is a genuinely different, quieter experience than the same view at midday coach-tour peak.`;

const whyItsSpecial = `Most Melbourne day-trip guides undersell how big a commitment this actually is, and oversell how easy it is to squeeze in — neither is true, and pretending otherwise sets a traveler up to either skip it or regret trying to rush it. The honest version is that this needs a full day sacrificed from the Test, and in exchange it delivers something no other stop on this whole tour does: a genuinely world-class natural landmark, not a themed attraction or a curated food scene, but limestone stacks that are visibly, slowly disappearing into the same ocean that made them. Gibson Steps and Loch Ard Gorge matter here specifically because they turn "look at the rock formations" into "stand beneath them" and "hear who died offshore" — the difference between a photo stop and a real place with a real history. For a New Zealand supporter on a month-long tour built almost entirely around cricket grounds and city neighbourhoods, this is the one day that's genuinely about Australia's own natural scale, not the series at all — which is exactly why it's worth the 12 hours.`;

const insiderTips = [
  "Book a guided coach tour rather than self-driving if this is your first visit — the return leg into Melbourne after dark, on unfamiliar country roads at the end of a 12-hour day, is a real fatigue and safety risk that a driver-guide removes entirely.",
  "Gibson Steps and Loch Ard Gorge are both within a few minutes of the main Twelve Apostles car park — don't treat the Apostles as the only stop; seeing the same cliffs from beach level at Gibson Steps and the 1878 shipwreck story at Loch Ard Gorge round out what would otherwise be a single quick photo stop into the real point of the day.",
];

const whatToAvoid = "Don't plan this as a half-day trip or try to fit it around a morning or evening gap in the Test schedule — the real round-trip commitment is 12-13 hours, and treating it as anything shorter means either turning around before reaching the Apostles or arriving back in Melbourne very late. Don't underestimate the self-drive return leg if you're doing this without a guide — country roads, fatigue after a full day, and driving on the unfamiliar side of the road for international visitors combine into a real risk that a guided coach tour avoids entirely.";

const practicalInfo = {
  hours: "Go West Tours' Great Ocean Road Eco Tour departs Melbourne early morning and returns approximately 12-13 hours later; exact pickup times confirmed at booking",
  costRange: "Go West Tours Great Ocean Road Eco Tour from AU$159 per adult, including morning tea and national park stops; lunch typically at own expense",
  bookingMethod: "Book directly at gowest.com.au — hotel pickup included across central Melbourne. A GetYourGuide affiliate listing for this same operator also exists (opportunity flagged separately, not yet wired in).",
  howToBook: "",
  website: "https://www.gowest.com.au",
  reservationsRequired: true,
};

const gettingThere = "No public transport option reasonably covers this distance in a day — a guided coach tour with hotel pickup (Go West Tours and similar operators) or a self-driven hire car are the only two practical ways to do this trip, roughly 270-275km each way along the coastal route from Melbourne.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Great Ocean Road & the Twelve Apostles",
      subtitle: "A full 12-hour day away from the cricket, for limestone sea stacks and a real shipwreck story",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Port Campbell National Park",
      address: null,
      heroImageUrl,
      heroImageAlt: "The Twelve Apostles limestone sea stacks at golden hour, Great Ocean Road",
      heroImageCredit: "Graham Holtshausen, Unsplash Licence",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: gowest.com.au (Great Ocean Road Eco Tour pricing AU$159, 12-13hr duration, Torquay morning tea, Memorial Arch, Port Campbell National Park stops), greatoceanroadmelbournetours.com.au (distance/drive-time cross-check — 270-275km, ~4hrs one-way; original large-coach operator's own tour found currently unavailable, not used as the recommended operator for that reason), parks.vic.gov.au (Loch Ard Gorge history, 1878 wreck, self-guided walks), wayandfarer.com (Gibson Steps — 86 steps, 70m cliffs). Google Places API lookup for Go West Tours (5.0/18,789 reviews) captured 17 Aug 2026 — real, exceptionally well-attested rating. GetYourGuide affiliate opportunity found for this same operator/product — flagged to founder, not constructed (per standing rule, agent never builds the real affiliate link). Added 17 Aug 2026 as experience #25, outside the originally locked 24-experience list, per explicit founder request.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["scenic", "full-day", "nature"],
      interestCategories: ["nature", "sightseeing"],
      pace: "slow",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["dec"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-17",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 25 })
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
