import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "yas-marina-sunset-race-abu-dhabi";
const ABU_DHABI_EVENT_ID = "8f45cb75-f205-458b-8f31-48551e6d7cb8";

const bodyContent = `Every other race on the calendar picks one time of day and stays there. Abu Dhabi doesn't — it starts in daylight and ends under floodlights, and that transition is the actual point of going.

## The only race built around a sunset

The Abu Dhabi Grand Prix has run at Yas Marina Circuit since 2009, and it's the only race on the F1 calendar with a genuine twilight start — lights out at 5:00pm local time, with sunset arriving around 17:37, meaning the race itself crosses from daylight into night while cars are still on track. No other Grand Prix asks its own lighting rig to do that much work during a single 90-minute session; every other night race just starts in the dark and stays there.

## A hotel that's actually part of the circuit

The W Abu Dhabi sits directly above the track — the only hotel in the world built physically over a Formula 1 circuit, its two towers connected by a 217-meter curved canopy called the Grid Shell, wrapped in the world's largest LED lighting installation. Guests can watch the race from their own room balconies, floor-to-ceiling glass looking straight down onto the racing line. No other circuit anywhere lets you stay literally inside the venue like this.

## The race that keeps deciding championships

Abu Dhabi has been F1's season finale on 13 occasions, and on five of those, the Drivers' Championship itself came down to that final race — 2010, 2014, 2016, 2021, and 2025. The 2010 finale was the first time in F1 history four different drivers arrived with a real shot at the title. The 2021 finale, when Max Verstappen and Lewis Hamilton arrived tied on points, remains one of the most contested endings in the sport's history. Across F1's 75-year history, fewer than half of all championships have ever gone to the final race — Abu Dhabi has hosted more than its fair share of them.

## Why this is the pick

Most season finales are just the last race on the schedule. Yas Marina has repeatedly been the actual decider, wrapped in a sunset no other circuit stages, watched from a hotel no other circuit has. If you're picking one F1 weekend for the spectacle of the sport rather than the purism of it, this is the one built for exactly that.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Why the Yas Marina Sunset Race Feels Like Nothing Else on the F1 Calendar",
    sport: ["formula_one"],
    sportingEventId: ABU_DHABI_EVENT_ID,
    contentCategory: "why_go",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "The only F1 race that starts in daylight and finishes under floodlights, watched from the only hotel in the world built physically over a circuit — and a genuine title-decider five times over.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Twilight start time (5:00pm, sunset ~17:37), 2009 calendar debut, only-twilight-race distinction — f1-fansite.com and global.honda. W Abu Dhabi over-the-track design, Grid Shell canopy (217m, LED installation) — marriott.com and uniqhotels.com. Abu Dhabi's 13 finale appearances, 5 title deciders (2010/2014/2016/2021/2025), 2010's four-driver finale, 2021 Verstappen/Hamilton tie — espn.com and sportskeeda.com. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-23T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
