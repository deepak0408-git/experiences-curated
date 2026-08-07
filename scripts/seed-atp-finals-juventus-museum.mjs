import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-juventus-museum-" + Date.now().toString(36);

const bodyContent = `If tennis isn't the only sport pulling you to Turin, the Allianz Stadium and Juventus Museum give you a genuine second sporting story — Juventus is one of Italian football's most decorated clubs, and this is their home ground plus a dedicated museum built to hold that history.

The museum opened in 2012, purpose-built by the club to house its trophies and memorabilia across 1,500 square metres, with multimedia elements that make it feel more like an engaging exhibition than a static trophy case. It's fully bilingual, so language isn't a barrier for a visiting fan.

Beyond the museum, the Stadium Tour takes you into the locker room, media area, and other zones normally off-limits — a live guide leads scheduled departures, with the standard ticket including a free unguided visit to the museum afterward. An Exclusive Tour option adds a dedicated guide throughout and the chance to handle objects from the club's history. Tours run daily except on match days, in Italian, though a paid audio guide is available in English and other languages.

Getting there is simple by metro — Linea 1 to the Fermi stop, then a short walk, a genuinely easy add-on if you're already navigating Turin's transit system for tennis sessions at Inalpi Arena.`;

const whyItsSpecial = `For a visitor whose main reason for being in Turin is the ATP Finals, this is worth including specifically because it's a completely different kind of sporting experience from tennis — walking through an active Serie A club's locker room and media areas gives you a real behind-the-scenes look at professional football infrastructure, not just a museum of old shirts and trophies. It's also a good half-day option on a day when your tennis session doesn't start until evening, filling a gap with something substantive rather than generic sightseeing.`;

const insiderTips = [
  "Standard Stadium Tour tickets include a free, unguided museum visit afterward — you don't need to book museum entry separately if you're already doing the tour.",
  "Tours don't run on match days — check the Juventus fixture list before planning your visit date, since a home match will mean the tour isn't available.",
];

const whatToAvoid = `Don't assume English-guided tours run as standard — live tours are in Italian, with English available only via paid audio guide, so factor that in if a live English commentary matters to your visit.`;

const practicalInfo = {
  hours: "Daily except match days — check current schedule.",
  costRange: "Standard Stadium Tour + free museum entry, or Exclusive Tour (dedicated guide, object handling) at a higher price.",
  bookingMethod: "Official Juventus ticketing site.",
  howToBook: "",
  website: "https://www.juventus.com/en/tickets/museum-tour/",
  reservationsRequired: true,
};

const gettingThere = "Metro Linea 1 to Fermi stop, then a short walk to Allianz Stadium.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Allianz Stadium & Juventus Museum",
      subtitle: "A behind-the-scenes stadium tour and 1,500sqm museum — Turin's other major sporting story",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Continassa",
      address: "Corso Gaetano Scirea, 10151 Torino, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Museum details, tour options, and metro access confirmed via juventus.com official site and turismotorino.org. Verified 4 Aug 2026.",
      sport: ["football"],
      moodTags: ["sports-fan", "behind-the-scenes"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
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
