import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "india-australia-modern-test-cricket-rivalry";
const BGT_EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";

const bodyContent = `Most sports rivalries fade once one side pulls ahead for a while. This one hasn't. Over twenty-five years, India and Australia have swapped the upper hand in Test cricket often enough, and with enough real edge, that neither side has stayed on top for long.

## Kolkata, 2001: the match that reset the terms

Australia came into India in 2001 on a 16-match winning streak, by far the best Test team in the world. At Eden Gardens they looked ready to extend it. Australia posted 445 in the first innings, India collapsed to 171, and the follow-on was enforced. What happened next is still the sport's go-to example of a comeback.

VVS Laxman batted for over ten hours and scored 281, an innings Steve Waugh later called some of the best batting he'd ever seen. Rahul Dravid added 180, and the two put on 376 for the fifth wicket, pulling India to 657 for 7 declared. Harbhajan Singh then took 13 wickets in the match, including a hat-trick, bowling Australia out for 212. India won by 171 runs, only the third time in Test history a team had won after being made to follow on.

The result mattered less for the scoreline than for what it proved: India could beat this Australian team, in India, from total collapse. The modern version of this rivalry really starts here.

## The Warne-McGrath years, and India's one real stronghold

For most of the 2000s, Australia's bowling attack of Shane Warne and Glenn McGrath was close to unplayable everywhere in the world. India was the exception, specifically India at home. Warne took his world-record 533rd Test wicket on Indian soil, in Chennai in 2004, but his career record there stayed oddly modest, a single five-wicket haul across all his tours, against a batting lineup of Sachin Tendulkar, Dravid and Laxman that just didn't rattle against him the way other teams did.

Australia's golden generation beat almost everyone else comfortably through this decade. India's golden generation of batsmen kept every series between the two close anyway, even in the years Australia won the overall contest.

## India starts winning in Australia

For roughly the first 70 years of this fixture, India had never won a Test series on Australian soil. That changed in 2018-19. India won 2-1: Adelaide by 31 runs, a loss at Perth, Melbourne by 137 runs to seal it, a draw at Sydney. It was the first time any Asian team had won a Test series in Australia.

## The Gabba, 2021

Two years later, India came back to defend that result and nearly came apart doing it. In the first Test at Adelaide they were bowled out for 36, their lowest Test score ever, and lost by eight wickets. Players kept getting injured or ruled out through the rest of the tour. By the fourth Test at the Gabba, a ground Australia hadn't lost at in 32 years, India were down to a side missing most of their senior bowlers and batsmen.

They won anyway. Rishabh Pant made an unbeaten 89 to chase down 328 with three overs left, India's first win at the Gabba and the first by any touring side there in over three decades. The series finished 2-1 to India again.

## Why this one still matters

A lot of sporting rivalries are really just one team winning for a long time, dressed up as a contest. This isn't that. Australia had its stretch of total control through most of the 20th century and into the 2000s. India has had its own stretch over the last decade. The gap between the two has stayed thin enough that one innings, Laxman's 281, Pant's 89, can flip the whole story. Both sides have a genuine, recent claim to being the better team. Neither has settled it.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "India vs Australia: The Modern Era of Test Cricket's Fiercest Rivalry",
    sport: ["cricket"],
    sportingEventId: BGT_EVENT_ID,
    contentCategory: "rivalry",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "From Laxman's 281 at Eden Gardens to Pant's 89 at the Gabba, India and Australia have spent 25 years trading the upper hand in Test cricket's most competitive rivalry.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: 2001 Kolkata Test scorecard and match report (Australia 445, India 171 all out and 657/7 dec following on, Laxman 281, Dravid 180, 376-run partnership, Harbhajan 13 wickets inc. hat-trick, Australia 212 all out, India won by 171 runs) — ESPNcricinfo full scorecard and match report, espncricinfo.com. Shane Warne's 533rd-wicket world record at Chennai 2004 and his single 5-wicket haul in India — ABC News (abc.net.au) and sportsadda.com. 2018-19 series: India won 2-1 (Adelaide by 31 runs, lost Perth, won Melbourne by 137 runs, drew Sydney), first Asian team to win a Test series in Australia — Wikipedia 'Indian cricket team in Australia in 2018-19' and ESPNcricinfo series page. 2020-21 series: India bowled out for 36 at Adelaide (lowest-ever Test score) and lost by 8 wickets; won at Gabba chasing 328 with Pant's unbeaten 89, India's first-ever Gabba win and first by any touring side there in 32 years; series finished 2-1 to India — ESPN.com 'Greatest Tests' retrospective, Al Jazeera, Sportskeeda. Verified 8 Oct 2026.",
    publishedAt: new Date("2026-10-08T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
