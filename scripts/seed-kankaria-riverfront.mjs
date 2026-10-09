import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "kankaria-riverfront-" + Date.now().toString(36);

const bodyContent = `Kankaria Lake dates back to the Gujarat Sultanate, excavated during the reign of Qutb-ud-Din Ahmad Shah II between 1451 and 1458, and it served as a royal leisure and bathing spot under both the Sultanate and, later, the Mughals. It was declared a protected monument in 1928, and in 2008 the Ahmedabad Municipal Corporation revamped it into the modern lakefront it is today, a roughly 600-metre-wide lake ringed by a zoo, boat rides, a toy train, and, most evenings, a laser show at Nagina Wadi running 7:00-7:30pm that projects Gujarat's history and cultural motifs onto a water screen.

It's genuinely more of a civic recreation ground now than a historic monument, and that's the appeal after a long day of cricket: families, joggers, food stalls, and a relaxed, unhurried evening atmosphere around the water. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=8610690589107386906)

The Sabarmati Riverfront is the newer, more architecturally deliberate version of the same idea. Built since 2005 and progressively opened to the public from 2012, it's an 11km stretch along both banks of the river with a two-level promenade, a lower level for pedestrians and cyclists directly by the water, and an upper level hosting parks, plazas, and cultural events. It's consistently described as one of the best places in the city for an evening walk, well-lit, well-maintained, and genuinely pleasant once the day's heat has passed. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=17545937553662305113)

Either one works as a wind-down after a day at the Narendra Modi Stadium, since both sit relatively close to the ground and the city's central hotel areas. The riverfront suits a quieter walk; Kankaria suits an evening with more going on around you.`;

const whyItsSpecial = `After three cities' worth of stadiums, temples, and heritage walks, Kankaria and the riverfront are the one entry in this pack that isn't really about seeing something specific, it's about doing what Ahmedabad's own residents actually do on an ordinary evening. A 600-year-old royal lake turned into a modern civic park, and an 11km river promenade built this century, sitting a short ride apart, give you two genuinely different registers of the same idea: a city using its water as public space rather than backdrop.`;

const insiderTips = [
  "Time a Kankaria Lake visit to catch the Nagina Wadi laser show at 7:00-7:30pm — it's free to view from most of the lakefront and gives the evening a clear anchor point rather than just wandering.",
  "The Sabarmati Riverfront's lower promenade level is reserved for pedestrians and cyclists specifically — it's the quieter, more scenic option if you want a proper walk rather than navigating around the upper level's event crowds.",
];

const whatToAvoid = `Don't expect Kankaria Lake to read as a historic site the way Sabarmati Ashram or the old city do — the modern 2008 redevelopment means it functions almost entirely as a contemporary recreation ground now, not a place to go looking for centuries-old atmosphere. Don't visit either spot at midday in February-March heat expecting the same relaxed atmosphere described here — both are genuinely evening destinations, and the crowds, lighting, and temperature all work in your favour after sunset, not before.`;

const gettingThere = `Kankaria Lake sits southeast of the old city; the Sabarmati Riverfront runs through central Ahmedabad on both banks of the river. Both are reachable by taxi or auto-rickshaw from most city hotels; the riverfront is also accessible on foot from several central neighbourhoods.`;

const practicalInfo = {
  hours: "Kankaria Lake grounds are open daily; Nagina Wadi laser show runs 7:00-7:30pm. Sabarmati Riverfront promenade is open extended hours, best visited from late afternoon into evening.",
  costRange: "Free to walk both; Kankaria's zoo, boat rides, and toy train charge small separate fees",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Kankaria Lake & Sabarmati Riverfront Evening",
      subtitle: "A 15th-century royal lake and an 11km modern promenade — how Ahmedabad actually spends its evenings.",
      slug,
      experienceType: "activity",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Kankaria / Sabarmati Riverfront",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: heritage.ahmedabadcity.gov.in (Kankaria Lake), Gujarat Tourism, Trawell/Thrillophilia Sabarmati Riverfront guides. Multi-venue piece — 2 named sites, each with a real Google Places API rating lookup (Kankaria Lake 4.5/17,972; Sabarmati Riverfront 4.6/13,675), same date. No single top-level googleMapsRating set — see MULTI_VENUE_RATINGS entry.",
      sport: ["cricket"],
      moodTags: ["evening", "relaxed", "lakefront"],
      interestCategories: ["nature", "culture"],
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
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
