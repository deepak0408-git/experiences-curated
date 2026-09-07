import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-where-to-stay-roma-norte-" + Date.now().toString(36);

const bodyContent = `Roma Norte is the neighborhood most first-time visitors end up recommending to the next first-time visitor, and the reason is straightforward: it's walkable in a way much of Mexico City isn't, dense with genuinely good restaurants and cafes rather than tourist-trap versions of them, and it sits close enough to both the historic center and the wider Roma-Condesa corridor that you're rarely more than a 15-20 minute walk or short ride from wherever else you want to be. It's also one of the two neighborhoods (alongside Polanco) consistently ranked among the safest in the city for visitors, with the kind of constant foot traffic and outdoor dining that keeps streets active well into the evening.

La Valise mx City sits inside a 1920s French-style townhouse turned into a small luxury property — just a handful of rooms, each different, with an intimacy that larger hotels in the area don't try to match. Room service comes from Rosetta, a restaurant that's held a spot on the World's 50 Best list, which is a genuinely unusual amenity for a boutique property this size. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14177891795109916126&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

NaNa Vida CDMX is the newer, design-forward option in the same neighborhood, built around contemporary interiors and consistently among the highest-reviewed properties in Roma on independent booking platforms. It doesn't carry La Valise's historic-building pedigree, but it makes up for that with a more modern room feel and a reputation for genuinely attentive service, not just a polished lobby. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=18004793949776098496&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Both properties sit within easy reach of Roma Norte's core strip along Álvaro Obregón and the streets branching off it, where the neighborhood's café and restaurant density is highest. Neither hotel puts you directly on the Metro Line 9 route to the circuit, so budget a taxi, rideshare, or a walk to a connecting station on event days — Roma Norte's appeal is the neighborhood itself, not proximity to the track.`;

const whyItsSpecial = `Mexico City has neighborhoods that are more central and neighborhoods that are more scenic, but Roma Norte is the rare one that's genuinely good at being lived in — the difference between a place built for tourists to look at and a place locals actually spend their evenings in. Staying here means your hotel is a base for a real neighborhood rather than a self-contained bubble, which matters on a trip where race weekend itself will already deliver plenty of self-contained bubble experiences (grandstands, hospitality suites, fan zones). Roma Norte is the counterweight — the part of the trip that feels like the city, not the event.`;

const insiderTips = [
  "Álvaro Obregón and the smaller streets branching off it hold the highest concentration of Roma Norte's best cafes and restaurants — base your hotel search within a few blocks of this stretch rather than the neighborhood's outer edges if walkability is a priority.",
  "Neither of these hotels sits directly on Metro Line 9, so if you're planning multiple race-weekend trips to the circuit, factor in a short taxi or rideshare to a connecting station each time rather than assuming a direct walk.",
];

const whatToAvoid = `Don't assume every corner of "Roma" is the same neighborhood experience — Roma Norte (north of Avenida Álvaro Obregón) and Roma Sur have a genuinely different character and density of amenities, and booking based on the district name alone without checking which half you're actually in can land you further from the walkable core than expected. And don't book last-minute assuming Roma Norte always has room — race weekend 2026 collides directly with Día de Muertos, one of the city's biggest tourism weekends independent of F1, so demand across this neighborhood's hotels will be higher than a typical race weekend elsewhere.`;

const practicalInfo = {
  hours: "N/A — neighborhood and hotel guide",
  costRange: "La Valise and NaNa Vida both sit in the upper-moderate to splurge range for Mexico City — expect a genuine premium over budget options elsewhere in the city, reflecting both the boutique positioning and race-weekend demand",
  bookingMethod: "Book directly through each hotel's own site or via Booking.com — given the Día de Muertos overlap, book earlier than you would for a typical Mexico City trip.",
  website: "https://www.lavalise.com, https://www.nanavida.com",
};

const gettingThere = "Neither hotel sits directly on Metro Line 9 — plan a short taxi/rideshare or a connecting walk to Insurgentes or Sevilla station on the Pink Line for onward travel to the circuit via Line 9.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay in Roma Norte",
      subtitle: "Mexico City's most walkable, food-forward neighborhood — and one of its safest",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Roma Norte",
      address: "Roma Norte, Cuauhtémoc, Mexico City",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [
        { platform: "Booking.com", url: "https://www.booking.com/hotel/mx/la-valise-mexico-city.html", pricePoint: "splurge" },
        { platform: "Booking.com", url: "https://www.booking.com/hotel/mx/nana-vida-cdmx.html", pricePoint: "moderate" },
      ],
      editorialNote: "Roma Norte safety/walkability ranking sourced from CasaGoliana.com and GetLostInMexicoCity.com neighborhood guides, Sep 2026. Hotel picks (La Valise, NaNa Vida) sourced from YourFriendTheNomad.com and Hotel-Scoop.com boutique-hotel roundups; Google ratings via Places API lookup same session (La Valise 4.8/294 reviews, NaNa Vida 5.0/247 reviews) — both real sample sizes, not thin-count flags. Multi-venue: MULTI_VENUE_RATINGS entry required, venueCount 2.",
      sport: ["formula_one"],
      moodTags: ["walkable", "food-forward", "boutique"],
      interestCategories: ["accommodation", "food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #9 seeded:", result.title, "|", result.id, "|", result.slug);
  console.log("REMINDER: add MULTI_VENUE_RATINGS entry for slug prefix in app/experience/[slug]/page.tsx, venueCount=2");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
