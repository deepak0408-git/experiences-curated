import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-corner-that-runs-through-a-baseball-stadium";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a"; // Mexico City Grand Prix 2026

const bodyContent = `Most of Formula 1 unfolds on purpose-built circuits, in grandstands designed specifically around a racing line. The Autódromo Hermanos Rodríguez does something no other current F1 venue does: it sends the track directly through the middle of Estadio GNP Seguros — formerly Foro Sol — a stadium originally built for baseball and concerts, now split by two grandstands facing each other across the racing surface.

## A corner unlike anything else on the calendar

Being inside that section during a race is reportedly unlike anything else in the sport. The enclosed stadium bowl traps crowd noise instead of letting it dissipate into open air, and drivers and broadcasters alike have described the roar inside as loud enough to compete with the cars themselves. The section regularly hosts the podium ceremony and, on non-race days that same weekend, live concerts — a genuinely dual-purpose venue that few other sports facilities anywhere attempt.

## The record it keeps breaking

The Mexico City Grand Prix drew 404,958 spectators across its 2024 race weekend, its ninth consecutive sellout since the modern-era race began in 2015. That's not a fluke born of one good year — it's a sustained pattern of a country consistently filling one of the largest capacities on the F1 calendar, year after year.

## What Checo Pérez adds to it

Some of that atmosphere is specifically about Sergio "Checo" Pérez, the Guadalajara-born driver who became the first Mexican driver ever to finish on the podium and lead a lap at his home race, in 2021. Pérez has leaned fully into what his home crowd wants from him — custom helmet designs drawing on Mexican heritage, a full lucha libre wrestling-mask entrance on race day, genuine visible pride rather than a polite nod to the host country.

Put the stadium section and the home-crowd culture together and Mexico City becomes one of the few Grands Prix where the atmosphere is arguably the headline attraction, not a supporting act to the racing itself.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Corner of F1 That Runs Through a Baseball Stadium",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "bucket_list",
    excerpt: "Nowhere else in Formula 1 does the track cut straight through a stadium built for a different sport. At the Mexico City Grand Prix, it does — and the crowd inside might be the loudest thing in motorsport.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: Foro Sol/Estadio GNP Seguros stadium section design and origin, crowd noise reputation, podium/concert dual use — formula1.com 'How the Mexico City Grand Prix became Formula 1's ultimate fiesta', oversteer48.com 'Grandstand 15 F1 Mexico'. 2024 attendance (404,958, ninth consecutive sellout) — formula1.com fan guide. Checo Pérez 2021 podium/first Mexican driver to lead a lap, helmet/lucha libre entrance — formula1.com driver page, vavel.com. Hero image pending: 3 options presented to curator, not yet chosen (see scratchpad/hero-images-blog-nonlive-events.md). Researched 6 Sep 2026.",
    publishedAt: new Date("2026-08-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
