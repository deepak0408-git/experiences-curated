import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "staying-in-pest-" + Date.now().toString(36);

const bodyContent = `Budapest splits into two halves across the Danube, hilly Buda and flat Pest, and for a Hungaroring race weekend the choice isn't close. Pest has the majority of the city's hotels, restaurants, and nightlife, it's flat and easy to navigate on foot, and critically, it's where the M2 red metro line runs, the first leg of the journey out to the circuit.

The practical rule is simple: book a hotel near an M2 station. That line runs you to Örs vezér tere, where you pick up the HÉV suburban rail toward the Hungaroring. Staying anywhere on or near the M2, whether that's Deák Ferenc tér in the historic centre or further out toward District VII's Jewish Quarter, keeps race-day mornings simple and cuts real time off the 60-90 minute journey to the circuit.

Pest's own draws don't need much selling: District V's grand boulevards and the Parliament building, District VII's ruin bars and thermal baths, and enough restaurant density that eating well every night of a multi-day trip is barely a decision. It's the default base for good reason, book here first and consider the alternatives (Gödöllő, a specific luxury hotel) only if you have a particular reason to.`;

const whyItsSpecial = `The advice to "stay on the flat side" sounds like a minor logistics note until you're actually navigating Budapest at 7am on race day with a metro connection to make. Pest isn't just more convenient, it's where the city's actual life happens in the evenings, which matters on a trip where you're not spending every waking hour at the circuit. Choosing Pest over Buda is one of the few genuinely easy calls in planning this trip: better transit, more restaurants, more going on after the chequered flag.`;

const insiderTips = [
  "Search specifically for hotels within walking distance of an M2 metro stop (Deák Ferenc tér, Astoria, Blaha Lujza tér, Keleti pályaudvar), this single filter does more for your race-day morning than almost any other accommodation decision.",
  "Book early. Hotels in Budapest fill up fast once Hungarian GP race tickets go on sale, and Pest's best-located options near the M2 go first.",
];

const whatToAvoid = `Don't default to a hotel in Buda for the views or quiet, the hillier terrain and lack of direct M2 access make the daily commute to the Hungaroring noticeably more complicated, even though it's the same city.`;

const practicalInfo = {
  hours: "N/A — destination guidance, not a single bookable venue",
  costRange: "Wide range depending on district and hotel tier, from budget guesthouses to five-star riverfront properties",
  bookingMethod: "Search accommodation platforms filtering for District V, VI, or VII in Pest, prioritising proximity to an M2 metro stop over proximity to the river or old town views.",
  website: "https://www.f1hungary.com/en/hotels-24",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Staying in Pest — The Flat Side, and the Right Metro Line",
      subtitle: "More hotels, more restaurants, and direct M2 access to the Hungaroring — the default base for race weekend.",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Pest",
      address: "Pest side of Budapest, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Any M2 metro stop in Pest connects directly to Örs vezér tere, the transfer point for HÉV suburban rail to the Hungaroring.",
      editorialNote: "Sources: gpdestinations.com/accommodation-hungarian-f1-grand-prix, motorsporttickets.com/blog/where-to-stay-for-the-hungarian-grand-prix. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["practical", "central", "convenient"],
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
