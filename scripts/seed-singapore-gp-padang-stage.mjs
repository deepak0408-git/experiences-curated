import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-padang-stage-concerts-" + Date.now().toString(36);

const bodyContent = `Singapore is the one race on the calendar built as much around the concerts as the racing. Ten stages run across the Marina Bay circuit park over the weekend, and the Padang Stage is the headline venue, hosting the biggest acts straight after each day's on-track sessions wrap.

The 2026 lineup is genuinely stacked: JJ Lin and K-pop group CORTIS open Friday night, Zara Larsson and The Killers headline Saturday straight after qualifying, and Lana Del Rey makes her first-ever Singapore concert appearance on Sunday alongside James Arthur. The wider bill across the weekend's ten stages adds Split Enz, Goo Goo Dolls, Janet Jackson, Mark Ronson, DJ Snake, Major Lazer Soundsystem, and Rev Run, among others, so even zones without Padang access get real entertainment, not filler.

Access depends on your ticket zone, not a separate concert pass. A Zone 4 ticket, whether a grandstand like Padang or Stamford, or a Zone 4 Walkabout, gets you into Padang Stage performances. If the Wharf Stage or Barge Stage lineups matter to you instead, you need a Zone 1 ticket, Padang alone won't get you there. This is worth checking before buying: assuming any ticket gets you to any stage is the most common mistake first-timers make with this race.

Because the stages run after the day's sessions finish, a full race day here genuinely runs from afternoon practice or qualifying through to a late-night headline set, and the floodlit night race format means the whole thing happens under lights rather than winding down at sunset like most Grands Prix.`;

const whyItsSpecial = `No other race on the F1 calendar treats its concert lineup as a genuine second reason to buy a ticket, not an afterthought bolted onto race weekend. Lana Del Rey choosing Singapore for her first-ever show in the country, on the same stage where qualifying happened hours earlier, is the kind of scheduling that only makes sense at this specific race. I think the honest way to frame this experience is that Singapore sells two events under one ticket, and which one matters more to you should genuinely shape which zone and stand you buy, not just which corner has the best sightline.`;

const insiderTips = [
  "Check your ticket's zone against the specific stage lineup before buying if a particular artist matters to you — Zone 4 (Padang) and Zone 1 (Wharf/Barge) have separate, non-overlapping access.",
  "Set times run late given the night-race format, plan your last MRT connection or transport home before committing to stay for a headline closer like Lana Del Rey's Sunday set.",
];

const whatToAvoid = `Don't assume a general Zone 4 ticket guarantees a good view of the Padang Stage itself — proximity varies by grandstand and viewing platform, and the closest sightlines (Padang Grandstand specifically) come at a real premium over other Zone 4 options.`;

const practicalInfo = {
  hours: "Performances run after each day's on-track sessions conclude, into the night, Friday–Sunday 9–11 Oct 2026",
  costRange: "Included in the price of any valid Zone 4 (Padang Stage) or Zone 1 (Wharf/Barge Stage) ticket — no separate concert ticket exists",
  bookingMethod: "Access comes bundled with your circuit ticket zone — check singaporegp.sg's stage/zone map before buying if a specific artist is the priority.",
  howToBook: "",
  website: "https://singaporegp.sg/en/news/2026/singapore-gp-completes-star-studded-entertainment-line-up-for-the-formula-1-singapore-airlines-singapore-grand-prix-2026/",
  reservationsRequired: false,
};

const gettingThere = "Padang Stage sits within Zone 4, accessible via Gates 3A, 4, 5, 6, or 7. Wharf/Barge Stage performances are in Zone 1, via Gate 1.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Padang Stage — the concert half of race weekend",
      subtitle: "Lana Del Rey, The Killers, JJ Lin — Singapore is the one GP built as much around the music as the race",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "Padang Stage, Zone 4, Marina Bay Street Circuit, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from singaporegp.sg official 2026 entertainment lineup announcement and cross-referenced against Billboard/Urban List coverage. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "festival"],
      interestCategories: ["sport", "music"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "event_only",
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
