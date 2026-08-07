import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-barolo-langhe-daytrip-" + Date.now().toString(36);

const bodyContent = `The Langhe hills — UNESCO-listed for their wine landscape — sit roughly 80km south of Turin, and this is one of Italy's most respected wine regions, home to Barolo, Barbaresco, and the Nebbiolo grape that produces both. On a day when your tennis session doesn't demand a full day in the city, this is a genuinely worthwhile way to spend it.

By car, Barolo itself is about 50km and roughly 1.5 hours from Turin, most of it on scenic roads rather than pure motorway. Driving to Alba, the region's unofficial capital, takes about 1 hour 15 minutes — mostly motorway with tolls, followed by 20-30 minutes on smaller country roads into the hills proper. Within an hour of Turin by car, you reach the hilltop villages of La Morra, Monforte d'Alba, and Barolo itself, all well-placed as a base for exploring.

By train, the journey to Alba from Torino Porta Nuova takes about 1.5 hours — a realistic option if you don't want to drive, though it puts you in Alba rather than directly in the smaller wine villages, which are more easily reached by car or a private tour from there.

This is genuinely a full-day commitment, not a half-day add-on — between the travel time each way and the pace the region rewards (wine tastings, a proper Piedmontese lunch, time in at least one hilltop village), trying to compress it into an afternoon undersells both the region and your own day.`;

const whyItsSpecial = `What makes this worth the travel time, rather than treating Turin's city sights as sufficient on their own, is that the Langhe is where Piedmont's food and wine identity — the Slow Food movement, the Nebbiolo-based wines you'll have been drinking in Turin's restaurants — actually comes from. Standing in the hills that produce Barolo, after a week of eating the region's food in the city, closes a loop that Turin alone can't offer. For a genuinely committed food-and-wine traveller, this is arguably a more memorable day than anything inside city limits, precisely because it's the source, not a curated urban version of it.`;

const insiderTips = [
  "Driving beats the train for this trip unless you're comfortable relying on local tours from Alba — the smaller, more atmospheric hilltop villages (La Morra, Monforte d'Alba, Barolo itself) are easiest reached by car, and the train only gets you as far as Alba.",
  "Treat this as a full-day trip, not a half-day add-on — between roughly 1.5 hours each way and the pace the region rewards, a rushed visit undersells both the wine and the villages.",
];

const whatToAvoid = `Don't attempt this on a day with an early-afternoon match session — the travel time alone (1.5 hours each way, plus time in the region) doesn't leave enough margin for a session before mid-to-late afternoon at the earliest, and a rushed return risks missing your session entirely.`;

const practicalInfo = {
  hours: "Full-day trip — plan for departure by mid-morning at the latest given ~1.5hr travel time each way.",
  costRange: "Car rental or private driver for a day, or train fare to Alba (~1.5hrs from Porta Nuova) plus local transport/tour costs.",
  bookingMethod: "Self-drive, or book a private driver/wine-tour service in advance for the fullest experience of the smaller villages.",
  howToBook: "",
  website: "",
  reservationsRequired: false,
};

const gettingThere = "By car: ~1.5hrs from Turin to Barolo (~50km). By train: ~1.5hrs from Torino Porta Nuova to Alba, then car/tour onward to the villages.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Barolo & the Langhe — a full-day wine trip",
      subtitle: "UNESCO wine hills 80km south of Turin, source of the Nebbiolo wines on every restaurant list",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Langhe",
      address: "Barolo, Piedmont, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Distances and travel times confirmed via kissfromitaly.com, girlsgottadrink.com, and insieme-piemonte.com, cross-checked for consistency across multiple sources. UNESCO status confirmed. Verified 4 Aug 2026.",
      sport: [],
      moodTags: ["wine", "countryside"],
      interestCategories: ["day_trip", "dining"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
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
