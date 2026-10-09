import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "bgt-rivalry-history-" + Date.now().toString(36);

const bodyContent = `The Border-Gavaskar Trophy was named in 1996-97 for Allan Border and Sunil Gavaskar, two batters who'd each passed 10,000 Test runs and, between them, defined how their countries played the format for a generation. What's happened since has made the trophy itself almost secondary to the cricket it now represents.

India has won the last four series in a row, and 10 of the 16 contested overall, against 5 for Australia and one drawn. That head-to-head alone tells you India has had the better of this rivalry for most of its modern history, but the number understates how close and how dramatic individual series have been.

The 2001 series is the one most often cited as the moment this rivalry became something bigger than a normal bilateral contest. Australia, on a 16-match winning streak, had India following on at Eden Gardens in Kolkata. VVS Laxman scored 281, Rahul Dravid added 180, and India won a Test that had looked finished after three days, then took the series. It's still regularly ranked among the greatest Test matches ever played, by anyone.

More recently, the 2020-21 tour produced a swing almost as dramatic in the opposite direction and back again within weeks. India were bowled out for 36 in Adelaide, their lowest Test score in the format's history, missing key players to injury for the rest of the tour. At the Gabba in Brisbane, a ground Australia hadn't lost at in decades, a patched-together Indian side chased 329 to win, Rishabh Pant's unbeaten innings sealing one of the least likely results in modern Test cricket. Two years before that, the 2018-19 tour had already produced India's first-ever series win on Australian soil, built on Jasprit Bumrah's 21 wickets and Cheteshwar Pujara's stubborn, hours-long innings.

Arriving at any ground on this tour, you're not just watching two good teams play cricket. You're watching the two sides responsible for a genuine run of the best Test cricket the sport has produced this century.`;

const whyItsSpecial = `Rivalries get called "the greatest" reflexively enough that the label rarely means much on its own. This one earns it on substance: a head-to-head this competitive, across this many series, producing this many matches now taught as reference points for what Test cricket can be at its best, isn't common. Knowing the 2001 Kolkata comeback and the 2021 Gabba chase before you sit down for this series changes what you're watching for, not just results, but the specific, repeated pattern of these two teams producing cricket that neither side's other rivalries quite match.`;

const insiderTips = [
  "If you only read up on two matches before this tour, make them 2001 Kolkata and 2021 Gabba — both are widely available in full and both explain, better than any stats table, why this rivalry carries the weight it does.",
  "India's four-series winning streak going into this tour means a lot of the pre-series discussion will focus on whether Australia can finally break it — worth knowing that framing before you follow local coverage in any of the three host cities.",
];

const whatToAvoid = `Don't assume recent history (India's four straight series wins) means this tour is a foregone conclusion — several of those series, including 2020-21, were won from genuinely desperate positions, and this rivalry has a well-established pattern of swinging hard within a single series. Don't treat the trophy's namesakes as trivia to skip past — Allan Border and Sunil Gavaskar's own rivalry as players, and their shared status as two of the format's most durable run-scorers, is part of why this contest carries the name and weight it does.`;

const gettingThere = `This is a historical overview, not a bookable location — see this pack's city-specific experiences for venue and travel detail.`;

const practicalInfo = {
  bookingMethod: "Not applicable — this is background reading, not a bookable experience.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Rivalry — A History of Border-Gavaskar Test Cricket",
      subtitle: "10 series wins in 16 for India, and two of the greatest Test matches this century.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: null,
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: Wikipedia (Border-Gavaskar Trophy), Business Standard/Cricbites winners lists, PlaySpots/AceMoneyTransfer rivalry overviews. Historical/editorial piece — no venue to rate.",
      sport: ["cricket"],
      moodTags: ["history", "rivalry", "context"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "INR",
      bestSeasons: ["jan", "feb", "mar"],
      advanceBookingRequired: false,
      availability: "perennial",
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
