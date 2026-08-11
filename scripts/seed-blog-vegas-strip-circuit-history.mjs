import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "vegas-strip-circuit-city-never-built-for-it";
const VEGAS_GP_EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";

const bodyContent = `Formula 1 already tried Las Vegas once. It went badly enough that the sport stayed away for 41 years.

## The first attempt was a parking lot, and everyone hated it

In 1981 and 1982, F1's season finale ran on a temporary circuit built inside the parking lot of Caesars Palace — 14 tight turns across 2.26 miles, run anticlockwise, which put unusual strain on drivers' necks compared to the clockwise direction most tracks use. Flat, scenery-free, and punishing in the desert heat, it's remembered as one of the worst circuits the sport has ever raced on. Ironically, both years' Drivers' Championships were actually decided there — real drama on a track nobody wanted to be at.

## The second attempt tore up the real city instead

When F1 returned to Las Vegas in 2023, it didn't build another isolated lot — it rebuilt 3.8 miles of actual public streets, including Las Vegas Boulevard itself, into a genuine 17-turn street circuit. The project cost an estimated $500–560 million, one of the most expensive and technically demanding builds in the sport's history. Crews stripped 5 to 10 inches of existing asphalt from the road and repaved it with a denser surface capable of handling cars exceeding 210 mph — ordinary street asphalt simply isn't built for Formula 1 loads. A 300,000-square-foot paddock building went up on a 39-acre site Liberty Media bought specifically for the project, and temporary bridges had to be built over the track so pedestrians and resort traffic could still move during construction.

## A city that had to be talked into it

Building an F1 circuit through the middle of a live, 24-hour tourism economy meant constant negotiation — designer Carsten Tilke held regular meetings with the Strip's hotels and casinos throughout planning, so each resort could brief its own staff and guests on the disruption headed their way. Nothing about the Strip was designed with a race circuit in mind; the entire build was retrofitting a genuine street layout to survive contact with the fastest cars in motorsport.

## Why this history matters

The 1981-82 attempt failed because Las Vegas built something for F1 that had nothing to do with the city itself — a parking lot standing in for a real circuit. The 2023 rebuild succeeded by doing the opposite: tearing into the actual Strip, at enormous cost and disruption, so the race and the city became the same thing. That's the real story behind the spectacle — it took a $500 million lesson to get right the second time.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Vegas Strip Circuit — Racing Through a City That Was Never Built for It",
    sport: ["formula_one"],
    sportingEventId: VEGAS_GP_EVENT_ID,
    contentCategory: "history",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "F1's first Vegas attempt was a widely hated parking-lot circuit in 1981-82. The 2023 return cost $500 million and tore up the real Strip instead — a genuine second-attempt turnaround.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: 1981-82 Caesars Palace Grand Prix (anticlockwise layout, neck strain, widely-hated reputation, both championships decided there) — gpfans.com and the-race.com. 2023 circuit construction (3.8 miles, 17 turns, $500-560M cost, 300,000 sq ft paddock, 39-acre site, asphalt depth/repaving, temporary bridges) — hollywoodreporter.com, enr.com, and gpblog.com. Carsten Tilke's resort-coordination role — enr.com. Verified 11 Aug 2026.",
    publishedAt: new Date("2026-07-30T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
