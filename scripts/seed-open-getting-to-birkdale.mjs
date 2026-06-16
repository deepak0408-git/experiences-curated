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
const slug = "open-getting-to-birkdale-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/Hillside-Railway-Station-Birkdale.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Hillside Railway Station Birkdale.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Resolve sporting event (already exists) ───────────────────────────────

const [existing] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

const eventId = existing?.id ?? EVENT_ID;
console.log("✓ Sporting event ID:", eventId);

// ─── 3. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Here is the one piece of transport advice worth knowing: take the train. Hillside station on the Merseyrail Southport Line sits 300 metres from the main public entrance to Royal Birkdale — a 4-minute walk, confirmed on The R&A's official transport page. There is no parking at the venue. There are no roads that get you closer. The train is faster, cheaper, and less stressful than any alternative.

During the four Championship days (16–19 July 2026), Merseyrail will run at 10-minute frequency on the Southport Line. Liverpool Central to Hillside takes approximately 38 minutes. Pay by contactless card on the platform — no advance ticket needed. A Merseyrail Day Saver costs £6.40 and gives unlimited off-peak travel all day. On Open weekend days (18–19 July) it's valid from first service; on weekdays, it kicks in after 09:29.

From London, take Avanti West Coast to Liverpool Lime Street, then walk five minutes to Liverpool Central. Book early — reduced Avanti services run on Saturday 18 and Sunday 19 July on the London Euston–Liverpool route. From Manchester, Northern Rail connects via Wigan Wallgate, or direct services reach Southport (one stop beyond Hillside). From Liverpool John Lennon Airport (28 miles), a bus links the terminal to Liverpool South Parkway for the Merseyrail connection — total journey approximately 90 minutes.

If you're driving, all parking is at Park & Ride sites with shuttle buses to the course. Championship day parking costs £25 on the day, £18 booked in advance; book at theopen.com/ticketbuilder/buy-parking-2026. Shuttles run free from 5:45am to 10pm. P&R site locations will be confirmed by The R&A at theopen.com/getting-there closer to the event. Turn satnav off and follow event signage — the R&A explicitly advises this, as map-logical routes run through closed residential streets.

Taxis are available but must be booked ahead. A local Southport taxi from the town centre to the venue costs £8–12. From Liverpool city centre expect £40 or more on Open days, with surge pricing on top. Uber operates in both Liverpool and Southport — check the app but treat any estimate as a minimum on Championship days.

Blue Badge holders should contact accessibility@randa.org before 26 June 2026 to arrange dedicated accessible parking and a free shuttle.`;

const whyItsSpecial = `Transport experiences are easy to write badly. The format tends toward the obvious: take a train, here's the time, here's the fare. What makes the Hillside station walk genuinely worth including is something more specific.

Getting to a major championship is part of the day. The four-minute walk from the station to Royal Birkdale's entrance — flags, sunhats, binoculars, programmes, all moving in the same direction — is unlike arriving at a football ground or a stadium. The Open draws a particular crowd: international, knowledgeable, dressed for weather that could go any direction. Those 300 metres feel like arriving at something.

The Merseyrail journey from Liverpool Central is where the day begins properly. Forty minutes through the Merseyside suburbs, past Formby and Ainsdale, the landscape flattening, Blackpool Tower visible on a clear day. The current Class 777 fleet is new, but the Southport Line was built in 1848 — these routes have carried people to the Lancashire coast for nearly two centuries. There's something right about arriving at a links championship by train.

The alternative — driving, parking, shuttling — takes longer, costs more, and arrives at the same place. The train is the better story. And in this case, the better logistics too.`;

const insiderTips = [
  "A Merseyrail Day Saver (£6.40) is almost always cheaper than a return fare and covers unlimited off-peak travel all day — buy it at the platform machine or just tap in with contactless.",
  "Leave at least 30 extra minutes for the return journey after a full day at the Open — Hillside station gets extremely busy when play finishes. Staying 30–40 minutes after the crowds leave makes the return significantly less stressful.",
];

const whatToAvoid = `Don't rely on satnav if driving — the R&A specifically advises turning it off and following event signage, as the most direct-looking route on a map takes you through closed residential streets. And don't plan to share a taxi from Liverpool city centre without booking well in advance: demand massively outstrips supply on Championship days and surge pricing makes the journey expensive.`;

const gettingThere = `Merseyrail Southport Line from Liverpool Central to Hillside station (38 minutes, every 10 minutes on Championship days). Pay by contactless on the platform. Hillside station is 300m (4-minute walk) from the Royal Birkdale main entrance. Journey planner: merseyrail.org`;

const practicalInfo = {
  hours: "Open Championship: 16–19 July 2026. Practice days: 12–15 July 2026.",
  costRange: "Merseyrail Day Saver £6.40. Park & Ride: £18–25/day (advance vs. on the day). Local taxi (Southport centre → venue): £8–12.",
  bookingMethod: "No booking needed for the train — tap in with contactless at Liverpool Central and tap out at Hillside. Book Park & Ride in advance at theopen.com/ticketbuilder/buy-parking-2026 (saves £7/day). Book Avanti West Coast London–Liverpool tickets early — reduced services on 18–19 July sell out. Coach/minibus groups (10+ seats): book via tickets@randa.org or +44 (0)1334 460010 before end of June for a £10 group discount. Blue Badge holders: register at accessibility@randa.org before 26 June 2026.",
  howToBook: null,
  website: "https://www.theopen.com/tickets-and-hospitality/getting-there",
  reservationsRequired: false,
};

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to Royal Birkdale",
      subtitle: "The train wins. Hillside station is 300m from the entrance — Merseyrail runs every 10 minutes on Championship days.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Hillside, Southport",
      address: "Hillside Station, Waterloo Road, Birkdale, Southport, PR8 2DU",
      heroImageUrl,
      heroImageAlt: "Hillside railway station building on Waterloo Road, Birkdale — 300 metres from the Royal Birkdale main entrance",
      heroImageCredit: "Rept0n1x, CC BY-SA 3.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: theopen.com/getting-there (official, Jun 2026), helpcentre.theopen.com/parking, nationalrail.co.uk/the-open-golf, merseyrail.org. P&R site locations not yet confirmed by R&A for 2026 — directed to official site. Avanti reduced services 18–19 Jul confirmed by National Rail. Fare £6.40 Day Saver from merseyrail.org. Verified June 2026.",
      sport: ["golf"],
      moodTags: ["practical", "local"],
      interestCategories: ["sport"],
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
  console.log("\n→ Review at:    http://localhost:3000/curator/review");
  console.log("→ Experience at: http://localhost:3000/experience/" + result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
