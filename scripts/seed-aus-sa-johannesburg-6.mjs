import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40";
const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";
const slug = "kruger-2-day-safari-johannesburg-" + Date.now().toString(36);

const bodyContent = `Kruger National Park sits roughly five hours from Johannesburg by road, which means a 2-day trip spends real time in transit at both ends. It's worth going in with that expectation rather than picturing a leisurely multi-day safari - this is a compressed, efficient version built for people who don't have a week to spare.

A typical 2-day package, like the one run by Africa Moja Tours, starts around R10,500 per person and follows the same basic shape most operators use. Day one: an early departure from Johannesburg, arriving in Hazyview near the park's Phabeni Gate around midday, then an afternoon game drive of roughly four hours in an open safari vehicle. Overnight at a lodge in Hazyview, Tembo Guest Lodge is one commonly used property, with en-suite rooms and a pool. Day two starts early, a 6am game drive lasting around four and a half hours, chasing the best wildlife activity before the heat sets in, followed by the five-hour drive back to Johannesburg, typically arriving mid-to-late afternoon.

That structure means two real game drives, one at dusk and one at dawn, which are genuinely the best windows for spotting the Big Five. What you're trading for the shorter format is depth - a longer safari gives more chances to actually find all five animals and lets sightings develop over multiple days rather than two concentrated sessions.

Packages typically include return road transfers, one night's accommodation, both game drives with a professional guide, park conservation fees, breakfast, and bottled water for the transfers. Confirm exactly what's included before booking, since meal coverage in particular varies between operators.`;

const whyItsSpecial = `I think the honest way to sell a 2-day Kruger trip is to be upfront about what it isn't. It isn't a proper safari holiday. It's a genuinely well-designed compressed version that gets you two real, professionally guided game drives during the hours wildlife is actually active, bookended by a long but manageable drive each way.

For a cricket trip where you're not going to carve out a week, this is the realistic way to add Kruger to the itinerary rather than skip it entirely. The trade-off is real - you're spending nearly as much time driving as safari-ing - but the alternative is not doing it at all, and two dawn-and-dusk drives with a professional guide beats that by a wide margin.`;

const practicalInfo = {
  hours: "2-day format: day one departure from Johannesburg roughly 4.5-5 hours, afternoon game drive on arrival; day two early morning game drive from around 6am, then the return drive to Johannesburg",
  costRange: "From around R10,500 per person for a 2-day package including transfers, one night's accommodation, two game drives, park fees, and breakfast - confirm exact inclusions with the operator before booking",
  bookingMethod: "Africa Moja Tours (+27 76 398 3648 / info@africamojatours.com) runs a confirmed 2-day Johannesburg package via Tembo Guest Lodge in Hazyview. Multiple other operators, including Moafrika Tours and Wildlife Safaris, run comparable 2-day packages - compare before booking, since inclusions and vehicle group size vary.",
  website: "https://www.africamojatours.com/tour/2-day-kruger-safari-from-johannesburg/",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Kruger National Park — 2-Day Big 5 Safari from Johannesburg",
      subtitle: "A compressed but real safari, two dawn-and-dusk game drives bookended by a long day of driving each way",
      slug,
      experienceType: "multi_day",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Hazyview / Kruger National Park",
      address: null,
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "The two game drives run at dusk (day one) and dawn (day two) specifically because those are the hours wildlife is most active, not an arbitrary scheduling choice.",
        "Confirm exactly which meals are included before booking - packages commonly include breakfast but vary on lunch and dinner coverage.",
      ],
      whatToAvoid: "Don't book a 2-day trip expecting a relaxed pace - roughly 9-10 hours of the trip is spent driving to and from Johannesburg, so this is a genuinely efficient, front-loaded itinerary rather than a leisurely getaway.",
      practicalInfo,
      gettingThere: "Tour operators handle return road transfers directly from Johannesburg as part of the package - no separate travel arrangement needed.",
      editorialNote: "Sources: africamojatours.com/tour/2-day-kruger-safari-from-johannesburg (confirmed pricing, itinerary, accommodation, contact details), safaribookings.com, africanbudgetsafaris.com, knaptours.com. Verified 14 Jul 2026. Assessed for Concierge (howToBook) eligibility - real contact exists but no confirmed genuine lead-time trap or named premium tier was found, so kept as standard bookingMethod content rather than forcing a thin Pro entry.",
      sport: ["cricket"],
      moodTags: ["adventure", "wildlife", "efficient"],
      interestCategories: ["nature", "adventure"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "splurge",
      budgetCurrency: "ZAR",
      bestSeasons: ["sep", "oct"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-14",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
