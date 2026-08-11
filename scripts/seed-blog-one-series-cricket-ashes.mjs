import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "one-cricket-series-the-ashes";
const ASHES_EVENT_ID = "48b4aa73-0d07-4fb7-b2db-5a02bb377ff1";

const bodyContent = `Most trophies get handed over. The Ashes doesn't. The urn that gives the rivalry its name has stayed in one building since 1929, and every team that's ever "won" it has actually just won the right to hold a replica. That's the first thing that tells you this isn't a normal series.

## The whole rivalry started as a joke that never stopped being funny

On 29 August 1882, Australia beat England on English soil for the first time, at The Oval. Days later, a satirical newspaper obituary in The Sporting Times mourned "English cricket, which died at the Oval," joking that the body would be "cremated and the ashes taken to Australia." English captain Ivo Bligh, touring Australia that winter, promised to "regain those ashes" — and a group of women in Melbourne actually gave him a small terracotta urn containing burnt cricket-related ashes as a gift. That urn has lived at Lord's, in the custody of the Marylebone Cricket Club, ever since. It's never been officially awarded to anyone. Since 1998, winning teams have received a Waterford Crystal replica instead — the real one simply doesn't leave.

## It's a month-long story, not a single afternoon

The Ashes is played as five Test matches across five different grounds, alternating between England and Australia every two years — the 2027 series in England is already confirmed for Lord's, The Oval, Trent Bridge, and Southampton's Utilita Bowl, among others. Each Test can run up to five days on its own. That structure is the actual point: form swings across weeks, not overs, and a team that gets thrashed in the first Test has three more grounds and three more weeks to answer for it. No other cricket rivalry, and very few rivalries in any sport, ask both sides to sustain a single contest for that long.

## Why this is the pick

A World Cup final is one afternoon. The Ashes is a genuine, monthlong campaign built on a 140-year-old joke that both countries have taken completely seriously ever since — different ground every week, real ebb and flow, and a trophy that was never actually meant to be won. If you only see one cricket series in your life, make it the one where the story is as real as the cricket.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "If You Could Only Attend One Cricket Series, Make It the Ashes",
    sport: ["cricket"],
    sportingEventId: ASHES_EVENT_ID,
    contentCategory: "bucket_list",
    seriesSlug: "one_weekend_per_sport",
    seriesPosition: 4,
    excerpt: "The real Ashes urn has never left Lord's since 1929 — every winning team just gets a replica. A five-Test, five-ground campaign built on a 140-year-old joke both countries took dead serious.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: 1882 Oval defeat, Sporting Times mock obituary, Ivo Bligh's promise, Melbourne urn gift — topendsports.com, Wikipedia 'The Ashes urn', zeenews.india.com. Urn's permanent Lord's/MCC custody since 1929, never officially awarded, Waterford Crystal replica since 1998 — Wikipedia 'The Ashes urn'. Five-Test, alternating-country, multi-ground format — Wikipedia 'The Ashes' and hospitalityfinder.co.uk. 2027 confirmed venues (Lord's, The Oval, Trent Bridge, Utilita Bowl Southampton) — cricketmates.co.uk. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-15T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
