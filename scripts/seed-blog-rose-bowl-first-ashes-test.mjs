import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "rose-bowl-first-ashes-test-southampton";
const ASHES_EVENT_ID = "48b4aa73-0d07-4fb7-b2db-5a02bb377ff1";

const bodyContent = `England has played Ashes cricket for 145 years. In that entire time, only nine different grounds have ever hosted a men's Ashes Test. In 2027, Southampton becomes the tenth.

## A genuinely new ground, joining a very old list

The Utilita Bowl — originally known as the Rose Bowl — only opened in 2001, making it one of the youngest Test venues in England by a wide margin. It didn't host its first Test at all until 2011, against Sri Lanka, after a 2008 redevelopment specifically built to meet Test-match standards. Getting invited into the Ashes rotation at all, let alone within its first two decades of existence, is a real statement about how quickly the ground has established itself — the venue also hosted the 2021 World Test Championship Final, a strong early signal it was being trusted with cricket's biggest occasions.

## A stadium built like a bowl, with a hotel inside it

The ground's amphitheater shape comes from its position on a sloping hill, giving it wide, even boundaries that older, more cramped English grounds squeezed into city centers can't match. Its most distinctive feature, though, is a four-star Hilton hotel built directly into one end of the stadium in 2015 — rooms that look straight out over the pitch, a genuinely rare setup among England's cricket grounds.

## The actual dates, confirmed

Southampton's first men's Ashes Test is scheduled for 21-25 July 2027, with the women's Ashes series running concurrently — meaning the ground hosts two versions of the same historic rivalry in the same window, something no other English venue has done for its Ashes debut.

## Why this is the pick

Watching an Ashes Test anywhere carries history. Watching the first one ever played at a ground is a genuinely different experience — no decades of prior Ashes atmosphere to live up to, no ghosts of old finishes, just a modern stadium about to write its own first chapter in the sport's oldest rivalry. If you want to see history happen rather than just visit where it already did, 2027 in Southampton is the one time that's literally true.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Rose Bowl's First-Ever Ashes Test — Why Southampton, Why Now",
    sport: ["cricket"],
    sportingEventId: ASHES_EVENT_ID,
    contentCategory: "why_go",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Only nine English grounds have ever hosted an Ashes Test in 145 years. In 2027, Southampton's Utilita Bowl — opened in 2001, with a hotel built into the stadium — becomes the tenth.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: 2027 first men's Ashes Test at Utilita Bowl, 10th UK ground to host an Ashes Test, confirmed 21-25 July 2027 dates, concurrent women's series — daily-sun.com, nclcricket.com, and Yahoo Sports 'Ashes Test dates confirmed as new English ground to make series debut'. Ground history (2001 opening, 2008 redevelopment, first Test 2011 vs Sri Lanka, 2021 WTC Final) — daily-sun.com and Wikipedia/Kiddle 'Rose Bowl (cricket ground)'. Amphitheatre design and Hilton hotel (built 2015) — sportsmatik.com and zapcricket.com. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-24T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
