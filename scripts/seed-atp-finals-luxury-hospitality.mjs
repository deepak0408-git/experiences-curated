import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-luxury-hospitality-" + Date.now().toString(36);

const bodyContent = `The ATP Finals runs three distinct official hospitality tiers, each a genuinely different product rather than variations on the same package.

The Smash Package is the entry point into official hospitality — front-row seating with strong sightlines, paired with a full gastronomic experience at an exclusive signature restaurant inside the hospitality area, so the meal itself is a real destination, not a buffet alongside your seat.

The Ace Package sits above it as the only official package offering courtside seats — the closest official hospitality seating to the action anywhere in the venue — paired with its own enogastronomic (food and wine) journey at a separate exclusive gourmet restaurant.

New for 2026, the ATP No. 1 Club is a single-day premium offering, available only through ATP Experiences rather than the tournament's own hospitality channel — it combines seating, elevated hospitality, and genuine behind-the-scenes access in one package, aimed at guests who want a single standout day rather than a season-long hospitality commitment.

Across all three, the common thread is the same: prime court views, first-class service, real culinary quality (not generic corporate catering), and direct access to moments a standard ticket doesn't offer. None of these are officially priced on the tournament's public site — genuine cost varies by day, tier, and demand, and is best confirmed directly through official hospitality or ATP Experiences channels closer to the tournament.`;

const whyItsSpecial = `What separates these three from generic "VIP tickets" resold by third parties is that they're the tournament's own official hospitality product, built around real restaurant partnerships and genuinely differentiated seating — Ace's courtside access specifically doesn't exist anywhere else in the venue at any price, official or otherwise. For a visitor treating this trip as a genuine luxury occasion, not just excellent tennis, the choice between Smash, Ace, and the new ATP No. 1 Club comes down to whether you want a full-tournament seating upgrade (Smash), the single closest official seat in the house (Ace), or a curated single day built around access rather than seating alone (ATP No. 1 Club).`;

const insiderTips = [
  "Ace is the only official package offering courtside seats — if proximity to the court is your priority over anything else, this is the tier that actually delivers it, not Smash.",
  "The ATP No. 1 Club is new for 2026 and booked through ATP Experiences specifically, not the tournament's own hospitality page — check both channels if you're comparing options, since they're not listed in the same place.",
];

const whatToAvoid = `Don't assume hospitality pricing is published or fixed — none of these three tiers has public pricing on the tournament's own site, and costs vary by specific day and demand. Confirm directly through official channels before assuming a figure you've seen elsewhere is current.`;

const practicalInfo = {
  hours: "Available across tournament sessions — specific tier availability varies by day.",
  costRange: "Not publicly listed — contact official hospitality channels for current pricing.",
  bookingMethod: "Smash/Ace via official Nitto ATP Finals hospitality; ATP No. 1 Club via ATP Experiences specifically.",
  howToBook: "",
  website: "https://tickets.nittoatpfinals.com/en/hospitality, https://atptourexperiences.com/atp-finals-2026",
  reservationsRequired: true,
};

const gettingThere = "Inalpi Arena, corporate hospitality entrance — south gates via Corso Sebastopoli, separate from general admission.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Luxury & hospitality packages — Smash, Ace, No.1 Club",
      subtitle: "Three official tiers — courtside access, signature dining, and a new single-day premium option for 2026",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Santa Rita",
      address: "Corso Sebastopoli 123, 10137 Torino, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Package names, tiers, and 2026 ATP No. 1 Club detail confirmed via official sources: tickets.nittoatpfinals.com/en/hospitality and atptour.com's ATP No. 1 Club announcement, cross-checked against ultimatehospitality.co.uk and official-vip.com. Pricing genuinely unpublished at time of writing — stated honestly rather than estimated. Verified 4 Aug 2026.",
      sport: ["tennis"],
      moodTags: ["luxury", "vip"],
      interestCategories: ["sport"],
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
