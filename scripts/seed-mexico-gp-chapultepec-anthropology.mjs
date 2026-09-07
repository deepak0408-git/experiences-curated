import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-chapultepec-anthropology-" + Date.now().toString(36);

const bodyContent = `Chapultepec Park is more than double the size of Central Park, and it functions as the city's actual green lung — tree-lined paths, lakes, and enough open space that it doesn't feel like a single park so much as a green district with several major attractions inside it. Chapultepec Castle sits at its highest point (once an Aztec ceremonial site, later a residence for Mexican presidents and a brief imperial court), and several of the city's major museums cluster within walking distance of each other inside the park's boundaries. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=4819667171050898351&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

The National Museum of Anthropology is the reason most visitors carve out real time for this part of the city — one of the most significant collections of pre-Columbian artifacts anywhere, and home to the Piedra del Sol, the Aztec Sun Stone, one of the most recognizable single artifacts in Latin American history. The museum is open Tuesday through Sunday, 9am to 8pm, giving you a long window to work with, but it's also one of the most visited museums on the continent, and lines have been known to stretch up to two hours and wrap around the block by midday. Getting there right at opening is a genuinely different experience than arriving in the afternoon — you'll have the Sun Stone and the museum's other headline pieces largely to yourself for the first hour, rather than viewing them through a crowd. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=9521483601320789284&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Entry runs a modest fee on regular days, with free admission on Sundays for Mexican citizens and residents specifically — a detail worth knowing if you're weighing whether Sunday's free crowd or a weekday's paid entry gets you a better experience, since the free day tends to be considerably busier.`;

const whyItsSpecial = `The Aztec Sun Stone is one of those artifacts that's been reproduced on so many postcards, textbook covers, and tourist souvenirs that it risks feeling smaller in person than the buildup suggests — until you're actually standing in front of it, at real scale, inside a museum built specifically to give pre-Columbian Mexican history the same institutional weight most countries reserve for their own national treasures. Chapultepec's real argument isn't any single piece, though — it's the combination of a working, heavily-used public park (locals running, families picnicking, everyday city life happening around you) sitting directly alongside one of the most serious anthropological collections in the world. Few cities let you experience both in the same afternoon walk.`;

const insiderTips = [
  "Arrive at or right after the museum's 9am opening if seeing the Sun Stone and other headline pieces without a crowd matters to you — by midday, lines have been reported stretching up to two hours and wrapping around the block.",
  "Sunday brings free admission for Mexican citizens and residents, which also means Sunday is considerably busier than a weekday — if you're a paying international visitor without a strong reason to specifically visit on Sunday, a weekday morning gets you a calmer visit for a modest fee.",
];

const whatToAvoid = `Don't plan to see the museum and Chapultepec Castle in the same short visit without budgeting real time for both — each deserves a couple of hours minimum, and trying to compress both into an afternoon usually means rushing through one or the other. And don't expect most exhibit labels to be in English — the majority of the museum's information is Spanish-only, so if you don't read Spanish comfortably, budget for the English audio guide (75 pesos, photo ID required as a deposit) rather than assuming you'll follow along with wall text alone.`;

const practicalInfo = {
  hours: "National Museum of Anthropology: Tuesday-Sunday, 9am-8pm. Chapultepec Park itself: generally open daily during daylight hours.",
  costRange: "Museum entry roughly 90-100 MXN (a few US dollars) on regular days; free for Mexican citizens/residents on Sundays. Park entry is free.",
  bookingMethod: "Tickets can be bought at the entrance, or in advance via skip-the-line options through GetYourGuide/Viator if you want to avoid the queue entirely.",
  website: "https://mexicocity.cdmx.gob.mx/locations/chapultepec-park/?lang=en, https://www.mna.inah.gob.mx",
};

const gettingThere = "Auditorio or Chapultepec Metro stations (both on Line 7/1 respectively) provide direct access to the park; the Anthropology Museum is a further walk within the park itself from either station.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Chapultepec Park & the National Museum of Anthropology",
      subtitle: "The Aztec Sun Stone, and a park more than double the size of Central Park",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Chapultepec / Bosque de Chapultepec",
      address: "Bosque de Chapultepec, Miguel Hidalgo, Mexico City",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [
        { platform: "GetYourGuide", label: "Chapultepec Castle & Anthropology Museum", url: "https://www.getyourguide.com/mexico-city-l194/mexico-city-chapultepec-castle-anthropology-museum-t58106/?partner_id=HCNITTS&utm_medium=online_publisher" },
      ],
      editorialNote: "Museum hours, entry fee, and queue-time detail sourced from Rehlat.bh and WonderfulMuseums.com's Anthropology Museum guides, Sep 2026. Park scale (2x Central Park) sourced from WeRoad.com's Mexico City guide. Google ratings via Places API lookup same session: Bosque de Chapultepec 4.7/267,836 reviews, Museo Nacional de Antropología 4.8/91,878 reviews. Multi-venue: MULTI_VENUE_RATINGS entry required, venueCount 2. Second What to Avoid replaced 6 Sep 2026 — the original restated bodyContent's queue-time fact almost verbatim. Replaced with the Spanish-only exhibit labeling and paid English audio guide detail (75 pesos + photo ID deposit), sourced from Mexico Insider's museum guide and a Tripadvisor forum thread on English-language access, 6 Sep 2026 — not previously mentioned in this experience. Website updated 7 Sep 2026 to add the official CDMX government Chapultepec Park page alongside the museum's own site. GetYourGuide affiliate link added 7 Sep 2026, founder-supplied real affiliate URL per feedback_affiliate_link_generation.md.",
      sport: ["formula_one"],
      moodTags: ["historic", "family-friendly", "must-see"],
      interestCategories: ["culture", "history"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "MXN",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #16 seeded:", result.title, "|", result.id, "|", result.slug);
  console.log("REMINDER: add MULTI_VENUE_RATINGS entry, venueCount=2");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
