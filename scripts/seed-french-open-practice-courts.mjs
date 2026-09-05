import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "roland-garros-practice-courts-outside-courts";

const bodyContent = `A Grounds Pass is really two different experiences stacked into one ticket, and most first-timers only plan for the first one. The obvious use is watching actual matches on the outer courts, numbered 2 through 14, general admission, first-come seating. The less obvious use, and arguably the better one, is arriving before 10am and finding a spot at the practice courts where the top seeds are warming up for matches that haven't started yet.

There's no separate ticket for this. If a top-10 player is scheduled to play that afternoon, they're very likely drilling on one of the grounds' practice courts that morning, often with a crowd of a few dozen rather than a few thousand. Standing 10 metres from a player you'd otherwise watch from the upper tier of a grandstand, with no upgrade required beyond the Grounds Pass already in your pocket, is one of the genuine insider moves at any Grand Slam. Jean-Bouin, the FFT's larger nine-court training facility a few blocks from the main site, is a different story — during the tournament fortnight the entire club is privatized for player training and closed to the public, so this practice-watching happens on-grounds, not there.

Court 14 is the outside court worth specifically seeking out once the actual matches start. Inaugurated in 2018, it's semi-sunken into the Fonds des Princes extension, 2,200 seats wrapped tight around the action with standing room behind both baselines. French players actively want to be drawn here in the first week, because the crowd is loud, partisan, and dedicated to noise from the first point to the last in a way the bigger show courts rarely match. Courts 6, 7, 9, 12 and 13 run a similar close-quarters energy at a smaller scale — this is where first-round matches involving ranked professionals play out in front of audiences small enough that you can hear the players talking to themselves between points.

Grounds Pass prices start around €30 for early-round weekday passes and climb through the tournament. Access covers every outer court plus Simonne-Mathieu's upper level, practice courts, and the fan zones — everything except Chatrier and Lenglen themselves.`;

const whyItsSpecial = `Match tennis is the tennis everyone plans for. Practice tennis is the tennis nobody mentions until they've done it once and realized how good it is. A player working through serve patterns or backhand drills with their coach, twenty feet away, unguarded and unhurried, tells you more about how they actually play than a scoreboard ever does — and it costs nothing beyond the ticket you were buying anyway.

Court 14 is the outer-court argument for why the "cheap seats" at a Grand Slam aren't actually a downgrade. A sunken 2,200-seat bowl with a crowd that's decided this is their court, their player, their afternoon, produces an atmosphere that Chatrier's institutional grandeur sometimes can't match. I'd rather watch a first-round match at Court 14 with a partisan crowd screaming through every deuce than a routine straight-sets win on the main stadium court. The tennis is the same sport in both places. The experience is not.`;

const insiderTips = [
  "Arrive before 10am specifically to catch practice sessions — top seeds warming up for afternoon matches train in full public view on the grounds' practice courts, and morning arrivals routinely end up a few metres from a top-10 player with zero ticket upgrade needed.",
  "If a French player is drawn at Court 14, go — the semi-sunken 2,200-seat bowl becomes one of the loudest, most partisan rooms in the tournament, and French players specifically want to be scheduled there in week one for exactly that reason.",
];

const whatToAvoid = `Don't expect to watch practice at Jean-Bouin, the FFT's larger nine-court training facility a few blocks from the main grounds — during tournament fortnight the entire club is privatized exclusively for player training, and public access is closed regardless of Grounds Pass status; on-grounds practice courts are the only public option. And don't treat the outer courts as a consolation prize while waiting for a Chatrier ticket to free up — a Grounds Pass with no plan is a wasted morning; check which practice sessions and outer-court matches are actually scheduled that day before arriving, since the good moments (a specific player's practice slot, a loud Court 14 draw) are time-specific, not something you stumble into by wandering.`;

const practicalInfo = {
  address: "2 Avenue Gordon Bennett, 75016 Paris, France",
  website: "https://tickets.rolandgarros.com",
  hours: "Practice sessions typically run mid-morning ahead of afternoon match sessions; outer-court matches follow the daily order of play",
  costRange: "Grounds Pass from approx. €30 for early-round weekday passes, rising through the tournament — covered under the same ticket as Experience #2",
  bookingMethod: "Included with any Grounds Pass — no separate ticket needed for practice-court viewing or outer-court matches (Courts 2-14).",
  reservationsRequired: false,
};

const gettingThere = `Porte d'Auteuil (Métro Line 9) is the closest stop to the main grounds, a 10-minute walk. Practice courts and outer courts (2-14) are all within the main Stade Roland-Garros complex — no separate travel required beyond entering the grounds.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Practice Courts & Outside Courts",
      subtitle: "Ten feet from a top seed at practice, then the loudest seats in the house at Court 14",
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
      editorialNote: "Practice-court access via Grounds Pass and 10am arrival tip from gonomad.com and goaltickets.com Grounds Pass guide. Jean-Bouin privatization-during-tournament fact from tennismagazin.de. Court 14 specs (2018, 2,200 seats, semi-sunken) from rolandgarros.com 'Dramatic start for RG's new arena' and stade.rolandgarros.com courts-annexes page. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      moodTags: ["authentic", "energetic", "insider"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      budgetMinCost: "30",
      budgetMaxCost: "75",
      bestSeasons: ["may"],
      advanceBookingRequired: false,
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
