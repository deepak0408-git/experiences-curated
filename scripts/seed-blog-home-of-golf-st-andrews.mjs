import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "why-home-of-golf-means-st-andrews";

const bodyContent = `Most sports don't have a single place everyone agrees is where it began. Golf does, and it's been arguing about the rules from that exact spot for nearly 600 years.

## Banned before it was beloved

Golf was already being played on the links at St Andrews by around 1400. It became popular enough that in 1457, King James II of Scotland had Parliament formally ban both golf and football, worried the games were distracting young men from archery practice they needed for national defense. The ban was largely ignored. By 1502, King James IV had taken up the game himself, becoming golf's first royal player and effectively ending any real attempt to stop it. In 1552, the Archbishop of St Andrews formally granted the town's people the right to play on the links — the first official record of golf actually being sanctioned there.

## The club that quietly became the sport's rulebook

The Society of St Andrews Golfers was founded in 1754. In 1834, King William IV became its patron, and the club took the name it's still known by: the Royal and Ancient Golf Club of St Andrews, or simply the R&A. In 1897, the R&A codified the actual Rules of Golf — the formal set of regulations that, in various updated forms, still governs the sport. From that point, the R&A became the game's real governing authority everywhere outside the United States and Mexico, a role it still holds today through R&A Rules Limited, alongside America's USGA.

## Why the title has stuck this long

Plenty of places claim to be a sport's spiritual home. St Andrews' claim is unusually literal: it's not just where golf is old, it's where the actual rulebook the entire sport still plays by was written and is still maintained. The Open Championship, golf's original major, returns there on rotation specifically because no other course carries that dual weight — genuine playing history stretching back centuries, and genuine governing authority that never left.

## Why this is the pick

A title survives 600 years only if it keeps being true, not just repeated. St Andrews earned "Home of Golf" the hard way — through a royal ban it survived, a governing body it built, and a rulebook it still writes. That's a harder claim to make than most sports' origin stories, and it's exactly why nobody seriously argues with it.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Why the Home of Golf Still Means St Andrews, 600 Years Later",
    sport: ["golf"],
    sportingEventId: null,
    contentCategory: "history",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Banned by royal decree in 1457, sanctioned by 1552, and the source of the actual Rules of Golf since 1897 — St Andrews' claim to \"Home of Golf\" is unusually literal.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: golf at St Andrews since ~1400, 1457 James II ban (golf and football, archery-practice concern), 1502 James IV as first royal golfer, 1552 Archbishop Hamilton's grant of rights — historic-uk.com, birdiebrae.co.uk, and golfcollege.edu. 1754 founding of the Society of St Andrews Golfers, 1834 King William IV patronage and R&A naming, 1897 codification of the Rules of Golf, R&A's governing role outside the US/Mexico via R&A Rules Limited — randa.org and Wikipedia 'The R&A'. Deliberately unlinked — no sportingEventId, same reasoning as article #38 (the original Alfred Dunhill Links tie was dropped from the roadmap 8 Aug 2026; St Andrews itself is treated as a standalone evergreen subject). Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-29T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
