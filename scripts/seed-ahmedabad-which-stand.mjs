import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "ahmedabad-which-stand-" + Date.now().toString(36);

const bodyContent = `With 132,000 seats, Narendra Modi Stadium doesn't really have a "wrong" stand so much as a wide spread of genuinely different experiences at different price points, and picking blind means you might end up somewhere that doesn't match what you actually wanted from the day.

If you want the traditionalist's view behind the bowler's arm, the Naroda End and Adalaj End stands put you in that classic sightline. For value without sacrificing a good look at the pitch, Blocks N and E are consistently flagged as the best combination of affordable pricing and genuinely solid views, a rarity at a ground this size where cheap seats can sometimes mean genuinely distant ones.

The Dream11 Stand sits in the mid-range tier, offering strong visibility without the premium price tag, a sensible pick if you want a proper seat without committing to hospitality-tier spending. Above that, the Torrent Corporate Box is air-conditioned with cushioned seating and food included, one of 76 corporate boxes at the stadium, each built to hold 25 people, and the ground's Club Pavilion and President's Gallery sit at the very top of the pricing structure with the fullest amenities.

Given this is the final Test of a five-match series, likely to carry real stakes either way the series has gone by the time it arrives, the honest advice is to think about what kind of five days you actually want: a traditionalist's view of the game from behind the arm, a loud, affordable seat with a good sightline, or a genuinely comfortable, air-conditioned day watching from a corporate box, all of which exist at this stadium simultaneously.`;

const whyItsSpecial = `A ground this enormous doesn't have one defining atmosphere the way a smaller, more intimate stadium does, it has several different ones happening at once in different stands. That's worth treating as a real decision rather than an afterthought, especially for a Test that will very possibly decide how this series is remembered. Picking the wrong stand at Modi Stadium doesn't ruin the day, but picking the right one for what you actually want, value, comfort, or sightline, meaningfully changes how you experience the last Test of a series this significant.`;

const insiderTips = [
  "If budget is the main constraint, Blocks N and E are specifically flagged as the best value-to-view ratio at this stadium — worth prioritizing over an equally-priced seat elsewhere in the ground.",
  "Corporate boxes here hold 25 people each and are genuinely air-conditioned with food included — a real consideration for a Test in late February/early March heat if a small group is willing to split the cost.",
];

const whatToAvoid = `Don't assume "premium" pricing automatically means the best sightline at a stadium this size — some of the higher-priced stands are named for sponsors and positioned for corporate visibility rather than for the clearest view of play, so check the actual sightline, not just the price tier. Don't underestimate the walk between entrance gates and your actual seat block — with 132,000 seats spread across a vast footprint, allow considerably more time than you would at a normal-sized ground to actually reach your section.`;

const gettingThere = `See the dedicated Getting to Motera experience in this pack for full transit detail from central Ahmedabad.`;

const practicalInfo = {
  bookingMethod: "General stands via BookMyShow or GCA's official channels closer to the match; corporate boxes and premium hospitality are typically allocated separately — enquire directly with the Gujarat Cricket Association.",
  costRange: "Recent comparable fixtures have ranged from roughly ₹1,000 for general stands up to ₹50,000-60,000 for premium hospitality suites; 2027 Test pricing not yet announced",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Ahmedabad Test — Which Stand to Pick",
      subtitle: "Blocks N and E for value, Naroda End for tradition, a corporate box if the heat's a concern.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Motera",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: CricketStadiumsInfo/SportsBoardIndia/SportsScroller Narendra Modi Stadium ticket and seating guides. Overview/strategy piece across the whole stadium — no single top-level Google Maps rating (see Narendra Modi Stadium sports_venue experience for the venue's own rating).",
      sport: ["cricket"],
      moodTags: ["ticket-strategy", "seating"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "INR",
      bestSeasons: ["feb", "mar"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences).values({ experienceId: result.id, sportingEventId: EVENT_ID }).onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
