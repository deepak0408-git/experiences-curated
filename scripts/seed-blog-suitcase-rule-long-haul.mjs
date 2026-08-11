import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "suitcase-rule-long-haul-sports-traveler";

const bodyContent = `Almost everyone who's flown internationally knows the rule: pack one full change of clothes and your actual essentials in your carry-on, in case your checked bag doesn't arrive with you. Almost everyone breaks it anyway, right up until the one trip it costs them.

## The odds are worse than they feel

International flights are five times more likely to lose or delay luggage than domestic ones, and connections make it worse still — 39% of all mishandling in 2025 happened specifically during transfers, exactly the kind of multi-leg routing a long-haul trip to a sporting event usually requires. Airlines mishandled 33.4 million bags globally in 2024 alone, a rate of 6.3 per 1,000 passengers. Europe, ironically one of the most common transit regions for exactly this kind of trip, has the worst mishandling rate in the world at 12.3 per 1,000 — nearly double the global average.

## Most delayed bags come back. The problem is the timing

Three out of four mishandled bags are simply delayed, not permanently lost — they usually do turn up. But "usually turns up within a day or two" is cold comfort if day one is the day you're actually at the venue, and your ticket, accreditation, or match-day gear was packed in the bag currently sitting in a different airport. The real rule isn't "never check a bag" — it's "never check the one thing your entire trip actually depends on."

## What actually goes in the carry-on

One full spare outfit, including underwear and socks, packed specifically so a delayed bag doesn't leave you stranded with nothing to wear. Every travel document, ticket, and confirmation, physical or digital, kept on your person rather than buried in the hold. Medication, chargers, and anything genuinely irreplaceable. None of this is exotic advice — it's the standard rule every serious traveler already knows. The gap is between knowing it and actually doing it under the pressure of an overstuffed suitcase the night before a flight.

## Why this matters

A delayed bag on a normal holiday is an inconvenience. A delayed bag on a trip built entirely around one fixed date — a match, a race, a final — is a genuine risk to the actual reason you traveled. The suitcase rule exists because the stakes on this specific kind of trip are higher than on almost any other.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Suitcase Rule Every Long-Haul Sports Traveler Breaks",
    sport: ["tennis", "cricket", "golf", "formula_one"],
    sportingEventId: null,
    contentCategory: "travel_craft",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "International flights are five times more likely to lose your bag than domestic ones, and transfers cause 39% of it. The rule everyone knows and almost nobody actually follows.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: SITA 2024 baggage mishandling data (33.4M bags, 6.3 per 1,000, 5x international-vs-domestic risk, 39% from transfers, Europe's 12.3-per-1,000 regional high) — aerospaceglobalnews.com and sita.aero baggage insights report. 3-in-4 delayed-not-lost ratio — aerospaceglobalnews.com. Carry-on spare-outfit and essentials rule — smartertravel.com and today.com. Verified 11 Aug 2026.",
    publishedAt: new Date("2026-08-02T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
