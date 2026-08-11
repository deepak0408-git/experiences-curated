import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "best-seat-in-golf-st-andrews-18th";

const bodyContent = `The 18th at the Old Course is 357 yards, flat, wide open, and by any conventional measure, not a hard hole. Yet it has decided majors, humbled legends, and hosted more farewells than any other 18 holes in the sport combined. That contradiction is the whole point.

## The valley that swallows more shots than any bunker

Front-left of the green sits the Valley of Sin, an eight-foot depression that Old Tom Morris built into the green complex when he reworked the 18th as Keeper of the Green. It looks harmless from the fairway. It is not. The green above it runs downhill back toward the valley, so a putt that looks safely past the hole can roll back down into it — the 18th is, by reputation, the most three-putted green in golf history. In 1995, Constantino Rocca hit one of the most famous shots in Open Championship history from inside it: a 60-foot putt from the Valley of Sin that dropped for eagle and forced a playoff with John Daly. Rocca lost the playoff. Nobody remembers that part.

## A bridge with more film in it than most stadiums

Between the 1st and 18th fairways sits the Swilcan Bridge, a stone footbridge at least 700 years old, originally built for shepherds moving livestock across the burn, long before anyone hit a golf ball anywhere near it. It's barely thirty feet long. It has become the single most photographed handshake point between golf and its own history — the place where Arnold Palmer waved goodbye in 1995, Jack Nicklaus did the same in 2005 after a ten-minute standing ovation and a birdie to finish his competitive career, Tom Watson in 2010, and Tiger Woods in 2022. None of those farewells happened because the bridge is beautiful, though it is. They happened because everyone in the game has agreed, without ever voting on it, that this is where a career at St Andrews is allowed to end.

## The part nobody expects: you can actually play it

Most "best seat" arguments in sport are about access you'll never get — a box, a badge, a connection. The 18th at St Andrews breaks that pattern entirely. The Old Course is publicly owned by the town, and any golfer with a handicap of 36 or under can enter the Old Course Ballot, a genuine lottery drawn 48 hours before play, and walk the same 18th that Nicklaus and Woods walked away from. You won't win the ballot every time — it's oversubscribed, and Thursdays and Saturdays give the best odds — but the fact that you can enter at all is the real difference between St Andrews' 18th and almost every other iconic closing hole in golf.

## Why this is the pick

Augusta's 18th has more television history. Pebble Beach's is more scenic. But no closing hole carries the sport's own memory the way St Andrews' does, and no other one lets a stranger with a mid-handicap actually stand where the greats said goodbye. That combination — history you can watch, and access you can actually win — is what makes it the best seat in golf, not the toughest one.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Best Seat in Golf — Why the 18th at St Andrews Ruins Every Other Green",
    sport: ["golf"],
    sportingEventId: null,
    contentCategory: "bucket_list",
    seriesSlug: "best_seat_per_sport",
    seriesPosition: 2,
    excerpt: "The Old Course's 18th isn't the hardest hole in golf. It's the only iconic closing hole a mid-handicap stranger can actually enter a ballot to play.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Swilcan Bridge history and age — bunkered.co.uk and liveabout.com; Valley of Sin origin (Old Tom Morris) and Rocca-Daly 1995 playoff putt — golfmonthly.com and top100golfcourses.com; Nicklaus 2005 farewell (10-minute ovation, birdie to finish) — theopen.com; Palmer 1995, Watson 2010, Woods 2022 farewell walks — thegolfbandit.com and theopen.com (Tiger Woods farewell); Old Course public ownership, 36-handicap ballot eligibility, 48-hour lottery window, Thursday/Saturday best-odds detail — golfbreaks.com and golfpass.com. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-10T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Slug:  ", row.slug);
console.log("  Status:", row.status);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
