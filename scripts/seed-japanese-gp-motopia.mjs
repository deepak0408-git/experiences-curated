// Seed: "Suzuka Circuit Park & Motopia" — experience #8/20 for Japanese
// Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - livejapan.com "Suzuka Circuit Guide: Japan's F1 Mecca & Thrilling Motopia Amusement Park"
// - suzukacircuit.jp/eng/info_s/ (official "For First Time Visitors" page)
// - easytravelfollowme.com Suzuka Circuit Park guide (attraction count, Circuit Challenger detail)

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-suzuka-circuit-park-motopia";

const bodyContent = `Suzuka isn't just a race track with a car park attached — it's built around Motopia, a genuine amusement park, and most first-time Japanese GP visitors have no idea it's there until they arrive. Knowing about it in advance changes how you plan the weekend, especially if you're travelling with family or just want somewhere to go on a non-race day.

Motopia itself has more than 30 vehicle-themed attractions covering a real age range — boats and mini-cars for younger kids, a small circuit-style coaster, an electric-cart track called Circuit Challenger, and seasonal additions like a Ferris wheel and, in summer, a full pool complex with slides. It's not a token kids' corner bolted onto the circuit; it's a proper day out in its own right.

The genuinely unmissable part for anyone who cares about the sport, though, sits inside the GP paddock area: the Honda Racing Gallery. It's a real museum covering Honda's motorsport history, with a lineup of actual F1 cars and MotoGP bikes on display — not replicas, the real machines that raced. Pair that with the Main Theater, which replays historic F1 races on a 19-metre screen with a full sensory sound system, and you get a genuine sense of what Suzuka has meant to the sport across decades, not just this one weekend.

The Circuit Challenger is the detail that separates Suzuka from almost every other F1 venue: you can drive an electric car around the actual international race circuit where the Grand Prix takes place, on non-race days. It's not the full-speed experience the drivers get, but it's a real lap of a real F1 track, something very few circuits in the world let ordinary visitors do at all.

None of this needs to happen on race weekend specifically — Suzuka Circuit Park runs independently of the Grand Prix calendar, which makes it a genuine option for a rest day before or after the race, or even a separate trip if you're building a longer Japan itinerary around the GP.`;

const whyItsSpecial = `Most F1 venues are exactly one thing — a place you go for a race weekend and nowhere else. Suzuka is different: it's a working amusement park with a real motorsport museum built into the paddock, and a track you can actually drive a lap of outside race weekend. That combination doesn't exist anywhere else on the calendar in quite the same form.

For a genuine motorsport fan, the Honda Racing Gallery and the Circuit Challenger are worth the visit on their own, race weekend or not — real cars, a real lap, at a circuit that's earned its reputation as one of the sport's most respected tracks.`;

const insiderTips = [
  "Suzuka Circuit Park operates independently of the Grand Prix calendar — a non-race-day visit (before or after the weekend) means smaller crowds at Motopia and more time in the Honda Racing Gallery without race-weekend congestion.",
  "The Circuit Challenger lets you drive an electric car around the real international circuit on non-race days — book this specifically if driving even a slow lap of an actual F1 track matters to you, since it's not available during the race weekend itself.",
];

const whatToAvoid = `Don't assume Motopia is only worth a stop if you're travelling with kids — the Honda Racing Gallery and Main Theater inside the same complex are genuine draws for any motorsport fan, independent of the amusement park attractions around them. Don't plan a Circuit Challenger lap for race weekend itself — it's a non-race-day attraction, so build it into a rest day before or after rather than assuming it runs alongside the Grand Prix sessions.`;

const practicalInfo = {
  hours: "Suzuka Circuit Park operates on its own seasonal schedule, generally 9:30am-5pm on open days — check current hours before visiting, especially around race weekend",
  costRange: "Amusement Park Passport included free with a 4-day General Admission ticket; standalone park entry and individual attraction pricing available separately",
  bookingMethod: "No advance booking required for general park entry — the Circuit Challenger and some seasonal attractions may require on-site reservation on the day.",
  website: "https://www.suzukacircuit.jp/eng/info_s/",
};

// UPDATED 22 Sep 2026 (live DB, not this const): getting_there now carries the
// full Nagoya Station -> Suzuka Circuit Ino Station route detail directly,
// per founder's instruction to put it on every in-circuit experience rather
// than only cross-referencing the dedicated Getting to Suzuka experience.
const gettingThere = "Located within the Suzuka Circuit grounds — see the dedicated Getting to Suzuka experience for full transit detail from Nagoya.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Suzuka Circuit Park & Motopia",
      subtitle: "A real amusement park, a genuine F1/MotoGP museum, and a lap of the actual circuit on non-race days.",
      slug,
      experienceType: "activity",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Suzuka Circuit",
      address: "Suzuka Circuit Park, 7992 Ino-cho, Suzuka, Mie 510-0295, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: livejapan.com Suzuka Circuit/Motopia guide, suzukacircuit.jp official visitor page, easytravelfollowme.com Suzuka Circuit Park guide (all verified 21 Sep 2026).",
      sport: ["formula_one"],
      moodTags: ["family-friendly", "motorsport-purist"],
      interestCategories: ["sport", "entertainment"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
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
