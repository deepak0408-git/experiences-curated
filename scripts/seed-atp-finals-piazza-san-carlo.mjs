import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-piazza-san-carlo-" + Date.now().toString(36);

const bodyContent = `Piazza San Carlo is nicknamed "Turin's drawing room," and once you've stood in it, the name makes sense — this is the square built to be seen in, not just passed through. Designed by architect Carlo di Castellamonte and inaugurated in 1638, it was laid out as part of Turin's southward expansion after the Savoy court moved the capital here in 1563, with arcaded porticos added between 1643 and 1646 that still frame the whole space.

The square's centrepiece is an 1838 equestrian monument to Emmanuel Philibert, Duke of Savoy, by Carlo Marochetti, and it's closed on its southern edge by the twin Baroque churches of Santa Cristina and San Carlo Borromeo — a genuinely elegant symmetry that's rare even by Turin's own baroque standards.

This is also where the city's aperitivo culture is most visibly performed. The historic cafés lining the arcades — Caffè Torino chief among them — have been meeting places for Turin's academics, writers, and politicians for generations; Caffè Torino specifically counts writer Cesare Pavese and post-war Italian leaders Luigi Einaudi and Alcide De Gasperi among the names associated with it. In the evenings, the square fills for aperitivo — Turin invented the tradition here, and Piazza San Carlo is where it's still done properly, with the historic cafés' buffets accompanying an evening drink.`;

const whyItsSpecial = `The reason this square earns "Turin's drawing room" as a name, and not just a marketing line, is that it genuinely functions as the city's shared living room — locals actually meet friends here, do business over an aperitivo, and treat the arcaded cafés as an extension of their own social life, not a tourist performance. For a visitor with limited time between match sessions, this is the single most efficient place to feel Turin's actual daily rhythm rather than just its monuments — sit at one of the historic cafés in the early evening, order an aperitivo, and you're doing exactly what generations of Turin residents have done in the same seat.`;

const insiderTips = [
  "Aperitivo hour (typically early evening) is when the square is at its most characteristic — the historic cafés' buffets are part of the drink price, not a separate charge, so it's genuinely good value as well as atmospheric.",
  "Caffè Torino is the most historically significant of the arcade cafés — worth choosing it specifically if you only have time for one, given its documented history with figures like Pavese and Einaudi.",
];

const whatToAvoid = `Don't treat this as a quick photo stop and move on — the square rewards actually sitting down for a drink, which is a genuinely different (and more worthwhile) experience than walking through it.`;

const practicalInfo = {
  hours: "Open square, accessible any time; café hours vary, evening aperitivo typically from early evening onward.",
  costRange: "Aperitivo at a historic café typically €8-15, buffet usually included.",
  bookingMethod: "Walk-in — no booking needed for the square or standard café seating.",
  howToBook: "",
  website: "",
  reservationsRequired: false,
};

const gettingThere = "Central Turin, walkable from Porta Nuova station and most central hotels.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Piazza San Carlo — Turin's drawing room",
      subtitle: "Baroque arcades, historic cafés, and the birthplace of Turin's aperitivo culture",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Centro",
      address: "Piazza San Carlo, 10123 Torino, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Square history, architect, and dates confirmed via en.wikipedia.org/wiki/Piazza_San_Carlo. Caffè Torino's historical associations confirmed via worldcitytrail.com. Verified 4 Aug 2026.",
      sport: [],
      moodTags: ["atmosphere", "local-life"],
      interestCategories: ["culture", "dining"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
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
