import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-porta-nuova-neighborhood-" + Date.now().toString(36);

const bodyContent = `Porta Nuova is Turin's main train station, and the area immediately around it is the city's most practical base — walking distance to the historic centre, train connections for day trips (Barolo, Milan), and hotel pricing that runs meaningfully lower than the luxury central options, with budget rooms from roughly €36/night and solid mid-range choices around €84.

Hotel Bologna, set in a 19th-century building directly opposite the station, and Hotel Concord, just steps from Porta Nuova and a short walk from Turin's pedestrian shopping streets, are both real, practical options in this bracket — not generic chain hotels, but genuine mid-range Turin stays with the convenience of the station on your doorstep.

One honest thing worth flagging: the immediate area right around the station has pockets that feel less polished after dark than the historic squares — it's not a dangerous neighbourhood, but it's worth choosing your specific hotel within the area with a bit of care rather than assuming every block is equally comfortable at night.

If Porta Nuova's station-district feel isn't quite what you want, San Salvario — about 15 minutes' walk further out — offers a different, younger, more multicultural atmosphere with a genuinely different dining and nightlife scene, worth knowing about as a real alternative rather than settling for the first area you find.`;

const whyItsSpecial = `The case for Porta Nuova over the luxury central hotels (see the separate Where to Stay experience) isn't just price — it's genuine logistical convenience if you're planning a day trip to Barolo or the Langhe by train, since you're starting from the same station rather than needing a taxi or tram to reach it first. For a visitor balancing tennis sessions with day trips and city sightseeing, having your accommodation double as your transport hub removes one layer of daily planning that a more atmospheric but less central choice would add back in.`;

const insiderTips = [
  "If you're planning a Barolo or Langhe day trip by train (see the Barolo & Langhe experience), staying near Porta Nuova removes an extra transit leg on your day-trip mornings.",
  "San Salvario, roughly 15 minutes further on foot, is a genuine alternative if you want a younger, more multicultural neighbourhood feel rather than the station district itself.",
];

const whatToAvoid = `Don't book the absolute cheapest option immediately adjacent to the station without checking recent reviews first — the area's quality varies block to block, and a few pockets feel noticeably less comfortable after dark than Turin's historic centre.`;

const practicalInfo = {
  hours: "Standard hotel check-in/check-out.",
  costRange: "Budget from ~€36/night, mid-range around €84/night, higher for hotels with direct station-front positioning.",
  bookingMethod: "Standard booking platforms or direct via hotel websites.",
  howToBook: "",
  website: "",
  reservationsRequired: true,
};

const gettingThere = "Immediately adjacent to Porta Nuova station — Turin's main rail hub, with tram connections onward to Inalpi Arena.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Porta Nuova — the practical, station-side base",
      subtitle: "Budget and mid-range hotels with train convenience — plus San Salvario as a real alternative",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Porta Nuova",
      address: "Porta Nuova station area, 10125 Torino, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Neighborhood character, pricing range, and San Salvario alternative confirmed via gotripzi.com Turin neighborhoods guide, cross-checked against booking platform listings. Verified 4 Aug 2026 — pricing subject to seasonal/event-week change.",
      sport: ["tennis"],
      moodTags: ["value", "convenient"],
      interestCategories: ["accommodation"],
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
