import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "lakeside-festival-albert-park-" + Date.now().toString(36);

const bodyContent = `Once the cars come off the circuit each evening, Albert Park turns into a waterfront concert venue. The Lakeside Festival runs Thursday through Sunday of race week, included at no extra cost with any Park Pass or grandstand ticket — no separate ticket, no separate queue, just a walk from the track to the lakeside stage once the day's sessions wrap up.

The 2026 edition gives a real sense of the scale here: Rita Ora, Duke Dumont and Basement Jaxx headlined across the weekend, with Melbourne's own SHOUSE and Mallrat and Logic1000 filling out the undercard on the quieter early nights. The pattern held across the four days — Thursday and Friday get lower-key, often locally-flavoured support acts building the atmosphere, while Saturday (straight after Qualifying) and Sunday (closing the whole race weekend) bring the international headline names. Shows typically run from around 5pm to 8:30pm, timed to start as the day's on-track programme finishes rather than competing with it.

What makes Lakeside worth planning around rather than treating as a nice surprise is exactly that inclusion — every visitor who's bought any circuit ticket already has access, and a lot of first-time attendees don't realise the concert is there until they hear it from their grandstand seat on Saturday evening. Given Sunday's show is the closing act of the whole weekend, deciding whether to duck out early to beat the transport crush (see the Getting to Albert Park experience) or stay for the full set is a real trade-off worth thinking about before race day, not deciding on the spot at 8pm with a departure queue already building.

Exact lineups are announced in the lead-up to each year's race, typically a few weeks to a couple of months before the event — so while the acts above are the confirmed 2026 lineup, the 2027 bill hadn't been announced as of this writing and should be checked on the official Grand Prix Lakeside precinct page closer to April.`;

const whyItsSpecial = `A lot of major sporting events treat evening entertainment as an optional add-on with its own ticket and its own queue. Albert Park bakes it directly into every ticket type, which means the actual value proposition of even a basic Park Pass extends well past the chequered flag each day. That's a genuinely different way to think about race weekend — four days of racing and four evenings of a real concert lineup, for one ticket price.

The scheduling logic — quieter nights early in the week building to international headliners on Saturday and Sunday — mirrors how the racing itself builds toward the race, and it means the festival and the sport peak together rather than the entertainment feeling bolted on. For a visitor weighing whether Sunday's exit crush is worth beating versus staying for the closing headline act, that's a genuinely personal call, but it's one worth having the real schedule in front of you to make, rather than discovering the choice exists as the music starts.`;

const insiderTips = [
  "Thursday and Friday nights get lower-key, often Melbourne-based support acts and noticeably thinner crowds than the Saturday/Sunday headline nights — a good option if you want the atmosphere without the biggest crowds.",
  "Check the official Lakeside precinct page in the weeks before the 2027 race for the confirmed lineup — acts are typically announced only a few weeks to a couple of months ahead, so a lineup search too far in advance will only turn up the previous year's names.",
];

const whatToAvoid = "Don't assume Lakeside needs a separate ticket or booking — it's included with any valid Park Pass or grandstand ticket, and buying anything extra for it is unnecessary. And don't leave your Sunday-night exit decision until the music starts — weigh staying for the closing headline set against beating the departure queue (see the Getting to Albert Park experience for real wait-time figures) before the day arrives, since that trade-off is much easier to think through calmly in advance than in the moment.";

const practicalInfo = {
  hours: "Runs Thursday–Sunday of race week, 1–4 Apr 2027, typically 5pm–8:30pm each evening, timed after the day's on-track sessions conclude.",
  costRange: "Included with any Park Pass or grandstand ticket — no separate cost.",
  bookingMethod: "No separate booking required — access is included in any valid Albert Park ticket. Check the official Lakeside precinct page at grandprix.com.au/event/precincts/lakeside for the confirmed 2027 lineup closer to race week.",
  website: "https://www.grandprix.com.au/event/precincts/lakeside",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Lakeside Festival — Race Week's Concert Series",
      subtitle: "Rita Ora, Duke Dumont, Basement Jaxx headlined 2026 — a real concert bill, included with your ticket.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Albert Park Grand Prix Circuit",
      address: "Albert Park Grand Prix Circuit, 12 Aughtie Dr, Albert Park VIC 3206, Australia",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      editorialNote: "Sources: grandprix.com.au/fan-zone/news/international-stars-set-to-headline-lakeside-festival-in-2026 (official 2026 lineup announcement), themusic.com.au (full day-by-day 2026 bill: Mallrat/Logic1000 Thu, Basement Jaxx Fri, Rita Ora + Rogue Traders Sat, Duke Dumont + SHOUSE Sun), grandprix.com.au/event/precincts/lakeside (precinct page, inclusion in all ticket types, ~5-8:30pm timing). 2027 lineup not yet announced as of 20 Sep 2026 — flagged as such; used 2026 as the most recent confirmed reference. Verified 20 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "immersive"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-20",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
