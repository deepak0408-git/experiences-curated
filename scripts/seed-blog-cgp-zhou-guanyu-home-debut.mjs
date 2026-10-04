import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-home-race-that-took-twenty-years-to-happen";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese GP 2027 (Shanghai)

const bodyContent = `## Twenty years of a home race with no one from home

Formula 1 raced in Shanghai every year from 2004 (with a pandemic-driven gap from 2020-2023), but for the first eighteen runnings of the Chinese Grand Prix, not a single Chinese driver ever started the race. The country had a round on the calendar, a purpose-built circuit, and no representation on the grid — a genuine gap that lasted almost two decades.

That changed with Zhou Guanyu, who made his F1 debut with Alfa Romeo in 2022 as the first Chinese driver to reach the sport. But his actual home race didn't come until 2024, when the Chinese Grand Prix returned to the calendar after its pandemic hiatus and Zhou lined up at Shanghai as a Formula 1 driver for the first time — 20 years, almost to the anniversary, after the circuit's 2004 debut.

## A sellout, finally

The difference showed up immediately in attendance. The 2024 race drew a sellout crowd, the first time that had happened at Shanghai since the inaugural 2004 event. Zhou, born and raised in Shanghai, described himself simply as "a Shanghai boy" racing in front of his own city for the first time, and said the moment carried weight beyond his own result: "Without it, my journey wouldn't have begun, and I wouldn't be standing here twenty years later, racing on home turf."

## Why it matters beyond one race weekend

Zhou has been direct about what he thinks the moment did for the sport domestically, saying fans who'd drifted away from F1 were coming back, and that a younger generation was discovering it for the first time specifically because there was finally someone to watch for. Whether or not that fully holds up over the following seasons, the 2024 race itself is a genuine landmark: a circuit that hosted a world championship round for two decades before it ever got to host a home driver, and a sellout crowd the moment it finally did.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Home Race That Took Twenty Years to Happen",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "why_go",
    excerpt: "The Chinese Grand Prix ran for 18 years before a Chinese driver ever started it. Zhou Guanyu's 2024 home debut drew Shanghai's first sellout crowd since the race began in 2004.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: Wikipedia, '2024 Chinese Grand Prix' — 20th anniversary framing, first home appearance for a Chinese driver at the event. Sky Sports, 'Chinese GP: Zhou Guanyu on impact of Shanghai race's return' — Zhou's quoted comments on fan interest returning and younger fans discovering F1. PRNewswire, 'Zhou Guanyu Takes Center Stage at Shanghai F1 Grand Prix' — home-debut framing, sellout crowd detail. English.jiading.gov.cn / Chinadaily.com.cn coverage of Zhou's Shanghai press remarks — direct 'Shanghai boy' quote and 'without it, my journey wouldn't have begun' quote. Researched 23 Sep 2026. Article 4 of 4 in the Chinese GP 2027 blog batch (angles locked with founder 23 Sep 2026). Hero image pending — sourced separately, all 4 articles' images to be applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-10-01T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
