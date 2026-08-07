import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-getting-to-inalpi-arena-" + Date.now().toString(36);

const bodyContent = `Inalpi Arena doesn't sit on Turin's single metro line, so the trip from central Turin runs on tram, not underground. The closest stop is Sebastopoli, served by tram lines 4 and 10, a walk of around 5 minutes from the arena's general admission entrance on Piazzale Grande Torino.

From Porta Nuova, Turin's main central station, tram 4 runs directly toward Sebastopoli — the simplest single-line route if you're staying anywhere near the city centre. From Porta Susa, the other major station (and the one connected to the airport train line), you'll typically need one connection to reach the same stop, since the direct tram routes from the two stations don't fully overlap.

Turin's public transport — buses, trams, and the single metro line — all run on the same integrated ticketing system operated by GTT (Gruppo Torinese Trasporti). A standard urban ticket covers 90 minutes across bus, tram, and metro, bought from tobacconists, bars displaying the GTT logo, station vending machines, or the free TO Move app, which also lets you buy and validate tickets directly on your phone and see real-time vehicle locations. If you're planning several days of city transit around match sessions, the Torino + Piemonte Card bundles public transport into a tourist pass, or a Special Tour Ticket gives unlimited tram/bus/metro travel for a fixed 48 or 72 hours from first validation.

On session days, expect trams 4 and 10 to be genuinely busier than usual — this is the main route for a 12,000-capacity crowd converging on one stop, so building in extra time before an evening session, when both match-goers and regular commuters overlap, is worth it.`;

const whyItsSpecial = `The practical reality first-time visitors miss is that Turin's transit map looks simple — one metro line — right up until you need to reach a venue the metro doesn't serve, which is exactly the case for Inalpi Arena. Sebastopoli tram stop is the real answer, not a fallback, and it's genuinely well-connected: lines 4 and 10 between them link most of central Turin to the arena's front door without a car or taxi. The TO Move app is worth having installed before you land — real-time tram tracking matters more here than in a city with metro-level frequency, since you're relying on above-ground transit that can be affected by traffic in a way the underground can't.`;

const insiderTips = [
  "Tram 4 runs a direct route from Porta Nuova station to Sebastopoli — the simplest option if your hotel is anywhere near central Turin.",
  "Download the TO Move app before you arrive — it handles ticket purchase, validation, and real-time tram tracking in one place, useful given trams (unlike the metro) can be affected by street traffic.",
];

const whatToAvoid = `Don't assume the metro gets you there — Turin's single metro line (Linea 1) doesn't serve Inalpi Arena at all, and a first-time visitor navigating by "just take the metro" instinct will end up walking a long final stretch or needing a second connection they didn't plan for.`;

const practicalInfo = {
  hours: "Trams operate throughout the day; expect to allow extra time on session days given crowd volume converging on Sebastopoli.",
  costRange: "Standard GTT urban ticket ~€2 (90-minute validity, covers bus/tram/metro); 48/72hr Special Tour Ticket available for multi-day visits.",
  bookingMethod: "GTT tickets from tobacconists, GTT-branded bars, station vending machines, or the TO Move app.",
  howToBook: "",
  website: "https://muoversiatorino.it/en/tickets/, https://www.gtt.to.it",
  reservationsRequired: false,
};

const gettingThere = "Sebastopoli tram stop (lines 4, 10) — approximately 5-minute walk to Inalpi Arena's general admission entrance on Piazzale Grande Torino.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to Inalpi Arena — tram, not metro",
      subtitle: "Sebastopoli stop, tram lines 4 and 10 — the real route the metro map won't show you",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Santa Rita",
      address: "Sebastopoli tram stop, Turin, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Tram line/stop confirmed via rome2rio.com and moovitapp.com transit search results, cross-checked against Inalpi Arena's official venue address. GTT ticketing/app detail from muoversiatorino.it. Verified 4 Aug 2026.",
      sport: ["tennis"],
      moodTags: ["practical", "planning"],
      interestCategories: ["transit"],
      pace: "moderate",
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
