import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "wheatsheaf-hotel-virginia-water-" + Date.now().toString(36);

const bodyContent = `The Wheatsheaf is roughly 0.7 miles from Wentworth, an 18th-century coaching inn turned hotel, sitting on the edge of Windsor Great Park close to Virginia Water Lake. It's part of the Chef & Brewer Collection, which tells you the character of the place before you even arrive: a proper pub with rooms attached, rather than a hotel that happens to have a bar.

There are 31 guest rooms, straightforward and well-kept rather than luxurious, each with free Wi-Fi, a desk, and tea and coffee facilities. Daily housekeeping is included. Nightly rates run from roughly £70 to £95, which puts this firmly at the accessible end of the accommodation options near Wentworth, a genuine alternative if Coworth Park's price point isn't what you're after.

The restaurant and bar downstairs handle the food side of a stay here, and the location, right on the edge of Windsor Great Park, means you're close to Virginia Water Lake and within striking distance of Windsor itself if you want to build a day trip around the wider area rather than just the golf.`;

const whyItsSpecial = `Every event pack needs a sensible, unglamorous option alongside the marquee luxury pick, and the Wheatsheaf does that job honestly. It's not trying to compete with Coworth Park on facilities or atmosphere, it's a solid, historic building doing exactly what a coaching inn has done for a couple of centuries: put people up for the night, feed them, and put them within walking distance of wherever they're actually going.

For BMW PGA specifically, that walking distance to Wentworth is the real value here. You're not paying for polo fields or a Michelin star, you're paying for proximity and a straightforward, comfortable stay at a price that doesn't require a splurge budget.`;

const practicalInfo = {
  hours: "Standard hotel check-in/check-out; restaurant and bar open daily.",
  costRange: "From approximately £70-95 per night, depending on season and day of week.",
  bookingMethod: "Book directly via chefandbrewer.com or through standard hotel booking platforms (Booking.com, Expedia, Hotels.com) — no advance booking required outside of peak tournament week, though earlier booking is recommended during BMW PGA due to proximity to Wentworth.",
  website: "https://www.chefandbrewer.com/pubs/surrey/wheatsheaf-hotel",
  reservationsRequired: false,
};

const gettingThere = "Approximately 0.7 miles from Wentworth Club — walkable or a short taxi ride, and close to Virginia Water station for onward travel to London Waterloo.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Wheatsheaf Hotel, Virginia Water",
      subtitle: "An 18th-century coaching inn 0.7 miles from Wentworth — the accessible-price alternative to Coworth Park.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Virginia Water",
      address: "Wheatsheaf Hotel, London Road, Virginia Water, Surrey GU25 4QF",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "This is one of the closest walkable options to Wentworth — factor that in against slightly further but cheaper alternatives further from Virginia Water if walking distance to the tournament matters to you.",
        "Book ahead specifically for BMW PGA week rather than assuming last-minute availability — its proximity to Wentworth means it fills faster than its everyday pricing might suggest during tournament dates.",
      ],
      whatToAvoid: "Don't expect luxury-tier facilities at this price point — this is a straightforward, well-kept pub-hotel, not a resort. If you want spa facilities or fine dining on-site, Coworth Park is the better fit.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: chefandbrewer.com official Wheatsheaf Hotel page, various booking aggregators (Hotels.com, Kayak, Travelocity) confirming 31 rooms, 18th-century building, edge of Windsor Great Park location, ~£70-95/night pricing. Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["accessible", "historic", "convenient"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
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
