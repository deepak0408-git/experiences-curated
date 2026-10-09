import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "deekshabhoomi-" + Date.now().toString(36);

const bodyContent = `On 14 October 1956, Dr. B.R. Ambedkar and roughly half a million followers converted to Buddhism together in Nagpur, in what's generally regarded as the largest mass religious conversion in modern history. Ambedkar chose Nagpur deliberately: it was the historical homeland of the "Nag" people associated with early Buddhism in India, and he wanted the ceremony to connect back to that lineage rather than start from nothing. He administered the Three Jewels, the Five Precepts, and his own 22 vows to the crowd that day, and the event is now marked annually as Dhammachakra Pravartan Din.

The memorial standing on the site now, Deekshabhoomi, wasn't built until 2001. It's a genuinely striking structure: modelled on the ancient stupa at Sanchi but, unlike its inspiration, completely hollow inside, built from Dhaulpur sandstone, granite, and marble, and rising 120 feet with room for 5,000 monks across two internal levels. It's regularly described as the largest hollow stupa in the world, and the engineering behind that hollow upper dome, a central locking system used for the first time in Asia on a structure like this, is a real point of pride for the site rather than incidental detail.

Ambedkar's ashes are enshrined inside, which is part of why this is treated as consecrated ground rather than a monument to look at from a distance. Entry is free, there's no ticket booth, and it draws a steady flow of visitors and pilgrims year-round, not just on the anniversary. For anyone in Nagpur for the Test, it's a genuinely significant half-day stop, a piece of modern Indian history that has almost nothing to do with cricket and everything to do with why this city holds the meaning it does for millions of people.`;

const whyItsSpecial = `Most of what a visiting cricket fan sees in Nagpur will be about the Test. Deekshabhoomi is the one stop in this pack that has nothing to do with the match at all, and that's exactly the point. This is where one of the most significant events in twentieth-century Indian social history actually happened, not a plaque marking where something occurred elsewhere, and the stupa's scale and hollow, echoing interior make that history feel physically present rather than abstract. If you only have time for one non-cricket stop in Nagpur, the honest argument is that this is the one that will stay with you longer than anything at the ground.`;

const insiderTips = [
  "Visit in the early morning if you want the site at its calmest — it draws a steady stream of pilgrims and school groups through the day, and the hollow interior gets genuinely crowded by late morning.",
  "The 14 October anniversary (Dhammachakra Pravartan Din) draws enormous crowds if your trip happens to overlap with it, but the site is quiet and easy to visit on any ordinary day outside that date.",
];

const whatToAvoid = `Don't treat this as a quick photo stop — the site is treated as consecrated ground by visitors (Ambedkar's ashes are enshrined here), and rushing through with the casual energy of a tourist attraction reads as disrespectful to the people there for genuine pilgrimage. Don't assume the stupa's opening hours match a typical museum's — check the current daily hours before you go, since they're set by the memorial trust rather than a standard tourism-board schedule and can shift around major dates.`;

const gettingThere = `Deekshabhoomi is in central Nagpur, well inside the city and separate from the Jamtha stadium side of town — a taxi or auto-rickshaw from most city-centre hotels covers it in 15-20 minutes.`;

const practicalInfo = {
  bookingMethod: "Free entry, no ticket or advance booking required — just walk in during open hours.",
  hours: "Open daily; confirm the current day's exact hours with the memorial trust, as they can shift around major anniversary dates.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Deekshabhoomi — Dr. Ambedkar's Buddhist Memorial",
      subtitle: "The largest hollow stupa in the world, built where half a million people converted in a single day.",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Central Nagpur",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: Wikipedia (Deekshabhoomi, Dhammachakra Pravartan Din), deekshabhoomi.org (history/architecture), Outlook Traveller, Cultural Samvaad. Google Places API lookup confirmed rating/review count same date (Deekshabhoomi Stupa Nagpur, 4.5/12,283).",
      googleMapsRating: "4.5",
      googleMapsReviewCount: 12283,
      googleMapsUrl: "https://maps.google.com/?cid=8364647158230273529",
      sport: ["cricket"],
      moodTags: ["history", "pilgrimage", "architecture"],
      interestCategories: ["culture", "history"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "INR",
      bestSeasons: ["jan"],
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
