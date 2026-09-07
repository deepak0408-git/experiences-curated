import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "why-f1-built-cota-from-scratch";
const EVENT_ID = "4d56ef8b-5026-4ca1-88ad-f87ccebcde1a"; // United States Grand Prix 2026

const bodyContent = `Formula 1's relationship with American racing has never been simple. Since 1959, the sport has held its United States Grand Prix at six different circuits, moving from venue to venue in a pattern that suggests none of them quite worked as a long-term home. The lowest point came at Indianapolis in 2005, when a tire safety dispute led to only six cars starting the race — an event remembered in F1 circles simply as "Tyregate," and one that did real damage to the sport's reputation in the one market it had struggled hardest to crack.

## Building the fix on purpose

Circuit of the Americas opened in Austin in 2012, ending a four-year gap since F1's last US race. It was the first circuit in the country built specifically and only for Formula 1, rather than adapted from an oval or a road course originally designed for other racing series. Promoter Tavo Hellmund and former motorcycle champion Kevin Schwantz proposed the project in 2010, with Hermann Tilke's group providing design assistance — the same firm behind Sepang and several other modern-era F1 venues.

The gamble worked. Over 100,000 fans attended the first race in 2012, and attendance has stayed above 400,000 across race weekends in most years since. In October 2025, F1 signed an eight-year extension guaranteeing the US Grand Prix a home at COTA through at least 2034 — a level of long-term commitment the sport had never previously offered any American venue.

## What that says about the race

COTA isn't just another stop on the calendar. It's the answer to a decades-long problem, and its longevity so far — now heading toward a quarter-century relationship with the sport — is itself part of why F1 finally found a lasting foothold in the United States after nearly failing to keep one at all.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Why F1 Had to Build a Track From Scratch to Fix Its American Problem",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "history",
    excerpt: "F1 has raced at six different circuits in the United States since 1959. Circuit of the Americas was built in 2012 specifically to end that pattern — and so far, it has.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/US GP - Main Grandstand Steve CC2.0.jpg",
    heroImageAlt: "Circuit of the Americas main grandstand, Austin, Texas",
    heroImageCredit: "Steve from Austin, TX, USA — CC BY-SA 2.0",
    editorialNote: "Sources: F1's six US circuits since 1959, 2005 Indianapolis 'Tyregate' (6 starters) — en.wikipedia.org 'Circuit of the Americas'. COTA's 2012 opening, Hellmund/Schwantz proposal, Tilke design involvement, attendance figures, Oct 2025 eight-year extension through 2034 — gpdestinations.com, f1oversteer.com. Reused existing hero image already licensed for the pack (Main Grandstand experience). Researched 6 Sep 2026.",
    publishedAt: new Date("2026-08-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
