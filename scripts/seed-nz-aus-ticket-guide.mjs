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

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne (event primary destination)
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "nz-australia-series-ticket-guide-" + Date.now().toString(36);

const imageKey = "experiences/hero/NZ Australia Series Ticket Guide.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - Series Ticket Guide.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `Four Tests, four different ticketing systems in practice, one underlying structure. Every venue on this tour — Perth Stadium, Adelaide Oval, the MCG, the SCG — sells the same two public tiers: General Admission and Reserved Grandstand seating. General Admission is unreserved, first-come-first-served within its section, and cheapest; Reserved Grandstand guarantees a specific seat you choose at the time of booking, at a real premium over GA, and is worth it for any day where crowd size makes arriving early to claim a GA spot impractical (Boxing Day at the MCG and the Sydney Pink Test both qualify). Tickets across all four grounds go on sale through Ticketmaster.com.au, which handles official Cricket Australia ticketing, or Ticketek for venue-specific presales.

The single most useful thing to know before this series goes on public sale is CricketPlus. It's a free membership — sign up at cricket.com.au/cricketplus — and it exists specifically to give members presale access to tickets before they hit general public sale, at what Cricket Australia describes as the best available pricing. You get an access code by email that's required to buy during the presale window, and each code covers up to 19 tickets per match. Registering doesn't guarantee you a seat, but it's the only way to get a shot at tickets before the wider public does, and it costs nothing to join. If you're planning to attend more than one Test on this tour, or you want Boxing Day or the Pink Test specifically, joining CricketPlus well before the series goes on sale is the single highest-leverage thing you can do.

Pricing varies by day within a single Test, not just by venue. The first day or two of any Test, and especially the marquee dates — Boxing Day at the MCG, New Year's at the SCG — carry a premium over the pricing for days four and five of the same match, when a result is less certain and demand drops. If budget matters more to you than guaranteed play, the back end of a Test is genuinely the better-value ticket, and on a five-day match there's still a real chance of seeing a result unfold.

No 2026-27 series-specific pricing has been published for any of the four venues as of this writing — Cricket Australia and Ticketmaster list only prior-season reference pricing and "tickets on sale soon" placeholders. Treat any number you see quoted online before the official on-sale date as an estimate from a previous series, not a confirmed 2026-27 figure.`;

const whyItsSpecial = `A four-Test tour spread across four cities is a genuinely different buying problem from a single match, and most fans only work this out after the good seats for the marquee days are gone. The presale mechanism is the part almost nobody outside Australia knows to look for — a free membership that exists purely to move you ahead of the general public sale window, with no catch beyond signing up early enough. Knowing that Boxing Day and the Sydney Test carry real pricing premiums over the same match's back end, and that GA tickets get harder to convert into a good seat the bigger the crowd gets, is the difference between planning this trip around guesswork and planning it around how Australian cricket ticketing actually works.`;

const insiderTips = [
  "Join CricketPlus (free, at cricket.com.au/cricketplus) as early as possible before the series goes on sale — presale access and the best available pricing are only extended to members with a valid access code, and each code covers up to 19 tickets per match.",
  "If you're choosing which single day of a Test to prioritise on a budget, day four or five is genuinely cheaper than day one or two of the same match — pricing follows day-by-day demand, not a flat per-Test rate.",
];

const whatToAvoid = "Don't wait for public on-sale if you want Boxing Day at the MCG or the Sydney Pink Test specifically — both are the highest-demand single days of the entire Australian summer, and CricketPlus presale access is the only realistic way to secure a seat before general admission for those two days sells out or the best reserved seats are gone. Avoid buying from resale marketplaces or unofficial resellers before checking Ticketmaster.com.au and Ticketek directly first — official channels are consistently cheaper and carry none of the fraud risk that comes with third-party resale sites for high-demand fixtures like this series.";

const practicalInfo = {
  hours: "Presale and public on-sale windows are announced separately by Cricket Australia closer to the season — join CricketPlus to be notified directly rather than checking manually",
  costRange: "No 2026-27 series-specific pricing published as of this writing — expect General Admission from roughly AU$25-60 per day depending on venue and day, Reserved Grandstand meaningfully higher, both varying by match day within the same Test",
  bookingMethod: "Ticketmaster.com.au handles official Cricket Australia ticketing across all four venues; Ticketek runs some venue-specific presales. CricketPlus membership (free) unlocks presale access ahead of general public sale.",
  howToBook: "",
  website: "https://www.cricket.com.au/cricketplus, https://www.ticketmaster.com.au/cricket",
  reservationsRequired: false,
};

const gettingThere = "This is a series-wide ticketing guide, not tied to a single venue — see the individual venue experiences (Perth Stadium, Adelaide Oval, the MCG, the SCG) for city-specific transport directions.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Your NZ-Australia Series Ticket Guide",
      subtitle: "The free presale membership that gets you ahead of the crowd for Boxing Day and the Pink Test",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: null,
      address: null,
      heroImageUrl,
      heroImageAlt: "Crowd filing into an Australian cricket stadium on a Test match day",
      heroImageCredit: "Tyson Bennett, Unsplash Licence",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: cricket.com.au CricketPlus and CricketPlus FAQs pages, cricket.com.au international schedule 26-27 presale page, cricket.com.au Golden Ticket promotion page, premiumseats.com.au MCG 2026-27 pricing reference, Cricket Australia Ticket & Entry Conditions 2024-25 (general GA/reserved mechanics, prior season). Verified 16 Aug 2026. No 2026-27 series-specific pricing published as of this date — flagged explicitly in copy.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["practical-guide", "strategy", "money-saving"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["dec", "jan"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 5 })
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
