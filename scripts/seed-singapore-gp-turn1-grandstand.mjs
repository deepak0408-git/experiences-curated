import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-turn1-grandstand-" + Date.now().toString(36);

const bodyContent = `Turn 1 Grandstand watches drivers brake from over 290km/h coming off the Pit Straight into Sheares Turn 1, then snake through Turns 2 and 3 while jostling for position. It's one of the two real start-line seats at this circuit, the other being Turn 2 across the way, and it's built for exactly the moment a Grand Prix is most likely to produce contact: the first braking zone, twenty cars still bunched together.

Eight sections run A2 through A9, individual bucket seats with backs, roughly 20 rows each. Not every section earns its price equally. A3-A6 sit closest to the track with real sightlines across Turns 1-3, and that's genuinely the seat to book. A7-A9 sit further back, facing the runoff area rather than the racing line, so you're relying on the big screens more than your own eyes up there. A2 is a middle case, decent straight ahead but compromised toward the pit exit side.

The zone access alone makes this a strong all-round ticket even before the racing: Turn 1 sits in Zone 1, and a Zone 1 grandstand ticket gets you into Zones 1 through 4, meaning both the Wharf Stage (a 5-minute walk) and the Padang Stage are open to you across the weekend, not just one. Ticket holders also get a free ride on the Singapore Flyer, first-come-first-served, the same perk Republic Grandstand carries.

If you're choosing between Turn 1 and Turn 2 for the start-line experience, Turn 1 gets you closer to the actual contact zone through the first three corners; Turn 2 sits slightly further back but squares up better on all 20 cars leaving the grid together. Neither is a wrong pick, they're two angles on the same opening seconds.`;

const whyItsSpecial = `A street circuit lives or dies on its first corner, and Singapore's Turn 1 is a real one, a hard stop from close to 300km/h with three corners still to navigate before the field settles. What makes this stand worth the research rather than a blind buy is that it isn't uniformly good: half its sections deliver exactly what the price promises, and the other half quietly don't, trading a real view for a big screen and a claim to the same postcode. I'd rather say that plainly than let a buyer discover A7 wasn't A3 after the money's spent. Combined with full four-zone access and both stages, this is one of the few stands where the ticket earns its keep even on a session with a quiet start.`;

const insiderTips = [
  "Book specifically into sections A3-A6 if the on-track view is the priority — A7-A9 face the runoff area, not the racing line, despite carrying the same grandstand name and price.",
  "Zone 1 tickets unlock all four zones, so plan to walk to the Padang Stage for the bigger evening acts even though your seat is at Turn 1.",
];

const whatToAvoid = `Don't assume every section of a named grandstand delivers the same view — A7-A9 here are a real step down from A3-A6 despite identical pricing, and this isn't disclosed prominently at the point of sale. If a specific section isn't selectable at checkout, ask or check a seating chart before buying rather than assuming the best-case view applies.`;

const practicalInfo = {
  hours: "Race weekend sessions Friday–Sunday, 9–11 Oct 2026, into the evening",
  costRange: "S$1,698 for 3-day (2026); single-day tickets typically sell out first",
  bookingMethod: "Book via singaporegp.sg or tickets.formula1.com, Zone 1 grandstands. Request sections A3-A6 specifically where the platform allows section selection.",
  howToBook: "",
  website: "https://singaporegp.sg/en/tickets/general-tickets/grandstands/turn-1-grandstand/, https://tickets.formula1.com/en/f1-3301-singapore",
  reservationsRequired: true,
};

const gettingThere = "Gate 1 (Republic Boulevard) is the most direct entrance, 5-10 minutes' walk to the stand. Nearest MRT: City Hall or Raffles Place.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Turn 1 Grandstand — the real start-line seat",
      subtitle: "290km/h braking into three corners of jostling cars — but only half the sections actually see it",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "Turn 1 Grandstand, Zone 1, Marina Bay Street Circuit, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from singaporegp.sg official Turn 1 page and gpdestinations.com independent section-by-section review. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "strategic"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "splurge",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-01",
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
