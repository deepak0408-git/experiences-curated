import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "monkeygate-sydney-test-2008";
const BGT_EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";

const bodyContent = `The second Test of the 2007-08 Border-Gavaskar Trophy, played at the Sydney Cricket Ground in January 2008, is remembered for two separate controversies that happened to collide in the same match.

## What was alleged

During the match, Andrew Symonds said Indian spinner Harbhajan Singh called him a "monkey." Harbhajan denied it, saying he'd used a Hindi phrase aimed at Symonds that had nothing to do with race, and that it had been misheard. Match referee Mike Procter ruled against Harbhajan: guilty of a Level 3 breach of the ICC's code of conduct, banned for three Tests. Procter said he was satisfied beyond reasonable doubt that Harbhajan had directed the word at Symonds and meant it to offend on the basis of his race.

## The umpiring, and a tour that nearly ended early

The same Test also turned on a string of contentious umpiring calls, nearly all of which went Australia's way. Sourav Ganguly was given out to a catch replays showed had bounced before it reached the fielder. Rahul Dravid was given out caught behind off his pad. Andrew Symonds survived several close chances on his way to the innings that effectively won Australia the match. Combined with the Harbhajan ban, it was enough that the BCCI formally threatened to pull the Indian team out of the tour rather than keep playing. The ICC responded by removing umpire Steve Bucknor from the rest of the series at India's request.

## The appeal, and what it actually found

Harbhajan's three-match ban went to appeal, heard by New Zealand judge John Hansen. Hansen's ruling went the other way from Procter's: he found the racism charge not proven. Harbhajan was instead found guilty of a lesser offense, abusive language that didn't amount to racial abuse, and fined 50 percent of his match fee instead of being banned. The tour continued.

## What happened after

Harbhajan and Symonds ended up on the same side a few years later, playing together for Mumbai Indians in the IPL. Symonds has said that during that stretch, an emotional Harbhajan apologized to him privately for what happened at Sydney. Ricky Ponting, Australia's captain at the time of the original Test, later called the whole episode the lowest point of his captaincy.

## Why it still comes up

Nearly two decades on, Monkeygate is still the reference point whenever this fixture gets heated. It's the one occasion the rivalry broke past cricket's normal boundaries and came close to rupturing the relationship between the two boards outright. People who were at the ground that week still disagree about both the original allegation and the eventual ruling. For a few days in January 2008, though, an ordinary Test match turned into something closer to a diplomatic incident.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Monkeygate: The Sydney Test That Nearly Broke the Rivalry",
    sport: ["cricket"],
    sportingEventId: BGT_EVENT_ID,
    contentCategory: "rivalry",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "A racism allegation, a string of contentious umpiring calls, and a threatened tour walkout — the 2008 Sydney Test is still the reference point for how heated this rivalry can get.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Symonds' allegation and Harbhajan's denial, Procter's Level 3 finding and 3-Test ban, Procter's 'beyond reasonable doubt' quote — ESPNcricinfo 'Harbhajan hit with three-Test ban' (espncricinfo.com/story/harbhajan-hit-with-three-test-ban-329440), Al Jazeera 'Harbhajan banned for three tests'. Umpiring controversies (Ganguly given out off a bounced catch, Dravid given out caught behind off pad, Symonds surviving close chances) and BCCI's tour-suspension threat — mynation.com 2007-08 series retrospective, ESPNcricinfo 'The aftermath of the Sydney Test'. ICC removing Steve Bucknor from the series at India's request — Al Jazeera 'Cricket board agrees to bar Bucknor'. Appeal outcome: Justice John Hansen found the racism charge not proven, downgraded to a Level 2.8 abuse charge, 50% match-fee fine — ESPNcricinfo 'Harbhajan racism charge not proven - Hansen' (espncricinfo.com/story/harbhajan-racism-charge-not-proven-hansen-333986), scroll.in retrospective. 2011 IPL reconciliation (Harbhajan's private apology per Symonds) — ESPNcricinfo 'Harbhajan broke down when apologising for monkeygate - Andrew Symonds'. Ponting calling it the lowest point of his captaincy — gulfnews.com. Both sides' accounts reported neutrally per the skill's hard editorial line against taking a side in a live, disputed allegation involving named individuals. Verified 8 Oct 2026.",
    publishedAt: new Date("2026-10-08T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
