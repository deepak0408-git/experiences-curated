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
const slug = "where-to-stay-melbourne-boxing-day-" + Date.now().toString(36);

const imageKey = "experiences/hero/Where to Stay Melbourne Boxing Day.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - Melbourne Skyline Fitzroy Gardens.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `Book Melbourne earlier than you think you need to. Boxing Day sits inside the single most expensive accommodation window Melbourne has all year — hotel rates across the city typically rise 50-80% for the Christmas-to-New-Year stretch, and rooms genuinely close to the MCG can go up to 200% above their normal rate once the Test, the cricket crowds, and the tail end of Christmas travel all land in the same week. This isn't ordinary event-week pricing; it's the city's peak.

Hotels within walking distance of the MCG cluster in three areas: East Melbourne, directly across the road from the ground; Jolimont, a short walk through Yarra Park; and the CBD, 10-15 minutes away across the Yarra. Pullman East Melbourne (renamed from Pullman Melbourne on the Park in 2026 — same hotel, same building, new name, so don't be thrown if you see both used online) is the standout East Melbourne pick: it looks directly across at the MCG and Fitzroy Gardens, and it's a two-minute walk from Jolimont Station. Some rooms have MCG views built in. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14175253022176210902&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

If you'd rather be based in the CBD, Sofitel Melbourne on Collins sits roughly midway between the MCG and Melbourne's main shopping and dining strip, about a 16-minute walk to the ground or a short tram ride, with Parliament train station and the Spring Street tram stops right outside. It trades the "roll out of bed and see the ground" convenience of East Melbourne for genuine access to Collins Street's restaurants and the rest of the CBD. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16025437539006058286&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Melbourne's December weather is the most changeable of the four Test cities on this tour — averages sit around 23.7-25°C but heatwave spikes above 35°C happen, and there are roughly nine rain days in a typical December. That volatility is a real reason to prioritise being close to the ground over being close to restaurants: if a session gets interrupted or the weather turns, you want a short walk back to your room, not a tram ride across the city in the heat.`;

const whyItsSpecial = `The number that should actually drive this decision isn't distance, it's the calendar. Boxing Day Test week is the single highest-demand accommodation window Melbourne sees all year, ahead of the Australian Open and the AFL Grand Final, because it stacks Christmas travel, New Year's Eve, and 80,000-90,000 daily cricket fans into the same seven days. Booking in October for a December trip isn't excessive caution here, it's the difference between a normal rate and paying double. Once you've accepted that, the East Melbourne-versus-CBD choice becomes a genuine lifestyle question rather than a budget one: East Melbourne means the ground is essentially your front yard, good when Melbourne's unpredictable summer weather makes a short walk back to your room valuable. The CBD means Collins Street's restaurants and the wider city are close, at the cost of a slightly longer trip on match days. Both are good decisions. Only one saves you from watching your card get charged double in December.`;

const insiderTips = [
  "Rates for Boxing Day week increase in steps as December progresses, not all at once — booking by October, well before the pack itself goes on sale, locks in a materially lower rate than waiting until the week itself.",
  "If you're staying in East Melbourne specifically to walk to the ground, book a room with a stated MCG or Yarra Park view where offered — several East Melbourne hotels list this as a specific, bookable room category, not just a marketing description.",
];

const whatToAvoid = "Don't assume every hotel with \"Melbourne\" or \"MCG\" in a listing title is actually close to the ground — greater Melbourne is enormous, and several hotels branded around the MCG or cricket are a drive away, not a walk, so check the actual walking distance to Jolimont Station or the ground gates specifically before booking on name alone. Avoid booking any Melbourne hotel for this week through a third-party site without checking its cancellation policy first — Boxing Day week pricing volatility means rates sometimes drop closer to the date on flexible listings, and a non-refundable early booking can end up more expensive than waiting, even though booking early is generally the right instinct.";

const practicalInfo = {
  hours: "Check-in/out varies by hotel — both properties below typically offer 3pm check-in / 11am checkout, confirm current policy when booking",
  costRange: "Rates rise 50-80% across Melbourne for the Christmas-Boxing Day-New Year window versus normal season, with MCG-adjacent hotels seeing the steepest increases — book several months ahead for anything close to a normal rate",
  bookingMethod: "Book Pullman East Melbourne directly via pullmaneastmelbourne.com.au, or Sofitel Melbourne on Collins via sofitel-melbourne.com.au — both also list on major booking platforms.",
  howToBook: "",
  website: "https://www.pullmaneastmelbourne.com.au, https://www.sofitel-melbourne.com.au",
  reservationsRequired: true,
};

const gettingThere = "Pullman East Melbourne is a 2-minute walk from Jolimont Station, itself one stop from Flinders Street. Sofitel Melbourne on Collins is beside Parliament Station and the Spring Street tram stops — roughly a 16-minute walk or short tram ride to the MCG from there.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay in Melbourne for Boxing Day",
      subtitle: "This is Melbourne's most expensive accommodation week of the year — book like it",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "East Melbourne / CBD",
      address: null,
      heroImageUrl,
      heroImageAlt: "Melbourne skyline viewed from Fitzroy Gardens in East Melbourne",
      heroImageCredit: "Rexness, CC BY-SA 2.0 (Wikimedia Commons)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: drivenow.com.au and lovehardtraveloften.com (MCG-adjacent hotel clusters — East Melbourne, Jolimont, CBD), switchsolutions.com and general seasonal pricing search (Boxing Day/Christmas-NYE 50-80% rate increase, up to 200% for peak events near major venues), hotelmanagement.com.au and accomnews.com.au (Pullman Melbourne on the Park officially renamed Pullman East Melbourne, 2026 rebrand confirmed), pointhacks.com.au and tripadvisor.com (Pullman East Melbourne location and guest sentiment). Google Places API lookups for Pullman East Melbourne (4.3/3,432 reviews) and Sofitel Melbourne on Collins (4.6/5,065 reviews), captured 16 Aug 2026 — both real, well-attested ratings, no thin-review concern. Multi-venue experience — no single googleMapsRating on this row, live per-hotel rating links written inline in bodyContent per skill §2c. Boxing Day hotel pricing surge explicitly flagged in copy per curator brief — genuinely elevated versus rest of year, not a generic 'book early' hedge.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["comfort", "convenience", "peak-season"],
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
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 13 })
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
