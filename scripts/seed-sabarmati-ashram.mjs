import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "sabarmati-ashram-" + Date.now().toString(36);

const bodyContent = `Sabarmati Ashram was Mahatma Gandhi's home and base of operations from 1917 to 1930, and it's where he lived, worked, and planned some of the most consequential moments of India's independence movement. It's a low, quiet campus of simple buildings under mature trees, right on the banks of the Sabarmati River, and it deliberately doesn't try to be grand.

Hridaya Kunj, the modest cottage where Gandhi actually lived, is the heart of the site. It's kept largely as it was: plain, spare, and small, which is itself the point. This is also where the Dandi March began in 1930, Gandhi's 24-day walk to the sea to make salt in defiance of British law, one of the defining acts of civil disobedience of the twentieth century.

Beyond the cottage, the ashram includes a memorial museum designed by the architect Charles Correa, along with a library, an auditorium, and photo galleries tracing Gandhi's life. It's a place people come to sit quietly rather than rush through, and the pace of a visit here is genuinely slower and more contemplative than most tourist stops.

Entry is completely free, with no ticket counter and no booking required, which feels appropriate for a site built around a man who preached simplicity as a matter of principle.`;

const whyItsSpecial = `Ahmedabad's Test match crowd will mostly be thinking about cricket, and this is the one stop in the city that has nothing to do with it and everything to do with why India looks the way it does today. Standing in the actual room where Gandhi lived, planned, and eventually launched the Dandi March is a different kind of experience than reading about it, quieter and more physically real than a museum built to explain history from a distance. For a trip built around a rivalry between two nations, it's worth remembering, if only for an afternoon, the much larger history that shaped one of them.`;

const insiderTips = [
  "Go in the early morning if you can — the ashram is described as most atmospheric as the sun rises over the river, and it's also the quietest, least crowded time to visit.",
  "Set aside genuine time rather than treating it as a 20-minute stop — the museum, library, and photo galleries reward slower engagement, and rushing through misses most of what makes the site meaningful.",
];

const whatToAvoid = `Don't treat Hridaya Kunj like a standard historical house-museum with rope barriers and audio guides — it's deliberately preserved as a simple, lived-in space, and the value here is in its restraint, not in elaborate exhibits. Don't schedule this as a quick stop between other sightseeing — the ashram sits on the opposite side of the city's river geography from the old city's pols and stepwells, and cramming both into one rushed half-day undersells both.`;

const gettingThere = `On the western bank of the Sabarmati River in Ahmedabad, reachable by taxi or auto-rickshaw from most parts of the city; not directly served by the metro.`;

const practicalInfo = {
  hours: "Open daily, 10:00am-6:00pm, including public holidays",
  costRange: "Free entry",
  bookingMethod: "No booking required — walk in during open hours.",
  website: "https://www.gandhiashramsabarmati.org/",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Sabarmati Ashram — Gandhi's Home on the River",
      subtitle: "The plain cottage where the Dandi March began, on the banks of the Sabarmati.",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Sabarmati Riverfront",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: gandhiashramsabarmati.org (official visitor information), Incredible India, Trawell. Google Places API lookup confirmed rating/review count same date (4.6/41,650).",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 41650,
      googleMapsUrl: "https://maps.google.com/?cid=1642601171893299619",
      sport: ["cricket"],
      moodTags: ["history", "gandhi", "riverside"],
      interestCategories: ["culture", "history"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "INR",
      bestSeasons: ["feb", "mar"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences).values({ experienceId: result.id, sportingEventId: EVENT_ID }).onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
