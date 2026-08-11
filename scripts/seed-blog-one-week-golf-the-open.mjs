import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "one-golf-week-the-open";
const OPEN_EVENT_ID = "ccb585a6-3cdb-40ce-999e-a1d455854301";

const bodyContent = `Golf has four majors, and three of them are American institutions with their own kind of prestige. The Open is the one that came first, and the only one that still insists on being played the way the sport actually began.

## It's older than the other three majors combined, functionally

The Open Championship was first played in 1860 at Prestwick Golf Club in Scotland — decades before the Masters, the US Open, or the PGA Championship existed. The very first event was a response to a real loss: Allan Robertson, recognized as golf's first true professional, had died, and a field of eight golfers gathered to crown his successor. Willie Park Sr. won that first Championship Belt over Old Tom Morris. That founding story is still the reason the tournament exists at all, and no other major carries anything close to that direct a lineage back to the sport's own beginning.

## The course changes every year, and the weather decides more than the players do

Unlike the Masters, which is played at Augusta National every single year, The Open rotates across nine approved links courses — St Andrews, Royal Birkdale, Carnoustie, Royal St George's, Royal Troon, Muirfield, Royal Liverpool, Royal Lytham & St Annes, and Royal Portrush. Links courses are built on sandy coastal land, firm and largely treeless, and by definition sit on the coast — which means the weather isn't a backdrop, it's the tournament's real defense. Wind speed can shift dramatically between one tee time and the next, turning club selection into a genuine gamble round to round, in a way no parkland course played in fair American summer weather ever forces.

## You can actually get in

The Masters' badge lottery is famously, deliberately exclusive — strict resale bans, years-long odds, a process built to stay scarce. The Open runs a public ballot and general sale instead, a meaningfully more accessible route to a ticket for golf's oldest major. You don't need a connection or a decade of failed lottery entries to stand at St Andrews or Royal Troon during Open week.

## Why this is the pick

Every major has its own case. But only one of them is the tournament the entire sport is measured against, played on the exact kind of ground golf was invented on, in weather nobody controls, with a ticket you can actually buy. If you get one golf trip, make it the one where the sport's own history is the whole reason you're there.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "If You Could Only Attend One Golf Week, Make It The Open",
    sport: ["golf"],
    sportingEventId: OPEN_EVENT_ID,
    contentCategory: "bucket_list",
    seriesSlug: "one_weekend_per_sport",
    seriesPosition: 2,
    excerpt: "Older than the other three majors, played on real links courses that rotate every year, and — unlike Augusta's lottery — a ticket you can actually get.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: 1860 founding at Prestwick, Allan Robertson's death and the first Championship Belt (Willie Park Sr. over Old Tom Morris) — Wikipedia 'The Open Championship' and britannica.com. Nine-course rotation list, links-course characteristics — topendsports.com and golfmode.io. Wind as the tournament's defining factor — si.com and golfmode.io. Masters ballot exclusivity/resale ban vs. Open's public ballot and general sale — bunkered.co.uk and joinpearl.co (Masters ticket process comparison). Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-14T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
