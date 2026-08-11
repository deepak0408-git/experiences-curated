import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "hotel-booking-mistake-costs-more-than-room";

const bodyContent = `Booking a hotel early usually saves money. Around a major sporting event, it can do the opposite — and one real case shows exactly how badly.

## The $4,300 room that became $17,000

A traveler booked a hotel for a Formula 1 race weekend in Montreal at $4,300, before the official race dates were confirmed. Once F1 locked in the actual dates, both the hotel and Booking.com claimed the original price had been a mistake and repriced the same reservation at $17,000 — nearly quadruple the original booking. Booking.com's own terms explicitly allow this: "obvious errors and obvious misprints are not binding," language broad enough to cover a rate that only looks wrong in hindsight, once real demand reveals what the room was actually worth.

## The scale of the real price swings

This isn't a one-off horror story — it reflects a genuine, measurable pattern. A study of 2,800 hotels across 24 Grand Prix destinations found race-weekend rates average 105% higher than a normal weekend at the same hotel. Some markets go further: top-tier hotels in Abu Dhabi have been recorded at up to three times their regular winter-weekend rate during F1 weekend. Super Bowl week hotel prices have spiked as high as roughly eight times normal pricing in some host cities. Sports travel isn't just expensive around a major event — it's genuinely unpredictable in exactly the window a fan needs certainty.

## What actually protects you

Locking in a cheap non-refundable rate the moment a venue or city is rumored, before dates are officially confirmed, is the exact mistake that leaves a booking vulnerable to being cancelled and repriced later. A flexible, cancellable rate costs more upfront, but it's the only kind of booking that can't be pulled out from under you once real demand sets in — and reading the actual cancellation terms before confirming, not just trusting a familiar platform's brand, is the difference between a booking that holds and one that doesn't.

## Why this matters

The room itself was never the real risk. The mistake is booking early enough to grab a suspiciously good rate, but not carefully enough to check whether that rate is actually protected once the event becomes real. The best price and the safest price are sometimes the same booking — but only if you know which cancellation terms you're actually agreeing to.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Hotel-Booking Mistake That Costs More Than the Room",
    sport: ["tennis", "cricket", "golf", "formula_one"],
    sportingEventId: null,
    contentCategory: "travel_craft",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "A real $4,300 Montreal F1 hotel booking got cancelled and repriced to $17,000 once the race dates were confirmed. Here's the actual mistake, and how a flexible rate would have prevented it.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Montreal F1 hotel case ($4,300 to $17,000 repricing, Booking.com 'obvious errors' clause) — viewfromthewing.com. F1 race-weekend hotel pricing study (2,800 hotels, 24 destinations, 105% average increase, Abu Dhabi up to 3x) — simon-kucher.com. Super Bowl hotel price spikes (up to ~8x normal) — frontofficesports.com. Flexible vs non-refundable rate risk guidance — engine.com and momentslog.com. Verified 11 Aug 2026.",
    publishedAt: new Date("2026-08-04T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
