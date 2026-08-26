import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "why-f1-never-really-left-monza";
const ITALIAN_GP_EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e";

const bodyContent = `Every September, the tifosi flood the pit straight at Monza like it's the most secure fixture on the calendar. It's the one that very nearly wasn't.

## "Bye bye after 2016"

In July 2014, Bernie Ecclestone — then F1's commercial boss — called the circuit's existing hosting contract "a disaster for us from a commercial point of view," and said it plainly: "so it's bye bye after 2016." Monza's operator, SIAS, majority-owned by the Automobile Club of Milan, spent the next two years in a standoff over money it genuinely couldn't find on its own. This wasn't posturing. Grands Prix have disappeared from the calendar for exactly this reason before — Turkey, India, South Korea all dropped off when the fee stopped making financial sense for whoever was paying it.

## How a national law saved a racetrack

What actually saved Monza wasn't a sponsor or a rescue fund. It was an amendment to Italy's national Stability Law, passed specifically to let the Automobile Club d'Italia funnel money from its own connected companies toward the race fee. A government changed how a public body could spend money, so that a 1922 racetrack could keep affording to exist on the modern F1 calendar. Monza signed a new three-year deal in 2016, worth €68 million — a number that would have been unthinkable to raise through ticket sales and hospitality alone.

The story didn't end there. Imola — Monza's own domestic rival, which had briefly hosted the race itself in 1980 after Ronnie Peterson's death forced Monza's own safety upgrades to run late — took legal action in 2016 over the terms of Monza's renewed deal, arguing its own claim to the calendar slot. Even inside Italy, there wasn't consensus that Monza deserved to keep it.

## The fight never really stopped

It kept happening. Every renewal cycle since has been some version of the same fight: a legendary, low-budget, publicly-adjacent circuit trying to justify its spot against tracks with sovereign wealth behind them. The most recent deal, signed November 2024, runs through 2031 — but it came with Monza's hosting fee roughly doubling, following the same pattern set by Monaco, the other "heritage" venue F1 has kept at a discount for decades before finally asking for market rate.

## Why 2026 makes this look even more remarkable

That fee increase is the real story in 2026. This year, F1 posted a genuine revenue drop — reports put it at 15-38% depending on how you measure it — largely because the 2026 calendar quietly shrank to 23 confirmed races instead of the mooted 24. One of the actual casualties: Zandvoort. The Dutch Grand Prix organizers announced that 2026 would be their last race, at least for now, because hosting costs had become prohibitively expensive for what a privately-run circuit could recoup. Hosting fees across the grid now run anywhere from $25 million to $60 million a year — money that has to be earned back through ticket sales and hospitality at a venue that, unlike a state-backed street circuit in the Middle East, doesn't have a government treating the race as a tourism marketing budget.

Monza is exactly the kind of circuit that logic should have eliminated by now: no sovereign backing, a genuinely old facility, a fee that keeps climbing toward what a Qatar or a Las Vegas can absorb without blinking. It survived 2014-2016's near-death anyway, and it's the one "classic" venue — alongside Monaco — that F1 has consistently chosen to keep rather than let market economics quietly finish off, the way it just did to Zandvoort.

When you're in the stands this September watching a sea of red flood the pit straight after the race, that atmosphere isn't just tradition holding on by habit. It's tradition that a government, twice, decided was worth changing the rules to keep.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Why F1 Never Really Left Monza (Even Though It Almost Did)",
    sport: ["formula_one"],
    sportingEventId: ITALIAN_GP_EVENT_ID,
    contentCategory: "why_go",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "In 2014, F1's own boss told Monza \"bye bye after 2016.\" The race survived because Italy changed a national law to pay for it. In 2026, with the Dutch Grand Prix gone for the same financial reasons, that fight looks more remarkable than ever.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: CNBC, Sky Sports, ESPN Africa (Ecclestone's 2014 'bye bye after 2016' quote, SIAS/Automobile Club of Milan standoff); Motorsport.com, Forbes, ESPN (Italy's Stability Law amendment, Automobile Club d'Italia funding mechanism, 2016 three-year €68M deal); Autosport (Imola's 2016 legal action); Motorsport.com, Forbes, ESPN (Nov 2024 deal through 2031, doubled fee, Monaco parallel); RacingNews365, Statista, Total Motorsport (F1 hosting fee ranges $25-60M/year); TheJudge13, BlackBook Motorsport, The Race, F1-Fansite, Grand Prix.com (2026 F1 revenue drop 15-38%, 23-race season, Zandvoort's exit announcement). Verified 21 Aug 2026.",
    publishedAt: new Date(),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Slug:  ", row.slug);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
