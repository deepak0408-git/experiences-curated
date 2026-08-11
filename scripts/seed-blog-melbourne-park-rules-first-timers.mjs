import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "melbourne-park-rules-first-time-australian-open";
const AO_EVENT_ID = "1ced8699-d5ce-49fb-add4-6ebc6f251ec6";

const bodyContent = `Most first-timers assume a Grand Slam works like any other big sports day out. The Australian Open has a handful of rules that catch people out specifically because they're not obvious, and one of them is an actual point of Victorian law, not just tournament policy.

## The court isn't where it used to be

The Australian Open played on grass at Kooyong Lawn Tennis Club from 1972 until 1987, when the tournament outgrew the venue. In 1988 it moved to what's now called Melbourne Park, switching to a hard court surface at the same time — first Rebound Ace, then Plexicushion Prestige since 2008. Anyone picturing a grass-court Slam like Wimbledon is picturing the wrong tournament; Melbourne Park has been played entirely on hard courts for nearly four decades now.

## You genuinely cannot bring your own alcohol

This one surprises people every year: bringing outside alcohol into the grounds isn't just against tournament rules, it's an offence under Victorian law specifically for the Australian Open. Water and non-alcoholic drinks are fine in metal or plastic bottles, and food is allowed if properly packaged, but alcohol has to be bought inside the grounds — no exceptions, no eskies, no hampers with a bottle tucked in.

## You can't just walk into the arena whenever

Spectator movement in and out of the show courts is generally restricted to changeovers, not whenever you happen to arrive at your seat — a rule that trips up people used to venues where you can slip in between points. It's worth checking current guidelines before you go, since the exact policy has shifted between editions, but assume you'll be waiting outside the door if you arrive mid-game.

## Why this actually matters

Melbourne Park is genuinely one of the more first-timer-friendly Slam venues — compact, walkable, well signed — but its specific rules aren't the ones a first-time Grand Slam visitor tends to assume. Knowing the surface changed decades ago, that the alcohol rule is real law rather than just a suggestion, and that you might be stuck outside during a changeover saves a first visit from a handful of entirely avoidable surprises.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Rules of Melbourne Park — What First-Time Australian Open Visitors Get Wrong",
    sport: ["tennis"],
    sportingEventId: AO_EVENT_ID,
    contentCategory: "history",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "The tournament left grass courts behind in 1988, and the no-outside-alcohol rule is real Victorian law, not just a tournament policy — two things most first-timers get wrong.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Kooyong grass-court era (1972-1987), 1988 move to Flinders Park/Melbourne Park, surface changes (Rebound Ace, then Plexicushion Prestige from 2008) — melbourne.fandom.com and ausopen.com 'transformation of Melbourne Park'. Alcohol policy as Victorian law offence, permitted food/drink, bag restrictions — sportskeeda.com and ausopen.com 'prohibited items'. Changeover-only movement convention — rg.org spectator guide (with the caveat that this policy has changed between editions, per that same source). Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-28T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
