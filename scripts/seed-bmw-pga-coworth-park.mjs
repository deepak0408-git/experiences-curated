import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "coworth-park-ascot-" + Date.now().toString(36);

const bodyContent = `Coworth Park sits directly next to Wentworth and Virginia Water, close enough that "adjacent" is a more accurate description than any specific distance. It's a Dorchester Collection property, 5-star, set across 240 acres of Berkshire parkland, and it's the only hotel in the UK with its own polo fields on-site, alongside a full equestrian centre offering riding lessons and stabling. That's not incidental detail either, this is genuinely one of the more distinctive luxury stays in the country regardless of the golf happening down the road.

The rooms lean into that country-estate character: spacious, garden views throughout, copper baths, underfloor heating. The eco-spa has a roof made of fragrant herbs and includes a pool with underwater music, which is the kind of detail that sounds gimmicky until you're actually there. Woven by Adam Smith, the hotel's flagship restaurant, has held a Michelin star since 2017, built around modern British cooking with seasonal ingredients.

Nightly rates run from roughly £500 to £700 depending on season and day of the week (Mondays tend to be the cheapest), which puts this firmly in splurge territory. For BMW PGA week specifically, expect rates toward the top of that range and book well ahead, proximity to Wentworth during tournament week is exactly the kind of thing that drives demand up fast.`;

const whyItsSpecial = `What makes Coworth Park worth calling out specifically, rather than just "a nice hotel near the golf," is that it has its own identity entirely separate from Wentworth. The polo fields and equestrian centre aren't a nod to the area's country-estate reputation, they're a genuine, rare facility that most 5-star hotels in Britain simply don't have.

I think that matters for how you plan a trip here. This isn't a convenient hotel you tolerate because it's close to the tournament, it's a destination in its own right, one where you could easily build a day around the spa or a riding lesson and treat the golf as the reason you came rather than the whole of the visit.`;

const practicalInfo = {
  hours: "Standard hotel check-in/check-out; spa and equestrian centre bookable separately with advance reservation.",
  costRange: "From approximately £500-700 per night depending on season and day of week; expect premium pricing during BMW PGA Championship week.",
  bookingMethod: "Book directly via dorchestercollection.com or through major hotel booking platforms — advance booking strongly recommended for tournament week given proximity to Wentworth.",
  howToBook: "Book your BMW PGA week stay as early as possible, ideally as soon as the tournament dates are confirmed each year, since this is the closest true luxury option to Wentworth and demand spikes hard during tournament week specifically. If a Michelin dinner matters to your stay, reserve a table at Woven by Adam Smith when you book your room rather than waiting until you arrive; it's a small property and tournament week fills fast. If you're not a golfer but travelling with someone who is, ask about a polo lesson or equestrian centre session to build your own day around while they're at Wentworth.",
  website: "https://www.dorchestercollection.com/ascot/coworth-park",
  reservationsRequired: true,
};

const gettingThere = "Coworth Park sits directly adjacent to Wentworth and Virginia Water — a short drive or taxi from Longcross or Virginia Water station, and effectively walkable to the Wentworth estate depending on your exact route.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Coworth Park, Ascot",
      subtitle: "A 5-star Dorchester Collection estate next to Wentworth — the only UK hotel with its own polo fields.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Ascot / Virginia Water border",
      address: "Coworth Park, Blacknest Road, Ascot, Berkshire SL5 7SE",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Book a table at Woven by Adam Smith (the hotel's Michelin-starred restaurant) at the same time as your room — it's a small property and fills fast during BMW PGA week specifically.",
        "If you're not golfing yourself, ask about the on-site polo fields and equestrian centre for riding lessons — a genuinely distinctive way to spend a day here that has nothing to do with the tournament.",
      ],
      whatToAvoid: "Don't leave booking until close to tournament week — proximity to Wentworth makes this one of the first hotels in the area to sell out once BMW PGA dates are public, and rates rise noticeably as availability shrinks.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: dorchestercollection.com official Coworth Park page, michelin guide entry for Woven by Adam Smith (Michelin star since 2017), mrandmrssmith.com and various booking aggregators confirming 240-acre estate, on-site polo fields (only UK hotel with this), equestrian centre, eco-spa. Pricing verified via multiple booking platforms (~£500-700/night range). Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["luxury", "scenic", "equestrian"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
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
