import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

// Rewrite of the archived "T1 Grandstand" experience (16 Oct 2026), part of
// the grandstand-experience restructure following the Ticket Intelligence
// build. Real sector/row detail sourced from oversteer48.com's dedicated T1
// review, corroborating and extending the existing published "Where to Sit"
// comparison piece's own T1 section, which this experience now supersedes
// as the standalone T1 write-up. Pricing grounded in this event's own
// seeded planner_ticket_tier_cost (tier3, $540-799).
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "t1-grandstand-piquet-corner-" + Date.now().toString(36);

const bodyContent = `Nelson Piquet passed Ayrton Senna around the outside here, sideways, on lap 68 of the very first Hungarian Grand Prix in 1986 — a race that drew 200,000 spectators from across the Eastern Bloc and held the F1 attendance record for nearly a decade. The corner carries his name officially now, part of F1's 2025 naming of every Hungaroring turn, and the T1 grandstand sits right on top of it, on the outside of the circuit at the end of the start-finish straight.

This used to be called Gold 4, renamed T1 as part of the same reconstruction that rebuilt the main grandstand. Ten sections, lettered A through K with no I, paired off with a stairwell between each pair, rows running 1 at the front to 26 at the back. Section A sits furthest from the pit lane, directly in line with Turn 1's apex — row 15 and above there gives a genuinely elevated view of the corner, high enough to watch a car's full line through braking, turn-in, and exit without losing it behind the car in front. Section K sits at the opposite end, closer to the pit lane and start-finish line, trading some of that apex-level intimacy for a wider read on what's happening down the straight.

The reason this stand gets booked out fast isn't just the history. Turn 1 is genuinely the one corner on this track where a pass reliably happens — the Hungaroring is famously one of the hardest circuits on the calendar to overtake on, and most of the real action compresses into this single braking zone on lap one and then stays scarce until the pit stops shuffle things later. Sit here and you're watching the moment most of the field actually decides its race, not hoping one might happen to arrive in your corner of the track.

It isn't covered — the rebuilt main grandstand down the straight is the only roofed seat at the Hungaroring — so a Hungarian July storm will find you here the same as everywhere else that isn't Hungaroring or Hungaroring Platinum. What you trade for that is proximity to the single sharpest piece of racing the circuit reliably produces, and a seat with real first-lap stakes even in years when the rest of the race goes quiet.`;

const whyItsSpecial = `Most of a Hungaroring weekend is watching cars hold position through a technical, hard-to-pass circuit. Turn 1 is the exception, and it's not subtle about it — this is where overtakes that actually stick tend to happen, lap one most reliably, but realistically any lap if a gap opens under braking. Sitting here means your seat has genuine stakes attached to it rather than hoping the race comes to you.

There's also a real sense of standing where it already happened once. Piquet's pass on Senna in 1986 is the single most replayed moment in this circuit's history, and the corner's own name now makes that explicit rather than a piece of trivia you'd have to already know. Watching modern cars brake into the same asphalt that produced it is a specific kind of pleasure that a lot of grandstands at a lot of circuits simply can't offer, because most corners don't have a story this good attached to them.`;

const insiderTips = [
  "Section A, row 18, seat 1 is a genuinely strong individual pick if it's available — high enough for a clean, elevated sightline straight down the apex, favoured by at least one circuit reviewer specifically for filming the corner.",
  "If you want to see the second half of the pit straight and pit lane exit in the same glance as Turn 1 itself, book Section K rather than A — you trade some apex intimacy for a wider read on the race.",
  "This stand sells out quickly on the official site most years — treat the on-sale date as a real deadline if Turn 1 specifically is the point of your trip, not a date to circle back to later.",
];

const whatToAvoid = `Don't expect a view much beyond the corner itself — sightlines fade out toward Turns 17 and 18 on either side, so this isn't a stand for following a long stretch of track, just this one braking zone and its immediate approach. And don't assume every section gives the same angle on it: Section A is genuinely apex-level and intimate, Section K is wider and further from the actual passing line, and picking the wrong one for what you actually want to watch is an easy, avoidable mistake once you know the difference exists.`;

const practicalInfo = {
  hours: "Gates typically open around 8am on race weekend days; grandstand seating holds for the full day once sessions begin",
  costRange: "Roughly US$540 (3-day), the top of this event's standard-grandstand pricing tier, just below the covered main grandstand",
  bookingMethod: "Book via the official reseller gpticketshop.hu or tickets.formula1.com. T1 is one of the circuit's fastest-selling grandstands given its genuine overtaking reputation — book well ahead of race weekend.",
  website: "https://www.gpticketshop.hu, https://tickets.formula1.com/en/f1-3277-hungary",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "T1 Grandstand — Where Hungaroring Races Get Decided",
      subtitle: "Turn 1, officially Piquet corner since 2025, and still the one place on this circuit where overtakes reliably stick.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Hungaroring, Mogyoród",
      address: "Hungaroring, 2146 Mogyoród, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "M2 metro to Örs vezér tere, then HÉV suburban rail toward Kerepes, then the free circuit shuttle to Gate 8 — the grandstand's own nearest entrance.",
      editorialNote: "Sources: oversteer48.com's T1 grandstand review (sector/row layout, best-seat picks, former Gold 4 name), confirming and extending facts already published in 'Where to Sit — T1, Apex, or the Covered Grandstand'. F1's 2025 Hungaroring corner-naming announcement (motorsport.com, f1.com) confirms Turn 1's official name as Piquet. Pricing grounded in seeded planner_ticket_tier_cost tier3 row for this event. Verified 16 Oct 2026.",
      sport: ["formula_one"],
      moodTags: ["intense", "historic", "front-row"],
      interestCategories: ["sport"],
      pace: "intense",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-10-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
