// Seed: "First-Timer's Guide to a Suzuka Race Weekend" — experience #9/20
// for Japanese Grand Prix 2027 (Suzuka).
//
// Synthesizes confirmed facts already sourced this session: Sprint weekend
// format (Fri practice/sprint quali, Sat sprint/quali, Sun race — confirmed
// via Williams F1 2027 calendar and en.wikipedia.org/wiki/2027_Formula_One_World_Championship),
// ticket tier structure, fan zones, Motopia — no new claims beyond what's
// already sourced elsewhere in this pack.
//
// CORRECTED 22 Sep 2026: this script's website/bookingMethod referenced
// japan.gp, which is an affiliate site, not the official F1 ticketing site.
// Live DB row corrected to ticketing.formula1.com/japan via
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
const slug = "japanese-gp-suzuka-first-timer-guide";

const bodyContent = `Suzuka isn't a straightforward first Grand Prix. It's remote by circuit standards, it doesn't sit inside a major city the way Singapore or Melbourne do, and 2027 adds a genuine wrinkle: this is Suzuka's first-ever Sprint weekend, so even fans who've followed the sport for years are seeing a new format here, not a routine repeat of past years.

The structure itself is worth understanding before you land. Friday covers Practice 1 and Sprint Qualifying — there's no FP2 or FP3 this year, which trips up anyone expecting the classic three-practice-session weekend. Saturday brings the Sprint race itself, followed by qualifying for Sunday's Grand Prix. Sunday is race day. That's a genuinely different rhythm from a standard weekend, with less practice time and two competitive sessions — Sprint and Grand Prix — inside three days rather than one.

Suzuka itself sits in Mie Prefecture, closer to Nagoya than to Tokyo or Osaka, and most fans base themselves in Nagoya rather than trying to stay near the circuit directly — Suzuka, Tsu, and Yokkaichi's limited hotel stock gets taken by teams and media early. Getting from Nagoya to the circuit is its own logistics question, covered in a dedicated experience, but the short version: plan the journey, don't assume it's a quick hop.

Ticketing is more layered here than at most circuits — roughly a dozen individually priced grandstands rather than a simple GA/grandstand/hospitality split, and it's genuinely worth understanding the tier structure before buying rather than picking a stand by name recognition alone. The dedicated ticket guide in this pack covers that decision in full.

Beyond the track, Suzuka Circuit itself is part amusement park — Motopia, attached to the venue, is a real day out with a genuine Honda motorsport museum inside it, worth knowing about even if you'd never normally think of an F1 weekend as including a theme park. And the free fan zones, GP Square and the West Fanzone, run throughout the weekend with driver appearances, sim racing, and enough programming to fill the real gaps a Sprint weekend's lighter Friday schedule leaves open.

None of this is complicated once it's laid out. It's just genuinely different from a standard three-day race weekend, and worth knowing that going in rather than discovering it on arrival.`;

const whyItsSpecial = `A first Suzuka trip built on assumptions from other circuits runs into real friction — a Sprint format with no FP2/FP3, a circuit that isn't walkable from a major city, and a ticket structure with a dozen individually priced grandstands instead of three or four simple tiers. None of that makes Suzuka harder to enjoy, but it does make it worth actually planning for rather than assuming it works like the last Grand Prix you attended.

Suzuka's reputation as one of the sport's most respected circuits is earned, not marketing — getting the logistics right just means that reputation is what you actually experience, instead of spending the weekend catching up on details you should have known before you arrived.`;

const insiderTips = [
  "2027 is Suzuka's first-ever Sprint weekend — if you've been to a classic three-day Suzuka weekend before, don't assume the same session rhythm; there's no FP2 or FP3 this time, and Saturday carries both the Sprint and Grand Prix qualifying. The Sprint itself is a genuine, competitive race with its own championship points on the line, not a glorified practice session — that means two real races across the weekend instead of one, and Saturday is not the day to treat as optional.",
  "Base yourself in Nagoya rather than trying to find accommodation in Suzuka itself — the town's limited hotel stock is taken early by teams and media, and Nagoya's rail connection to the circuit is well established for race weekend.",
];

const whatToAvoid = `Don't assume Suzuka's ticket structure works like a typical circuit's GA/grandstand/hospitality split — it's roughly a dozen individually priced named grandstands, and picking one by name recognition alone risks paying for a view you didn't actually want. Don't plan a tight same-day arrival for race day if you're flying in from outside Japan — Suzuka's remoteness relative to major airports means the margin for a delayed flight or missed connection is much smaller than at a circuit closer to a major hub.`;

const practicalInfo = {
  hours: "Race weekend runs Friday-Sunday, 9-11 April 2027 — exact daily gate/session times not yet published",
  costRange: "See the dedicated Ticket Guide experience for the full tier and pricing breakdown",
  bookingMethod: "Start with the official Suzuka Circuit information site for 2027 event updates, and plan accommodation in Nagoya well ahead of the race weekend.",
  website: "https://www.suzukacircuit.jp/eng/info_s/",
};

// UPDATED 22 Sep 2026 (live DB, not this const): getting_there now carries the
// full Nagoya Station -> Suzuka Circuit Ino Station route detail directly,
// per founder's instruction to put it on every in-circuit experience rather
// than only cross-referencing the dedicated Getting to Suzuka experience.
const gettingThere = "See the dedicated Getting to Suzuka and Arriving into Japan experiences for full transit and airport-choice detail.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "First-Timer's Guide to a Suzuka Race Weekend",
      subtitle: "What's genuinely different about 2027's Sprint format, the ticket structure, and where to actually base yourself.",
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
        "Synthesizes confirmed facts sourced earlier this session: Sprint format schedule (Williams F1 2027 calendar announcement, en.wikipedia.org/wiki/2027_Formula_One_World_Championship), Nagoya-as-base pattern (f1destinations.com, rakuten.com travel guides), ticket tier structure (japan.gp, verified 21 Sep 2026). No independently new claims.",
      sport: ["formula_one"],
      moodTags: ["first-timer", "planning"],
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
