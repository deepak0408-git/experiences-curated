import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "hungaroring-grandstand-" + Date.now().toString(36);

const bodyContent = `The Hungaroring Grandstand sits opposite the pit garages on the main straight, and it's the only fully covered seating at the circuit, a real distinction on a track that gets stiflingly hot in a Hungarian July and occasionally throws a sudden afternoon storm. Ahead of the 2025 race, the old stand (long known by its previous name, Super Gold) was demolished and rebuilt, and the upgrade shows.

From here you get pit lane activity, the start-finish line, and a partial view up toward Turn 1, all without needing to track a single corner in isolation the way the grandstands further round the lap do. It's the closest thing at the Hungaroring to a stand built for people who want to watch the race as a whole rather than commit to one section of track.

The top tier, sold separately as Platinum, sits centrally within the same structure and adds a slightly elevated, more direct sightline over the pit straight, along with the same weather cover as the rest of the stand.`;

const whyItsSpecial = `Most Hungaroring grandstands trade breadth for intensity, you get one corner, intensely, or a run of corners, more thinly. The Hungaroring Grandstand doesn't really do either. It gives you the pit straight, which means starts, safety car restarts, pit stops, and the closing sprint to the line, all from one seat. It's a stand for the moments that actually decide races rather than the moments that look most dramatic on a highlight reel, and being under a roof while a July storm rolls through the valley is its own quiet luxury.`;

const insiderTips = [
  "If Hungaroring weather forecasts show any chance of rain during your visit, this is the stand to prioritise, it's genuinely the only fully covered seating on the circuit.",
  "Platinum seats sell at a premium within the same stand, if budget is tight, standard Hungaroring Grandstand seating still gets you the roof and most of the same sightlines.",
];

const whatToAvoid = `Don't expect close-up corner drama here, the view is wide and pit-lane focused rather than tight on a single braking zone or apex. If you want to watch one corner intensely, T1 or the Apex Grandstand suit that better.`;

const practicalInfo = {
  hours: "Gates typically open around 8am on race day; grandstand seating is allocated and holds for the full session",
  costRange: "Premium grandstand pricing, Platinum tier commands a further premium within the same stand, check tickets.formula1.com for current-year prices",
  bookingMethod: "Book via tickets.formula1.com/en/f1-3277-hungary/24228-hungaroring. This is one of the circuit's most in-demand stands given its cover and pit-straight position, book well ahead of race weekend.",
  website: "https://tickets.formula1.com/en/f1-3277-hungary/24228-hungaroring",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Hungaroring Grandstand — The Only Covered Seat at the Track",
      subtitle: "Opposite the pit garages on the main straight, recently rebuilt, and the sole roofed grandstand on the circuit.",
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
      editorialNote: "Sources: oversteer48.com/hungaroring-grandstand, oversteer48.com/hungaroring-platinum-grandstand, gpdestinations.com/hungarian-grand-prix-hungaroring-grandstand-review. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["comfortable", "panoramic", "premium"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "splurge",
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
