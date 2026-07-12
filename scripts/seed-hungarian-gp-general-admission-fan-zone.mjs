import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "general-admission-fan-zone-hungaroring-" + Date.now().toString(36);

const bodyContent = `General Admission at the Hungaroring is the cheapest way onto the grounds, an open meadow ticket with no assigned seat, no single fixed view, and the freedom to walk the hillsides that ring the circuit's natural bowl. The Hungaroring sits in a valley outside Mogyoród specifically chosen because the terrain gives spectators elevated sightlines over long stretches of track without needing a single grandstand seat, and GA tickets are how most of the crowd actually experiences that.

A GA ticket also includes access to the Fan Zone, the area near the entrance with big screens, food vendors, merchandise stalls, and usually some driver or team appearances scheduled across the weekend. It's less a single experience than a base camp, somewhere to return to between wandering the hill for viewing spots.

The tradeoff is obvious: no reserved seat means arriving early matters, and popular hillside spots near Turn 1 or the final corner fill up fast on race day. But the flexibility to move, to chase a better sightline for qualifying versus the race, to sit down when a session's quiet and stand for the laps that matter, is its own kind of value that a fixed grandstand seat doesn't give you.`;

const whyItsSpecial = `A grandstand ticket buys you certainty, one seat, one view, the same sightline for every lap. General Admission buys you the opposite: the chance to actually explore a circuit built into a natural amphitheatre, and to find your own favourite vantage point rather than have one assigned. For a first-time visitor especially, wandering the Hungaroring's hillside on a GA ticket is often how people discover which corner they'll want a proper grandstand seat for next time. It's also simply the most economical way to be inside the fence for a full weekend of a sport that's gotten expensive to watch in person.`;

const insiderTips = [
  "Arrive as early as gates allow on race day if you want a hillside spot near Turn 1 or the final corner, the most popular natural viewing areas fill up hours before lights out.",
  "Bring a portable stool or blanket, most GA viewing areas are grass banking rather than paved standing room, and Hungaroring race weekend in late July regularly hits 30°C plus.",
];

const whatToAvoid = `Don't assume every part of the GA hillside has a clear sightline, some areas look directly onto a corner while others only catch a car for a second or two before it disappears behind terrain or trackside structures. Scout your spot during a support race before settling in for qualifying or the Grand Prix itself.`;

const practicalInfo = {
  hours: "Gates typically open around 8am on race day; GA access holds for the full day across all three sessions (practice, qualifying, race)",
  costRange: "The most budget-friendly ticket tier at the circuit, check tickets.formula1.com for current-year pricing",
  bookingMethod: "Book via tickets.formula1.com/en/f1-3277-hungary. GA tickets typically remain available later than grandstand seats, but the best hillside spots are a first-come, first-served resource on the day itself.",
  website: "https://tickets.formula1.com/en/f1-3277-hungary",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "General Admission & Fan Zone — The Hungaroring's Hillside",
      subtitle: "No fixed seat, just the natural bowl the circuit sits in, plus big screens and food at the Fan Zone.",
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
      gettingThere: "Free F1 shuttle buses run from Kerepes HÉV station (reached via M2 metro to Örs vezér tere, then HÉV suburban rail) directly to Gate 3, timed to match train arrivals.",
      editorialNote: "Sources: f1hungary.com/en/general-admission-tips-4, racefans.net/f1-information/going-to-a-race/hungaroring-circuit-information. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["budget-friendly", "flexible", "communal"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-11",
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
