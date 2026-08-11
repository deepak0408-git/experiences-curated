import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "f1-fan-clubs-scuderia-orange-army";

const bodyContent = `F1 has always had fans. What it has now is something closer to two entire subcultures, built decades apart, for completely different reasons.

## Ferrari's tifosi: eight decades of built-in loyalty

Enzo Ferrari founded the team in 1929, and by the time it was winning races in the early 1950s, it had already become something bigger than a race team in Italy — a symbol of post-war national pride. That association never really faded. The official Scuderia Ferrari Club, founded in 2006, now has over 200 recognized chapters spread across 24 countries, offering members factory visits to Maranello, meet-and-greets with drivers, and reserved seating at the Italian Grand Prix. What makes the tifosi genuinely different from most fan cultures is that loyalty passes down generations regardless of results — supporters keep showing up during Ferrari's worst seasons with the same intensity as its best, because the attachment was never really about the standings.

## The Orange Army: built almost overnight

Compare that to Formula 1's newest fan phenomenon. Zandvoort hosted a Grand Prix from 1950 to 1985, then went dark for 36 years before F1 returned there in 2021 — the same year Max Verstappen was closing in on his first World Championship. Tickets sold out within hours. Verstappen won that first race back. The following year, attendance surged 81 percent. What's grown since is a genuinely new subculture: fans in matching orange shirts, inflatable "Lion Gate" decorations as informal status symbols, bouquets of orange tulips, and grandstands chanting "Du Du Du Du, Max Verstappen" in unison — a fan culture that didn't exist a decade ago and now rivals movements that took generations to build.

## Why the contrast matters

The tifosi prove a fan culture can outlast results by decades, built on identity rather than form. The Orange Army proves the opposite is also true — a fan movement can appear almost overnight when the right driver, the right comeback circuit, and the right national moment collide at once. Neither needed the other's method to become real. Formula 1 is one of the only sports on earth where both models are currently working at the same time, on the same grid.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "F1 Fan Clubs Aren't Just Merch — Inside the Scuderia and Orange Army Phenomenon",
    sport: ["formula_one"],
    sportingEventId: null,
    contentCategory: "rivalry",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Ferrari's tifosi took eight decades to build and outlasts every bad season. The Orange Army did something similar in four years flat. Both are real, and both are currently working.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Ferrari's 1929 founding, early-1950s success and post-war Italian identity, generational tifosi loyalty regardless of results — formula1team.eu and scuderiafans.com. Scuderia Ferrari Club official scale (200+ chapters, 24 countries, founded 2006), member benefits — ferrari.com official club pages. Zandvoort 1950-1985 then 36-year gap, 2021 return coinciding with Verstappen's title run, sold-out tickets, 81% attendance surge the following year — formula1.com and essentiallysports.com. Orange Army culture details (orange shirts, Lion Gates, tulip bouquets, 'Du Du Du Du' chant) — formula1.com and sportskeeda.com. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-21T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
