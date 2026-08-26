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

const DESTINATION_ID = "55f26c1e-adb3-46ba-aaf7-997585ed25a5"; // Sydney
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "scg-fourth-test-sydney-summer-" + Date.now().toString(36);

const imageKey = "experiences/hero/SCG Fourth Test Sydney Summer.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - SCG Fourth Test Sydney Summer.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `The SCG turns pink for this one. Since 2009 the ground's January Test has doubled as the Pink Test, raising money for the McGrath Foundation's breast cancer nurses, and this fixture — the last of the four-Test series, 4-8 January 2027 — carries that tradition regardless of who's playing. Members' Stand ushers wear pink, the outfield gets a pink ring painted into the grass on the third day, and the evening before play usually brings a fan walk and street performance outside the gates that's become its own minor Sydney institution.

Test cricket has been played here since February 1882, when Australia beat England by five wickets in the ground's first Test. It's since hosted 113 Tests, more than anywhere in Australia bar the MCG, and the record books read like a highlight reel: Michael Clarke's 329 not out against India in 2012 is still the highest individual score at the ground, and Shane Warne played his first Test here in 1992 and his last in 2007, taking his 300th Test wicket on this square along the way. The most recent redevelopment, finished in 2014 at a cost of $197.5 million, brought capacity to 48,000 without touching the heritage-listed Members' and Ladies' Stands on the northern side — still the oldest continuously used stand in world Test cricket.

New Zealand's history at the SCG carries a sting. The 1985-86 tour remains New Zealand's only series win on Australian soil, sealed 2-1 through Richard Hadlee's 15-wicket match haul at Brisbane and a strong follow-up at Perth — but Sydney was the one Test in that series Australia actually won, chasing down 260 on a wearing SCG pitch in the middle match. That's the pattern this ground tends to produce: true and fast for seam bowling across the first two days, then cracks open and the ball starts turning hard from around day three, which is exactly the kind of surface that turned that 1986 chase in Australia's favour.

Moore Park light rail is the easiest way in. Trains run from Central Station roughly every five minutes, the ride itself takes about five minutes, and the Moore Park stop drops you within a short walk of the gates on Driver Avenue. It's a considerably smoother trip than trying to drive and park around Moore Park on a Test match day, when the surrounding streets fill fast and parking is limited.`;

const whyItsSpecial = `Every ground on this tour has history, but the SCG is the only one where New Zealand's history here is genuinely mixed. The 1985-86 tour is still the high-water mark for Black Caps cricket in Australia — their only series win on this soil — and Sydney was the one Test that got away in it, a pitch that wore exactly the way SCG pitches do and handed Australia a chase they shouldn't have got. That tension, a ground that's produced New Zealand's best series and one of its nearest misses in the same tour, is worth knowing walking in. Layer the Pink Test on top of it — a fixture with real weight behind it regardless of who's on the field, ushers in pink, a repainted outfield ring, a crowd that's there for more than the cricket — and this is the Test on the tour where the occasion is doing as much work as the contest. Four days into a five-day match on a pitch that's just started to turn is when this ground is at its most itself.`;

const insiderTips = [
  "Book Moore Park light rail from Central Station rather than driving — services run roughly every 5 minutes and the ride itself is about 5 minutes, considerably faster than fighting for street parking around Moore Park on match day.",
  "If you want to see the pitch at its most SCG-like — turning, cracked, a genuine fourth-innings contest — day four or five is the one to prioritise over the earlier days, when the surface plays truer and faster.",
];

const whatToAvoid = "Don't assume this fixture is a routine Test — it's the SCG's annual Pink Test, which draws a bigger and more mixed crowd than a standard Test day, including many people there primarily for the McGrath Foundation cause rather than the cricket itself, so book early if a purely cricket-focused, quieter day matters to you. Avoid trying to drive in and find street parking around the ground on the day — Moore Park's surrounding streets are heavily congested on match days and the paid parking that does exist fills early, making the light rail the genuinely faster option even for those who'd normally default to driving.";

const practicalInfo = {
  hours: "Gates typically open around 2 hours before play; Test day play generally runs approximately 10:30am-5:30pm local time (Sydney summer), subject to official scheduling closer to the match",
  costRange: "General admission typically from around AU$40-60 per day; Reserved seating higher — no 2026-27 series-specific pricing published yet",
  bookingMethod: "Tickets via cricket.com.au or Ticketek once the international season allocation opens. General admission and Reserved Grandstand are the two public tiers — see the separate Ticket Guide and SCG Luxury experience for hospitality options.",
  howToBook: "",
  website: "https://www.sydneycricketground.com.au, https://www.cricket.com.au/tickets/venues/sydney-cricket-ground",
  reservationsRequired: false,
};

const gettingThere = "Light rail: Moore Park stop on the L2/L3 Randwick Line, reached from Central Station in about 5 minutes with services roughly every 5 minutes, then a short walk to the gates on Driver Avenue. Bus: route 355 also serves Moore Park. Address: Driver Avenue, Moore Park NSW 2021.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "SCG — The Fourth Test, Sydney in Summer",
      subtitle: "New Zealand's only series win in Australia came in 1985-86 — and they lost this ground that tour",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Moore Park",
      address: "Driver Avenue, Moore Park NSW 2021, Australia",
      heroImageUrl,
      heroImageAlt: "Sydney Cricket Ground members' pavilion and stands during a Test match",
      heroImageCredit: "David Molloy (davidmolloyphotography.com), CC BY 2.0 (Wikimedia Commons)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: Wikipedia (Sydney Cricket Ground), ESPNcricinfo SCG records page, McGrath Foundation Pink Test history pages, thecricketmonthly.com/Wisden 1985-86 NZ tour of Australia coverage, Transport NSW Moore Park transport page, cricketnsw.com.au 2026-27 fixtures release. Verified 16 Aug 2026. No 2026-27 series ticket pricing published as of this date.",
      googleMapsRating: "4.5",
      googleMapsReviewCount: 8130,
      googleMapsUrl: "https://maps.google.com/?cid=5995758790797321448",
      sport: ["cricket"],
      moodTags: ["iconic-venue", "heritage", "atmosphere"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["jan"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 4 })
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
