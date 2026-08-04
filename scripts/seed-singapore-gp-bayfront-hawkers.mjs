import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-bayfront-hawkers-" + Date.now().toString(36);

const bodyContent = `Two separate hawker spots share the bayfront theme but sit in genuinely different places, worth knowing apart rather than treating as one stop.

Makansutra Gluttons Bay sits inside Esplanade Mall, right on the water, an easy walk from City Hall MRT. Its 11 stalls lean toward late-night eating built for exactly this kind of race weekend, Syifa' Satay and Old Satay Club for grilled skewers, Huat Huat BBQ and BBKia Stingray for char-grilled seafood, plus Hong Kong Street and Kebabchi for something outside strictly local food. Hours run late by hawker standards, 5pm-2am most nights, extending to 3am Friday and Saturday, built specifically for a post-session crowd rather than an early dinner.

Satay by the Bay is a different venue entirely, inside Gardens by the Bay itself, reached via Bayfront MRT and a walk across the Dragonfly or Meadow Bridge. It's bigger, more than 20 stalls covering satay, barbecue seafood, steamboat, Hokkien mee, popiah, rojak, and prata, and it runs daytime hours, 11am-10pm for food stalls, with drinks available 24 hours. It's the better pick if you're already spending a day at the Gardens and want a proper local meal without leaving the park, rather than a late-night stop after racing.

Both share the same real appeal: eating actual Singaporean hawker food with the skyline, and in Makansutra's case the water itself, as the backdrop, rather than a generic food court setting.`;

const whyItsSpecial = `These two spots solve different problems and it's worth not conflating them. Makansutra Gluttons Bay is built for the exact rhythm of a race night, sessions finish, concerts run late, and you want real food at 1am without trekking across the city, its hours say so plainly. Satay by the Bay is a daytime companion to a Gardens visit, not a race-night stop at all given its 10pm close. Recommending "bayfront hawker food" as one generic idea would miss that these are genuinely two different visits for two different parts of a Singapore trip, and I think that specificity is worth more than a vague pointer toward "eat by the water."`;

const insiderTips = [
  "Head to Makansutra Gluttons Bay specifically after a night session, not Satay by the Bay, it closes at 10pm and won't be open by the time a race weekend evening actually wraps up.",
  "If you're spending a day at Gardens by the Bay separately from race sessions, Satay by the Bay inside the park is the better lunch stop, over 20 stalls without needing to leave.",
];

const whatToAvoid = `Don't assume these two venues are interchangeable or in the same location, they're a real MRT ride apart (City Hall for Makansutra, Bayfront for Satay by the Bay), and mixing up their hours could mean showing up to a closed Satay by the Bay expecting a late-night option.`;

const practicalInfo = {
  hours: "Makansutra Gluttons Bay: Mon-Thu 5pm-2am, Fri-Sat 5pm-3am, Sun 4pm-1am. Satay by the Bay: food stalls 11am-10pm daily, drinks 24 hours.",
  costRange: "S$5-15 per dish at either venue, typical hawker pricing",
  bookingMethod: "Walk-in only at both — Makansutra for late-night post-session eating, Satay by the Bay for a daytime Gardens visit.",
  howToBook: "",
  website: "https://www.esplanade.com/visit-esplanade/esplanade-mall/shops-and-restaurants/makansutra-gluttons-bay, https://www.gardensbythebay.com.sg/en/things-to-do/dine-and-shop/satay-by-the-bay.html",
  reservationsRequired: false,
};

const gettingThere = "Makansutra Gluttons Bay: City Hall MRT, walk via the Esplanade link-way. Satay by the Bay: Bayfront MRT (CE1/DT16), cross the Dragonfly or Meadow Bridge into Gardens by the Bay.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Bayfront hawkers — Makansutra and Satay by the Bay",
      subtitle: "Two different spots, two different rhythms — late-night skyline eating vs. a daytime Gardens lunch stop",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "8 Raffles Avenue, Esplanade Mall (Makansutra); 18 Marina Gardens Drive, Gardens by the Bay (Satay by the Bay)",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Hours and stall lists sourced from esplanade.com official page (Makansutra) and gardensbythebay.com.sg official page (Satay by the Bay). Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["local-food", "waterfront"],
      interestCategories: ["dining"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "perennial",
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
