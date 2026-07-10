import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "72-lounge-green-on-18-" + Date.now().toString(36);

const bodyContent = `The Championship Pavilion is Wentworth's biggest hospitality building, sitting right on the 18th green, and it holds a stack of different packages at different price points rather than one single experience. Two of them are worth understanding together, because they're really the entry point and the mid-tier of the same building.

72 Lounge, from £370 per person, made its debut in 2025 and sits in the heart of the Championship Village close to the 18th green and the Show Stage. It's unreserved seating, a mix of indoor and outdoor space, casual breakfast and lunch with a variety of bowl foods and cuisines, a complimentary bar, and access to a seat in the 18th Green Grandstand reserved until 4pm. It's the most laid-back of Wentworth's premium tiers, closer to a relaxed lounge than formal hospitality.

Green on 18, from £750 per person, is the step up: ground-level hospitality inside the Championship Pavilion itself, with private tables in a shared dining area, a 3-course lunch served with wine, and all-day access to a covered, spacious greenside terrace directly overlooking the 18th. It's a genuinely different format from 72 Lounge, seated dining rather than casual bowl food, and a terrace view rather than a grandstand seat.

New for 2026, a 72 Signature Lounge has also been added on the upper deck of the same building, with sweeping views over the Village and its own access to the 18th Grandstand — worth knowing about if the standard 72 Lounge sells out or you want the elevated vantage point specifically.`;

const whyItsSpecial = `What I like about laying these two out together is that they make an honest case for choosing based on what kind of day you actually want, not just how much you're willing to spend. 72 Lounge is for someone who wants to be near the golf and the Village atmosphere without committing to a formal meal. Green on 18 is for someone who wants a proper sit-down lunch with wine and a genuinely elevated view of the tournament's signature hole.

Both put you inside the same building on the same green, which matters more than the price difference suggests. You're not choosing between good and bad access, you're choosing between two different rhythms for the same excellent location.`;

const practicalInfo = {
  hours: "Full-day access during tournament hours; 18th Green Grandstand access included with 72 Lounge is reserved until approximately 4pm.",
  costRange: "72 Lounge from £370 per person; Green on 18 from £750 per person (2026 pricing); a new 72 Signature Lounge (upper deck) is also available for 2026.",
  bookingMethod: "Book via the official BMW PGA Championship hospitality pages, or contact the premium team directly at premium@etghq.com or +44 1344 840681 (10am-4pm Monday to Friday).",
  howToBook: "If you want the more relaxed, lower-cost entry to Wentworth's hospitality, book 72 Lounge — but note it made its debut only in 2025 and demand has grown since, so book earlier than you might for an established package. If a proper sit-down lunch and the best static view of the 18th green matters more to you, Green on 18 is worth the jump in price; ask specifically about the covered terrace seating when booking, since that's the differentiator from the indoor dining area. The new-for-2026 72 Signature Lounge on the upper deck is worth asking about directly if the standard 72 Lounge is sold out by the time you book — it's a newer tier and availability may be less pressured initially.",
  website: "https://www.europeantour.com/dpworld-tour/bmw-pga-championship-2026/tickets-packages/",
  reservationsRequired: true,
};

const gettingThere = "The Championship Pavilion sits directly on the 18th green — follow hospitality signage from the main spectator entrance, distinct from general admission routes.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "72 Lounge & Green on 18",
      subtitle: "Two tiers of the same Championship Pavilion on the 18th green — casual lounge or seated 3-course lunch.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Wentworth Club, Virginia Water",
      address: "Wentworth Club, Wentworth Drive, Virginia Water, Surrey GU25 4LS",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "72 Lounge only debuted in 2025 and demand has grown fast since — don't assume it's an easy last-minute booking the way a newer package might suggest.",
        "Green on 18's covered terrace is the real differentiator from the indoor dining area — ask for it specifically when booking if an all-day outdoor view of the 18th matters to you.",
      ],
      whatToAvoid: "Don't book Green on 18 expecting a casual, drop-in-and-out experience — it's a seated 3-course lunch format, which suits a slower day more than someone who wants to move freely between watching golf and eating.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: eventmasters.co.uk 72 Lounge and Championship Pavilion hospitality pages, koobit.com Green on 18 and 72 Lounge ticket pages (2026 pricing: 72 Lounge £370pp, Green on 18 £750pp), grandstandtickets.com confirming both packages within the same Championship Pavilion building. Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["premium", "social", "dining"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "GBP",
      bestSeasons: ["sep"],
      advanceBookingRequired: true,
      availability: "event_only",
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
