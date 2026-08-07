import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-royal-palace-" + Date.now().toString(36);

const bodyContent = `The Royal Palace of Turin was the seat of the House of Savoy, and it's the clearest single place in the city to understand why Turin — not Rome, not Milan — was Italy's first capital. Built in the 16th century and expanded over the following two centuries, it's part of a UNESCO World Heritage listing (since 1997) covering the Savoy Residences across Piedmont, which also includes the Palace of Venaria roughly 10km outside the centre, the Castle of Valentino, the Palazzina di Caccia di Stupinigi, and the Castle of Rivoli.

A ticket to the Royal Palace covers the state rooms and lounges, the armoury, the royal gardens, and the palace's galleries — genuinely a multi-hour visit if you go through all of it.

Directly connected to the palace, and entered as part of the same complex, is the Chapel of the Holy Shroud — a Baroque masterpiece designed by Guarino Guarini, built between 1668 and 1694, sitting behind Turin Cathedral's high altar. The dome is the reason architecture students study this building specifically: a self-supporting structure of intersecting arches that creates a genuine optical tunnel-toward-light effect, six overlapping levels converging on a star-shaped apex. It reopened in 2018 after a 21-year restoration, following serious fire damage in 1997.

One honest thing to know before visiting: the actual Shroud of Turin — the cloth itself — is not on permanent public display. It's kept in a climate-controlled case and only shown during rare, scheduled expositions (the most recent was 2015). What you're visiting at the Chapel is the architectural space built to house it, not a guaranteed viewing of the relic — worth setting that expectation correctly rather than assuming a chapel visit means seeing the Shroud.`;

const whyItsSpecial = `The Chapel's dome alone justifies treating this as more than a standard palace-tour stop — Guarini built something that reads as genuinely strange and modern even now, an architectural trick of light and geometry inside a 17th-century building, and it rewards actually looking up and taking time rather than moving through quickly. Combined with the Royal Palace's own state rooms, this is the single best place in Turin to feel the scale of what the Savoy dynasty actually built here — not just wealth, but a genuine architectural ambition that still reads as striking three centuries later.`;

const insiderTips = [
  "The Shroud itself is not on permanent display — you're visiting the Chapel's architecture, not the relic. The last public exposition was 2015; don't plan a visit assuming you'll see the actual cloth.",
  "Budget real time for the dome specifically — Guarini's intersecting-arch design rewards a slow look upward, not a quick photo and move on.",
];

const whatToAvoid = `Don't skip checking current opening status before visiting — as a working royal complex with an active restoration/conservation history (the Chapel was closed for 21 years after the 1997 fire), sections can have limited access at different times; confirm current hours rather than assuming full access.`;

const practicalInfo = {
  hours: "Check official hours before visiting — palace complex hours vary by season.",
  costRange: "Royal Palace ticket covers state rooms, armoury, gardens, galleries; Chapel of the Holy Shroud accessed as part of the connected complex.",
  bookingMethod: "Official Musei Reali Torino ticketing.",
  howToBook: "",
  website: "https://museireali.beniculturali.it/en/",
  reservationsRequired: true,
};

const gettingThere = "Piazza Castello, central Turin — walkable from Piazza San Carlo and most central hotels.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Royal Palace & the Chapel of the Holy Shroud",
      subtitle: "UNESCO-listed Savoy grandeur and Guarini's dome — the architectural heart of Turin",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Centro",
      address: "Piazzetta Reale 1, 10122 Torino, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "UNESCO status, Savoy Residences list, and Chapel history confirmed via museireali.beniculturali.it and en.wikipedia.org/wiki/Chapel_of_the_Holy_Shroud. Shroud display status (last public exposition 2015, not on permanent display) confirmed via multiple sources. Verified 4 Aug 2026.",
      sport: [],
      moodTags: ["history", "architecture"],
      interestCategories: ["culture"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
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
