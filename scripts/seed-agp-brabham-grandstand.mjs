import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "brabham-grandstand-turns-1-2-" + Date.now().toString(36);

const bodyContent = `The Brabham Grandstand sits on the inside of Turns 1 and 2, directly across the circuit from the Jones Grandstand, watching cars arrive off the main straight into Albert Park's opening corners. This is where first-lap incidents happen — a pack of 20 cars still bunched together, braking hard for the first time since the lights went out, jostling for position exiting Turn 2. If you want to see the moment a race is won or lost in the opening seconds, this is one of the sharper seats on the circuit for it.

Brabham's position gives it a slight edge over Jones directly opposite: because of the angle, you can track a car for longer through the apex and out of Turn 2, rather than losing it early behind the run-off. It's not a stand built around one clean sightline the way a corner-apex grandstand elsewhere might be — it's built around watching a genuinely chaotic few seconds of racing that repeats every lap in a milder form and explodes into real drama at the start.

Named for Jack Brabham — the only driver in F1 history to win a world championship in a car of his own construction — the grandstand sits only a short walk from the main stage and Fan Zone, with food and drink vendors clustered directly behind it. That makes Brabham an easy stand to pair with a Fan Zone visit between sessions, unlike some of the more isolated grandstands further round the lake.

For 2027, Albert Park Grand Prix Corporation has moved Brabham behind a new gate: seating is reserved exclusively for Premium Members of the Albert Park Circuit Club, a membership tier introduced for this edition and sold separately from the ticket itself. A Premium Membership runs A$1,275 for an adult (A$1,020 junior), on top of the Brabham grandstand ticket at A$910-1,090 adult (A$728-877 junior) for all four days — a genuine change from previous years, when Brabham sat among Albert Park's ordinary mid-tier reserved stands with no membership requirement attached. The shift has drawn criticism in the Australian motorsport press as effectively a price hike dressed up as a loyalty tier, since fans who simply want a Turn 1/2 seat now have to buy a membership they may not otherwise want to get one.`;

const whyItsSpecial = `Most of the genuinely dramatic moments in a Formula 1 race happen in the first few seconds — cars still three-wide, brakes at their absolute limit, no space for anyone. Brabham sits at exactly the corner where that drama plays out every single lap, not just at the start. Turn 1 and Turn 2 are where positions actually get won and lost throughout the race, not just theorised about from a TV replay.

What makes Brabham the better of the two Turn 1/2 grandstands rather than just an equally-good alternative to Jones is the angle: you track cars longer through the exit of Turn 2 before they disappear from view. Combined with being one of the few grandstands genuinely close to the Fan Zone, it's a seat built for fans who want real racing action and don't want to spend their whole day walking between it and everything else Albert Park has to offer.`;

const insiderTips = [
  "Brabham's stand angle lets you track cars further through the Turn 2 exit than the Jones Grandstand opposite — a genuine, if small, edge if you're choosing between the two.",
  "This is a new-for-2027 change: until the 2026 race, Brabham was an ordinary mid-tier reserved grandstand with no membership attached. If the added Premium Membership cost isn't worth it to you, Vettel, Waite, Stewart, Senna and Albert Park's other mid-tier stands remain ticket-only at their normal price.",
];

const whatToAvoid = "Don't expect a clean single-corner sightline the way you would at a corner-apex stand further round the lake — Brabham's view covers a wide, fast-moving braking zone where cars can be several abreast, which is thrilling but harder to follow than a slower, single-file corner. And don't budget for just the grandstand ticket — as of 2027, Brabham access requires a separate Premium Membership (A$1,275 adult) bought through the Circuit Club, not the general ticketing hub, so the real all-in adult cost is closer to A$2,185-2,365 than the ticket price alone suggests.";

const practicalInfo = {
  hours: "Gates open from approximately 08:00 each day, 2–4 Apr 2027. Reserved seating applies Friday–Sunday; Thursday is unreserved circuit-wide.",
  costRange: "New for 2027: Brabham Grandstand seating is reserved exclusively for Premium Members of the Albert Park Circuit Club. Grandstand ticket A$910-1,090 adult (A$728-877 junior) for all four days, plus a separate Premium Membership fee of A$1,275 adult (A$1,020 junior) — combined adult cost A$2,185-2,365.",
  bookingMethod: "Premium Membership is purchased separately via the Albert Park Circuit Club at membership.grandprix.com.au — membership-tier sales open Thursday 1 October 2026, five days ahead of general public sale on 6 October. The Brabham grandstand ticket itself is then bought through the AGPC's official ticketing hub at grandprix.com.au.",
  website: "https://www.membership.grandprix.com.au/en/premium, https://www.grandprix.com.au/en/tickets",
  reservationsRequired: true,
};

const gettingThere = "Albert Park is a 5-10 minute walk from Melbourne's tram network (routes 1, 3, 5, 6, 16, 64, 67, 72 serve the precinct) — a free AGPC shuttle also runs from the city on event days. Brabham sits near the Turn 1/2 complex close to the Fan Zone; check your ticket for the specific gate letter, since Albert Park's perimeter gates each serve different grandstands.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Brabham Grandstand — Turns 1 & 2",
      subtitle: "First-lap drama at Turns 1 & 2 — gated for 2027 behind a new Premium Membership tier.",
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
      gettingThere,
      editorialNote: "Sources: f1-australia.com/en/ticket-info/grandstand-brabham (location opposite Jones, first-lap framing, Fan Zone proximity), oversteer48.com/brabham-grandstand/ via search summary (angle advantage over Jones). UPDATED 20 Sep 2026: membership.grandprix.com.au/en/premium (official, confirms Brabham is Premium Members-only for 2027; membership A$1,275 adult/A$1,020 junior; grandstand ticket A$910-1,090 adult/A$728-877 junior, all 4 days) and membership.grandprix.com.au/en/FAQs (membership sold separately from ticket, covers all 4 days). 7news.com.au coverage (\"Australian Grand Prix organisers under fire over new membership cash grab for 2027 ticket sales\") used for the criticism framing only, not for figures — all pricing sourced from the official AGPC membership page. AUD kept as real local pricing, not converted to USD, per currency-migration rule. Supersedes prior note, which estimated Brabham against tier2 pricing before this membership gate was known. Membership-tier sales open 1 Oct 2026, general sale 6 Oct 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "premium", "immersive"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
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
