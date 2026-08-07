import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-caffe-bicerin-" + Date.now().toString(36);

const bodyContent = `Caffè Al Bicerin has been open since 1763, and it holds the original recipe for the drink it's named after — bicerin, a three-layered mix of espresso, hot chocolate, and whipped cream, served in a small glass so you can see the layers before they're mixed together.

This isn't a recreation or a themed café built around the idea — it's the actual place the drink is documented as originating, still operating in the same tradition more than 260 years later. Turin's identity as the birthplace of gianduja chocolate and a genuine chocolate-drinking culture predates the bicerin's specific invention here, but this café is where that broader tradition crystallised into its most famous single drink.

It's a small, historic space — not built for large groups or a quick in-and-out visit — and it sits in Turin's old quarter, an easy add-on to a Mole Antonelliana or Egyptian Museum visit given the short walking distance between them.`;

const whyItsSpecial = `What makes this worth seeking out specifically, rather than ordering a bicerin at any café that lists one on the menu, is the continuity — this is the actual site the drink comes from, not a modern café borrowing a historic name. For a visitor trying to understand Turin's real food identity beyond the obvious tourist version, sitting in a space that's served the same drink since 1763 is a genuinely different experience from a generic "historic Turin café" — it's the specific origin point, verifiable and singular, not one of several claimants.`;

const insiderTips = [
  "Order the bicerin as intended — a small glass, meant to be drunk without stirring the layers together immediately, so you get the espresso, chocolate, and cream in sequence rather than as one blended drink.",
  "It's a small space with limited seating — expect a wait during peak tourist hours, and don't plan a large group visit without checking capacity first.",
];

const whatToAvoid = `Don't rush the visit — this is a place to sit and actually experience the drink as intended, not a grab-and-go stop; treating it as a quick photo opportunity misses the point of what makes it worth visiting at all.`;

const practicalInfo = {
  hours: "Standard café hours — check current schedule.",
  costRange: "Bicerin typically €6-8.",
  bookingMethod: "Walk-in.",
  howToBook: "",
  website: "",
  reservationsRequired: false,
};

const gettingThere = "Piazza della Consolata, Turin's old quarter — short walk from the Mole Antonelliana.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Caffè Al Bicerin — since 1763",
      subtitle: "The original home of Turin's signature layered drink, unchanged for over 260 years",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Quadrilatero Romano",
      address: "Piazza della Consolata 5, 10122 Torino, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Founding date (1763), original recipe claim, and drink composition confirmed via slowfoodtravelers.com and girlsgottadrink.com, cross-checked across multiple sources. Verified 4 Aug 2026.",
      sport: [],
      moodTags: ["historic", "local-icon"],
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
