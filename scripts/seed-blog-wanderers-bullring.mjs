import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-wanderers-bullring-nickname-explained";
const AUS_SA_EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806"; // Australia tour of South Africa 2026

const bodyContent = `Not every cricket ground earns a nickname that sticks. The Wanderers in Johannesburg did, and "The Bullring" fits it for a simple reason: visiting teams describe walking out to bat there as walking into an arena built to intimidate them. The stands rise close and steep around the field, the crowd noise has nowhere to escape, and South African teams have used that pressure to their advantage for generations. Australia will face it again during the 2026 tour, in a ground that has hosted some of the most one-sided atmospheres in world cricket.

## The fire that erased part of the ground's memory

In 2003, a fire tore through the Wanderers clubhouse and destroyed decades of accumulated cricket memorabilia — trophies, photographs, and match-worn equipment with no duplicates anywhere else. Among the losses was the actual bat Graeme Pollock used to score 274 against Australia in 1966-67, at the time the highest score ever made by a South African Test batsman. It was gone in one night, and nothing replaces it, because it was the bat itself, not a record of the innings.

That loss says something about how differently cricket grounds hold their history compared to more heavily archived sports. A lot of what the Wanderers "was" for its first hundred years existed physically in that clubhouse rather than in a museum or a digital archive, and a real chunk of it simply doesn't exist anymore.

## A slow rivalry with Australia specifically

Australia's first tour to South Africa, in 1902-03, predates the Wanderers' modern rebuilding, but the ground has hosted plenty of Australia-South Africa history since. South African crowds had to wait a long time for some of their biggest wins there against Australian sides — the sort of drought that makes an eventual victory land harder when it finally comes.

Walking into the Wanderers in 2026, expect a crowd that remembers all of it: the wins, the long gaps between them, and a scandal from 2018 that happened at a different ground but hangs over every Australia-South Africa fixture regardless of where it's played.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Wanderers: Why Johannesburg's Ground Is Called 'The Bullring'",
    sport: ["cricket"],
    sportingEventId: AUS_SA_EVENT_ID,
    contentCategory: "history",
    excerpt: "The Wanderers Stadium earned its nickname from decades of hostile crowds and dramatic finishes — and lost part of its own history to a 2003 fire that destroyed irreplaceable cricketana.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/the-bullring-wanderers-test.jpg",
    heroImageAlt: "The Wanderers Stadium, Johannesburg, known as 'The Bullring'",
    heroImageCredit: "Wikimedia Commons",
    editorialNote: "Sources: Wanderers 'Bullring' nickname and atmosphere, 2003 clubhouse fire and loss of the Graeme Pollock 274 bat — cricinfo.com ('The Wanderers Stadium'). Australia's first 1902-03 tour of South Africa and long gaps between SA wins at Newlands/Wanderers-era grounds — flashscore.com, sahistory.org.za. 2026 tour schedule — cricsa.co.za. Reused existing hero image already licensed for the Australia-in-South-Africa pack ('The Bullring — Pink Day ODI at the Wanderers' experience). Researched 6 Sep 2026.",
    publishedAt: new Date("2026-08-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
