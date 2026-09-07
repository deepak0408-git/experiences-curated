import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-shortest-grand-prix-in-f1-history";
// This event's DB name is "Bahrain Grand Prix 2026 (Malaysia)" at venue Sepang —
// that's correct, not a mislabel (an earlier note here wrongly flagged it as a bug).
// The 2026 Bahrain GP was relocated to Sepang after the original Bahrain/Saudi races
// were postponed due to the 2026 Gulf conflict — see seed-blog-why-malaysia-built-sepang.mjs.
const EVENT_ID = "07e23597-720b-41e1-b8ff-419e004307ee";

const bodyContent = `The 2009 Malaysian Grand Prix started in typical tropical heat and ended in a genuine monsoon. Rain fell hard enough, and fast enough, that parts of the circuit flooded and visibility for the drivers dropped close to nothing. Race officials red-flagged the event after 33 of the scheduled 56 laps, and it never restarted.

## Fifty-five minutes, thirty seconds

Under F1's rules at the time, results were taken from the last fully completed lap before the stoppage — lap 31 — which meant the race was officially declared over at just 55 minutes and 30 seconds. Jenson Button, driving for the Brawn GP team in its remarkable debut season, was declared the winner. It remains the shortest Malaysian Grand Prix ever run, and one of the shortest completed races in the sport's history.

## Why Sepang specifically

This wasn't bad luck striking a random venue. Sepang sits close to the equator, and its rainy season produces exactly this kind of sudden, violent downpour with real regularity — the kind of tropical weather system that can turn a dry track into a flooded one inside a single lap. The 2009 race is the moment that cemented the circuit's reputation for genuinely unpredictable weather, not just "some rain," but conditions capable of ending a Grand Prix outright.

## What it says about racing there

Modern F1 fans are used to circuits being fairly predictable — dry-weather venues that occasionally get light rain, wet-weather venues that plan for it from the start. Sepang sits in neither category cleanly. It can run a bone-dry race one year and get shut down by a monsoon the next, sometimes within the same afternoon as conditions change. That unpredictability is a real part of what makes racing there different from most stops on the calendar, and it's worth knowing before assuming any race weekend here will go entirely to plan.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Shortest Grand Prix in F1 History Happened at Sepang",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "rivalry",
    excerpt: "On 5 April 2009, a monsoon downpour turned Sepang into standing water and forced officials to stop the race early — producing the shortest Malaysian Grand Prix ever run, and one of the shortest in F1 history.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/blog/hero/the-shortest-grand-prix-in-f1-history.jpg",
    heroImageAlt: "View of Sepang International Circuit from the C2 hillstand, Malaysia",
    heroImageCredit: null,
    editorialNote: "See seed-blog-why-malaysia-built-sepang.mjs for the DB event-naming note (this event genuinely is the Bahrain GP, relocated to Sepang for 2026 — not a mislabel, per the 6 Sep 2026 correction). Sources: 2009 Malaysian GP monsoon red flag, lap count (33 of 56, results taken at lap 31, 55m30s finish time), Jenson Button/Brawn GP win — racingnews365.com 'Torrential monsoon forces F1 into race abandonment', motorsport.com. Sepang's equatorial weather pattern context — crash.net, therakyatpost.com. Hero image: replaced 6 Sep 2026 with a curator-supplied local file (Images/Bahrain GP in KL - View from C2 hillstand.jpg); heroImageCredit left null per hero-image-search convention for user-supplied files. Researched 6 Sep 2026.",
    publishedAt: new Date("2026-08-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
