import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "chepauk-stadium-" + Date.now().toString(36);

const bodyContent = `Chepauk has been Tamil Nadu's cricket ground since 1916, which makes it one of the oldest continuously used venues in the sport anywhere in the world. The first Test was played here in 1933-34, against Douglas Jardine's England, and India recorded their first-ever Test win on this ground in 1951-52. By the time you factor in the extensive 2009-2023 rebuild, glass-fronted new stands, upgraded hospitality boxes, better sightlines, the place is a genuine mix of a century of history and a fully modern stadium sitting on top of it.

The single most important fact about Chepauk for this series specifically: it's the site of the second tied Test in cricket history, India against Australia, in 1986-87. Only two Tests have ever ended tied in the sport's entire history, and one of them happened on this exact ground between these exact two countries. That's not incidental trivia for a Border-Gavaskar Trophy stop, it's close to the single most dramatic thing that's ever happened between these teams.

The pitch itself plays low and slow, and it turns, sometimes sharply, which has made Chepauk a genuine spinner's ground across generations. Narendra Hirwani took 16 wickets here on Test debut in 1988, still one of the best debut bowling performances in the format's history. Sunil Gavaskar, the trophy's namesake, scored his 30th Test century here in 1983-84, breaking Don Bradman's long-standing record for most Test hundreds at the time. Chepauk's sea breeze off the Bay of Bengal adds its own variable, cooling the ground through the day and, depending on who you ask, doing something to how the ball behaves in the evening sessions.

What locals will tell you, and what most neutral observers agree on, is that the crowd here is among the most knowledgeable in Indian cricket. This isn't a ground where casual spectators dominate the noise. Chennai's cricket public has been watching Test cricket on this exact patch of ground for close to a century, and it shows in how they read a session.`;

const whyItsSpecial = `Nagpur opens this series with a pitch that's decided matches fast in recent history. Chepauk offers something different: a ground with actual weight of history behind the rivalry itself, not just the current squads. A tied Test between India and Australia is one of only two in the sport's entire history, and it happened here. Add a spin-friendly, sea-breeze pitch and arguably the most informed crowd in Indian cricket, and this stop isn't just the second Test of five, it's the one most likely to be argued about for decades afterward, the way the 1986 game still is.`;

const insiderTips = [
  "Ask a local about the 1986 tied Test before the match starts — Chennai's cricket crowd treats it as a point of civic pride, and it's a genuine conversation-starter with the people sitting around you.",
  "The sea breeze off the Bay of Bengal tends to pick up through the afternoon session and is widely believed locally to affect swing and spin in the evening — bring a layer even in January heat, evenings cool down noticeably once it sets in.",
];

const whatToAvoid = `Don't expect Chepauk's modern stands to mean modern-stadium anonymity — this remains a ground where longtime members and local cricket families hold generational seats, so don't be surprised if the atmosphere around you feels more like a shared local institution than a neutral corporate venue. Don't assume the pitch will behave like Nagpur's just because both are said to favour spin — Chepauk's turn is typically slower and lower, a genuinely different bowling challenge than Jamtha's, not an interchangeable "spin-friendly" label.`;

const gettingThere = `Chepauk sits in central Chennai, close to Triplicane and Marina Beach; see the dedicated Getting to Chepauk experience in this pack for full transit detail.`;

const practicalInfo = {
  address: "M. A. Chidambaram Stadium, Wallajah Road, Chepauk, Chennai, Tamil Nadu 600005, India",
  costRange: "General admission from roughly ₹1,200 up to ₹30,000 for VIP boxes on recent IPL/international fixtures; 2027 Test pricing not yet announced",
  bookingMethod: "Tickets released via BookMyShow, Paytm Insider, or Tamil Nadu Cricket Association's own channels closer to the match — India-Australia Tests here have historically sold out quickly.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Chepauk — Cricket by the Bay of Bengal",
      subtitle: "A century-old ground, a sea breeze, and the only tied Test India and Australia have ever played.",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Chepauk",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: ESPNcricinfo ground page, Wikipedia (MA Chidambaram Stadium), IceCric/TheCricketSamrat pitch reports. Google Places API lookup confirmed rating/review count same date (4.5/25,374).",
      googleMapsRating: "4.5",
      googleMapsReviewCount: 25374,
      googleMapsUrl: "https://maps.google.com/?cid=4925595476370681061",
      sport: ["cricket"],
      moodTags: ["history", "spin-friendly", "second-test"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "INR",
      bestSeasons: ["jan", "feb"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences).values({ experienceId: result.id, sportingEventId: EVENT_ID }).onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
