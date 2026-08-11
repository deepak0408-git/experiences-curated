import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "border-gavaskar-most-intensely-contested-rivalry";
const BGT_EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";

const bodyContent = `Named after two men who'd done something nobody else had at the time, this rivalry didn't need manufactured stakes. It earned them on the field within its first five years.

## Named for two players who redefined the record books

The Border-Gavaskar Trophy began in 1996, named jointly after Sunil Gavaskar, India's legendary opener, and Allan Border, Australia's most-capped Test captain. At the time it was created, they were the only two players in history to have scored more than 10,000 Test runs each — a genuinely rare shared distinction that made naming the trophy after both of them an easy, obvious call rather than a political decision. India won the inaugural series in 1996-97, a Sachin Tendulkar-led team beating Australia by seven wickets at the Feroz Shah Kotla in Delhi.

## The match that turned it into a real rivalry

Australia arrived in India in 2001 on a 16-match winning streak, and in the second Test at Kolkata, they looked set to extend it — bowling India out for 171 and forcing the follow-on. What happened next is one of Test cricket's genuine turning points: VVS Laxman and Rahul Dravid built a 376-run partnership, Laxman finishing on 281, then the highest individual score by an Indian batsman in Tests. India declared, then bowled Australia out to win a match that had looked unwinnable two days earlier. That single Test reshaped how both countries approached the rivalry going forward.

## Why the scale genuinely matters

Both nations bring enormous, passionate fanbases to every series — India's crowds in particular bring an intensity that fills stadiums and dominates broadcast numbers worldwide, and the quality of cricket on both sides has stayed consistently high for two decades, unlike rivalries that fade once one side pulls clearly ahead. Former Australian captain Ricky Ponting has called the 2001 series "probably the most remarkable" of his career — a genuine assessment from someone who lived through the losing side of it.

## Why this rivalry still matters

Border-Gavaskar didn't need an invented narrative to become one of the sport's biggest series — it earned that status through a genuinely competitive two decades and one impossible comeback that neither country has forgotten. That's a rarer thing in sport than manufactured intensity: a rivalry that's actually justified by what happened on the field.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Border-Gavaskar — Cricket's Most Intensely Contested Modern Rivalry",
    sport: ["cricket"],
    sportingEventId: BGT_EVENT_ID,
    contentCategory: "rivalry",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Named after the only two players to have passed 10,000 Test runs at the time, this rivalry earned its intensity through one impossible 2001 comeback, not manufactured stakes.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: 1996 trophy naming, Gavaskar/Border's shared 10,000-run distinction, 1996-97 inaugural series result — outlookindia.com and cricketcountry.com. 2001 Kolkata Test: Australia's 16-match streak, India's 171 all out and follow-on, Laxman-Dravid 376-run partnership, Laxman's 281, India's win — espncricinfo.com scorecard and pressreader.com (Hindustan Times). Ponting's 'most remarkable' quote on the 2001 series, fanbase-scale framing — factspark.blog and sportskeeda.com. Retitled from the Content Calendar's working title ('cricket's most politically loaded rivalry') — no sourced political content was found to substantiate that framing, and inventing one would risk exactly the kind of unearned nationalism-adjacent stance the skill's hard editorial lines warn against; retitled to what the real, sourced story actually supports (sporting intensity, not politics). Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-22T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
