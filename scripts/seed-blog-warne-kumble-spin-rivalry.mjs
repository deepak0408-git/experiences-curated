import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "warne-kumble-spin-rivalry";
const BGT_EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";

const bodyContent = `Shane Warne and Anil Kumble are both leg-spinners by classification. Watch them bowl and you'd struggle to believe that.

## Two different ways to take a wicket

Warne turned the ball a lot, enough that batsmen sometimes lost it off the pitch completely. He finished with 708 Test wickets at an average of 25.41, the most by any specialist spinner in the format's history at the time he retired. Kumble got to almost the same place a different way: less turn, more pace and bounce, and an accuracy that never gave batsmen anything loose to go after. He finished with 619 wickets at 29.65, third-highest ever, behind only Warne and Muttiah Muralitharan.

Kumble said later he never really understood why people kept comparing the two of them. "Warne was someone really different," he said. "He was on a different plane." Fair enough on the difference. Less fair on the gap mattering as much as everyone assumed.

## The series where it actually mattered

The clearest head-to-head came in 1997-98, when Australia toured India for three Tests. Warne took wickets, including Dravid, Tendulkar and Azharuddin in a single innings at Chennai. But the series belonged to Kumble: 23 wickets across three Tests, more than double what Australia's frontline spinner, Gavin Robertson, managed. India won 2-1. On home soil, against the man most people called the greatest spinner alive, Kumble was simply the better bowler across those three matches.

## The one night that separated them anyway

If you want a single measure of the gap between very good and genuinely historic, here it is: Kumble took all 10 wickets in an innings against Pakistan in 1999, only the second bowler in Test history to do it. Warne never managed all ten. His career strike rate, though, 57.4 balls per wicket against Kumble's 65.9, hints at something that one perfect night doesn't capture. Over hundreds of matches and thousands of overs, Warne got there a little faster, a little more often, across a longer and more varied career.

## Why both belong in this rivalry's story

Neither man needs the other to justify his legacy. Put them in the same series, though, and the contrast does the work: one bowler turned the ball more than almost anyone who's played the game. The other proved you didn't need to turn it much at all to get nearly as far. That's really what the Border-Gavaskar era's spin battle was about, not who had the better numbers, but two bowlers solving the same problem from opposite directions.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Warne vs. Kumble: Two Spinners, Two Philosophies",
    sport: ["cricket"],
    sportingEventId: BGT_EVENT_ID,
    contentCategory: "rivalry",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "One turned the ball more than almost anyone who's played the game. The other proved you didn't need to. Warne and Kumble solved the same problem from opposite directions.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Career Test figures (Warne 708 wickets at 25.41 average, strike rate 57.4; Kumble 619 wickets at 29.65 average, strike rate 65.9, third-highest wicket-taker ever behind Warne and Muralitharan) — Wikipedia 'Anil Kumble', thesportslegends.com, thequint.com ('Warne, Muralitharan, and Kumble: A Delectable Rivalry of Champions'). Kumble's quote on not understanding the comparison ('Warne was someone really different...on a different plane') — The Statesman (thestatesman.com). 1997-98 Australia tour of India: 3-Test series, India won 2-1, Kumble took 23 wickets vs Australia's Gavin Robertson's 12, Warne dismissed Dravid/Tendulkar/Azharuddin in a single Chennai innings — Wikipedia 'Australian cricket team in India in 1997-98' and ESPNcricinfo scorecard. Kumble's 10/74 vs Pakistan, Delhi 1999, second bowler in Test history after Jim Laker to take all 10 in an innings — scroll.in, cricketaddictor.com, Wikipedia 'Anil Kumble'. Verified 8 Oct 2026.",
    publishedAt: new Date("2026-10-08T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
