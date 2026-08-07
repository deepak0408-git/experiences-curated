import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-aperitivo-vermouth-" + Date.now().toString(36);

const bodyContent = `Turin is where vermouth was first produced, dating to 1786 — before Milan, before anywhere else associated with Italian aperitivo culture claims the tradition, it started here. That history is the reason Turin's aperitivo scene isn't a generic version of something you'd find across Italy; it's the source.

The format is specific to the city: order an evening drink — traditionally vermouth itself, though the tradition has expanded to cover a wider range of aperitivo drinks — and it typically arrives with a genuinely generous buffet included, not a small bowl of chips. This is standard practice across Turin's bars during aperitivo hour, not an upsell or a premium option at a few select spots.

Piazza San Carlo's historic cafés are the most atmospheric place to do this (see the Piazza San Carlo experience), but the tradition runs across the whole city — Turin residents genuinely treat aperitivo hour as a real, near-daily social ritual, not a special-occasion outing. For a visitor with match sessions structuring the day, an early-evening aperitivo before a night session, or after an afternoon one, fits naturally into the schedule the tournament itself creates.`;

const whyItsSpecial = `The detail that reframes this for most visitors is the origin date — 1786 puts Turin's vermouth tradition well over two centuries deep, and treating aperitivo here as "the same as anywhere in Italy" misses that this is genuinely the source city, not a participant in a wider trend. Ordering a vermouth specifically, rather than defaulting to a spritz or another more internationally familiar aperitivo drink, is the more authentic choice here — it's asking for the thing Turin actually invented, in the city that invented it.`;

const insiderTips = [
  "Order vermouth specifically if you want the most historically authentic choice — it's the drink that started Turin's aperitivo tradition in 1786, not just one option among many.",
  "The buffet that comes with an aperitivo order is genuinely substantial at most Turin bars — factor that into dinner planning rather than treating it as a light pre-dinner snack.",
];

const whatToAvoid = `Don't assume aperitivo hour is a niche or touristy add-on — it's a real, widely-practiced daily ritual for Turin residents, and treating it as optional means missing one of the most authentic, low-effort ways to experience local life during your trip.`;

const practicalInfo = {
  hours: "Aperitivo hour typically runs early evening, roughly 6-9pm, varying by venue.",
  costRange: "€8-15 per drink, buffet typically included.",
  bookingMethod: "Walk-in at most venues; busier spots may benefit from arriving early.",
  howToBook: "",
  website: "",
  reservationsRequired: false,
};

const gettingThere = "City-wide tradition — Piazza San Carlo's historic cafés are the most atmospheric single location.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Turin's aperitivo — where vermouth began",
      subtitle: "The city that invented vermouth in 1786, and still does aperitivo hour properly",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Centro",
      address: "City-wide, Turin, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Vermouth origin date (1786) and aperitivo tradition confirmed via slowfoodtravelers.com and girlsgottadrink.com, cross-checked across multiple food-culture sources. Verified 4 Aug 2026.",
      sport: [],
      moodTags: ["local-life", "evening"],
      interestCategories: ["dining"],
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
