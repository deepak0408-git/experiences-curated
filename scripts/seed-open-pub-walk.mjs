import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

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

const DESTINATION_ID = "263faaad-ceed-4355-acb7-9f2073cb1028";
const EVENT_SLUG = "open-championship-2026";
const EVENT_ID = "ccb585a6-3cdb-40ce-999e-a1d455854301";
const slug = "open-pub-walk-birkdale-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/The-Pub-Walk-Birkdale-Village.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/The Pub Walk Birkdale Village.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Resolve sporting event ────────────────────────────────────────────────

const [existing] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

const eventId = existing?.id ?? EVENT_ID;
console.log("✓ Sporting event ID:", eventId);

// ─── 3. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Birkdale Village sits between Birkdale Station and Royal Birkdale's main entrance — about 10 minutes on foot from the course. The pub strip runs along Weld Road and Liverpool Road, and during Open week it functions as the natural decompression zone for spectators heading back toward the station.

The logical route out of the course runs east along Waterloo Road, then right onto Weld Road. Coast Birkdale is the first decent stop — gastropub, upscale end of the strip, with a dedicated outdoor terrace and a specific Open Golf 2026 section on their website. They're actively targeting golf visitors and will be busy; book dinner in advance. Next along Weld Road is Café Bar N'Ista at number 41 — the best outdoor terrace in the village, opens at 09:30, tapas and cocktails, described by regulars as the sunniest spot in Birkdale. Good for a long afternoon drink before deciding where to eat.

The Park Hotel is at the junction of Weld Road and the station — Greene King, large front beer garden, real ale on cask. It's the community pub. Drink here; the kitchen struggles under pressure so ordering food during Open week is a gamble. A short detour east on Upper Aughton Road brings you to Up Steps at number 20 — the most characterful pub in the village, a converted corner house with original Matthew Brown Lion Ales windows, four rooms around a central bar, and a strong rotating cask ale selection. Worth the five-minute walk if real ale matters.

Back on Liverpool Road: Barrique at number 17 is a wine bar and pizzeria in a converted bank, 150-plus hand-selected wines, walk-ins only by policy. Arrive before 19:00 or expect a queue. The Birkdale Tea Rooms at 10–12 Liverpool Road is the village local — quieter, good for an earlier evening pint. The Crown at 304 Liverpool Road is furthest from the course, an Ember Inns chain pub with the most kitchen capacity of the group and a proper beer garden.

The whole strip is walkable end to end in under 10 minutes. Every pub listed has a garden or terrace, which matters in July.`;

const whyItsSpecial = `Most major championships generate their own on-site hospitality village and the surrounding area stays empty. Birkdale is different. The village has enough genuinely good independent venues — Coast, N'Ista, Barrique, Up Steps — that the evening after the golf has real options. These places were here before The Open arrived and will be here after it leaves.

The 10-minute walk from Royal Birkdale's entrance to Weld Road is part of it. Long enough to decompress, short enough that you don't need a taxi. On a July evening, that walk through a quiet Lancashire village after a full day at one of the world's great links courses is its own thing.`;

const insiderTips = [
  "Coast Birkdale has a dedicated Open Golf 2026 section on their website and will have event-specific menus — book the terrace for dinner if you want to stay in the village rather than heading back to Southport.",
  "Barrique operates a strict walk-ins-only policy and fills by 19:30 on Open week evenings — arrive at 18:00 for drinks and pizza before the crowds hit.",
];

const whatToAvoid = `The Park Hotel's beer garden is good; its kitchen under Open week pressure is not. Order drinks only unless you arrive before noon — multiple reviews cite 1–1.5 hour food waits on busy days, and the tournament will stretch it further. Also check Merseyrail's last service from Hillside Station before settling in for a second round — the village empties fast when the trains thin out.`;

const gettingThere = `10–15 minutes on foot from Royal Birkdale main entrance: east along Waterloo Road, right onto Weld Road. Birkdale Station (Merseyrail Southport Line) is 150m from Liverpool Road — the village sits directly between the station and the course. Arriva Line 47 bus also serves the village.`;

const practicalInfo = {
  hours: "Most venues open from 10:00–11:00. Coast closed Mon–Tue. Barrique closed Mon. Check individual sites during Open week for extended hours.",
  costRange: "Pint of cask ale £4–5.50. Cocktails £9–12. Barrique pizza from ~£12. Coast dinner à la carte £25–35/head.",
  bookingMethod: "Coast Birkdale takes reservations — book dinner well in advance for Open week at coastbirkdale.com or call 01704 331333. Barrique is walk-ins only; arrive before 19:00. All other venues are walk-in.",
  howToBook: null,
  website: "https://coastbirkdale.com/",
  reservationsRequired: false,
};

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Pub Walk — Birkdale Village Open Week",
      subtitle: "Seven pubs within 15 minutes of Royal Birkdale. Coast has a dedicated Open Golf terrace. Barrique walk-ins only.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Birkdale Village, Southport",
      address: "Weld Road and Liverpool Road, Birkdale, Southport, PR8 2DS",
      heroImageUrl,
      heroImageAlt: "Birkdale village centre street scene showing the junction of Weld Road and Liverpool Road, the heart of the Open Championship pub strip",
      heroImageCredit: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: southportguide.co.uk/blog/pubs-near-royal-birkdale-open-2026, coastbirkdale.com (Open Golf 2026 page confirmed Jun 2026), cafebarnista.co.uk, barriquebirkdale.com, CAMRA listings (Up Steps, Park Hotel, Crown, Tea Rooms all confirmed trading), TripAdvisor (Coast 4.7/5, N'Ista 4.5/5, Park Hotel 3.7/5), standupforsouthport.com. Hero image: Public Domain, Small-town hero, Wikimedia Commons. Verified Jun 2026.",
      sport: ["golf"],
      moodTags: ["local", "social", "practical"],
      interestCategories: ["sport", "food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "GBP",
      bestSeasons: ["jul"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-17",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Experience at: http://localhost:3000/experience/" + result.slug);
  console.log("→ Review at:     http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
