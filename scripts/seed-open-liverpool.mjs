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
const slug = "open-liverpool-day-trip-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/Liverpool-Mathew-Street-Cavern-Club.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Liverpool Mathew Street Cavern Club.jpg");
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

const bodyContent = `Hillside Station is a four-minute walk from Royal Birkdale's main entrance. The Merseyrail Northern Line runs direct to Liverpool Central in around 40 minutes, with trains every 15 minutes throughout the day. A return ticket costs approximately £7–9. During Open week that journey is the most efficient thing you can do on a rest day.

Liverpool Central puts you in the middle of the city. The Albert Dock is a 15-minute walk south along the waterfront, or a short ride on the city's bus network. Everything worth seeing is either free or under £25.

The Albert Dock is the obvious starting point. It is the largest group of Grade I listed buildings in the UK — five-storey red brick warehouses built in 1846, now housing the Merseyside Maritime Museum, the International Slavery Museum, and The Beatles Story. The Maritime Museum and Slavery Museum are both free and run by National Museums Liverpool; allow 90 minutes if you visit both. The Beatles Story charges £20 for adults — it is immersive and better than you'd expect, with reconstructed sets from the Cavern Club and Abbey Road. Worth it if you have any interest in the band at all.

The Pier Head is five minutes north of the Albert Dock on foot. The Royal Liver Building, the Cunard Building, and the Port of Liverpool Building — the Three Graces — are the defining images of Liverpool's waterfront. The Museum of Liverpool on the waterfront is also free, open Tuesday to Sunday 10:00–17:00, and covers the city's history in a way that actually holds your attention.

If the afternoon is free, the Walker Art Gallery on William Brown Street is the best single building in the city. It holds the most significant collection of art outside London — free, open Tuesday to Sunday 10:00–17:00, closed Mondays except school holidays. Rubens, Rembrandt, Hockney, and Freud, all in a Victorian neoclassical building with almost no queue. It is about a 20-minute walk from the Albert Dock, or one stop on the bus.

For food, the Albert Dock has restaurants but most are tourist-oriented and overpriced. Better to walk five minutes east to Bold Street or Castle Street, where there are independent cafés and restaurants at normal prices. The Baltic Triangle, a former warehouse district south of the city centre, has the city's best independent food and bar scene but requires a deliberate detour and is best in the evening.

The last train from Liverpool Central back toward Hillside and Southport runs late — check the Merseyrail app on the day, but you have until at least 23:00 on most evenings during July. This is the one day trip in the pack where you can genuinely stay for dinner.`;

const whyItsSpecial = `Most major golf events are held far enough from a city that a day trip feels like a mission. Hillside Station being four minutes from Royal Birkdale, and Liverpool being 40 minutes away by direct train, removes that friction entirely. A rest day between rounds doesn't have to be the hotel bar and a long lunch.

The Walker Gallery alone would justify the trip. Rubens and Freud, free, with almost nobody else there. Combine that with the Albert Dock waterfront, the Pier Head, and the kind of city that has enough history, food, and music that you can fill a day without planning too much. Liverpool rewards people who wander.`;

const insiderTips = [
  "The Walker Art Gallery closes Mondays (except school holidays) — plan your Liverpool day for Tuesday through Sunday, and go to the Walker first before Open week crowds drift in during the afternoon.",
  "Buy Merseyrail tickets on the app before you leave Birkdale — the machines at Hillside can have queues on busy Open week mornings.",
];

const whatToAvoid = `The restaurants directly inside the Albert Dock complex charge city-centre tourist prices for food that doesn't merit them. Walk five minutes east to Bold Street or Castle Street for independent restaurants at better value. Also: check the Merseyrail last service before committing to a late dinner — the Northern Line thins out after 22:30, and missing the last train to Hillside means a taxi back to Birkdale at Open week surge pricing.`;

const gettingThere = `Walk 4 minutes from Royal Birkdale's main entrance to Hillside Station. Merseyrail Northern Line direct to Liverpool Central, approximately 40 minutes, every 15 minutes. Return fare approximately £7–9. Buy tickets at the station or on the Merseyrail app.`;

const practicalInfo = {
  hours: "Merseyrail approx 05:30–23:30 daily. Albert Dock outdoor areas 24/7. Museums Tue–Sun 10:00–17:00. Walker Art Gallery Tue–Sun 10:00–17:00 (closed Mon except school holidays).",
  costRange: "Return Merseyrail ticket ~£7–9. Albert Dock museums free. The Beatles Story £20 adult. Walker Art Gallery free. Museum of Liverpool free.",
  bookingMethod: "No booking required for free attractions. Beatles Story tickets at beatlesstory.com. Merseyrail tickets at merseyrail.org or on the app.",
  howToBook: null,
  website: "https://www.merseyrail.org/, https://www.beatlesstory.com/, https://www.liverpoolmuseums.org.uk/walker-art-gallery",
  reservationsRequired: false,
};

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Liverpool — 40 Minutes from Birkdale",
      subtitle: "Direct Merseyrail from Hillside Station. Albert Dock, the Walker Gallery, and the waterfront — most of it free.",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Liverpool City Centre",
      address: "Liverpool Central Station, Ranelagh Street, Liverpool, L1 1JT",
      heroImageUrl,
      heroImageAlt: "The Cavern Club entrance on Mathew Street, Liverpool, with the John Lennon statue — the heart of the city's Beatles heritage",
      heroImageCredit: "Loco Steve, CC BY-SA 2.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: merseyrail.org (Hillside journey time ~40 min, every 15 min), beatlesstory.com/plan-your-visit/prices (£20 adult, verified Jun 2026), liverpoolmuseums.org.uk (Walker Art Gallery free, Tue–Sun 10–17, confirmed Jun 2026), Museum of Liverpool (free, same hours), albertdock.com (Maritime Museum, Slavery Museum free). Hero: Cavern Club entrance & John Lennon statue, Mathew Street, Loco Steve, CC BY-SA 2.0, Wikimedia Commons. Verified Jun 2026.",
      sport: ["golf"],
      moodTags: ["cultural", "local", "social"],
      interestCategories: ["sport", "culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "GBP",
      bestSeasons: ["jul"],
      advanceBookingRequired: false,
      availability: "perennial",
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
