import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-barmy-army-cricket-away-support-institution";
const ASHES_EVENT_ID = "48b4aa73-0d07-4fb7-b2db-5a02bb377ff1";

const bodyContent = `Most fan movements get named by their own supporters. The Barmy Army got its name from the opposition's press.

## Thirty backpackers, one losing team, and a nickname that stuck

The Barmy Army began during England's 1994-95 Ashes tour of Australia, when a small group of English fans — around 30 of them, mostly backpackers staying in hostels — kept turning up and chanting encouragement for a team that was losing badly. The Australian media coined the name "Barmy Army," reportedly mocking the sheer audacity of traveling that far to support a side with almost no chance of winning. The fans adopted the insult as their own identity instead of shrugging it off, which is arguably the whole reason the name survived at all.

## A t-shirt stall became a movement

The turning point was almost accidental. During the fourth Test at Adelaide in January 1995, organizers Paul Burnham and David Peacock walked into a local shop and had 50 t-shirts printed with the Union Jack and the words "Michael Atherton's Barmy Army." They sold for $20 each. The first order sold 100 shirts. The follow-up order was for more than 3,000. What started as merchandise for a small group of diehards became the funding and branding for an entire supporters' movement that's followed England ever since.

## What it actually is today

The Barmy Army is now a genuine institution: over 50,000 registered members, a social media following in the millions, and its own official travel arm — the escorted tour packages for the most recent Ashes series in Australia sold out completely, taking more than 3,000 England fans Down Under. It's less a fan club now than infrastructure: songs, chants, and a physical presence that follows England to nearly every Test venue on earth, home or away.

## Why this rivalry still matters

What makes the Barmy Army genuinely rare isn't the volume — it's the loyalty. Most traveling support in sport shows up when a team is winning. This one was founded specifically during a losing tour, by fans who kept singing anyway, and that origin is still the identity three decades later. It's proof that a rivalry isn't only carried by the players on the field — sometimes it's carried by the people who refuse to stop showing up.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Barmy Army — How a Cricket Away-Support Movement Became Its Own Institution",
    sport: ["cricket"],
    sportingEventId: ASHES_EVENT_ID,
    contentCategory: "rivalry",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Named as an insult by Australian media during a losing 1994-95 tour, the Barmy Army turned it into an identity — now 50,000 members strong and cricket's most recognizable traveling support.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: 1994-95 origin, ~30 backpackers, Australian media naming — Wikipedia 'Barmy Army' and cricketcountry.com. Adelaide t-shirt stall story (Jan 1995, 50 then 3,000+ shirts, Burnham/Peacock) — hscsetup.net and i.imgci.com official history. Current scale (50,000+ members, millions of social followers, 3,000+ fans on recent Ashes tour, sold-out packages) — barmyarmy.com. Deliberately excluded: specific chant lyrics targeting a named player (Shane Warne), per the skill's hard editorial line against disparaging a named individual — the movement's real history and scale stand on their own without repeating those lyrics. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-18T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
