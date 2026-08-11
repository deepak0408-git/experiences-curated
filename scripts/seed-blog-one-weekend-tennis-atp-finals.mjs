import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "one-tennis-weekend-atp-finals";
const ATP_FINALS_EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";

const bodyContent = `Buy a ticket to any Grand Slam and you're gambling. Your favorite player could be gone by Wednesday, beaten in round one by someone ranked 80 places below them, and there's nothing on the ticket that protects you from that. The ATP Finals is the one tennis event built specifically so that can't happen to you.

## Only eight players get in, and that's the whole point

The field is the best eight players in the world, full stop — no draw, no wildcards, no lucky losers. Qualification runs on the ATP Race to Turin, a season-long points race that closes after the Paris Masters, the last tournament before the Finals begin. Ninth place gets nothing. That single detail sets the tone for the entire week: everyone on court has spent an entire season proving they belong there, and the margin for getting in is genuinely brutal.

## The format guarantees you get to actually watch them

Here's the part that makes this pick different from every other "best tennis event" argument: the eight players split into two round-robin groups of four, and everyone plays all three of their group-stage opponents before anyone gets knocked out. That means if you buy a ticket for day two of the tournament, the players you came to see are contractually guaranteed to still be playing — something no Grand Slam can promise you. At Wimbledon or the US Open, a single bad afternoon ends a run. At the ATP Finals, one loss just means a tougher route through the group.

## The venue does its part too

Turin's Inalpi Arena holds 12,000 — small by tennis standards, closer to a top-tier indoor stadium than a sprawling Slam complex — and it's genuinely close to the court on every level. The tournament also carries real financial stakes beyond ranking points: the undefeated champion's prize has topped $5 million in recent years, which means every round-robin match matters to the players in a way a first-round Slam match against a qualifier often doesn't.

## Why this is the pick

A Grand Slam gives you two weeks, hundreds of matches, and no guarantee you'll ever see the player you actually bought a ticket for. The ATP Finals gives you eight players, a handful of days, and a format engineered so that every one of them plays multiple times in front of you. If you only get one tennis trip in your life, the ATP Finals is the one that can't disappoint you by round two.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "If You Could Only Attend One Tennis Weekend, Make It the ATP Finals",
    sport: ["tennis"],
    sportingEventId: ATP_FINALS_EVENT_ID,
    contentCategory: "bucket_list",
    seriesSlug: "one_weekend_per_sport",
    seriesPosition: 1,
    excerpt: "A Grand Slam ticket is a gamble — your player could be gone by round one. The ATP Finals is the one tennis event where that's structurally impossible.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: qualification format, Race to Turin closing after Paris Masters, '9th counts for nothing' framing — livetennis.com and lta.org.uk. Round-robin format, guaranteed 3 group-stage matches per player — nittoatpfinals.com and lta.org.uk. Inalpi Arena 12,000 capacity — nittoatpfinals.com venue page. $5M+ undefeated-champion prize, 1500 ranking points — sportspundit.com. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-12T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
