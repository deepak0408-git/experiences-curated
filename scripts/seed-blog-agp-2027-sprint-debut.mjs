import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "why-2027-is-the-year-to-see-a-sprint-weekend-at-albert-park";
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian Grand Prix 2027

const bodyContent = `## A format Melbourne has never run

Albert Park has hosted the Australian Grand Prix every year since Formula 1 arrived in 1996, except for 2020 and 2021, when the race was cancelled due to COVID-19, 29 editions in total. Every one of them has followed the same shape: practice on Friday and Saturday morning, qualifying Saturday afternoon, race on Sunday. The 2027 Australian Grand Prix, 1-4 April, breaks that pattern for the first time. It's Australia's first-ever F1 Sprint weekend.

Victoria's Minister for Major Events, Anthony Carbines, put it plainly announcing the change: "Melbourne is the home of the Formula 1 Australian Grand Prix, and in 2027 we're taking it to another level with Australia's first-ever Sprint Race." Australian Grand Prix Corporation CEO Travis Auld framed the appeal for fans specifically: "Friday and Saturday now offering more on-track action than ever before."

## What actually changes across the weekend

Under F1's current Sprint format, Friday carries a single practice session followed by Sprint Qualifying, which sets the grid for a short, standalone race, roughly a third of a full Grand Prix distance, run on Saturday morning. Saturday afternoon then holds regular qualifying for Sunday's Grand Prix. That means two genuinely competitive, points-paying sessions happen before the main race ever starts: the Sprint pays points eight deep (8-7-6-5-4-3-2-1) toward the same championship totals as the Grand Prix itself.

For a fan at Albert Park, the practical effect is that Friday and Saturday stop being warm-up days. There's real jeopardy in Friday's Sprint Qualifying, since a bad session there sets a driver's grid slot for Saturday's Sprint with no second chance. Saturday itself carries a genuine race with a genuine result, followed immediately by qualifying for Sunday. None of the three days is a rehearsal for the next one.

## Why this matters for planning a trip

Sprint weekends put a premium on being there for more than just Sunday. A ticket that only covers race day misses an entire extra competitive session that counts toward the championship, something no previous Melbourne Grand Prix has ever offered. The 2027 dates also land inside Victorian school holidays, which the organizers have pointed to directly as part of the appeal for family attendance, and it's worth factoring into how early accommodation gets booked around the park.

Three decades into hosting the sport, Melbourne is getting a genuinely different race weekend, not just a new coat of paint on the same schedule. For anyone deciding which year to make the trip, a first-ever format is a real, concrete reason 2027 is a different pitch than "just go to the Grand Prix again."`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Why 2027 Is the Year to See a Sprint Weekend at Albert Park",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "why_go",
    excerpt: "Melbourne has hosted a Grand Prix since 1996, but it's never run an F1 Sprint. In April 2027, that changes, and it means real, points-paying racing on both Friday and Saturday, not just Sunday.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: grandprix.com.au, 'Formula 1 Australian Grand Prix 2027 dates confirmed with debut of a Sprint Race' — 1-4 Apr 2027 dates, 'Australia's first-ever' Sprint framing, Travis Auld quote, school-holiday timing. premier.vic.gov.au, 'Melbourne To Start 2027 With Formula 1 Sprint First' — Anthony Carbines quotes, Grand Prix contract secured to 2037. Motor Sport Magazine, 'How 2026 F1 sprint races work' — Sprint weekend session structure (Fri practice + Sprint Qualifying, Sat Sprint + Grand Prix qualifying, Sun Grand Prix), 8-7-6-5-4-3-2-1 points scale. Race-count figure (29 editions 1996-2026, excluding cancelled 2020/2021) cross-checked across Wikipedia's Australian Grand Prix and Albert Park Circuit pages plus GPFans.com. Also see project_australian_gp_2027_sprint_format memory (confirmed same session skeleton 20 Sep 2026, exact clock times not yet published). Researched 20 Sep 2026. Article 4 of 4 in the Australian GP 2027 blog batch (angles locked with founder 20 Sep 2026) — batch complete. Hero image pending — all 4 articles' images to be sourced/applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-09-23T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
