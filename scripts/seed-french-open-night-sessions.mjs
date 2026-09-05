import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "roland-garros-night-sessions";

const bodyContent = `Night play at Roland-Garros only exists because the roof does. Before Court Philippe-Chatrier's 2020 renovation, every match was a daylight match, weather permitting, and "permitting" was doing a lot of work in a city where late-May rain is closer to routine than exception. The retractable roof changed that. Now Chatrier hosts a genuine evening session, roof closed, lights up, one match only, guaranteed to be played regardless of what the sky is doing outside.

Gates open at 6:30pm; play doesn't start before 8:15pm. That gap matters — it's not a rushed evening add-on to the day's schedule, it's a separate session built around a single, deliberately chosen match, almost always the day's most anticipated pairing. Where a day session on Chatrier can run through up to three matches back to back, the night session commits the entire evening to one. The tournament picks that match to matter, and the crowd behaves accordingly.

The roof closing for night play does something to the room that's hard to predict from outside. Clay-court tennis is usually an outdoor, open-sky experience — the roof enclosure turns Chatrier into something closer to an arena, sound bouncing back off steel instead of dissipating into the evening air. Combined with stadium lighting replacing daylight and a crowd that's paid a premium specifically for this one match, the atmosphere runs noticeably more intense than an afternoon session on the same court.

A night session ticket includes the numbered Chatrier seat for the match plus access to outside-court open seating for anything still playing elsewhere on the grounds that evening — though realistically, once the night match starts, that's where everyone's attention goes. Prices sit at a premium over day sessions for the same court, and tickets move through both the official Roland-Garros channels and, closer to the date, secondary marketplaces once the actual matchup is known and demand becomes clearer.`;

const whyItsSpecial = `Day tennis and night tennis are, emotionally, different sports played on the same court. A day session has rhythm and rotation — one match ends, another begins, the crowd's attention resets each time. A night session is built entirely around anticipation for a single match that the tournament has decided deserves the whole evening, and everyone in the building knows it before a ball is struck.

The roof is what actually makes this possible, and it's worth sitting with that for a second: clay-court tennis under a closed roof, at night, lit artificially, muffled and intense, simply didn't exist at Roland-Garros before 2020. It's the newest experience this 99-year-old tournament has ever created, layered onto its oldest court. Watching a five-set battle unfold under that roof, crowd noise with nowhere to go but back down onto the court, is Roland-Garros doing something it genuinely couldn't do a decade ago.`;

const insiderTips = [
  "The tournament schedules exactly one match per night session on Chatrier, chosen specifically for its appeal — check the daily order of play as soon as it's released (usually the evening before) to know which match you're actually buying into.",
  "Gates open at 6:30pm but play doesn't start until 8:15pm at the earliest — arriving right at gate-open gives time to watch whatever's still finishing on outside courts before the main event, rather than sitting in an empty Chatrier for 90 minutes.",
];

const whatToAvoid = `Don't buy a night session ticket expecting multiple matches — unlike day sessions, which can run up to three matches on Chatrier, a night session is built around exactly one, and if that match ends in straight sets in under two hours, there's no second match to fall back on. And don't assume night sessions run every day of the tournament — they're a limited, specifically scheduled feature on certain days, not a nightly fixture, so check the official calendar before planning a trip around one.`;

const practicalInfo = {
  address: "2 Avenue Gordon Bennett, 75016 Paris, France",
  website: "https://tickets.rolandgarros.com/en/decouvrir-nos-offres/a-la-journee/court-philippe-chatrier-soiree",
  hours: "Gates open 18:30; play starts no earlier than 20:15",
  costRange: "Premium pricing over equivalent day-session Chatrier tickets — exact 2027 figures not yet published",
  bookingMethod: "Book via tickets.rolandgarros.com once the night-session schedule is released, typically alongside the main draw. Secondary marketplaces list night-session tickets once matchups are confirmed, at a premium reflecting demand for that specific match.",
  reservationsRequired: true,
};

const gettingThere = `Same access as day sessions: Porte d'Auteuil (Métro Line 9) is the closest stop, a 10-minute walk. Evening sessions mean a later Métro return — check last-train times for your line before committing to staying through a full five-set night match.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Night Sessions at Roland Garros",
      subtitle: "One match, under a closed roof, in the tournament's newest and most intense format",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "16th arrondissement / Porte d'Auteuil",
      address: "2 Avenue Gordon Bennett, 75016 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Night session format (single match, 18:30 gates/20:15 play, roof closed) from official tickets.rolandgarros.com night-session ticket page. Corroborated via goaltickets.com listings. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      moodTags: ["electric", "intense", "premium"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      bestSeasons: ["may"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: FRENCH_OPEN_EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "→", result.slug, `(${result.status})`);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
