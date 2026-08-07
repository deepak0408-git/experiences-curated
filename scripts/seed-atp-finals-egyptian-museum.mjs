import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-museo-egizio-" + Date.now().toString(36);

const bodyContent = `Turin holds one of the largest collections of Egyptian antiquities anywhere outside Egypt itself — over 30,000 artefacts, including mummies, monumental statues, papyrus scrolls, and everyday objects spanning millennia of Egyptian civilisation. It's a genuinely surprising thing to find in a Piedmontese city best known for cars, chocolate, and now tennis, and the scale of the collection catches most first-time visitors off guard.

The museum runs timed-entry ticketing, and mid-morning and weekend slots sell out first — booking 3-7 days ahead is the realistic window for reliable availability, not a same-day walk-in. Hours run Monday 9am-2pm (a shorter day) and Tuesday through Sunday 9am-6:30pm.

The collection's depth means a rushed visit undersells it badly — this isn't a museum you clear in 40 minutes between other plans. If your Turin time is genuinely tight around match sessions, treat it as a half-day commitment rather than trying to fit it into a gap.`;

const whyItsSpecial = `What makes this worth prioritising over some of Turin's other big-name sights is how specific and complete the collection is — this isn't a scattered assortment of artefacts, it's widely regarded as the most important Egyptian collection after Cairo's own, built up over two centuries rather than assembled quickly. For a visitor who's never associated Turin with Egypt at all, walking through room after room of genuinely major pieces resets expectations of the city fast — it signals Turin was a serious European capital with the wealth and ambition to build a collection like this, which says something about the House of Savoy's reach that the rest of the city's baroque architecture only hints at.`;

const insiderTips = [
  "Book timed-entry tickets 3-7 days ahead — mid-morning and weekend slots sell out first, and this isn't a reliable same-day walk-in museum.",
  "Monday is a shorter day (9am-2pm) — don't plan a Monday afternoon visit assuming standard hours.",
];

const whatToAvoid = `Don't budget less than 2 hours — the collection is large enough that a rushed pass through feels like missing the point, and with 30,000+ artefacts on show, a genuinely engaged visit runs closer to half a day.`;

const practicalInfo = {
  hours: "Mon 9am-2pm, Tue-Sun 9am-6:30pm",
  costRange: "Timed-entry ticket pricing via official site — book in advance.",
  bookingMethod: "Official website egizio.museitorino.it, or booking office +39 011.4406903 (Mon-Sat, 9am-6pm).",
  howToBook: "",
  website: "https://egizio.museitorino.it",
  reservationsRequired: true,
};

const gettingThere = "Central Turin, via Accademia delle Scienze 6 — walkable from Piazza San Carlo and Porta Nuova station.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Museo Egizio — Egypt's second-largest collection",
      subtitle: "30,000+ artefacts, the most complete Egyptian collection outside Cairo",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Centro",
      address: "Via Accademia delle Scienze 6, 10123 Torino, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Collection size, hours, and booking guidance confirmed via characrosstheworld.com and weekendinitaly.com, cross-checked against multiple sources for consistency. Verified 4 Aug 2026.",
      sport: [],
      moodTags: ["museum", "history"],
      interestCategories: ["culture"],
      pace: "slow",
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
