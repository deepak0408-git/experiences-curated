import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "st-andrews-vs-augusta-which-pilgrimage-first";

const bodyContent = `Every serious golf fan eventually has to pick one first. The honest answer depends less on which course is "better" than on what kind of pilgrimage you actually want.

## Augusta owes its design to St Andrews

Augusta National opened in January 1933, built by Bobby Jones and Clifford Roberts on a former commercial nursery, with course design led by Alister MacKenzie. Both MacKenzie and Jones were serious admirers of the Old Course at St Andrews, and Augusta's design deliberately borrows from it — wide angles of attack, large, strategically complex greens, and the same emphasis on shot-making choice rather than pure difficulty. The Masters was first played there in 1934, originally called the Augusta National Invitational before the local paper's shorthand — "The Masters" — stuck for good. In a real sense, you can't fully separate the two courses even if you visit them decades apart; one was built in direct architectural conversation with the other.

## The actual experience could not be more different

St Andrews is publicly owned by the town, and any golfer with a handicap of 36 or under can enter a genuine ballot for a tee time — golf for anyone, on the exact ground the sport was invented on. Augusta National is the opposite: a private, members-only club, invitation-only, famous for its no-cell-phone policy and a Masters badge lottery that's genuinely difficult to win. One course asks nothing of you but a decent handicap and some luck in a lottery. The other asks for a connection most golfers will never have.

## Why the order actually matters

If you go to Augusta first, everything afterward risks feeling less immaculate — its fairways and greens are famously, almost unnaturally pristine, and few courses anywhere match that level of manicured perfection. If you go to St Andrews first, you get the raw, weathered, genuinely ancient version of the game before you see the polished one — pot bunkers, unpredictable coastal wind, centuries of real wear built into the ground itself.

## Why this is the pick

There's no wrong order, but there's a real case for St Andrews first: it's the sport's actual origin, the place Augusta's own designers were consciously echoing when they built the course that came after it. See the original before you see the tribute, and both pilgrimages end up meaning more.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "St Andrews vs. Augusta — Which Golf Pilgrimage Should Come First",
    sport: ["golf"],
    sportingEventId: null,
    contentCategory: "why_go",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Augusta's own designers built it in deliberate homage to St Andrews. One course is a public ballot away; the other is invitation-only. The order you visit them in genuinely changes both.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Augusta National's 1933 opening, 1934 first Masters, Bobby Jones/Clifford Roberts/Alister MacKenzie, former nursery site, 'Augusta National Invitational' original name — visitaugusta.com and readex.com. MacKenzie/Jones's admiration for St Andrews and Augusta's borrowed design elements — everydaytourist.ca. St Andrews public ownership and 36-handicap ballot (already sourced for article #21) — golfbreaks.com. Augusta's no-cell-phone policy and badge lottery exclusivity (already sourced for article #28) — heavy.com. Deliberately unlinked — no sportingEventId, since this is a genuinely cross-venue comparative piece with no single event anchor, and the original Alfred Dunhill Links event it may once have been tied to was dropped from the roadmap 8 Aug 2026. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-27T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
