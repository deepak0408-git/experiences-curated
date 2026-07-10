import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "getting-to-wentworth-waterloo-longcross-" + Date.now().toString(36);

const bodyContent = `Wentworth is a day trip from London, not a separate travel destination the way Monza or Spa-Francorchamps are, and the transport reflects that. South Western Railway runs an hourly direct service from London Waterloo to Longcross, the station closest to the club, taking around 46 minutes. If you'd rather arrive via Virginia Water station itself, that's roughly a 58-minute direct journey from Waterloo, with Virginia Water sitting a short distance further from the club than Longcross.

Either way, this is a straightforward rail trip with no need for a car, and no need to book accommodation locally unless you want to, given how close London stays are. That's a genuinely different pattern than most of the events in this pack's expansion so far. Belgian GP and Italian GP both require multi-day travel and dedicated accommodation; BMW PGA can realistically be done as a single long day from central London, tournament and travel included.

If you're driving, Wentworth's own estate has parking, though on tournament days expect the roads around Virginia Water to be busier than usual, and factor in extra time. For most visitors without a car, the train is simpler and avoids the parking question entirely.`;

const whyItsSpecial = `What's worth flagging here is how much this changes the shape of a visit compared to the other events in this pack's family. You don't need to plan a multi-night trip to see BMW PGA properly, you can leave London in the morning, watch a full day of golf, and be back for a late dinner. That's rare for a tournament of this size and reach.

It also means the accommodation options in this pack (Coworth Park, Wheatsheaf Hotel) are genuinely optional rather than necessary, worth considering if you want to make a proper weekend of it, but not required the way a hotel booking is for an event that's genuinely far from home.`;

const practicalInfo = {
  hours: "South Western Railway direct services run hourly throughout the day from London Waterloo.",
  costRange: "Approximately £13-30 one way for the Waterloo-Longcross or Waterloo-Virginia Water direct services, depending on ticket type and time of travel.",
  bookingMethod: "Book via South Western Railway or a rail ticketing app for the best fares — no advance reservation is required for most off-peak tickets, but booking ahead can reduce cost on popular tournament days.",
  website: "https://www.southwesternrailway.com/train-times/london-waterloo-to-virginia-water",
  reservationsRequired: false,
};

const gettingThere = "Direct South Western Railway service from London Waterloo to Longcross (approximately 46 minutes) or Virginia Water (approximately 58 minutes), both within a short walk or shuttle of Wentworth Club.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to Wentworth — Waterloo to Longcross",
      subtitle: "A straightforward day trip from London — no car needed, hourly direct trains from Waterloo.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Longcross / Virginia Water",
      address: "Longcross Station, Chobham Ln, Longcross, Chertsey KT16 0DZ / Virginia Water Station, Station Approach, Virginia Water GU25 4DZ",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Longcross station is closer to Wentworth Club than Virginia Water station — use it as your default unless a specific train connection makes Virginia Water more convenient.",
        "If you're planning a single-day trip, check the last train back to Waterloo before you commit to staying for the full day's play — tournament crowds can make the evening trains busier than usual.",
      ],
      whatToAvoid: "Don't drive to Wentworth on tournament days without checking parking availability in advance — the roads around Virginia Water get considerably busier than a normal day, and the train is the simpler option for most visitors.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: thetrainline.com and southwesternrailway.com Virginia Water/Longcross to London Waterloo route pages, rome2rio.com Waterloo Station to Wentworth Club journey planner. Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["convenient", "practical"],
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
