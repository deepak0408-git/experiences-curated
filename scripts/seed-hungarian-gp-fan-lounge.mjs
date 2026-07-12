import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "f1-fan-lounge-hungaroring-" + Date.now().toString(36);

const bodyContent = `The F1 Fan Lounge sits a step below Paddock Club and Champions Club in F1's own hospitality tiers, but it's built around the same idea at a more accessible price: an air-conditioned indoor space with a buffet and open bar, paired with a reserved, covered seat in the Hungaroring Grandstand for all three days.

That combination matters more here than it would at a cooler circuit. Late July at the Hungaroring regularly pushes past 30°C, and having somewhere to retreat between sessions, sit down out of direct sun, eat properly, and cool off before heading back to your seat changes the character of a long race weekend considerably. The Fan Lounge doesn't include the pit walk or the same proximity to the paddock as Paddock Club, but it gives you a genuinely comfortable base and a good, covered view of the pit straight without the top-tier price.

It's the natural step up for someone who's done a grandstand-only Hungaroring weekend before and wants more comfort without committing to the full Paddock Club spend.`;

const whyItsSpecial = `The gap between a standard grandstand ticket and full Paddock Club hospitality is large, both in price and in what you actually get. The Fan Lounge sits in the middle in a way that's genuinely useful rather than just a marketing tier: real air conditioning, a real buffet, a real covered seat, at roughly half of what Champions Club costs. For a hot-weather circuit like the Hungaroring, that combination of comfort and value is arguably a better fit for more people than the flagship hospitality product above it.`;

const insiderTips = [
  "Use the lounge's air conditioning strategically, retreat there during a quiet stretch of practice or between qualifying and the pit walk crowds, rather than sitting in the grandstand heat the whole day.",
  "Because the Fan Lounge includes a Hungaroring Grandstand seat rather than a separate viewing area, check the seat plan so you know exactly which part of the main straight you'll be watching from.",
];

const whatToAvoid = `Don't expect pit lane access or a paddock walk at this tier, that's reserved for Paddock Club above it. If pit lane proximity is the priority, budget for the next tier up instead.`;

const practicalInfo = {
  hours: "3-day access (Fri-Sun), lounge opens ahead of first practice each day",
  costRange: "Approx. €2,035 for 3 days (2026 pricing), roughly half of Champions Club",
  bookingMethod: "Sold via f1experiences.com and official F1 hospitality resellers. Includes a reserved covered seat in the Hungaroring Grandstand plus indoor lounge access with buffet and open bar for all three days.",
  website: "https://f1experiences.com/2026-hungarian-grand-prix",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "F1 Fan Lounge — Comfort Without the Paddock Club Price",
      subtitle: "Air-conditioned indoor lounge, open bar and buffet, plus a covered grandstand seat for all three days.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Hungaroring, Mogyoród",
      address: "Hungaroring, 2146 Mogyoród, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Free F1 shuttle buses run from Kerepes HÉV station (reached via M2 metro to Örs vezér tere, then HÉV suburban rail) directly to Gate 3, timed to match train arrivals.",
      editorialNote: "Sources: gpdestinations.com/tickets-hungarian-f1-grand-prix, f1experiences.com/2026-hungarian-grand-prix. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["comfortable", "value", "relaxed"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
