import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "four-seasons-gresham-palace-" + Date.now().toString(36);

const bodyContent = `The Four Seasons Gresham Palace sits at Széchenyi István tér 5-6, right where the Chain Bridge meets the Pest side of the Danube. It wasn't built as a hotel. The London-based Gresham Life Assurance Company put it up in 1906 as an office and apartment building, and its Art Nouveau detailing, wrought iron, carved stone, stained glass, a grand central staircase, made it one of the most sought-after addresses in what was then one of Europe's most fashionable cities.

Then the century happened to it. After the Second World War the Red Army used the building as a barracks. It slid into disrepair and spent the Communist era as a plain apartment block, a long way from its original glamour. Four Seasons took on the restoration in 1999 and reopened it as a hotel in June 2004, rebuilding the Art Nouveau details rather than replacing them with something generic.

Today it's 179 rooms and 17 suites, many with direct views over the river, and it sits close enough to central Pest and an M2 metro connection that the Hungaroring commute isn't meaningfully harder from here than from anywhere else in the city centre. What you're paying for is the building itself as much as the location.`;

const whyItsSpecial = `Most five-star hotels are built to be five-star hotels. Gresham Palace wasn't, it was an insurance company's flagship building that happened to survive a war, a military occupation, and four decades of neglect intact enough to be worth restoring rather than demolishing. Staying here during a Hungaroring weekend means sleeping inside a genuinely reconstructed piece of Budapest's most turbulent century, not a themed luxury property built to evoke one. The Danube views and the Chain Bridge on your doorstep are the postcard version, the actual story is what makes it worth the premium.`;

const insiderTips = [
  "Ask for a river-facing room specifically when booking, not all 179 rooms have the Danube view that's the main reason to choose this address.",
  "The hotel sits an easy walk from Deák Ferenc tér, where the M2 metro line begins its run out to Örs vezér tere and the HÉV connection to the Hungaroring, factor that into your race-day timing rather than assuming a taxi.",
];

const whatToAvoid = `Don't book here expecting a Hungaroring shortcut, it's a genuinely central Pest location, not a circuit-adjacent one, the transit time to the track is the same as most other central hotels.`;

const practicalInfo = {
  hours: "Standard hotel check-in/check-out, front desk staffed 24 hours",
  costRange: "Five-star luxury pricing, among Budapest's highest, check fourseasons.com/budapest for current rates",
  bookingMethod: "Book directly via fourseasons.com/budapest. Rooms fill quickly during race weekend given the hotel's combination of location and profile, book several months ahead if this is a must-have.",
  website: "https://www.fourseasons.com/budapest/",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Four Seasons Gresham Palace — A Restored Danube Landmark",
      subtitle: "An Art Nouveau insurance-company palace, barracked by the Red Army, restored and reopened as a hotel in 2004.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Belváros, District V",
      address: "Széchenyi István tér 5-6, 1051 Budapest, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Short walk to Deák Ferenc tér, the interchange for the M2 metro line used to reach the Hungaroring via Örs vezér tere and the HÉV suburban rail.",
      editorialNote: "Sources: en.wikipedia.org/wiki/Gresham_Palace, cnn.com/travel/four-seasons-gresham-palace-budapest-hotel, press.fourseasons.com/budapest/trending-now/gresham-palace-restoration. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["historic", "luxurious", "iconic"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "perennial",
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
