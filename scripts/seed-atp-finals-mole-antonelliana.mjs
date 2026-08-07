import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-mole-antonelliana-" + Date.now().toString(36);

const bodyContent = `The Mole Antonelliana is the building every photo of Turin uses to identify the city, and its history explains why it looks nothing like a typical Italian landmark: it was originally commissioned as a synagogue in the 19th century, before the city took it over and it became something else entirely — at 167.5 metres, one of the tallest museum buildings in the world.

Today it houses the National Cinema Museum, and the building itself is arguably the bigger draw: a glass panoramic lift, 59 seconds top to bottom, climbs through the open central hall to a viewing terrace near the top, giving genuinely unbeatable views across Turin's grid of streets to the Alps beyond on a clear day.

Tickets come in three configurations — museum only, panoramic lift only, or a combined ticket covering both (around €20 combined, museum alone €16, lift alone €9 at recent pricing). The lift itself is a small cabin, 6-7 people per ride, with only one lift in operation, so queues build fast, especially on weekends — booking online in advance is worth doing specifically to skip a queue that can otherwise stretch with no shade at the entrance.

Hours run Wednesday, Thursday, Sunday, and Monday 10am-6pm, with Friday and Saturday extended to 10am-8pm — worth checking against your specific visit day, since the museum doesn't run the same hours every day of the week.`;

const whyItsSpecial = `The panoramic lift is worth treating as the actual headline experience, not an add-on to the museum — climbing through the middle of a 19th-century building originally meant to be a synagogue, in a glass cabin, to a terrace with the Alps on the horizon, is a genuinely different sensation from a standard observation deck. For a visitor whose main reason for being in Turin is the tennis, this is the single most efficient way to get real orientation on the city — one ride gives you the whole layout of Turin at once, useful for making sense of where everything else you're planning to see actually sits relative to each other.`;

const insiderTips = [
  "Book the panoramic lift ticket online in advance — the cabin holds only 6-7 people per ride and there's a single lift, so queues build quickly with no shade at the entrance.",
  "Hours differ by day: Wed/Thu/Sun/Mon 10am-6pm, Fri/Sat 10am-8pm — check the exact day you're planning to visit rather than assuming a fixed daily schedule.",
];

const whatToAvoid = `Don't skip advance booking assuming you'll walk straight in — the single-lift, small-cabin setup means unbooked queues have genuinely run long on busy days, and there's no shaded waiting area if you get caught in one.`;

const practicalInfo = {
  hours: "Wed/Thu/Sun/Mon 10am-6pm, Fri/Sat 10am-8pm",
  costRange: "Museum only €16, panoramic lift only €9, combined ticket ~€20. Free for under-5s and disabled visitors.",
  bookingMethod: "Book online in advance to skip queue — official museum ticketing site.",
  howToBook: "",
  website: "https://www.museocinema.it",
  reservationsRequired: false,
};

const gettingThere = "Central Turin, walkable from Piazza San Carlo and Porta Nuova station; served by multiple GTT bus/tram routes.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Mole Antonelliana — Turin's landmark and skyline view",
      subtitle: "A former synagogue turned cinema museum, with a glass lift to the best view of the Alps in the city",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Centro",
      address: "Via Montebello 20, 10124 Torino, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Building height, history, lift details, and pricing confirmed via italy-museum.com and littleoldworld.com, cross-checked against multiple sources for consistency. Hours from italy-museum.com. Verified 4 Aug 2026.",
      sport: [],
      moodTags: ["landmark", "views"],
      interestCategories: ["culture", "sightseeing"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-04",
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
