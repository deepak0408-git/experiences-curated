import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-paddock-club-" + Date.now().toString(36);

const bodyContent = `The F1 Paddock Club sits directly above the pit garages at Marina Bay, and everything about it is built around proximity, to the cars, the teams, and the moment the grid forms before lights out. The single most sought-after inclusion is the daily Pit Lane Walk, a close-up look at the cars, garages, and crews that no grandstand ticket comes anywhere near. From the Club itself you get sweeping views of the Pit Straight, the starting grid, and the paddock, then a separate vantage point, the Observatory, for the Pit Straight and the post-race fireworks.

Dining runs through concept restaurants helmed by celebrity chefs rather than standard hospitality catering, and the package also includes a spa, a dedicated merchandise boutique, and a tailored daily entertainment programme, on top of access to every zone in the Circuit Park and that day's Padang Stage concerts. Like several grandstand tiers, Paddock Club guests also get a complimentary Singapore Flyer ride, first-come-first-served.

This is Singapore's genuine top tier, not a marketing label. Historically these packages have sold out within weeks of release, three-day and Sunday passes especially, so this isn't a ticket to leave for the month before the race. Pricing isn't published outright on most booking pages, official channels ask you to call or submit an enquiry directly rather than checkout online, which is normal for a hospitality product at this level but worth knowing before you assume you can just buy it like a grandstand seat.`;

const whyItsSpecial = `Most of what a Singapore GP ticket sells is a view. Paddock Club sells proximity instead, walking distance from the actual cars and crews during the Pit Lane Walk, a vantage point directly above the garages, and a dining experience closer to a genuine restaurant than a hospitality tent. I don't think every fan needs this tier, most of what makes this race worth attending is available for a fraction of the price, but for someone who wants the version of the weekend built around access rather than just a good seat, this is the real thing, not an inflated version of a grandstand ticket with a nicer name.`;

const insiderTips = [
  "Book well ahead of the season, not closer to race week — Paddock Club 3-day and Sunday passes have historically sold out within weeks of going on sale.",
  "Pricing isn't published on most official booking pages; call the Singapore GP hospitality line (+65 6731 5900) directly or submit an enquiry to get a real quote rather than assuming online checkout is available.",
];

const whatToAvoid = `Don't leave this purchase for the weeks before the event expecting availability — unlike grandstand tickets, which sometimes have late single-day inventory, Paddock Club's premium tiers have consistently sold out early in past seasons. Also don't expect a standard checkout flow: most official channels route you to a phone call or enquiry form rather than instant online purchase.`;

const practicalInfo = {
  hours: "Access runs across all three race days, Friday–Sunday 9–11 Oct 2026, plus post-race fireworks Sunday evening",
  costRange: "Pricing not publicly listed — contact Singapore GP hospitality directly for a 2026 quote",
  bookingMethod: "Enquire via singaporegp.sg's official Paddock Club page or call the hospitality line directly — this tier is not sold via standard online checkout.",
  howToBook: "Call Singapore GP hospitality on +65 6731 5900, or submit the official enquiry form at singaporegp.sg's Paddock Club page, well before the season, ideally as soon as the prior year's race ends. 3-day and Sunday passes have sold out within weeks in past years, so treat this as an early booking, not a closer-to-race-week decision.",
  website: "https://singaporegp.sg/en/tickets/hospitality-packages/hospitality/formula-1-paddock-club/",
  reservationsRequired: true,
};

const gettingThere = "Paddock Club entry is via dedicated hospitality gates, separate from general admission — confirm your specific entry point with your booking confirmation.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "F1 Paddock Club — Singapore's real top tier",
      subtitle: "Daily pit lane walks, celebrity-chef dining, and a view straight down the Pit Straight from above the garages",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "F1 Paddock Club, above the Pit Garages, Marina Bay Street Circuit, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from singaporegp.sg official Paddock Club page, Bloomberg's 2023 sell-out reporting, and cross-referenced hospitality resellers (grandprixevents.com, edgeglobalevents.com). Pricing genuinely unpublished as of 1 Aug 2026 — flagged, not invented.",
      sport: ["formula_one"],
      moodTags: ["exclusive", "high-energy"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "luxury",
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
