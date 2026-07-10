import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "windsor-castle-long-walk-" + Date.now().toString(36);

const bodyContent = `No other event pack we've built has a day trip this significant sitting a few miles from the venue. Windsor Castle is the oldest and largest inhabited castle in the world and remains an official residence of the King, and it's close enough to Virginia Water that combining a golf day with a castle visit is genuinely realistic within one trip, not a stretch.

Inside, the State Apartments are the ceremonial rooms still used today for official visits and investitures, filled with works by Van Dyck and Rubens, French furniture, and armour collections. Queen Mary's Dolls' House, completed in 1924 with working lifts and running water, is a genuine curiosity worth seeking out rather than skipping past. The Changing of the Guard runs Tuesdays, Thursdays, and Saturdays year-round, and daily (except Sundays) from April through July, starting around 11am and lasting roughly 30 minutes.

The approach matters almost as much as the castle itself. The Long Walk, a dead-straight, tree-lined avenue running just over 2.5 miles, leads directly to the castle gates and is one of the more genuinely grand approaches to any building in England. 2026 opening hours run 10am to 5:15pm (last admission 4pm) through October, with tickets at £32 for adults booked in advance, rising to £36 on the day. Allow two and a half to three hours for a proper visit.`;

const whyItsSpecial = `I think what makes Windsor worth building real time into a BMW PGA trip for, rather than treating it as an optional afterthought, is that it's not a manufactured tourist add-on the way some "nearby attractions" lists can feel. This is a working royal residence, still in active use, a few miles from where you're watching a golf tournament. That proximity is unusual and worth taking advantage of.

The Long Walk earns its name in the literal sense, and I'd argue the walk itself is worth doing even if you've seen the castle before. There's a rhythm to a two-and-a-half-mile straight approach to a building this significant that a car journey simply doesn't replicate.`;

const practicalInfo = {
  hours: "March-October: 10:00-17:15 (last admission 16:00). November-February: 10:00-16:15 (last admission 15:00). Open Thursday-Monday most of the year; also open Tuesdays April-September (closed Wednesdays only in summer).",
  costRange: "£32 per adult booked in advance (£36 on the day); £16 for under-18s in advance (£18 on the day).",
  bookingMethod: "Book in advance via rct.uk (Royal Collection Trust official site) for the cheaper rate and to guarantee entry on your chosen date, especially during BMW PGA week when demand may overlap.",
  website: "https://www.rct.uk/visit/windsor-castle",
  reservationsRequired: true,
};

const gettingThere = "A short drive or taxi from Virginia Water/Wentworth; direct trains also run from Waterloo to Windsor & Eton Riverside. The Long Walk, a 2.5-mile tree-lined avenue, leads directly to the castle gates from the Windsor Great Park side.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Windsor Castle & The Long Walk",
      subtitle: "The world's oldest inhabited castle, a few miles from Wentworth — approached via a 2.5-mile tree-lined avenue.",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Windsor",
      address: "Windsor Castle, Windsor, Berkshire SL4 1NJ",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Book tickets in advance online — it's cheaper (£32 vs £36 for adults) and guarantees entry on your chosen date rather than risking a sold-out day.",
        "Time your visit around the Changing of the Guard (roughly 11am, Tuesdays/Thursdays/Saturdays year-round, daily except Sundays April-July) if the ceremony matters to you — check the specific day's schedule before travelling, as it's weather-dependent.",
      ],
      whatToAvoid: "Don't rush this into a half-day add-on around your golf schedule — allow two and a half to three hours for a proper visit to the State Apartments alone, plus time for the Long Walk if you want to do it properly rather than just driving straight to the gates.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: rct.uk official Royal Collection Trust site (opening hours, ticket prices, Changing of the Guard schedule), windsor.gov.uk Windsor Castle visitor page, savoredjourneys.com and alltrails.com on the Long Walk (2.5 miles, tree-lined avenue). Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["historic", "iconic", "royal"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      bestSeasons: ["sep"],
      advanceBookingRequired: true,
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
