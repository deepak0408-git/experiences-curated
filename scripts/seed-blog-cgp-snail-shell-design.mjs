import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-circuit-shaped-like-a-chinese-character";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese GP 2027 (Shanghai)

const bodyContent = `## A track drawn to look like a word

Shanghai International Circuit's layout, seen from above, is built around the shape of the Chinese character 上 ("shang," as in Shanghai itself) — an architectural choice, not a coincidence of where the corners happened to fall. Very few circuits on the F1 calendar are designed around a piece of symbolism rather than pure racing geometry, and Shanghai wears it plainly enough that it's visible on a track map without anyone pointing it out.

## Two spirals, and they're not the same

The character shape produces two distinct "snail" sections that function as the circuit's defining technical challenge. Turns 1 and 2 form a decreasing-radius spiral — the corner tightens as the driver commits further into it, at the very start of the lap, before tyres have fully come up to temperature. Turns 11 through 13 do the opposite: an increasing-radius spiral that opens up as the driver works through it. Both put unusual, sustained load through the front-left tyre in a way most circuits never ask for even once, let alone twice in the same lap.

Turn 1 in particular is a genuine outlier. Cars arrive at close to 190mph and are down to around 60mph by the time they've worked through the full 270-degree tightening radius — a single corner that does the job of two or three normal ones, at the point in the lap where a driver has the least margin for error.

## The reward: the longest straight on the calendar

Getting Turns 11 to 13 right matters beyond that sequence alone, because it feeds directly onto the back straight between Turn 13 and Turn 14 — at 1,170 metres, the longest straight anywhere on the current Formula 1 calendar. A clean exit from that final spiral is the difference between a strong run down the straight and losing several tenths before the drag race even starts.

It's an unusual pairing for one circuit: two of the most demanding low-speed corners on the calendar, built specifically to set up the single longest full-throttle run drivers get anywhere else. Shanghai's layout asks for precision and rewards patience with pure speed, in that order, every single lap.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Circuit Shaped Like a Chinese Character",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "history",
    excerpt: "Shanghai International Circuit's layout is deliberately drawn around the Chinese character for 'Shang.' It produces two mirror-image spiral corners and, as a reward, F1's longest straight.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: f1chronicle.com, 'The technical challenges of the Shanghai circuit's snail-shell corners explained' — 上 character design, Turns 1-2 decreasing-radius spiral, Turns 11-13 increasing-radius spiral, Turn 1 entry/exit speed detail. Wikipedia, 'Shanghai International Circuit' — 1,170m back straight length confirmed as F1's longest. Researched 23 Sep 2026. Article 2 of 4 in the Chinese GP 2027 blog batch (angles locked with founder 23 Sep 2026). Hero image pending — sourced separately, all 4 articles' images to be applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-09-29T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
