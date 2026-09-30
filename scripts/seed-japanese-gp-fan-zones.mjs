// Seed: "GP Square & the Fan Zones — Suzuka Off-Track" — experience #7/20
// for Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - fanamp.com "The Best Fan Zones and Events at the Japanese GP 2026"
// - japan.gp/en/fan-zones-53 (official fan zone listing)
// - suzukacircuit.jp/eng/f1/event/west-fanzone.html (West Fanzone official detail)
//
// CORRECTED 22 Sep 2026: japan.gp is an affiliate site, not official. Live DB
// row's website field corrected to the official formula1.com fan zone article
// via scripts/_fix-japan-gp-official-urls.mjs. This file is left as the
// historical record of what actually ran — do not re-run it, and do not
// treat its japan.gp values below as current truth.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-suzuka-fan-zones";

const bodyContent = `A grandstand ticket gets you a seat for the sessions. It doesn't get you the rest of a Suzuka race weekend, which is where the circuit's fan zones come in — free to enter with any ticket, and genuinely worth building time around rather than treating as a walk-through on the way to your seat.

GP Square is the main hub. It's built around an official F1 stage that runs appearances from drivers and team personnel across the weekend, alongside talk shows, entertainment programming, and live performances — the closest thing Suzuka has to a central meeting point when nothing's happening on track. The Fan Forum, held on the same stage, is where the driver interviews and Q&A sessions happen, and it's a genuine chance to hear from teams directly, not just watch cars go past.

The West Fanzone is the more hands-on of the two main areas. Food and drink booths, including a dedicated Pit Bar, sit alongside F1 sim racing setups and the F1 Pitstop Challenge, where fans can try their hand at a timed pit stop. There are photo spots built around a podium replica and driver selfie boards, and the entertainment lineup runs beyond motorsport into live music and, in recent years, ninjutsu performances — a distinctly Japanese addition that doesn't show up at any other round on the calendar.

New for the 2026 season, and expected to continue into 2027, is a Ferris Wheel Fanzone inside Suzuka Circuit Park, close to the grandstands near the final corner — a genuine reason to combine a walk through the theme park with fan zone time rather than treating them as separate parts of the day.

None of this requires a separate ticket. It's included with any race weekend admission, which makes it one of the easiest ways to fill the gaps between sessions — particularly on a Sprint weekend like 2027's, where the on-track schedule across Friday and Saturday leaves real stretches of downtime that a lot of first-time visitors don't plan for.`;

const whyItsSpecial = `Most fans plan a Suzuka trip around the sessions and treat everything else as filler. That's a mistake at a circuit that puts genuine programming — driver appearances, a real Fan Forum Q&A, sim racing, a pit stop challenge — into free zones anyone with a ticket can walk into. The ninjutsu performances in particular are the kind of detail that only happens at Suzuka, a small reminder that this is a Japanese Grand Prix specifically, not a generic F1 weekend that happens to be in Japan.

For a first-timer especially, the fan zones are where the gaps between sessions stop being dead time and start being part of the weekend.`;

const insiderTips = [
  "Check the Fan Forum schedule on GP Square's stage as soon as it's published — driver Q&A sessions are timed and worth planning your between-session time around rather than discovering after the fact.",
  "The Ferris Wheel Fanzone sits inside Suzuka Circuit Park near the final corner grandstands — worth combining with a Motopia visit rather than a separate trip across the venue.",
];

const whatToAvoid = `Don't turn up to the Fan Forum stage right as a driver Q&A is about to start expecting an easy view — these are the most-attended slots in either fan zone, and a good spot means arriving well before the published time, not exactly at it. Don't assume the Ferris Wheel Fanzone will look exactly the same as 2026 — it's a new addition that's expected to continue but hasn't been officially reconfirmed for 2027 as of this writing, so treat its exact location and setup as likely rather than locked in until closer to the event.`;

const practicalInfo = {
  hours: "Fan zones typically run during circuit gate hours across the Friday-Sunday race weekend — exact 2027 hours not yet published",
  costRange: "Free with any race weekend ticket",
  bookingMethod: "No separate booking required — included with GA, grandstand, or hospitality admission. Check the official schedule closer to the event for Fan Forum driver appearance timings.",
  website: "https://www.japan.gp/en/fan-zones-53",
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
      title: "GP Square & the Fan Zones — Suzuka Off-Track",
      subtitle: "Driver appearances, sim racing, and a pit stop challenge — free programming most fans walk past.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Suzuka Circuit",
      address: "Suzuka Circuit, 7992 Ino-cho, Suzuka, Mie 510-0295, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: fanamp.com 'Best Fan Zones and Events at the Japanese GP 2026' (verified 21 Sep 2026), japan.gp official fan zones page, suzukacircuit.jp West Fanzone detail page.",
      sport: ["formula_one"],
      moodTags: ["family-friendly", "entertainment"],
      interestCategories: ["sport", "entertainment"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "event_only",
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
