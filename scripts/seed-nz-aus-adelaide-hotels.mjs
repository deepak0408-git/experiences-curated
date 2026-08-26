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
const slug = "where-to-stay-adelaide-city-vs-north-" + Date.now().toString(36);

const imageKey = "experiences/hero/Where to Stay Adelaide City vs North Adelaide.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - Adelaide Oval Footbridge.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `Adelaide Oval sits right on the edge of North Adelaide, across the River Torrens from the CBD — which makes this city's accommodation choice genuinely close-vs-close rather than a real trek either way. Both sides of the river put you within a 10-15 minute walk of the gates. The actual difference is what kind of 10 minutes you want to spend, and what the rest of your day looks like.

If proximity is all that matters, the Oval Hotel is the answer and there's no real competition. It's built onto the eastern side of Adelaide Oval itself — Australia's first stadium hotel — so getting to your seat means walking out the lobby, not catching transport at all. Rooms look out over the heritage-listed parklands, and being wrapped around the ground means you're inside the atmosphere from the moment you wake up on match day. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=2976848023503816091&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

The InterContinental Adelaide, on the CBD side of the same river footbridge, is the pick if you'd rather have Adelaide's actual city life within reach. It sits directly across the River Torrens from Adelaide Oval — a footbridge walk to the ground — while also putting the Adelaide Festival Centre, the Convention Centre, and Rundle Mall's shops and restaurants within easy reach, which the Oval Hotel, wrapped around a stadium in parkland, genuinely doesn't offer on non-match days. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=7173748620512840815&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

The honest read: choose the Oval Hotel if this Test is the main event and you want to live inside it — 138 rooms, keyless entry, a welcome drink, and direct access to Adelaide Oval's own RoofClimb and stadium tour experiences when there's no play. Choose the InterContinental, or another CBD hotel in the Riverbank Precinct, if you're treating Adelaide as a city stop with cricket as one part of a longer visit, and want restaurants, bars and Rundle Mall within an easy walk rather than a Test-day-only location. Adelaide's December weather is the mildest and driest of the four cities on this tour, sitting around 25°C, so neither side of the river involves much discomfort walking to or from the ground.`;

const whyItsSpecial = `Most stadium accommodation guides frame the choice as close versus far. Adelaide breaks that framing, because the Oval and the CBD are both close — the real question is whether you want the stadium to be your whole world for a few days or just the reason you're in town. The Oval Hotel is a genuinely rare thing: a proper hotel built into a working Test cricket ground, not a generic tower a few blocks away with a marketing line about proximity. Staying there means the ground's rhythm becomes your own — you can hear the crowd from certain rooms, and walking to your seat is a lobby exit, not a journey. That's worth paying for if the Test is the point of the trip. But North Adelaide is quiet outside match hours, all heritage parkland and residential streets, while the CBD across the river has the city's actual life in it. Neither choice is a compromise. They're just different trips wearing the same hotel booking.`;

const insiderTips = [
  "The Oval Hotel does not have its own pool or gym — guests get access to the nearby Next Gen Health & Lifestyle Club instead, so factor that into your choice if hotel fitness facilities matter to you.",
  "Adelaide Railway Station sits about 600 metres from Adelaide Oval, roughly equidistant from CBD hotels near North Terrace and from the Oval side via the footbridge — check a specific CBD hotel's distance to the station itself, not just to the river, since some North Terrace addresses are a longer walk to the platform than to the water.",
];

const whatToAvoid = "Don't book a North Adelaide hotel expecting CBD-level dining and nightlife nearby — it's a quiet, heritage residential area built around parklands, and outside match hours there's genuinely little to do within walking distance beyond the Oval precinct itself. Avoid assuming all North Terrace CBD hotels are equally close to the Oval footbridge crossing — North Terrace runs for over a kilometre, so a hotel at the eastern end near the Botanic Gardens is a noticeably longer walk to the ground than one nearer the Riverbank Precinct, where the InterContinental sits.";

const practicalInfo = {
  hours: "Check-in/out varies by hotel — the Oval Hotel offers keyless entry and typically 3pm check-in / 11am checkout, confirm current policy when booking",
  costRange: "Oval Hotel from roughly AU$350-480/night in peak December demand; InterContinental Adelaide and comparable CBD Riverbank hotels from roughly AU$280-400/night — both rise during the Test window",
  bookingMethod: "Book the Oval Hotel directly via ovalhotel.com.au, or the InterContinental Adelaide via icadelaide.com.au — both also list on major booking platforms.",
  howToBook: "",
  website: "https://www.ovalhotel.com.au, https://icadelaide.com.au",
  reservationsRequired: true,
};

const gettingThere = "Both areas are walkable from Adelaide Railway Station, about 600m from the Oval. From CBD hotels near North Terrace, cross the River Torrens on the Adelaide Oval Footbridge — roughly a 10-minute walk. The Oval Hotel is built directly onto the ground's eastern side, no transport needed.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay in Adelaide — City vs. North Adelaide",
      subtitle: "A hotel built into the ground itself, or the CBD a 10-minute river walk away",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "North Adelaide / Adelaide CBD",
      address: null,
      heroImageUrl,
      heroImageAlt: "The footbridge over the River Torrens leading to Adelaide Oval",
      heroImageCredit: "Luke Anderson, CC BY-SA 2.0 (Wikimedia Commons)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: booking.com landmark page and tripadvisor.com (Adelaide Oval hotel proximity comparison, North Adelaide vs CBD distances), powertraveller.com and tablethotels.com (Oval Hotel overview, 138 rooms, no pool/gym, Next Gen Health Club access, 9.1/10 Booking.com aggregate rating), icadelaide.com.au (InterContinental Adelaide, Riverbank Precinct, footbridge to Adelaide Oval). Mayfair Hotel dropped 17 Aug 2026 — its own domain (mayfairhotel.com.au) returns an SSL certificate mismatch (resolves to a generic WPEngine placeholder, not the hotel) and the property is reported closed for refurbishment until Q4 2026; replaced with InterContinental Adelaide (real, currently trading, 4/5 Tripadvisor, ~8/10 aggregate from 2,300+ reviews per tripexpert.com, confirmed via WebFetch to icadelaide.com.au). Google Places API lookup for Oval Hotel (4.5/777 reviews) captured 16 Aug 2026 — real, well-attested rating, no thin-review concern. InterContinental Adelaide Google Places API lookup (4.3/2,825 reviews) captured 17 Aug 2026 — real, well-attested rating, no thin-review concern. Multi-venue experience — no single googleMapsRating on this row, live per-hotel rating links written inline in bodyContent per skill §2c. Prices are indicative from general search, not vendor-confirmed live rates.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["comfort", "convenience", "heritage"],
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
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 12 })
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
