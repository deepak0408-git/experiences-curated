import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "ahmedabad-old-city-" + Date.now().toString(36);

const bodyContent = `Ahmedabad's walled old city became India's first UNESCO World Heritage City in 2017, and the reason isn't a single monument, it's the whole surviving urban pattern: dense, self-contained neighbourhoods called pols, each one a cluster of 50 to 100 closely packed timber houses sharing walls, built around their own wells, small temples, and bird-feeding towers. It's a genuinely different way of organising a city than anywhere else in India, medieval urban planning still functioning as a living neighbourhood rather than preserved as a museum piece.

The Ahmedabad Municipal Corporation runs an official morning walk through this area, titled "Mandir se Masjid," temple to mosque, which is the most structured way to actually understand what you're looking at rather than wandering the pols without context. It runs 7:45-10:30am, starting from the Swaminarayan Temple in Kalupur, and threads through the Calico Dome, Manek Chowk, the ornate Harkunvar Shethani ni Haveli, and a series of pols, ending at Jama Masjid.

Jama Masjid itself, built in 1424 by Sultan Ahmed Shah I for the ruling family's private use, is one of the walk's genuine highlights, an early, formative building in the city Ahmed Shah founded, and one of the first structures raised as part of establishing Ahmedabad as an Islamic capital in the 15th century.

The walk costs ₹200 for Indian citizens and ₹300 for foreign visitors, booked in advance through the municipal corporation's helpline, and bookings aren't refundable once made, so confirm your dates before paying.`;

const whyItsSpecial = `Most heritage walks in Indian cities show you buildings. This one shows you a genuinely intact system, houses, wells, temples, and shared walls, still organised the way it was designed centuries ago, and still inhabited rather than emptied out for tourism. Ahmedabad earned its UNESCO status specifically for this, being the first Indian city recognised for its whole urban fabric rather than a single monument, and a guided walk through the pols is the only way to actually understand that distinction rather than just photographing an old building.`;

const insiderTips = [
  "Book the official municipal walk (₹200 for Indians, ₹300 for foreign visitors) through the helpline in advance rather than trying to explore the pols independently — the guide's context on the pol system and its history is most of the value here.",
  "Wear comfortable walking shoes and expect narrow, winding lanes — the 2.5-hour route genuinely covers ground on foot through the old city's dense street pattern, not a short stroll between a few stops.",
];

const whatToAvoid = `Don't book the walk without checking the cancellation policy first — bookings are explicitly non-refundable once made, so confirm your Ahmedabad dates are firm before paying. Don't wander into the pols expecting open tourist access to every building — these are genuinely lived-in residential communities, and the value of the guided walk is partly that it navigates you respectfully through a functioning neighbourhood rather than treating it as an open-air museum.`;

const gettingThere = `The walk starts at Swaminarayan Temple, Kalupur, in Ahmedabad's old city; reachable by taxi or auto-rickshaw from most parts of town.`;

const practicalInfo = {
  hours: "Official walk runs 7:45am-10:30am daily, starting from Swaminarayan Temple, Kalupur",
  costRange: "₹200 for Indian citizens, ₹300 for foreign citizens",
  bookingMethod: "Book in advance via the Ahmedabad Municipal Corporation heritage walk helpline (1800 233 9008) — bookings are non-refundable once made.",
  website: "https://heritage.ahmedabadcity.gov.in/morning-walk/en",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Ahmedabad's Old City — Pols & UNESCO Heritage Walk",
      subtitle: "A 2.5-hour walk through India's first UNESCO World Heritage City, temple to mosque.",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Old City / Kalupur",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: heritage.ahmedabadcity.gov.in (official walk details), UNESCO World Heritage Centre listing, Gujarat Tourism. Google Places API lookup confirmed rating/review count same date (Ahmedabad Heritage Walk, 4.6/258).",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 258,
      googleMapsUrl: "https://maps.google.com/?cid=3136157084033477473",
      sport: ["cricket"],
      moodTags: ["unesco", "walking-tour", "history"],
      interestCategories: ["culture", "history"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "INR",
      bestSeasons: ["feb", "mar"],
      advanceBookingRequired: true,
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
