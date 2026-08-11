import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "bharat-army-fan-group-travels-further-than-team";
const BGT_EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";

const bodyContent = `The Barmy Army follows one team from one country. The Bharat Army follows one team from everywhere its diaspora lives — and that difference shapes the entire group.

## It started with four strangers at a World Cup match

The Bharat Army was founded in 1999 by Rakesh Patel, after he and three other Indian cricket fans crossed paths at Old Trafford watching India play Pakistan during that year's World Cup. What began as four people who happened to sit near each other has grown into an organization with over 160,000 registered members worldwide — a full commercial operation now, with a head office in Ahmedabad, another in London, and roughly 20 full-time staff spread across three countries.

## The diaspora is the actual engine

This is where the Bharat Army genuinely differs from its English counterpart. At the 2019 Cricket World Cup in England, around 11,000 Bharat Army fans traveled in from 23 different countries to support India — not primarily from India itself, but from the global Indian diaspora, showing up from wherever they'd settled. During the 2023 World Cup, the group says it organized travel for 18,000 fans. Over the past decade, it's run travel programs across 13 different ICC tournaments. The team travels to one country at a time. The support travels from dozens.

## Recognition came from the team itself

In 2018, following India's historic Test series win in Australia, the BCCI formally recognized the Bharat Army and invited members to celebrate with the team directly — a rare moment where an official cricket board acknowledged an unofficial fan movement as part of the actual story of a win, not just background noise in the stands.

## Why this rivalry still matters

The Barmy Army's identity is built on loyalty through losing. The Bharat Army's is built on distance — a support base that doesn't share one country, one time zone, or even one accent, united by a team that gives them a reason to show up in the same stadium anyway. Neither group needed the other to exist, but cricket's biggest rivalries are genuinely funnier, louder, and more alive because both of them do.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Team India's Bharat Army — the Fan Group That Travels Further Than the Team",
    sport: ["cricket"],
    sportingEventId: BGT_EVENT_ID,
    contentCategory: "rivalry",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Founded by four strangers at a 1999 World Cup match, the Bharat Army now mobilizes fans from 23 countries at once — a diaspora support base no single-nation fan group can match.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: 1999 founding by Rakesh Patel at Old Trafford (India vs Pakistan World Cup match), Manchester origin — Wikipedia 'Bharat Army' and tfipost.com. Current scale (160,000+ registered members, Ahmedabad/London offices, ~20 staff across 3 countries) — Wikipedia 'Bharat Army'. 2019 World Cup: 11,000 fans from 23 countries — theprint.in. 2023 World Cup 18,000 fans, 13 ICC tournaments over the past decade — theprint.in. 2018 BCCI recognition following the Australia Test series win — Wikipedia 'Bharat Army'. Verified 10 Aug 2026. Note: DB event record is titled 'Border-Gavaskar Trophy 2027' — article framing kept consistent with the real event record rather than the Content Calendar's '2026-27' label.",
    publishedAt: new Date("2026-07-19T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
