// Seed: "General Admission — Suzuka's Roaming Ticket" — experience #5/20 for
// Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - https://www.japan.gp/en/ticket-info/general-admission-west-area (official GA West Area detail,
//   confirmed 4-day pass, all-grandstands-except-V1/V2 Friday access, Amusement Park Passport inclusion)
// - total-motorsport.com / paddockintel.com (2026 confirmed GA pricing, ~¥18,000)
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
const slug = "japanese-gp-suzuka-general-admission";

const bodyContent = `General Admission at Suzuka — officially the West Area ticket — is the cheapest way into the circuit and the most misunderstood. It isn't a single seat and it isn't a single viewing area; it's a four-day pass covering the whole Sprint weekend that lets you roam the open, unreserved areas around the circuit rather than locking you into one spot for three days straight.

The ticket includes a genuinely useful perk that a lot of first-time buyers miss: on Friday only, GA also grants entry into every named grandstand at the circuit except V1 and V2. That means a GA ticket holder can spend Friday's practice and sprint qualifying sessions sitting in two, three, even four different stands, working out which corner actually suits them, before Saturday and Sunday's sprint, qualifying, and race sessions push everyone back into the open West Area for the rest of the weekend. It's the closest thing Suzuka offers to a free trial of its grandstand seating, and it's worth planning your Friday around deliberately rather than picking a stand at random.

Beyond the circuit itself, GA also comes bundled with a four-day Amusement Park Passport, giving free rides at Suzuka Circuit Park — the Motopia theme park attached to the venue — for the whole weekend. That's a real, practical inclusion if you're travelling with family or just want something to do between sessions, not a token add-on.

What GA doesn't give you is a guaranteed sightline once the crowds fill in. The open West Area areas are unreserved, so the best vantage points along the fence lines and open terraces fill up early on the busier session days, particularly race day. If you're set on a specific view of a specific corner for the whole weekend, GA is the wrong ticket — that's what the named grandstands are for. But if you'd rather stay mobile, explore multiple parts of the circuit across four days, and keep costs down, GA is a genuinely good way to experience Suzuka, not just a fallback for people who couldn't afford a grandstand.`;

const whyItsSpecial = `Most circuits sell general admission as the "no seat, no view" option — the thing you buy if you can't afford anything better. Suzuka's version is more interesting than that, because the Friday grandstand access turns it into an actual scouting tool: you can sit in several different stands across one day and make an informed choice about where you'd want a proper seat next time, something a standard GA ticket at almost any other circuit doesn't offer.

Add the Amusement Park Passport, and GA becomes a genuinely different kind of weekend from a grandstand ticket — less about locking into one view, more about treating the whole circuit and its attached theme park as something to explore across four days.`;

const insiderTips = [
  "Plan your Friday deliberately — the all-grandstand access (except V1/V2) only applies that one day, so treat it as a real chance to compare two or three stands before Saturday and Sunday push you back into the open West Area.",
  "Arrive early on race day specifically — the West Area's unreserved viewing spots fill up fastest on Sunday, and the best fence-line positions go to whoever gets there first.",
];

const whatToAvoid = `Don't show up to the open West Area without real wet-weather gear — these viewing areas are outdoors and unsheltered, and early April at Suzuka can turn cold and wet with little warning, unlike a roofed grandstand seat. Don't assume the ground will be comfortable to sit or stand on for four days — much of the open terrace and grass viewing area has no seating at all, so bring a foldable stool or a cushioned mat if you're planning to settle in for a full session rather than stand the whole time.`;

const practicalInfo = {
  hours: "Gate times follow the official race-day schedule — not yet published for 2027",
  costRange: "From ~¥18,000 (2026 confirmed 4-day pricing; 2027 pricing not yet released)",
  bookingMethod: "Official tickets at japan.gp/en/ticket-info/general-admission-west-area. Includes a 4-day Suzuka Circuit Park Amusement Park Passport.",
  website: "https://www.japan.gp/en/ticket-info/general-admission-west-area",
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
      title: "General Admission — Suzuka's Roaming Ticket",
      subtitle: "The flexible, budget entry point — four days of open viewing, plus a Friday grandstand-scouting trick.",
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
        "Sources: japan.gp official General Admission (West Area) page (verified via direct fetch, 21 Sep 2026 — 4-day pass, Friday all-grandstand-except-V1/V2 access, Amusement Park Passport inclusion), total-motorsport.com and paddockintel.com (2026 confirmed GA pricing, cited as prior-year reference).",
      sport: ["formula_one"],
      moodTags: ["budget-friendly", "first-timer"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
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
