import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "chennai-hospitality-tiers-" + Date.now().toString(36);

const bodyContent = `Chepauk's stands run almost all the way around the ground, lettered A through K, and where you sit changes the experience more than at most Indian grounds because the stadium's shape and age mean the stands genuinely differ from each other, not just in price.

A and B stands sit behind the bowler's arm at the pavilion end, which is the classic, traditionalist's view of the game, you see the line of the ball the way the umpire does. I and J stands, on the Wallajah Road side, are where the loudest, most engaged crowd tends to gather; TNCA's own IPL-era seating puts the most vocal supporters there, and for a Test match that translates into the stands most likely to be following every ball rather than treating the day as a social outing. F, G, and H run along the west boundary and are generally the more affordable, more casual sections.

Above general seating, Chepauk has genuine tiered hospitality: the Anna Pavilion and the stadium's AC boxes offer air-conditioned viewing with food and drink included, a real option in Chennai's January-February heat and humidity, which can be a serious factor across five days of play. These sit meaningfully above general admission in price and are TNCA-allocated rather than sold the same way as standard tickets.

For a Test specifically, rather than the shorter, louder IPL format this stadium is more famous for hosting, the honest advice is to weight your decision toward comfort over atmosphere unless you specifically want the I/J-stand energy. Five days of sitting in open sun in Chennai's climate is a real physical consideration that a T20 crowd doesn't have to think about in the same way.`;

const whyItsSpecial = `Most fan guides to a cricket ground describe the stands as generically "close to the action" or "good value," without engaging with what actually differs between them. Chepauk's stands genuinely have different personalities, built up over a century of the ground evolving in sections rather than as one uniform bowl, and that's worth knowing before you buy rather than discovering on day one. Picking A/B for the bowler's-eye view, I/J for the crowd energy, or the Anna Pavilion for shelter from the heat are three different, equally valid ways to watch the same Test, and which one is right for you depends on what you actually want from five days at the ground.`;

const insiderTips = [
  "If you're attending multiple days across a five-day Test, weigh the Anna Pavilion or AC boxes seriously even at the higher price — Chennai's January-February heat and humidity are a genuine endurance factor across a full day in open stands.",
  "I and J stands, closest to the Wallajah Road side, are where the ground's most vocal, most engaged crowd tends to concentrate — a good pick if you want the atmosphere Chepauk is known for, less good if you want a quiet, focused view of the cricket.",
];

const whatToAvoid = `Don't buy the cheapest general seating without checking which stand it's actually in — F, G, and H are considerably more casual sections than A/B or I/J, and "general admission" at Chepauk isn't one uniform experience the way it might be at a newer, symmetrical stadium. Don't assume hospitality-tier tickets go on sale through the same channel as general admission — TNCA typically allocates Anna Pavilion and box seating separately, and it's worth asking directly rather than assuming it will appear on the standard booking platform.`;

const gettingThere = `See the dedicated Getting to Chepauk experience in this pack for transit detail from central Chennai.`;

const practicalInfo = {
  bookingMethod: "General admission via BookMyShow/Paytm Insider closer to the match date. Hospitality-tier seating (Anna Pavilion, AC boxes) is typically allocated separately through TNCA — enquire directly rather than expecting it on the standard ticketing platform.",
  costRange: "General stands roughly ₹1,200+ on recent comparable fixtures; VIP/hospitality boxes upward of ₹30,000 — 2027 Test pricing not yet announced",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Chennai Test — Hospitality & Ticket Tiers",
      subtitle: "A/B for the bowler's-eye view, I/J for the noise, the Anna Pavilion if the heat worries you.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Chepauk",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: TimesOfSports/SportsScroller/CricketStadiumsInfo Chepauk seating-plan guides, Wikipedia. Overview/strategy piece across the whole stadium — no single top-level Google Maps rating (see Chepauk sports_venue experience for the venue's own rating).",
      sport: ["cricket"],
      moodTags: ["ticket-strategy", "seating"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "INR",
      bestSeasons: ["jan", "feb"],
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
