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
const slug = "adelaide-oval-most-beautiful-ground-" + Date.now().toString(36);

const imageKey = "experiences/hero/Adelaide Oval Most Beautiful Ground.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - Adelaide Oval Most Beautiful Ground.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `Adelaide Oval has been playing Test cricket since 1884, longer than any Australian ground bar the MCG and SCG, and it still looks like nowhere else in the country. St Peter's Cathedral rises behind the northern end, close enough that its spires sit inside the frame of almost every TV broadcast from the ground. Locals call the two ends River End and Cathedral End rather than anything sponsor-named, and the old hand-operated scoreboard — heritage-listed, still in use — sits on the same footprint it has occupied since 1911. The 2014 redevelopment doubled capacity to roughly 53,500 with new southern and eastern stands, but the brief was explicit: keep the grass hill, keep the scoreboard, keep the cathedral view. It worked. This is a stadium that expanded without losing the thing that made it worth visiting in the first place.

Cricket history here runs deeper than most touring fans realise. The Bodyline series reached its ugliest point at Adelaide Oval in January 1933, when Bert Oldfield was struck and mounted police had to help control a crowd of over 50,000. The pitch itself plays fair through most of a Test: good pace and bounce early for the quicks, before it dries out and starts turning for the spinners from around day three onward — a genuine contest for bat and ball across all five days, rather than a surface that decides the game in the first session.

The ground sits about a kilometre north of the CBD, an easy walk over the Riverbank footbridge from Adelaide Railway Station on North Terrace. On match days the free Footy Express tram and bus network — usually associated with AFL, but running for major cricket fixtures too — covers the short hop from the city centre, and the closest tram stop, Festival Plaza on King William Road, is about 500 metres from the gates.`;

const whyItsSpecial = `Most modern stadiums solve the capacity problem by demolishing what came before. Adelaide Oval didn't: it kept the hill where you can still sit on the grass with a picnic rug for a fraction of grandstand prices, kept the 1911 scoreboard doing its job by hand, and kept the cathedral in the skyline behind the northern stand. That's rare, and it's why photographers and players alike single this ground out as their favourite in Australia. For this series specifically, Adelaide is the second Test — daytime cricket, not day/night as some past New Zealand tours here have used — so the ground plays as it always has: quick early, harder work for the bowlers as the match wears on. If you want one photograph that captures what touring for this series actually looks like, it's taken from the hill, cathedral in the background, gates onto the outfield still visible from a hundred years ago.`;

const insiderTips = [
  "The Riverbank footbridge from Adelaide Railway Station is the fastest route in on foot — about 5 minutes — and avoids the traffic bottleneck on King William Road on a full match day.",
  "Bring a picnic rug and get to the hill early if you want grass seating; it's first-come, general admission, and fills up fast for a marquee fixture like the Boxing Day lead-in Test.",
];

const whatToAvoid = "Don't confuse this Test with a day/night fixture — Cricket Australia and the venue have confirmed the 2026-27 Adelaide Test in this series is played entirely in daylight hours with a red ball, unlike some previous Adelaide Tests that used a pink ball under lights, so don't plan an evening arrival expecting play to still be running. Avoid driving in and hunting for street parking around North Adelaide on match day — parking is limited and heavily contested, and the tram/train/Footy Express network is faster door-to-door than most people expect from a stadium this close to a river.";

const practicalInfo = {
  hours: "Gates typically open around 2 hours before the day's play starts; Test day play generally runs approximately 11:00am-6:00pm local time in South Australian summer, subject to official scheduling",
  costRange: "Hill (grass general admission) tickets typically from around AU$25-35 per day; Reserved grandstand seating higher — no 2026-27 series-specific pricing published yet",
  bookingMethod: "Tickets via cricket.com.au or Ticketek once the international season allocation opens. General admission (including the Hill) and Reserved Grandstand are the two public tiers — see the separate Ticket Guide and Adelaide Oval luxury experience for hospitality options.",
  howToBook: "",
  website: "https://www.adelaideoval.com.au, https://www.cricket.com.au/tickets/venues/adelaide-oval",
  reservationsRequired: false,
};

const gettingThere = "Walk from Adelaide Railway Station (North Terrace) via the Riverbank footbridge, about 5 minutes. Tram: Festival Plaza stop on King William Road, about 500m from the gates. On match days, the free Footy Express bus and tram network runs supplementary services before and after play for ticket holders.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Adelaide Oval — Cricket's Most Beautiful Ground",
      subtitle: "St Peter's Cathedral in the background, a hand-worked 1911 scoreboard, and the Hill",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "North Adelaide",
      address: "War Memorial Drive, North Adelaide SA 5006, Australia",
      heroImageUrl,
      heroImageAlt: "Adelaide Oval with St Peter's Cathedral visible behind the northern stand",
      heroImageCredit: "Mike Wilson, CC0 1.0 (Unsplash, via Wikimedia Commons)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: Wikipedia (Adelaide Oval, List of Test cricket records at the Adelaide Oval), ESPNcricinfo ground page, adelaideoval.com.au getting-here page, Adelaide Metro transport pages, cricket365/sportsdunia pitch reporting. Verified 16 Aug 2026. Confirmed with curator brief: 2026-27 Adelaide Test is daytime, red-ball, not day/night — explicitly flagged in copy given past Adelaide pink-ball precedent. No series-specific ticket pricing published as of this date.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 13569,
      googleMapsUrl: "https://maps.google.com/?cid=18024393823055569463",
      sport: ["cricket"],
      moodTags: ["iconic-venue", "heritage", "scenic"],
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
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 2 })
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
