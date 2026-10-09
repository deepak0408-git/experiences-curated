import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "mahabalipuram-daytrip-" + Date.now().toString(36);

const bodyContent = `Mahabalipuram sits about 60km south of Chennai on the Coromandel Coast, roughly an hour and fifteen minutes by car, and it's the single most rewarding day trip out of the city, a genuine UNESCO World Heritage Site rather than a "worth a look if you have time" attraction.

The Shore Temple is the obvious centrepiece: a granite structure built directly on the coastline in the 8th century by the Pallava dynasty, weathered by well over a thousand years of sea spray and still standing. It anchors the wider Group of Monuments at Mahabalipuram, which earned UNESCO World Heritage status in 1984, and the site rewards slowing down rather than treating it as a single photo stop.

Two other sites are worth building the day around alongside the Shore Temple itself. Arjuna's Penance is a massive open-air rock relief, one of the largest of its kind in the world, carved directly into a granite boulder with an intricate procession of gods, animals, and mythological figures. The Five Rathas (Pancha Rathas) are a set of monolithic temples, each one carved from a single, whole piece of rock rather than built up from separate stones, in the shape of temple chariots. Seeing all three properly, Shore Temple, Arjuna's Penance, and the Five Rathas, takes something like 3.5-5 hours if you don't rush it.

One practical detail worth knowing before you go: a single ticket, bought at any of the complex's ticket counters, covers entry to every monument within the UNESCO site, so there's no need to buy separately at each stop. It costs ₹40 for Indian nationals and ₹600 for foreign nationals, with children under 15 admitted free.`;

const whyItsSpecial = `Chennai itself is more a working commercial capital than a monument city, so if the Tamil temple architecture and coastal history you'd expect from a South India trip are what you're after, Mahabalipuram is where that trip actually happens, not Chennai proper. What makes it genuinely worth the hour-plus drive rather than a lesser stand-in closer to the city is the range in one place: an open-air rock relief on the scale of a small hillside, temples carved whole from single boulders, and a coastal shrine that's been standing since the 8th century. Few day trips from an Indian metro pack this much real, UNESCO-verified history into one afternoon.`;

const insiderTips = [
  "Buy your single combined ticket at the first monument you visit — it covers the Shore Temple, Arjuna's Penance, and the Five Rathas together, so there's no need to queue again at each site.",
  "Go early in the day if you can — the Shore Temple sits directly on the coast with almost no shade, and the granite surfaces at Arjuna's Penance and the Five Rathas get genuinely hot to be near by midday.",
];

const whatToAvoid = `Don't budget less than half a day for this trip on the assumption it's a quick stop — properly seeing all three main sites takes 3.5-5 hours on top of the roughly 75-minute drive each way, and rushing it means missing most of what makes Mahabalipuram worth the trip. Don't skip Arjuna's Penance in favour of just the Shore Temple because it's less famous internationally — it's one of the largest open-air rock reliefs anywhere in the world, and several visitors rate it as the more genuinely striking of the two.`;

const gettingThere = `About 60km/75 minutes by car from central Chennai; also reachable by bus in roughly 2-2.5 hours. Most visitors hire a car and driver for the day rather than self-driving.`;

const practicalInfo = {
  hours: "Group of Monuments typically open sunrise to sunset (site-specific hours can vary slightly by monument)",
  costRange: "₹40 for Indian nationals, ₹600 for foreign nationals (single combined ticket), children under 15 free",
  bookingMethod: "No advance booking required — buy the combined ticket on arrival at any monument's ticket counter.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Mahabalipuram — UNESCO Shore Temple Day Trip",
      subtitle: "An 8th-century coastal temple, a boulder carved with an entire mythology, an hour south of Chennai.",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Mahabalipuram",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: UNESCO World Heritage listing background, GoTirupati/TravelTam/India-Guide Mahabalipuram guides. Google Places API lookup confirmed rating/review count same date (Mahabalipuram Shore Temple, 4.6/13,365).",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 13365,
      googleMapsUrl: "https://maps.google.com/?cid=12255013162383511873",
      sport: ["cricket"],
      moodTags: ["unesco", "history", "day-trip"],
      interestCategories: ["culture", "history"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "INR",
      bestSeasons: ["jan", "feb"],
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
