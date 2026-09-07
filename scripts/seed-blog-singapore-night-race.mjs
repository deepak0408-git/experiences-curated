import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "how-singapore-convinced-f1-to-race-at-night";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b"; // Singapore Grand Prix 2026

const bodyContent = `Formula 1 had never raced at night before Singapore's 2008 debut. Marina Bay Street Circuit changed that, becoming the first Grand Prix in the sport's history run entirely after dark, under roughly 1,600 custom floodlights spread around the 4km circuit — about four times brighter than a typical stadium's lighting, engineered specifically to avoid glare for both drivers and broadcast cameras.

The race weekend drew a reported 300,000 fans across the event, and Fernando Alonso, driving for Renault, won a race that would later turn out to be far more complicated than it looked at the time.

## Why night racing, specifically

The lighting wasn't really about spectacle for its own sake, even though it produced one. Racing at night let Singapore's Grand Prix air live during prime broadcast windows in Europe, a real commercial consideration for a sport that makes most of its money from television rights outside the host country. It also sidestepped Singapore's daytime heat and humidity, which sit close to 30°C with humidity rarely below 70% even after dark — conditions that make the race one of the most physically demanding on the calendar regardless of the hour.

## An idea that stuck

Plenty of F1 experiments don't survive their first year. Night racing did the opposite — it became a permanent part of Singapore's identity, with the race locked in on the calendar through at least 2028, and other venues later adopting elements of the same lighting approach for their own events. Almost two decades after the first attempt, it's easy to forget that racing after dark used to be something F1 had simply never tried.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "How Singapore Convinced F1 to Race at Night",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "history",
    excerpt: "In 2008, Marina Bay hosted the first night race in Formula 1 history — a decision that reshaped how the sport thinks about weather, television, and heat, and one that's never gone away since.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/singapore-gp-waterfront-walk.jpg",
    heroImageAlt: "Marina Bay waterfront, Singapore",
    heroImageCredit: "Ngô Thanh Tùng, Unsplash Licence",
    editorialNote: "Sources: Marina Bay's 2008 debut as F1's first night race, floodlight specs (~1,600 lights, ~4x stadium brightness), 300,000 weekend attendance, Alonso's win — nlb.gov.sg, chaseyoursport.com, sfcriga.com, formula1.com 'Do you remember... F1's first ever night race'. Heat/humidity conditions (~30°C, 70%+ humidity) and calendar commitment through 2028 — chaseyoursport.com, formula1.com. Reused existing hero image already licensed for the pack (Marina Bay Waterfront Walk experience). Researched 6 Sep 2026.",
    publishedAt: new Date("2026-08-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
