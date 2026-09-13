import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "qatar-night-race-why-go-lusail";
const QATAR_GP_2026_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";

const bodyContent = `Every other night race on the F1 calendar was built to be watched. Singapore's 2008 race, F1's first ever under lights, was scheduled specifically to land in a European TV-friendly slot. Abu Dhabi's Yas Marina stages a deliberate sunset-to-darkness transition, timed for the cameras. Qatar's lights weren't built for any of that.

## Lights that predate Formula 1 by 13 years

Lusail installed its floodlights in 2007, more than a decade before Formula 1 ever raced there. The reason had nothing to do with spectacle: MotoGP had been opening its season at the circuit since 2007, and a March race weekend in the Qatari desert meant finding a way to run outside the worst of the daytime heat. The following March, the 2008 Qatar motorcycle Grand Prix became the first night race in the history of motorcycle racing, six months before Singapore did the same for Formula 1. By the time F1 turned up at Lusail in 2021, the lights weren't a new addition designed to sell the race. They were already 13 years old, installed to solve someone else's scheduling problem.

## What racing fully after dark actually looks like

Since 2024, the Qatar Grand Prix has run as a full night race, lights out at 19:00 local time, run start to finish under the floodlights rather than crossing from daylight into darkness mid-session the way Abu Dhabi does. That distinction is worth knowing if you're picking between the calendar's night races: Qatar isn't staging a sunset for you to watch, because the race was never scheduled around when the sun goes down in the first place. It's simply run after dark, the same way it has been for both cars and motorcycles for going on two decades.

## Why the origin story is worth knowing before you go

This is the opinion part: a night race built to solve a real problem reads differently, trackside, than one built as a broadcast product. Singapore's lights are a genuine spectacle and Abu Dhabi's twilight transition is a real piece of theatre, and neither is worse for having been designed that way. But there's something to be said for watching a Grand Prix run entirely under a lighting rig that exists because riders and drivers actually needed it, not because a broadcaster did. If you want the night-race experience without it feeling like it was staged for the cameras, Lusail is the one place on the calendar where the lights came first, for reasons that had nothing to do with Formula 1 at all.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Qatar's Night Race Wasn't Built for Formula 1 — and That's Exactly Why It Feels Different",
    sport: ["formula_one"],
    sportingEventId: QATAR_GP_2026_EVENT_ID,
    contentCategory: "why_go",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Singapore's night race was built for European TV. Abu Dhabi's twilight start was built for the cameras. Lusail's floodlights are 13 years older than Formula 1's arrival there, and were never about either.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Lusail's 2007 floodlight installation and its link to MotoGP's own March season-opener heat problem, 2008 first-ever MotoGP night race — speedo-angels.com, qatarmotogp.com, en.wikipedia.org/wiki/Lusail_International_Circuit (previously verified for lusail-built-for-motogp-not-f1-history article, 13 Sep 2026). Singapore 2008 as F1's first night race, built for European broadcast timing — f1chronicle.com, wonderwall.sg, formula1.com. Abu Dhabi's twilight 5:00pm start crossing daylight into dark — f1-fansite.com, global.honda (previously verified for the Yas Marina sunset-race article, 10 Aug 2026). Qatar's shift to a full 19:00 local night start from the 2024 season — mercedesamgf1.com ('Qatar Grand Prix 2024'), racingnews365.com ('Schedule F1 Qatar Grand Prix 2024'). F1's 2021 Lusail debut — en.wikipedia.org/wiki/2021_Qatar_Grand_Prix. Verified 13 Sep 2026. The 'why this is worth going for' framing in the final section is the outlet's own editorial opinion, not presented as fact.",
    publishedAt: new Date(),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
