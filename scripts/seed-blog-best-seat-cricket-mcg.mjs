import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "best-seat-in-cricket-mcg-bay-13";
const NZ_TOUR_EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd"; // New Zealand tour of Australia 2026-27

const bodyContent = `For three decades, if you wanted the loudest 15 minutes cricket had to offer, you didn't buy a Members' ticket. You went and stood in Bay 13.

## What Bay 13 actually was

Bay 13 sat in the old Southern Stand at the MCG, tucked behind the slip cordon for a right-handed batsman, and it built a reputation nothing else in the sport quite matched: cheap tickets, standing-room energy, and crowds that turned discarded plastic cups into towering "beer snakes" during the lulls in play. Its most famous export is a piece of cricket folklore rather than a piece of cricket itself — thousands of fans in unison mimicking fast bowler Merv Hughes' pre-over stretches during an Ashes Test, a moment that's been replayed in cricket coverage for decades since.

## The part worth being honest about

Bay 13's reputation wasn't only good-natured chaos. On Boxing Day 2005, sections of the crowd directed racial abuse at South African bowler André Nel — a real, documented low point, not folklore, and one the ground authorities took seriously. The MCG spent years afterward tightening behaviour policies across the stadium. In 2019, Bay 13 itself was redeveloped into "Boundary Social," a higher-priced, dress-coded space with its own bar — the rowdy free-for-all that made the name famous doesn't exist in that form anymore.

## So where's the seat now

The Great Southern Stand — the three-tiered, 45,000-capacity stand completed in 1992 that now occupies the ground where the old Southern Stand and Bay 13 once stood — is where the MCG's real crowd energy lives today. Level 1 puts you close enough to hear the game properly; the upper tiers give you the full 100,024-capacity bowl in view at once, still the largest stadium in the Southern Hemisphere and cricket's original Test venue, dating back to 1877. Nothing about it has the specific outlaw reputation Bay 13 once had — and that's arguably the honest upgrade. A packed Boxing Day Test at the Great Southern Stand is still one of the loudest, most physically overwhelming atmospheres in the sport. It's just one you can be part of without the history that came with the old name.

## Why this is the pick

The MCG on Boxing Day drew 373,691 fans across five days in the 2024 Test — a Test-cricket attendance record at the ground, and proof the atmosphere it's known for is a current fact, not a nostalgia act. The best seat in cricket isn't a specific numbered bay anymore. It's anywhere in the Great Southern Stand on the day the ground fills up, which at the MCG, still happens more reliably than at any other cricket ground on earth.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Best Seat in Cricket — the MCG's Bay 13, Explained",
    sport: ["cricket"],
    sportingEventId: NZ_TOUR_EVENT_ID,
    contentCategory: "bucket_list",
    seriesSlug: "best_seat_per_sport",
    seriesPosition: 4,
    excerpt: "Bay 13 built cricket's rowdiest reputation and a real, documented low point along with it. Here's what replaced it, and where the MCG's real atmosphere actually lives now.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Bay 13 history, location, beer snakes, Merv Hughes stretches moment — Wikipedia 'Bay 13' and Grokipedia. 2005 André Nel racial-abuse incident — Wikipedia 'Bay 13' (confirmed, documented incident, included per the skill's honesty requirement rather than omitted or softened). 2019 Boundary Social redevelopment — Wikipedia 'Bay 13'. Great Southern Stand capacity/completion year (45,000, 1992) — johnholland.com and austadiums.com. MCG total capacity (100,024), Southern Hemisphere's largest stadium, 1877 Test-cricket origin — topendsports.com and austadiums.com. 2024 Boxing Day Test attendance record (373,691 across five days) — sportskeeda.com. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-11T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
