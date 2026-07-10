import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "piccolino-virginia-water-village-" + Date.now().toString(36);

const bodyContent = `Piccolino sits on London Road in Virginia Water village itself, an easy walk or short taxi from Wentworth, and it's currently the top-ranked restaurant in the village on Tripadvisor. It's a proper Italian restaurant rather than a pub doing Italian food: open kitchen, a wine boutique, a cocktail bar, and a genuinely usable all-weather terrace for outdoor dining regardless of what a September evening in Surrey decides to do.

Kitchen hours run midday to 10pm most of the week, stretching to 11pm on Fridays and Saturdays, with the bar open later still. There's live entertainment on Friday and Saturday nights, which shifts the atmosphere from a straightforward dinner spot to something with a bit more energy if you're there on a weekend during tournament week.

This is the sensible, no-fuss dinner option if you've spent a full day at Wentworth and don't want to travel far or commit to a multi-hour tasting menu. Reservations are worth making, particularly during BMW PGA week when the village sees more visitors than usual, but this isn't a restaurant that requires the level of advance planning the Fat Duck does.`;

const whyItsSpecial = `Every pack needs a genuinely good, uncomplicated dinner option, and Piccolino does that job well specifically because it doesn't try to be anything more ambitious than a well-run Italian restaurant. After a long tournament day, that's often exactly the ceiling you actually want, good food, a decent wine list, somewhere to sit outside if the weather holds, without the multi-hour commitment of somewhere like the Fat Duck.

Its position as the top-rated restaurant in Virginia Water village also isn't incidental. Local reputation built over ordinary weeknights, not just tournament-week visitors, tends to be a more reliable signal than a single flashy review.`;

const practicalInfo = {
  hours: "Kitchen: Mon-Thu and Sun 12:00-22:00, Fri-Sat 12:00-23:00. Bar: Mon-Thu and Sun 12:00-23:00, Fri-Sat until midnight. Live entertainment Fridays and Saturdays.",
  costRange: "Mid-range Italian dining, typically £30-50 per person for a full meal with wine.",
  bookingMethod: "Book via OpenTable or by calling 01344 844756 — reservations recommended, especially during BMW PGA week and weekend evenings.",
  website: "https://piccolinorestaurants.com/our-restaurants/virginia-water/",
  reservationsRequired: false,
};

const gettingThere = "Located on London Road in Virginia Water village, a short walk or taxi ride from Wentworth Club and Virginia Water station.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Piccolino, Virginia Water Village",
      subtitle: "The village's top-rated Italian restaurant — a straightforward, no-fuss dinner near Wentworth.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Virginia Water Village",
      address: "Piccolino, London Road, Virginia Water, Surrey GU25 4QE",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Book ahead for Friday or Saturday evenings during tournament week — the village sees more visitors than usual and the live entertainment nights draw a bigger crowd.",
        "The all-weather terrace is worth requesting specifically if you want to eat outside — it's built to stay usable regardless of weather, unlike a typical open-air terrace.",
      ],
      whatToAvoid: "Don't expect a quiet, quick meal on a Friday or Saturday night — the live entertainment shifts the atmosphere toward something livelier, which suits some evenings better than others depending on what you're after.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: piccolinorestaurants.com official Virginia Water page, tripadvisor.com (ranked #1 of 13 restaurants in Virginia Water), windsor.gov.uk food and drink listing confirming kitchen/bar hours and live entertainment schedule. Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["casual", "social", "convenient"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-10",
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
