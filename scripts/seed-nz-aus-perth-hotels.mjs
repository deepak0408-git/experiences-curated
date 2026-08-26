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

const DESTINATION_ID = "ffec74ad-80de-41e6-a003-919e30ce6f06"; // Perth
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "where-to-stay-perth-first-test-" + Date.now().toString(36);

const imageKey = "experiences/hero/Where to Stay Perth First Test.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - Perth Skyline Swan River.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `Perth Stadium sits in Burswood, across the Swan River from the city centre — not in the CBD itself, which shapes the real decision here more than most stadium-city writeups let on. You're choosing between the Crown Perth complex, a short walk from the ground, or Perth's CBD, a train ride away but with the city's actual restaurant and bar scene on your doorstep.

Crown Towers Perth is the pick if you want to walk to the cricket. It sits inside the Crown Perth resort complex in Burswood, about a kilometre from the stadium, connected by the Matagarup Bridge on foot. It's a five-star hotel with lagoon pools, a spa, and direct access to Crown's own restaurants and bars, so on days you're not at the ground there's still plenty on site. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=8703376889546349404&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

InterContinental Perth City Centre is the pick if you'd rather base yourself in town. It's an eight-minute walk from Perth railway station and about ten minutes on foot from Elizabeth Quay, putting you inside the CBD's actual dining and bar strip rather than a resort compound. The tradeoff is that getting to the ground means a short train ride instead of a walk. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=8273347388918025058&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

That train ride is genuinely painless, which is the fact that should settle most people's decision. Perth Stadium has its own station built into the venue, served directly by the Armadale, Fremantle and Thornlie-Cockburn lines, and any Test match ticket includes free travel on Transperth's entire network for three hours before play and three hours after — just show your ticket at the gate or on the platform. There's no need to buy a fare, work out zones, or plan around a timetable. If the appeal of Crown Towers is mainly "I don't want to think about transport," the CBD option removes almost all of that friction anyway, for a fraction of the walk-up convenience but a much better base for everything outside match hours.

Perth is Australia's hottest, driest Test venue on this tour — December temperatures regularly sit around 29-30°C and can spike into the mid-30s. Crown's pools are a genuine asset on a rest day between sessions; a CBD hotel without a pool leaves you relying on the Swan River foreshore or Kings Park for shade and greenery instead.`;

const whyItsSpecial = `Most "where to stay" guides for a stadium city pretend the choice is close-vs-far. Perth's real choice is resort-vs-city, because Perth Stadium isn't downtown — it's across the river in Burswood, next to Crown's casino and hotel complex, with the actual CBD a deliberate train ride away. That's unusual among the four Test venues on this tour, and it's worth knowing before you book, not after. Crown Towers suits someone who wants the tournament to be the whole trip: walk to the ground, swim between sessions, eat at Crown's restaurants, repeat. The CBD suits someone who wants Perth itself — Kings Park, the Elizabeth Quay waterfront, Northbridge's bars — with cricket as one part of a longer stay. Neither is the "correct" answer. What makes this worth spelling out is that the free three-hour Transperth window genuinely flattens the difference in travel effort, so the deciding factor should be what kind of week you actually want, not which hotel is fewer minutes from the gates.`;

const insiderTips = [
  "Show your Test match ticket at the Transperth gate or on the platform to travel free on any train, bus, or ferry from three hours before the first ball to three hours after the close of play — no SmartRider card or separate fare needed.",
  "If you're staying at Crown Towers and want a change of scene between sessions, the walk to the CBD via the Matagarup Bridge takes you past Point Fraser and the Swan River foreshore rather than through traffic — a genuinely pleasant 25-30 minute route, not just a functional shortcut.",
];

const whatToAvoid = "Don't assume every Crown Perth property is the same standard — Crown Towers is the five-star flagship, while Crown Metropol and Crown Promenade sit a tier below on price and finish despite being part of the same complex and equally close to the stadium, so check which one you're actually booking. Avoid booking a CBD hotel purely on proximity to Elizabeth Quay without checking its distance to Perth railway station specifically — some CBD addresses are closer to the river than to a train line that runs direct to the stadium, which matters more on match day than being near the water.";

const practicalInfo = {
  hours: "Check-in/out varies by hotel — Crown Towers and InterContinental Perth City Centre both offer late checkout on request, subject to availability",
  costRange: "Crown Towers from roughly AU$330-450/night in peak December demand; InterContinental Perth City Centre from roughly AU$280-380/night — both rise sharply during the Test match window, book early",
  bookingMethod: "Book directly via crownperth.com.au for the Crown complex hotels, or ihg.com for InterContinental Perth City Centre — both also list on major booking platforms.",
  howToBook: "",
  website: "https://www.crownperth.com.au, https://www.ihg.com/intercontinental/hotels/us/en/perth/perha/hoteldetail",
  reservationsRequired: true,
};

const gettingThere = "Perth Stadium has its own station, Perth Stadium Station, served by the Armadale, Fremantle and Thornlie-Cockburn lines — direct from Perth CBD in one stop. From Crown Towers, it's a 10-15 minute walk via the Matagarup Bridge instead.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay in Perth for the First Test",
      subtitle: "Crown's resort complex by the stadium, or the CBD a free train ride away — the real tradeoff",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Burswood / Perth CBD",
      address: null,
      heroImageUrl,
      heroImageAlt: "Perth skyline at golden hour across the Swan River",
      heroImageCredit: "Nathan Hurst (Unsplash Licence)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: trip101.com and optusstadium.com.au (Crown Hotels walking distance and complex overview), Tripadvisor user reviews (Crown Towers/Metropol/Promenade location sentiment), transperth.wa.gov.au and afl.com.au (free 3-hour Transperth travel window confirmed for cricket events at Perth Stadium), ihg.com (InterContinental Perth City Centre walk times to Perth station and Elizabeth Quay). Google Places API lookups for Crown Towers Perth (4.4/8,546 reviews) and InterContinental Perth City Centre by IHG (4.4/1,168 reviews), captured 16 Aug 2026 — both real, well-attested ratings, no thin-review concern. Multi-venue experience — no single googleMapsRating on this row, live per-hotel rating links written inline in bodyContent per skill §2c. Prices are indicative from general search, not vendor-confirmed live rates — flagged as approximate.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["comfort", "convenience", "resort"],
      interestCategories: ["sport", "accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["dec"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 11 })
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
