import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-turin-cathedral-" + Date.now().toString(36);

const bodyContent = `Turin Cathedral — the Duomo di San Giovanni Battista — is a genuinely different building from the Baroque Chapel it connects to, and worth understanding as its own thing rather than a footnote to the Royal Palace visit. Built between 1491 and 1498 by Tuscan architect Meo del Caprina, it's considered the first real example of Renaissance architecture in Turin, replacing three earlier medieval churches on the same site.

The white marble facade is what sets it apart from most Italian churches of its era — a deliberate break from the brick finish typical of the period, with three portals, the central one crowned by a tympanum. Inside, a Latin-cross basilica layout with three naves carries Gothic elements alongside the Renaissance exterior — the two styles sitting together rather than one replacing the other.

The Sant'Andrea bell tower, originally finished in 1469, was raised further by Filippo Juvarra in 1720 — one more layer of the building's centuries-long construction history. In the 17th century, Guarino Guarini's renovation added the Chapel of the Holy Shroud, physically connecting the cathedral to the Royal Palace and making this the building that's held the Shroud since 1578, when the House of Savoy first brought the relic to Turin.

Entry to the cathedral itself is generally free — it's an active church, not a ticketed museum — though the connected Chapel of the Holy Shroud is accessed through the Royal Palace complex ticket (see the Royal Palace experience).`;

const whyItsSpecial = `What makes the cathedral worth its own visit, separate from the Chapel next door, is the contrast — walking from a Renaissance basilica with Gothic bones into Guarini's genuinely strange Baroque dome is a real architectural jump, three centuries and two completely different design languages sitting in one connected building. Understanding that the cathedral itself predates the famous Chapel by nearly two centuries reframes the whole complex: this wasn't built as one unified vision, it's layers of Savoy ambition added generation after generation, and seeing both parts back to back is the clearest way to feel that.`;

const insiderTips = [
  "Visit the cathedral itself before or after the Chapel of the Holy Shroud (Royal Palace experience) — they're physically connected but architecturally distinct, and seeing both together makes the contrast clearer.",
  "The white marble facade was a genuine departure from the brick style common in Turin at the time — worth a moment outside before going in, since it's easy to walk past quickly toward the Royal Palace entrance.",
];

const whatToAvoid = `Don't assume this is the same ticketed visit as the Royal Palace/Chapel — the cathedral itself is generally free entry as an active church, while the connected Chapel of the Holy Shroud is accessed via the Royal Palace complex ticket. Check current entry arrangements for each separately.`;

const practicalInfo = {
  hours: "Standard church hours — check current schedule, as an active place of worship hours can vary around services.",
  costRange: "Free entry to the cathedral itself (active church); Chapel of the Holy Shroud via Royal Palace ticket.",
  bookingMethod: "No booking required for standard cathedral entry.",
  howToBook: "",
  website: "https://turismotorino.org/en/visit/things-to-do-and-things-to-see/spirituality/places-of-worship/duomo-di-san-giovanni-battista",
  reservationsRequired: false,
};

const gettingThere = "Piazza San Giovanni, central Turin — directly adjacent to the Royal Palace, walkable from Piazza San Carlo.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Turin Cathedral — Renaissance roots, Gothic bones",
      subtitle: "The white-marble Duomo that predates the famous Chapel next door by two centuries",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Centro",
      address: "Piazza San Giovanni, 10122 Torino, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Construction dates, architect, facade detail, and Shroud history confirmed via en.wikipedia.org/wiki/Turin_Cathedral and torinocard.org. Verified 4 Aug 2026.",
      sport: [],
      moodTags: ["history", "architecture"],
      interestCategories: ["culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
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
