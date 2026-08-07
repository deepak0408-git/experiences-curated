import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-luxury-hotels-" + Date.now().toString(36);

const bodyContent = `Turin's best central hotels cluster around Porta Nuova station and the historic squares, close enough to walk to Piazza San Carlo and the Mole Antonelliana, with a tram connection to Inalpi Arena rather than a walking distance — so "central" here means central to the city, not to the tennis venue specifically.

Principi di Piemonte is the standout for setting — a 5-star hotel with genuinely striking views across the city and the Alpine arch beyond, positioned near the central Piazza Castello and Piazza San Carlo, putting you inside the historic core.

Grand Hotel Sitea, at Via Carlo Alberto 35, sits a 7-minute walk from Porta Nuova station and 5 minutes from Palazzo Bricherasio — a 5-star property with the modern amenities you'd expect (including currency exchange on-site), in one of the most walkable central locations.

Royal Palace Hotel, at Via Cavour 13, is an 8-minute walk from Porta Nuova, positioned just steps from the city centre's major points of interest — a strong choice if walkability to the historic squares is your priority over any single feature.

All three put you within easy reach of the tram lines that connect onward to Inalpi Arena (see the Getting to Inalpi Arena experience) — none are walkable to the venue itself, so budget the tram connection into your daily routine regardless of which one you choose.`;

const whyItsSpecial = `The real decision point among these three isn't quality — all are genuine 5-star central options — it's which specific slice of Turin you want as your daily backdrop. Principi di Piemonte's Alpine-arch views are hard to replicate anywhere else in the city; Grand Hotel Sitea and Royal Palace Hotel both trade that specific view for maximum proximity to Porta Nuova station, useful if you're making day trips (Barolo, for instance) that depart from there. None of the three shortens your tram commute to the arena meaningfully compared to the others — so the choice comes down to what you want to walk out the door to each morning, not logistics.`;

const insiderTips = [
  "None of these hotels are walkable to Inalpi Arena — all require the tram connection via Sebastopoli stop, so factor that into your daily routine regardless of which you choose.",
  "If you're planning a Barolo or Langhe day trip by train, Grand Hotel Sitea and Royal Palace Hotel's proximity to Porta Nuova (7-8 min walk) is a genuine practical advantage over Principi di Piemonte's slightly more central-square position.",
];

const whatToAvoid = `Don't book based on proximity to Inalpi Arena — none of Turin's best central hotels are within walking distance of the venue, and choosing based on that criterion alone will lead to disappointment. Choose based on which part of central Turin suits your trip, and plan the tram connection into every match day regardless.`;

const practicalInfo = {
  hours: "Standard hotel check-in/check-out.",
  costRange: "5-star central Turin pricing — check current rates, expect premium pricing during the ATP Finals week given demand.",
  bookingMethod: "Direct via hotel websites or standard booking platforms.",
  howToBook: "",
  website: "",
  reservationsRequired: true,
};

const gettingThere = "All three within walking distance of Porta Nuova station and central Turin's historic squares.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to stay — central Turin luxury",
      subtitle: "Principi di Piemonte, Grand Hotel Sitea, Royal Palace Hotel — central, not arena-adjacent",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Centro",
      address: "Central Turin, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Hotel names, positioning, and walking distances confirmed via turinwhynot.com luxury hotel roundup, cross-checked for consistency. Verified 4 Aug 2026 — pricing not confirmed, subject to change and event-week demand.",
      sport: ["tennis"],
      moodTags: ["luxury", "central"],
      interestCategories: ["accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "event_only",
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
