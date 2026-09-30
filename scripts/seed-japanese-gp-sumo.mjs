// Seed: "Watching Sumo Near Nagoya — the Real Show Worth Booking" —
// experience #17/20 for Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - sumowrestlingshow.jp/2193/ (founder-provided reference — Nagoya Basho
//   detail, Sumo Studio Osaka alternative)
// Note: Nagoya Basho (the real professional tournament) runs July — wrong
// season for an April 2027 race weekend visit. This experience honestly
// features Sumo Studio Osaka's real, year-round interactive program instead,
// explicitly distinguishing it from the Basho tournament, per skill's
// "never invent/misrepresent" sourcing rules.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-sumo-near-nagoya";

const bodyContent = `Sumo is one of those experiences a lot of visitors to Japan assume they'll need to plan a whole separate trip around, and for the real professional tournament, that's mostly true — worth being upfront about before recommending anything here.

Nagoya does host a genuine grand sumo tournament: the Nagoya Basho, a full 15-day professional event held every July at IG Arena, right next to Nagoya Castle. It's the real thing — professional rikishi competing across every division, with proper tamari ringside seats, traditional tatami box seating, and Western-style chair seating for anyone who'd rather sit in something familiar. But July is the operative word — a Grand Prix trip in April sits nowhere near this tournament's calendar, so if watching a real Basho is the goal, that's a separate trip, not something to fold into race weekend.

What does actually work for an April visit is Sumo Studio Osaka, about fifty minutes from Nagoya by train — not a tournament, but a genuine, year-round interactive program worth being clear-eyed about rather than oversold. It's a 90-minute session led by a former professional rikishi, in English, combining live demonstration with hands-on participation — you get to step onto a real dohyo yourself, not just watch from a seat. It's the honest alternative for anyone visiting outside July: a real, structured introduction to the sport from someone who actually competed, rather than a tournament seat you can't get at this time of year.

The distinction matters. This isn't a lesser version of watching the Basho — it's a genuinely different kind of experience, closer to a masterclass than a spectator event, and for a lot of first-time visitors it's arguably a better introduction to the sport's actual technique and culture than watching from a distant seat at a full tournament would be.

If your Suzuka trip happens to land in July on a future edition, plan around the Nagoya Basho properly and treat it as the real thing it is. For an April visit, Sumo Studio Osaka is the genuine, bookable option — not a consolation prize, just a different and honestly good way to actually engage with the sport.`;

const whyItsSpecial = `Most sumo content aimed at tourists either oversells a generic "sumo show" as equivalent to the real tournament, or doesn't mention the seasonal mismatch at all. Being upfront that Nagoya's actual grand tournament is a July-only event — genuinely irrelevant to an April Grand Prix trip — and then pointing to a real, honest alternative instead of a vague generic "sumo experience" is what makes this worth including at all.

Sumo Studio Osaka's format — a former professional rikishi teaching hands-on, in English, on a real dohyo — is a genuinely different and arguably more engaging way to encounter the sport than a distant tournament seat, not a downgrade dressed up as equal.`;

const insiderTips = [
  "Don't confuse Sumo Studio Osaka's interactive program with a Basho tournament experience — they're genuinely different things, and going in with the right expectation (a hands-on masterclass, not a spectator tournament) makes for a better visit.",
  "If a future trip happens to land in July, the real Nagoya Basho at IG Arena — right next to Nagoya Castle — is worth building a day around properly; it's a completely different, much bigger experience than the year-round studio program.",
];

const whatToAvoid = `Don't plan around watching the Nagoya Basho for an April race weekend trip — it's a July-only tournament, and there's no version of it running during Grand Prix week. Don't book Sumo Studio Osaka expecting a full sumo tournament atmosphere — it's an intimate, 90-minute interactive teaching session, genuinely good on its own terms, but a different kind of experience from watching professional rikishi compete.`;

const practicalInfo = {
  hours: "Sumo Studio Osaka sessions run on a scheduled basis throughout the year, roughly 90 minutes each — check current session times when booking",
  costRange: "From ¥9,600 per person for the Sumo Studio Osaka program",
  bookingMethod: "Book online in advance via Sumo Studio Osaka's official reservation system — sessions are English-language and run in fixed time slots.",
  website: "https://sumowrestlingshow.jp/",
};

const gettingThere = "Sumo Studio Osaka is roughly 50 minutes from Nagoya by train — check the studio's current location and route detail when booking, as venues for interactive programs of this kind can change.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Watching Sumo Near Nagoya — the Real Show",
      subtitle: "The Nagoya Basho is a July tournament — here's the genuine, bookable alternative for an April visit.",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Osaka",
      address: "Sumo Studio Osaka, Osaka, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Source: sumowrestlingshow.jp (founder-provided reference, verified 21 Sep 2026) — confirms Nagoya Basho is July-only (wrong season for this event) and Sumo Studio Osaka as the real, honest, year-round alternative. Explicitly distinguished from the tournament rather than conflated with it.",
      sport: ["formula_one"],
      moodTags: ["culture", "unique-experience"],
      interestCategories: ["culture", "sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-21",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
