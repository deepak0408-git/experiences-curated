import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "hamilton-verstappen-cota-2021-turn-1-battle";
const EVENT_ID = "4d56ef8b-5026-4ca1-88ad-f87ccebcde1a"; // United States Grand Prix 2026

const bodyContent = `Second practice sessions don't usually produce genuine tension — teams are testing setups, not racing each other. At the 2021 United States Grand Prix, Lewis Hamilton and Max Verstappen ended up side by side through the final corner and into Turn 1, close enough that it read as a real racing incident rather than two cars simply sharing track space. Hamilton's team radioed him to "ignore it," and Verstappen downplayed the moment afterward, saying he didn't understand what had happened. Neither reaction fully hid how tight the margins between them had become.

## The race itself

Hamilton took the lead off the start from second on the grid, resisting a hard squeeze from Verstappen on the run to Turn 1. Verstappen answered by reclaiming the position and holding on to win by 1.3 seconds, in what his own team principal Christian Horner called a genuinely "classy" drive under pressure. The result extended Verstappen's championship lead to 12 points, in a title race that would ultimately go to the final lap of the final race of the season in Abu Dhabi.

## Why Austin specifically

COTA's mix of a long straight into a tight first corner, combined with real elevation change through the esses, tends to produce exactly this kind of close-quarters racing — it rewards a driver willing to commit fully into Turn 1 rather than back out, which is precisely what forced the tension between Hamilton and Verstappen both in practice and in the race itself.

The 2021 title fight is remembered mostly for its ending in Abu Dhabi, but Austin is where the margins between the two drivers first became visibly this thin.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The COTA Weekend Where Hamilton and Verstappen Stopped Being Polite",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "rivalry",
    excerpt: "Before their title fight became one of the most contested in F1 history, Lewis Hamilton and Max Verstappen had a tense, wheel-to-wheel moment at Austin in 2021 — a preview of exactly how close that season would get.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/US GP - Turn 1 Lars Plougmann CC2.0.jpg",
    heroImageAlt: "Turn 1 'Big Red' at Circuit of the Americas, Austin",
    heroImageCredit: "Lars Plougmann — CC BY-SA 2.0",
    editorialNote: "Sources: 2021 US GP practice tension and race result (Hamilton leads off start, Verstappen wins by 1.3s, Horner's 'classy' quote, championship lead extended to 12 points) — formula1.com 'Verstappen brilliantly holds off Hamilton...', statesman.com. Reused existing hero image already licensed for the pack (Turn 1 'Big Red' experience) — a direct match since the rivalry moment happened at that exact corner. Researched 6 Sep 2026.",
    publishedAt: new Date("2026-08-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
