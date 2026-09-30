// Seed: "Grandstand G — Suzuka's 130R Seat" — experience #3/20 for
// Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - https://www.fanamp.com/tr/japanese-grand-prix-seating-guide (Grandstand G / G-1 detail)
// - https://en.wikipedia.org/wiki/Suzuka_Circuit (130R corner description, Turn 15)
//
// CORRECTED 22 Sep 2026: japan.gp is an affiliate site, not official. Live DB
// row corrected to ticketing.formula1.com/japan via
// scripts/_fix-japan-gp-official-urls.mjs. This file is left as the
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
const slug = "japanese-gp-suzuka-grandstand-g";

const bodyContent = `130R is the corner that defines Suzuka's reputation, and Grandstand G is where you go to watch it properly. It's Turn 15 on the circuit map — a long, fast, committing left-hander taken flat or close to it in a modern F1 car, the kind of corner drivers talk about with genuine respect rather than routine description. Grandstand G sits right on it, close enough that you feel the speed difference between 130R and the tighter corners elsewhere on the lap, not just see it.

There are two real options within Grandstand G, and they're not the same product. The permanent seating section is reserved, numbered, and comes with a large screen for tracking the rest of the circuit between passes. The temporary G-1 section runs first-come-first-served instead, with basic seating that assumes you're bringing your own cushion or folding chair — a cheaper way in, but a genuinely different experience from the reserved stand, not just a budget version of it.

What you don't get from Grandstand G is a view of the chicane immediately after 130R, where most of the weekend's actual passing happens — that's Q2's territory, one stand further around the lap. Grandstand G is a pure speed-and-commitment seat: you're here to watch cars carry more speed through one corner than almost anywhere else on the calendar, not to watch overtakes unfold. That's a real, specific choice, not a lesser version of Q2 — some fans want the raw spectacle of 130R more than they want the tactical sequence at the chicane, and Grandstand G is built for exactly that preference.

If you're choosing between the two, the honest question is what you actually want to watch: the corner itself, at speed, or the consequences of that corner playing out a few hundred metres later.`;

const whyItsSpecial = `130R has a reputation among drivers that most corners never earn — a fast, committing left-hander where the car is fully loaded and there's very little margin for a mistake. Watching it from anywhere else on the circuit, you get told about that reputation. Watching it from Grandstand G, you see it: the speed differential between this corner and the rest of the lap is obvious even to someone who's never watched an F1 race live before.

It's a narrower experience than a stand like Q2, by design. You're not getting overtakes or a sequence of corners — you're getting one corner, done at a speed most of the circuit doesn't get close to, and for a genuine motorsport fan that's exactly the point.`;

const insiderTips = [
  "The reserved permanent seats and the first-come-first-served G-1 section are genuinely different products at different price points — check which one you're buying, since G-1 requires you to bring your own cushion or folding chair.",
  "Get to G-1 early if that's your option — first-come-first-served seating means the best sightlines within the section go to whoever arrives first, not whoever paid the most.",
];

const whatToAvoid = `Don't expect to see the Casio Triangle chicane or any overtaking action from Grandstand G — this seat's view is 130R itself, and the corner sequence immediately after it belongs to Q2, further around the lap. Don't buy G-1 assuming it comes with a seat the way the reserved section does — it's genuinely bring-your-own-cushion seating, and turning up without one for a full day at the circuit is a real discomfort, not a minor inconvenience.`;

const practicalInfo = {
  hours: "Gate times follow the official race-day schedule — not yet published for 2027",
  costRange: "Mid-tier bench-seating grandstand (reserved section) or budget tier (G-1, first-come-first-served) — 2026 confirmed grandstand pricing at Suzuka ran ¥22,000–¥105,000+ overall, with Grandstand G sitting in the mid/lower part of that range rather than the premium bucket-seat tier; 2027 pricing not yet released as of Sep 2026. See the Ticket Guide experience for the full range and current on-sale status.",
  bookingMethod: "Official tickets at japan.gp/en/tickets. Confirm whether you're purchasing the reserved permanent section or the first-come-first-served G-1 section before buying.",
  website: "https://www.japan.gp/en/tickets",
};

// UPDATED 22 Sep 2026 (live DB, not this const): getting_there now carries the
// full Nagoya Station -> Suzuka Circuit Ino Station route detail directly,
// per founder's instruction to put it on every in-circuit experience rather
// than only cross-referencing the dedicated Getting to Suzuka experience.
const gettingThere = "See the dedicated Getting to Suzuka experience for full transit detail from Nagoya and the circuit's rail/shuttle connections.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand G — Suzuka's 130R Seat",
      subtitle: "The corner that defines Suzuka's reputation, watched from the stand built for exactly that.",
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
        "Sources: fanamp.com Japanese GP seating guide (Grandstand G / G-1 seating detail, verified 21 Sep 2026), Wikipedia Suzuka Circuit (130R / Turn 15 layout).",
      sport: ["formula_one"],
      moodTags: ["trackside", "motorsport-purist"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
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
