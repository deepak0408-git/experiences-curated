import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "godollo-near-circuit-stay-" + Date.now().toString(36);

const bodyContent = `Gödöllő sits about 10km from the Hungaroring, close enough to skip most of the Budapest commute entirely, and it happens to be the town where the return shuttle bus drops race-day crowds at the railway station. The Erzsébet Királyné Hotel, a three-star property at Dózsa György út 2 in the town centre, is the practical option here: air-conditioned rooms, a restaurant, a small spa (sauna and hot tub), and a location close enough to the station that walking to your return train after a long race day is realistic rather than aspirational.

It won't compete with a Budapest five-star on polish or history, this is a solid, well-reviewed three-star hotel, not a destination in itself. What it offers instead is proximity: shorter travel time to the circuit each morning, and critically, a much shorter, calmer trip home after the chequered flag, when tens of thousands of people in Budapest hotels are all trying to use the same M2 metro line at once.

Gödöllő itself is a small town best known for the Grassalkovich Palace, a former royal residence associated with Empress Elisabeth of Austria (Sisi), for anyone who wants somewhere quiet to explore beyond race weekend.`;

const whyItsSpecial = `The choice between staying in Budapest and staying near the circuit usually comes down to one race-day detail that's easy to underweight while planning: getting home after the race. Budapest hotels mean joining a crowd surge onto the M2. A Gödöllő base means a short walk from Gate 3's return shuttle straight to a hotel bed, while everyone else is still queuing for a train. For a multi-day trip where race day itself is the priority over evening nightlife, that tradeoff is worth taking seriously rather than defaulting to a city-centre stay out of habit.`;

const insiderTips = [
  "Confirm the shuttle bus drop-off point (Gödöllő Railway Station) is genuinely walking distance from your specific hotel before booking, distances within Gödöllő itself vary.",
  "If you want a rest day away from the circuit, the Grassalkovich Palace and its grounds are a short walk from the hotel and give you something to do beyond the race itself.",
];

const whatToAvoid = `Don't choose Gödöllő expecting Budapest-level restaurant or nightlife options, it's a small town, good for practical proximity to the circuit, not for evening entertainment after the race.`;

const practicalInfo = {
  hours: "Standard hotel check-in/check-out",
  costRange: "Three-star pricing, noticeably below central Budapest five-star rates",
  bookingMethod: "Book via booking.com, hotels.com, or the hotel's own site (erzsebetkiralyne.accenthotels.com). A smaller property in a small town, book ahead of race weekend as availability is limited compared to Budapest's much larger hotel stock.",
  website: "https://erzsebetkiralyne.accenthotels.com/en",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Gödöllő — A Quieter Base 10km from the Circuit",
      subtitle: "The Erzsébet Királyné Hotel, near the return shuttle's drop-off station, for an easier trip home after the race.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Gödöllő",
      address: "Dózsa György út 2, 2100 Gödöllő, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Short walk from Gödöllő Railway Station, the drop-off point for the return F1 shuttle bus from Gate 3.",
      editorialNote: "Sources: erzsebetkiralyne.accenthotels.com/en, tripadvisor.com/Hotel_Review-g754049-d1108135, gpdestinations.com/accommodation-hungarian-f1-grand-prix. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["practical", "quiet", "convenient"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
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
