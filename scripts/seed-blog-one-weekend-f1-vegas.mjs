import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "one-f1-weekend-las-vegas";
const VEGAS_GP_EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";

const bodyContent = `Most Grand Prix circuits ask you to travel to them, then travel again from your hotel to a purpose-built venue on race day. Las Vegas doesn't. The track runs directly past the hotels, which means for one weekend a year, your hotel room can be your grandstand.

## The circuit is the Strip, not a track built near it

The 3.8-mile Las Vegas Strip Circuit uses closed public roads through the middle of the city — 17 turns past the Bellagio fountains, the Sphere, Caesars Palace, and the Venetian, all lit by more than 1,500 lighting fixtures pulling enough power for roughly 13,000 homes. Guests at the Venetian can walk straight to trackside grandstands from their room; Caesars Palace runs its own three-day trackside viewing package directly in front of the resort. No other race on the calendar puts the accommodation and the circuit in the same building.

## It's also genuinely one of the fastest tracks F1 races on

This isn't just spectacle — the racing is real. The current top-speed record at the Strip Circuit is 229.28 mph, set by Alex Albon in 2024, and one of the longest full-throttle sections anywhere on the calendar runs straight down the middle of the Strip. The race starts at 10pm local time, timed deliberately for European Sunday-afternoon broadcast, and November desert nights drop cold enough — sometimes below 10°C — that tyres genuinely struggle to find grip, adding a real technical wildcard that most street circuits don't have.

## Why this is the pick

Monaco has more history. Spa has more purist respect. But no other Grand Prix puts you inside the spectacle the way Vegas does — where the neon backdrop isn't scenery bolted onto the race, it's the actual city you're staying in, running at 220mph past your window. If you're picking one F1 weekend to actually attend rather than watch on TV, Vegas is the one where the race and the trip are the same experience, not two separate things stitched together.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "If You Could Only Attend One F1 Weekend, Make It Las Vegas",
    sport: ["formula_one"],
    sportingEventId: VEGAS_GP_EVENT_ID,
    contentCategory: "bucket_list",
    seriesSlug: "one_weekend_per_sport",
    seriesPosition: 3,
    excerpt: "No other Grand Prix puts your hotel room and the circuit in the same building. Vegas is the F1 weekend where the race and the trip are literally the same experience.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: circuit length, 17 turns, lighting fixture/power figures, 10pm local start timed for European broadcast — formula1.com 'What makes the Las Vegas Grand Prix special'. Venetian/Caesars Palace trackside hotel access — venetianlasvegas.com and formula1.com fan guide. Top-speed record (229.28 mph, Alex Albon, 2024) — f1technical.net. Sub-10°C cold-tyre challenge — motorsportmagazine.com. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-13T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
