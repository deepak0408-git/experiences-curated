import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "nagpur-ahmedabad-border-gavaskar-country-spanning-trip";
const BGT_EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";

const bodyContent = `Five Tests, one series, and almost 2,000 kilometers between just two of the cities involved. Following the Border-Gavaskar Trophy in India isn't a stadium tour. It's a genuine cross-country trip that happens to have cricket at the center of it.

## Five cities, five different regions of India

The confirmed 2027 series runs from 21 January to 3 March, opening in Nagpur and closing more than six weeks later in Ahmedabad, with Chennai, Guwahati, and Ranchi in between. Those five cities sit in five genuinely distinct regions — Nagpur in central India, Chennai in the south, Guwahati in the northeast, Ranchi in the east, and Ahmedabad in the west. The distance from Nagpur to Guwahati alone is roughly 1,867 kilometers, further than London to Rome. This isn't a series that stays within one train line or one time zone's worth of travel.

## The traditional venues aren't even on the list

Notably absent from the 2027 schedule: Mumbai, Kolkata, and Bengaluru — three of India's best-known and most historic Test cities, all missing from this particular series. That's a real signal about how the BCCI is spreading Test cricket's biggest fixtures beyond the venues international fans might already assume are guaranteed, and it means a first-timer following this series can't lean on the well-worn Mumbai-Kolkata cricket-tourism route that's covered most previous tours.

## The final Test lands at the biggest stadium in the sport

The series closes at Ahmedabad's Narendra Modi Stadium — the largest cricket stadium in the world — a genuinely fitting finale after five weeks and thousands of kilometers of travel across the country.

## Why this is the pick

Most Test series ask you to pick one city and stay there. Border-Gavaskar asks you to actually see India — central plains, southern coast, northeastern hills, eastern plateau, and western desert-state capital, all in one campaign. If you want a cricket trip that's also genuinely a trip, not just a stadium with a hotel attached, this is the series built for it.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Nagpur to Ahmedabad — Why the Border-Gavaskar Trophy Is a Country-Spanning Trip, Not a Match",
    sport: ["cricket"],
    sportingEventId: BGT_EVENT_ID,
    contentCategory: "why_go",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Five Tests, five regions of India, and almost 1,900km between just two of the venues. The 2027 Border-Gavaskar Trophy is a genuine cross-country trip, not a stadium tour.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: 2027 confirmed venues (Nagpur, Chennai, Guwahati, Ranchi, Ahmedabad) and dates (21 Jan - 3 Mar 2027), Mumbai/Kolkata/Bengaluru absence — thesportstak.com and cricket.com.au. Ahmedabad's Narendra Modi Stadium as world's largest cricket stadium — thesportstak.com. Nagpur-Guwahati distance (~1,867km) — clearcarrental.com. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-25T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
