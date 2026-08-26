import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
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
const slug = "perth-stadium-series-opener-" + Date.now().toString(36);

const imageKey = "experiences/hero/Perth Stadium Series Opener.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - Perth Stadium Series Opener.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `The series opens here, on the Burswood Peninsula, at a ground that didn't exist eight years ago and now holds more people than any cricket venue in Australia bar the MCG. Optus Stadium — still "Perth Stadium" in most cricket coverage — opened in January 2018 as the WACA's replacement, and it inherited the WACA's one defining trait: pace. Head curator Isaac McDonald has spoken about preparing surfaces with genuine bounce and carry, closer to what fast bowlers used to get at the old ground than the flatter decks common elsewhere in the country. Batters generally enjoy the first innings, when the pitch is at its truest. Cracks open from day three, and both quicks and spinners start finding sideways movement through them. Whichever side wins the toss tends to bat first — historically, the team batting first wins around two-thirds of Tests played here.

For a touring New Zealand side, that's a real problem to solve, not a footnote. A hard, bouncy Perth surface has undone plenty of visiting batting line-ups over the years, and this squad has to face it on day one of a four-Test series with no lead-in Test to adjust. The ground seats 61,266, extendable to 65,000, making it Australia's third-largest stadium. The bowl shape — steep stands close to the field on all four sides — means the noise carries even when the crowd isn't at full capacity, and a first-ever Trans-Tasman Test here is genuinely new territory for atmosphere.

Getting in is easy. Perth Stadium has its own train station built specifically to move 60,000 people quickly: six platforms, two concourses, trains every 15 minutes from Perth Station on match days, journey time about five minutes. If the weather cooperates — December in Perth usually means dry heat pushing 30°C, sometimes higher — the walk from the city is worth doing at least once. Cross the Matagarup Bridge from East Perth, a pedestrian and cycle crossing over the Swan River that drops you almost at the stadium gates, roughly 30 minutes from Cathedral Square in the CBD.`;

const whyItsSpecial = `This is the fixture that sets the tone for the whole series. New Zealand haven't toured Australia for a full series since 2019-20, and this is the first time either side has played a four-Test series against the other — so there's no recent form line to lean on, no obvious script. Add a pitch that genuinely rewards fast, accurate bowling over patience, and day one becomes a proper contest rather than a formality. Perth crowds also bring something Adelaide and the MCG don't: a stadium built entirely post-2018, with sightlines and acoustics designed around AFL and cricket together, so even a modest crowd doesn't feel thin. If you only make it to one Test on this tour, the opener carries the most unknowns — which is exactly what makes it worth being there for.`;

const insiderTips = [
  "Book the train, not a rideshare — Perth Stadium Station clears crowds in minutes on match days, while roads around Burswood back up badly after play.",
  "If you're planning the Matagarup Bridge walk, do it in the morning before the day heats up; there's very little shade on the crossing itself.",
];

const whatToAvoid = "Don't assume the ground still goes by \"Perth Stadium\" everywhere — official Cricket Australia ticketing and most signage use the naming-rights title, Optus Stadium, so search for that if the CA site or Ticketmaster listing doesn't come up under \"Perth Stadium.\" Avoid parking near the stadium itself unless you've pre-booked a spot through the venue's official parking system — casual on-street parking in Burswood on a Test match day is scarce and heavily restricted.";

const practicalInfo = {
  hours: "Gates typically open 2 hours before the day's play starts; Test day play generally runs 10:30am-5:30pm local time, subject to official scheduling closer to the match",
  costRange: "General Admission from approximately AU$30-40 per day; Reserved/Reserve Grandstand seating higher — no series-specific pricing published yet",
  bookingMethod: "Tickets via cricket.com.au or Ticketmaster Australia once the 2026-27 international season allocation opens. No Concierge-tier hospitality booking applies here — general admission and reserved seating are the only public tiers; see the separate Ticket Guide and MCG/Adelaide Oval/SCG luxury experiences for hospitality options.",
  howToBook: "",
  website: "https://www.cricket.com.au/tickets/venues/perth-stadium, https://optusstadium.com.au",
  reservationsRequired: false,
};

const gettingThere = "Direct train from Perth Station (Platform 5) to Perth Stadium Station (Platform 6), every 15 minutes on match days, about 5 minutes' journey. Walking from the CBD: cross the Matagarup Bridge from East Perth (Nelson Crescent), roughly 30 minutes from Cathedral Square. Taxi from central Perth costs around AU$8-10 and takes about 5 minutes outside of match-day traffic.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Perth Stadium — The Series Opener on the Swan",
      subtitle: "Where the tour begins on Australia's fastest, bounciest Test pitch",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Burswood",
      address: "Victoria Park Drive, Burswood WA 6100, Australia",
      heroImageUrl,
      heroImageAlt: "Aerial view of Optus Stadium (Perth Stadium) beside the Swan River, Burswood, Perth",
      heroImageCredit: "Harrison Reilly, Unsplash Licence",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: Wikipedia (Perth Stadium), ESPNcricinfo ground records, cricket.com.au venue page, optusstadium.com.au getting-here pages, cricket.com.au pitch conditions reporting (curator Isaac McDonald quotes). Verified 16 Aug 2026. No series-specific 2026-27 ticket pricing published as of this date — costRange uses recent general Test pricing as an honest range, flagged as not series-confirmed.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 14569,
      googleMapsUrl: "https://maps.google.com/?cid=10727793760152609491",
      sport: ["cricket"],
      moodTags: ["iconic-venue", "first-timer", "atmosphere"],
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
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 1 })
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
