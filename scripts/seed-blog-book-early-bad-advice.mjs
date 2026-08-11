import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "book-early-bad-advice-half-events";

const bodyContent = `"Book early" is repeated so often it's stopped being advice and started being a reflex. For a real chunk of the trips a sports fan actually takes, it's the wrong instinct.

## The data doesn't actually support booking as early as possible

Flight prices follow a real, measurable pattern — a "Goldilocks window," not a straight line where earlier is always cheaper. Domestic fares tend to bottom out around 21 to 52 days before departure, with the real sweet spot closer to 38 days out; international fares hit their floor between 50 and 101 days before departure. Booking too early costs money almost as reliably as booking too late — travelers who purchased more than 104 days out overpaid by an average of $33 per ticket, while last-minute bookers overpaid by considerably more, around $73. "As early as possible" isn't actually the cheapest strategy for either domestic or international flights; it just feels safest.

## Some events genuinely aren't stable enough to book early against

Sports calendars aren't as fixed as they look. The 2026 F1 season lost two races — the Saudi Arabian and Bahrain Grands Prix — when regional conflict made their April dates unviable, a decision made close enough to the calendar date that no replacement venue could be arranged in time, cutting the season from 24 races to 22 with a five-week gap where two races used to be. The 2022 season lost the Russian Grand Prix entirely after Russia's invasion of Ukraine. The 2021 season saw the Australian Grand Prix moved to November and an Imola race substituted for China, both because of COVID-19 travel restrictions. None of these were announced years in advance — some landed with only weeks of notice.

## Why this matters

For an event with a genuinely fixed venue and date locked years ahead — a Grand Slam, a World Cup final — booking within the real fare sweet spot is the right move, and booking too early just costs you money for no protection. For an event whose calendar slot has any real history of moving — and several sports genuinely do — a non-refundable booking made months out isn't just suboptimal pricing, it's a real bet against a schedule that has actually changed before. "Book early" only works as advice once you've checked which kind of event you're actually dealing with.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Why \"Book Early\" Is Bad Advice for Half the Events You'll Ever Travel For",
    sport: ["tennis", "cricket", "golf", "formula_one"],
    sportingEventId: null,
    contentCategory: "travel_craft",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Flight prices have a real sweet spot, not a straight \"earlier is cheaper\" line — and some sports calendars, F1's included, have genuinely changed with only weeks of notice. Booking early isn't universally right.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: domestic/international flight price 'Goldilocks window' data (21-52 days domestic, 50-101 days international, $33 vs $73 overpay figures) — going.com and thriftytraveler.com. 2026 F1 season Saudi Arabia/Bahrain cancellations (24 to 22 races, 5-week gap) — gpfans.com and the-race.com. 2022 Russian GP cancellation, 2021 COVID-driven Australian GP/Imola changes — pressreader.com and africa.espn.com. Verified 11 Aug 2026.",
    publishedAt: new Date("2026-08-05T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
