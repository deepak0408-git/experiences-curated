import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-doliveira-affair-england-south-africa";
const ENG_SA_EVENT_ID = "c2bc1d6c-19ab-4d8c-9002-cb41d48a35de"; // England tour of South Africa 2026-27

const bodyContent = `Basil D'Oliveira was born in Cape Town, classified "Cape Coloured" under apartheid law, and blocked from playing top-level cricket in his own country because of his race. He left for England in 1960, qualified to play for his adopted country, and by 1966 was a genuine England Test player — good enough that when England picked its squad for the winter 1968-69 tour of South Africa, the question of whether to include him was never really about form.

## Left out, then called up

He was initially left out of the touring squad. The explanation given at the time didn't satisfy much of the cricket public, and when injury to another player opened a spot, D'Oliveira was called up after all. South African Prime Minister John Vorster then said publicly that D'Oliveira's team would not be welcome — a mixed-race man returning to represent a different country was, to that government, an unacceptable political statement regardless of his passport. England canceled the tour rather than travel without him.

## What it actually changed

The D'Oliveira Affair didn't end apartheid-era sport on its own, but it was a real turning point in how the cricket world treated South Africa. It accelerated South Africa's isolation from international cricket, a ban that held for roughly two decades until South Africa was readmitted in the early 1990s.

England and South Africa now play for the Basil D'Oliveira Trophy whenever they meet in a Test series, first contested in 2004-05. It's a rare case of a modern trophy named directly after the political crisis that shaped the whole rivalry, rather than after a founding match or a symbolic object.

## Why this still matters for the 2026-27 tour

Every England tour of South Africa carries this history whether either team mentions it or not. It's also part of a longer, stranger pattern: several South African-born players, Kevin Pietersen among the most prominent, later represented England using British-passport eligibility rather than the reverse. The politics that forced D'Oliveira out of his own country in the first place still echo, decades later, in who ends up playing for whom.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Tour That Never Happened: England, South Africa, and Basil D'Oliveira",
    sport: ["cricket"],
    sportingEventId: ENG_SA_EVENT_ID,
    contentCategory: "history",
    excerpt: "In 1968, England picked a player South Africa's apartheid government refused to let into the country — and canceled a tour rather than back down. The two nations still play for the trophy that carries his name.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: D'Oliveira Affair timeline (1968-69 tour cancellation, Vorster's statement) — en.wikipedia.org 'D'Oliveira affair', theconversation.com 'England v South Africa — a history of tough tackling and political turmoil'. Basil D'Oliveira Trophy, first contested 2004-05 — en.wikipedia.org 'Basil D'Oliveira Trophy'. South African-born England players / Kevin Pietersen pattern — thecricketmonthly.com. Hero image pending: 3 Newlands options presented to curator, not yet chosen (see scratchpad/hero-images-blog-nonlive-events.md). Researched 6 Sep 2026.",
    publishedAt: new Date("2026-08-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
