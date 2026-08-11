import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "mcg-boxing-day-test-scheduling-accident";
const NZ_TOUR_EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";

const bodyContent = `One of cricket's most beloved fixtures exists because six Test matches didn't fit neatly into a summer, not because anyone set out to build a tradition.

## An older, less comfortable Christmas tradition came first

Long before the Boxing Day Test existed, the MCG hosted a Sheffield Shield fixture between Victoria and New South Wales scheduled over the Christmas period, dating back as far as 1865 — including play on Boxing Day itself, much to the annoyance of the New South Wales players stuck away from their families over Christmas. The first actual Boxing Day Ashes Test came in 1950-51, when the Melbourne Test ran December 22-27 and simply happened to include the 26th as its fourth day. It wasn't a deliberate annual institution yet — no Boxing Day Test was played in Melbourne at all between 1953 and 1967, a 14-year gap that undercuts any idea of a continuous tradition.

## The real trigger was a scheduling problem, not a plan

The modern, permanent version traces to the 1974-75 Ashes series, which crammed six Tests into one Australian summer. To fit them all in, the Third Test at Melbourne landed on December 26 — a practical solution to a calendar problem, not a deliberate decision to build a Boxing Day institution. It worked well enough, by accident, that it kept happening. The fixture wasn't formally locked in as a permanent tradition until 1980, once the Australian Cricket Board, Channel Nine (which had just acquired the TV rights), and Melbourne's own civic boosters all recognized what they'd stumbled into and made it official.

## Why this history matters

The version of the Boxing Day Test people talk about — a beloved, decades-deep national institution — is real today, but its origin is far messier than the mythology suggests. It survived a 14-year gap, existed almost by scheduling coincidence in 1974-75, and only became a deliberate tradition once broadcasters and civic interests saw what an accident had accidentally built. Most of cricket's oldest "traditions" are younger and more improvised than they sound, and this is one of the clearest examples.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The MCG's Boxing Day Test Started as a Scheduling Accident",
    sport: ["cricket"],
    sportingEventId: NZ_TOUR_EVENT_ID,
    contentCategory: "history",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "The Boxing Day Test survived a 14-year gap and only became permanent because six Tests didn't fit into the 1974-75 Ashes summer any other way — a beloved tradition born from a scheduling problem.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: pre-1950 Sheffield Shield Christmas fixture at the MCG (dating to 1865), 1950-51 first Boxing Day Ashes Test, 1953-1967 gap — sportsadda.com and the West Sydney University/The Conversation piece 'Half-watched TV and part-heard radio'. 1974-75 six-Test Ashes series scheduling necessity, 1980 formal establishment (Australian Cricket Board, Channel Nine TV rights, Melbourne civic interest) — internationalcricket.fandom.com and cricket.com. Verified 11 Aug 2026.",
    publishedAt: new Date("2026-08-01T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
