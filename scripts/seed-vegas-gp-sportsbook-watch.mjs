import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-sportsbook-watch-" + Date.now().toString(36);

const bodyContent = `Not every real way to experience the Las Vegas Grand Prix requires a circuit ticket. Circa Resort & Casino, downtown on the Fremont Street Experience, runs a free Red Bull Watch Party at Stadium Swim during race weekend — no admission cost, watching the Grand Prix on a three-story, 78-million-pixel screen across six heated pools with private cabanas, water couches, daybeds, and VIP lounge chairs available depending on how much you want to spend beyond the free entry. Circa markets itself as home to the world's largest sportsbook, and Stadium Swim was purpose-built as a pool-meets-arena format specifically for watching sports at scale — this isn't a bar with a TV, it's infrastructure designed around exactly this kind of event.

Outside race-day watch parties, several Strip properties run their own F1-adjacent viewing experiences throughout the weekend. The Venetian's Grand Canal Shoppes hosts watch parties at several of its restaurants during race week. Wynn Las Vegas has run its own "Ultimate Race Week" packages built around premier race viewing and exclusive events. Caesars Palace runs viewing setups across its sportsbook, convention spaces, and select restaurants. None of these require a grandstand ticket — they're a genuine alternative for anyone who wants to be part of race weekend's atmosphere without paying circuit prices, or who's already spending the day elsewhere and wants to catch a session without leaving the Strip.

Circa's free watch party specifically stands out for cost: it's a genuinely no-admission way to watch the race in a setting built for exactly that, at a downtown property that already offers real value on rooms during race weekend (see the off-Strip accommodation pick elsewhere in this pack).`;

const whyItsSpecial = `Most guides to a Grand Prix assume you're either at the track or you're not really part of the weekend. Las Vegas breaks that assumption completely — Circa built an entire venue around the premise that watching sports at scale, outside a stadium, can be its own real event, and the fact that it's free during race weekend specifically makes it a genuine alternative rather than a consolation prize. I'd point anyone on a tight budget, or anyone who's already spending their ticket money on a grandstand seat for one day and wants a second, cheaper way to be part of the weekend on another day, straight to Stadium Swim before any Strip sportsbook.`;

const insiderTips = [
  "Standard Stadium Swim entry runs from around $25 on non-race days, but the Red Bull Watch Party during Grand Prix weekend has historically waived that fee entirely — confirm current admission terms close to the date, since race-specific promotions can change year to year.",
  "Cabanas, water couches, and VIP lounge seating at Stadium Swim cost extra even when general admission is free — decide in advance whether you want a premium spot or are happy with general pool-deck access before arriving, since the best premium spots book out fastest on a big watch-party day.",
];

const whatToAvoid = `Don't assume every Strip property's "watch party" offers the same free, purpose-built viewing experience Circa does — some Strip venues' race-viewing setups are smaller, ticketed, or tied to a specific restaurant reservation rather than open pool-deck access, so check the specific format before planning around it. Don't leave arrival to the last minute on race day expecting easy entry — even with free admission, a genuinely popular free watch party at a purpose-built venue can reach capacity, and downtown's Circa in particular tends to draw a real crowd for its marquee sports watch parties.`;

const practicalInfo = {
  hours: "Stadium Swim watch party runs during scheduled race sessions, confirm exact hours closer to race weekend; standard Stadium Swim hours vary seasonally",
  costRange: "Free admission for the Grand Prix watch party (standard non-event entry from approximately US$25); premium cabana/lounge seating extra",
  bookingMethod: "No advance booking required for general admission to the free watch party. Premium cabana and lounge seating can be reserved directly via circalasvegas.com.",
  howToBook: "",
  website: "https://www.circalasvegas.com/stadium-swim/, https://www.circalasvegas.com/victory-lap-race-weekend/",
  reservationsRequired: false,
};

const gettingThere = "Circa Resort & Casino, downtown on the Fremont Street Experience, roughly 10 minutes by car or an hour's walk from the Strip circuit. The 24/7 Monorail during race week connects downtown to Strip stations near the circuit.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Watching From a Sportsbook — Circa's Stadium Swim",
      subtitle: "Free admission, a 78-million-pixel screen, six pools — race weekend without a circuit ticket",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Fremont Street / Downtown",
      address: "8 Fremont St, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from circalasvegas.com official Stadium Swim and Victory Lap Race Weekend pages, gamingamerica.com Red Bull Watch Party coverage, lasvegasnightclubs.com Stadium Swim guide. Google rating reused from prior Places API (New) direct lookup 29 Aug 2026 (same session, same venue as the off-Strip hotels experience): Circa Resort & Casino 4.5/13,406 reviews. Verified 29 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["social", "value"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-29",
      googleMapsRating: "4.5",
      googleMapsReviewCount: 13406,
      googleMapsUrl: "https://maps.google.com/?cid=6006901985708148596",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
