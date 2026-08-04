import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-zone4-walkabout-" + Date.now().toString(36);

const bodyContent = `Zone 4 Walkabout is the cheapest way to attend the Singapore GP, and it trades a seat for freedom to roam. There's no fixed spot, instead you get access to raised viewing platforms at two real vantage points: Turn 13 on Esplanade Drive, where cars are at full acceleration, and Turn 14 near the Jubilee Bridge, sitting right in the braking zone at the end of a long DRS run where overtaking happens often. Both platforms are genuinely trackside, not distant general-admission fencing.

None of the platforms have seating. Some viewing spots let you sit on Friday and Saturday if crowds are light, but by Sunday it's standing room only, and the accounts from people who've done it describe tens of thousands of steps and up to eight hours on your feet across a race day. Comfortable, broken-in shoes aren't optional here.

Big screens are placed opposite several grandstands and platforms so you don't lose the wider race even when the cars aren't in front of you, and the official F1 Singapore app marks which viewing platforms have a screen in sightline, worth checking before you commit to a spot for the session. Zone 4 also includes full access to the Padang Stage and its headline concerts, plus food and merchandise throughout the zone, so a walkabout day genuinely combines racing and festival without needing a separate ticket for either.

The real limitation is that Zone 4 access is Zone 4 only, you can't wander into Zones 1-3 the way a Premier Walkabout ticket allows. If a specific corner outside Turns 13-14 matters to you, this isn't the ticket, a grandstand or the pricier Premier tier will get you there instead.`;

const whyItsSpecial = `Zone 4 Walkabout is honest in a way a lot of general admission tickets aren't; it doesn't pretend to be a premium seat, and it doesn't need to. Turn 14's braking zone produces real overtaking, Turn 13 shows cars at genuine speed, and the freedom to move between platforms means a slow session doesn't trap you in a bad sightline the way a fixed grandstand seat can. What I'd tell a first-timer on a budget: this ticket gets the racing and the entire Padang Stage lineup for less than a single mid-tier grandstand, provided you're prepared to be on your feet, no seat, for most of the day. That trade is worth making with your eyes open, not discovered halfway through Saturday.`;

const insiderTips = [
  "Use the official F1 Singapore app to check which viewing platforms have a big screen in sightline before settling in for a session — not every platform does.",
  "Arrive earlier on Sunday specifically if you want any chance of sitting during quieter stretches — by the final day, most Zone 4 platforms are standing room only.",
];

const whatToAvoid = `Don't buy Zone 4 expecting Zone 1-3 access — it's genuinely restricted to Zone 4's own platforms (Turns 13-14) and stages, not a discount route into the rest of the circuit. And don't underestimate the physical side: this is a full standing day with significant walking between platforms, not a casual stroll-and-watch experience.`;

const practicalInfo = {
  hours: "Race weekend sessions Friday–Sunday, 9–11 Oct 2026, into the evening",
  costRange: "S$198 Friday, S$298 Saturday, S$368 Sunday, or S$548 for 3-day (2026 pricing, subject to availability)",
  bookingMethod: "Book via singaporegp.sg or tickets.formula1.com under general admission walkabout tickets. 3-day and Sunday passes tend to sell out first.",
  howToBook: "",
  website: "https://singaporegp.sg/en/tickets/general-tickets/walkabouts/zone-4-walkabout/, https://tickets.formula1.com/en/f1-3301-singapore",
  reservationsRequired: false,
};

const gettingThere = "Zone 4 access via Gates 3A, 4, 5, 6, or 7. Nearest MRT: Promenade or Esplanade.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Zone 4 Walkabout — the honest budget ticket",
      subtitle: "No seat, real racing at Turns 13-14, and the whole Padang Stage lineup for the lowest price at the race",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "Zone 4, Marina Bay Street Circuit, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from oversteer48.com Zone 4/Premier Walkabout comparison, singaporegp.sg official Zone 4 page, and general search results on app features and crowding. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "festival"],
      interestCategories: ["sport"],
      pace: "intense",
      physicalIntensity: 4,
      budgetTier: "budget",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-01",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
