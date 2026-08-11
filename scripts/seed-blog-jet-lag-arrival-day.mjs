import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "jet-lag-bad-arrival-day-planning";

const bodyContent = `Jet lag itself is not a mystery. The body adjusts to a new time zone at a fairly predictable rate — roughly one day per hour of time difference crossed, without any intervention. What actually wrecks a trip is what happens in the first 24 hours after landing, not the jet lag itself.

## The direction of travel matters more than most people plan for

Crossing time zones eastward is consistently harder to adjust to than crossing westward, because the body finds it easier to delay its internal clock than to advance it. A trip that flies east into a new time zone needs more deliberate planning on arrival day than the equivalent flight west — a real, physiological difference, not just a feeling.

## The two mistakes that do the most damage

Sleeping immediately on arrival, especially a long, uncontrolled nap, is one of the most common and most damaging habits travelers fall into. Naps longer than about 30 minutes on arrival day can anchor the body to its old schedule and make it genuinely harder to fall asleep at the correct local time that night — the opposite of what a long nap feels like it should do. The second mistake is skipping daylight: light exposure is the single biggest factor in resetting the body's internal clock, and missing it on arrival day is widely cited as the number one recovery mistake travelers make. Alcohol used to fall asleep on the flight or on arrival compounds both problems, disrupting sleep quality and adding dehydration on top of an already-disrupted schedule.

## What arrival day should actually look like

Get outside into real daylight as early as possible on the first morning, especially after flying east. Keep any nap short — under 30 minutes — rather than collapsing for hours the moment you reach the hotel. Stay reasonably active and push through to a normal local bedtime rather than sleeping the day away. None of this eliminates jet lag entirely, but it's the difference between feeling functional by the second day and still fighting your own body clock on the day of the actual event.

## Why this matters

A sports trip usually has one date that can't move — the match, the race, the final round. Jet lag recovery is genuinely predictable and manageable if arrival day is planned around it. Most of the damage comes from what people do in the first few hours after landing, not from crossing time zones itself.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Jet Lag Isn't the Enemy — Bad Arrival-Day Planning Is",
    sport: ["tennis", "cricket", "golf", "formula_one"],
    sportingEventId: null,
    contentCategory: "travel_craft",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "The body adjusts to a new time zone at a predictable rate. What actually wrecks a trip is sleeping wrong and skipping sunlight in the first 24 hours — both fixable, both usually ignored.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: circadian re-entrainment rate (~1 day per hour of time difference), eastward-harder-than-westward adjustment — Wikipedia 'Jet lag' and sleepfoundation.org. Long-nap and missed-sunlight as top recovery mistakes, alcohol's effect on sleep quality — thenationalnews.com and gamintraveler.com. Verified 11 Aug 2026.",
    publishedAt: new Date("2026-08-03T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
