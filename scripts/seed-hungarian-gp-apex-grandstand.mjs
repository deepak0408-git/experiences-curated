import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "apex-grandstand-hungaroring-" + Date.now().toString(36);

const bodyContent = `Turn 14 is the long, drawn-out right-hander that closes the Hungaroring lap, and it matters more than a final corner usually does. Get the line and the exit speed wrong here and you lose the tow into Turn 1, the one place on the circuit where overtaking is still realistic. Get it right, and you arrive at the start-finish straight with enough pace to threaten the car ahead into the very corner covered by the T1 Grandstand.

The Apex 1 and Apex 2 grandstands sit right on this corner, and the difference between them is worth knowing before booking. Apex 1, closer to the apex, gives a tight view of the corner itself and, from the right seats, a long look down the main straight. Apex 2 sits further back with a wider view of the whole closing sequence, but loses the cars from sight the moment they exit onto the straight.

Either way, this is a stand built around anticipation rather than the corner itself, watching a car set up its exit knowing that what happens in the next four seconds decides whether the driver in front spends the next lap defending.`;

const whyItsSpecial = `A lot of final corners on the calendar are afterthoughts, tracks people barely remember once the podium's decided. Turn 14 isn't, because it's directly wired to Turn 1's overtaking chances. A good final corner here doesn't just look tidy, it's a tactical setup for the entire next lap. Watching from the Apex grandstand means watching cause and effect in real time: the exit you see here is the pass (or non-pass) you'll see moments later, just out of view, at Turn 1.`;

const insiderTips = [
  "If you can choose your exact seat, ask for Apex 1 rather than Apex 2 if you want to keep the cars in view as they cross onto the main straight, Apex 2's sightline cuts off right at the corner exit.",
  "Pair this stand mentally with T1, if you're doing a multi-day trip and can afford two different grandstand days, watching the final corner one day and Turn 1 the next gives you both halves of the same tactical picture.",
];

const whatToAvoid = `Don't book Apex 2 expecting to track cars onto the straight, the search results are clear that this stand loses sightline right at the corner exit. If following the car through and past the corner matters to you, prioritise Apex 1.`;

const practicalInfo = {
  hours: "Gates typically open around 8am on race day; grandstand seating is allocated and holds for the full session",
  costRange: "Mid-tier grandstand pricing, check tickets.formula1.com or f1hungary.com for current-year prices",
  bookingMethod: "Book via tickets.formula1.com/en/f1-3277-hungary. Apex 1 and Apex 2 are priced and sold separately, check the seat plan before choosing, the view difference between them is significant.",
  website: "https://tickets.formula1.com/en/f1-3277-hungary",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Apex Grandstand — The Corner That Sets Up Turn 1",
      subtitle: "Turn 14's final right-hander, where exit speed here decides whether tomorrow's overtake at Turn 1 happens.",
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
      editorialNote: "Sources: oversteer48.com/hungaroring-apex-1-grandstand, gpdestinations.com/hungarian-grand-prix-apex-1-2-grandstands-review, enterf1.com/races/where-to-sit.php. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["tactical", "high-stakes", "technical"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
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
