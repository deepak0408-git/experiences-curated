import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "szechenyi-thermal-bath-" + Date.now().toString(36);

const bodyContent = `Széchenyi Thermal Bath opened in 1913 in City Park, built over natural hot springs drilled by engineer Vilmos Zsigmondy in the late 19th century. It's the largest medicinal bath complex in Europe: 15 indoor pools and 3 grand outdoor pools, the outdoor water sitting around 30-34°C and the thermal pools closer to 38°C, hot enough to sit comfortably in even on a cool evening.

The building itself is part of the draw, a grand yellow neo-Baroque complex designed by Győző Czigler, expanded to its current size in 1927. But the actual experience is more social than architectural: Széchenyi has a livelier, more communal atmosphere than Budapest's other historic baths, and the sight of people playing chess on floating boards in the outdoor pools, year-round, rain or shine, is one of the city's genuinely iconic images rather than a tourist cliché invented for postcards.

It's open every day from 6am to 10pm, though indoor pools close at 8pm and saunas at 9pm. Weekday tickets run about HUF 11,900, weekend tickets HUF 13,500 (roughly €30-34), and buying a skip-the-line ticket online ahead of time is worth the small effort given how busy the entrance gets, especially on a summer weekend during race week.`;

const whyItsSpecial = `A trip built around three days at a Formula 1 circuit is intense in a specific way, heat, crowds, noise, standing for hours. Széchenyi is the most complete antidote Budapest offers, not a quiet boutique spa but a properly social, slightly chaotic public bath where locals and visitors mix in the same water. Sitting in a 38°C outdoor pool the evening before or after a Hungaroring session, watching a chess game happen mid-water because that's just what people do here, is as different from race-day intensity as a single afternoon in this city can get.`;

const insiderTips = [
  "Buy a skip-the-line ticket online in advance via szechenyibath.hu, the entrance queue on a summer weekend can run long, especially with race-week visitor numbers added to the usual crowds.",
  "Bring a padlock for the lockers if you have one, and expect a deposit-and-return system for towels if you don't bring your own.",
];

const whatToAvoid = `Don't visit expecting Gellért Baths as an alternative if Széchenyi is too crowded, Gellért is closed for renovation from October 2025 until 2028, Rudas is the better substitute if you want a second bath experience during your stay.`;

const practicalInfo = {
  hours: "Daily 6am-10pm; indoor pools close 8pm, saunas/steam rooms close 9pm",
  costRange: "HUF 11,900 weekday / HUF 13,500 weekend (approx. €30-34)",
  bookingMethod: "Buy a skip-the-line ticket online via szechenyibath.hu ahead of your visit, or use a Budapest Card for a discounted entrance fee.",
  website: "https://www.szechenyibath.hu/",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Széchenyi Thermal Bath — Europe's Largest Medicinal Bath",
      subtitle: "18 pools, 38°C thermal water, and the chess-in-the-pool ritual that's been running here since 1913.",
      slug,
      experienceType: "activity",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "City Park (Városliget)",
      address: "Állatkerti körút 9-11, 1146 Budapest, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Located in City Park, reachable via the M1 (yellow) metro line to Széchenyi fürdő station, or a short walk from Heroes' Square.",
      editorialNote: "Sources: szechenyibath.hu, szechenyibath.hu/opening-hours, szechenyibath.hu/prices, thecommonwanderer.com/blog/szechenyi-baths-budapest. Verified 11 Jul 2026. Note: Gellért Baths closed for renovation Oct 2025-2028, do not recommend as alternative.",
      sport: ["formula_one"],
      moodTags: ["relaxing", "social", "historic"],
      interestCategories: ["wellness"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: false,
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
