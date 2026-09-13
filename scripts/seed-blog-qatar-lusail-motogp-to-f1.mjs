import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "lusail-built-for-motogp-not-f1-history";
const QATAR_GP_2026_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";

const bodyContent = `Formula 1 has raced at Lusail International Circuit since 2021. The circuit itself had already been running for 17 years by then, and it wasn't built with F1 in mind at all.

## Built in a year, for a different sport entirely

Losail International Circuit, as it was originally spelled, went up in just over a year, at a cost of around $58 million, with nearly 1,000 workers on site around the clock to get it ready in time. Its first race, on 2 October 2004, was the Qatar motorcycle Grand Prix, won by Sete Gibernau in a race remembered as much for a mid-championship row between Gibernau and Valentino Rossi as for the circuit itself. Since 2007, Losail has opened the MotoGP season nearly every year, and that scheduling detail matters: a March season-opener in the Qatari desert meant the circuit needed a way to race outside the punishing daytime heat almost from the start.

## The lights that came three years before F1 ever considered it

In 2007, the circuit installed permanent floodlights, a job that took contractor Musco Lighting 175 days and more than 1,000 lighting structures, 3 million kilos of concrete, and 500km of wiring. The payoff came the following March: the 2008 Qatar motorcycle Grand Prix was the first night race in MotoGP history. Formula 1 wouldn't hold its own first night race, in Singapore, for another six months, and that race was built for a completely different reason: to put the Grand Prix into a European TV-friendly time slot. Losail's lights existed for over a decade before F1 needed anything from them, built to solve MotoGP's own weather problem rather than to stage a spectacle for anyone watching from home.

## What F1 actually inherited when it turned up

Formula 1 arrived at Lusail in 2021 as a late addition to a calendar disrupted by the pandemic, not as a planned expansion. Qatar signed a proper 10-year hosting deal from 2023, and that's when the circuit was upgraded specifically for F1 cars and teams, including what's now the longest pit lane building on the Formula 1 calendar: 402.1 metres long, with 50 pit boxes. But the track itself, 16 corners split 10 right and 6 left, wrapped around a kilometre-long main straight, is still fundamentally the layout designed for motorcycles two decades earlier. It rewards flowing, high-commitment corners over the stop-start braking zones more common on circuits purpose-built for F1.

## Why that history is worth knowing before race weekend

Most Grand Prix circuits get built, or substantially rebuilt, because Formula 1 wants a race there. Lusail is one of the few on the calendar that F1 simply moved into, arriving two decades after the circuit's first event and inheriting both a layout and a set of floodlights designed for an entirely different set of machines. Watching an F1 car navigate a track built for motorcycles is, in a real sense, watching the sport adapt to somewhere else's terms for once.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Lusail Was Built for MotoGP, Not F1 — How It Became a Grand Prix Track",
    sport: ["formula_one"],
    sportingEventId: QATAR_GP_2026_EVENT_ID,
    contentCategory: "history",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Formula 1 didn't arrive at Lusail until 2021 — 17 years after the circuit's first race, and 13 years after it became the first venue in motorcycle racing history to host a Grand Prix at night.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: circuit built in ~1 year, $58M cost, ~1,000 workers — racingcircuits.info, en.wikipedia.org/wiki/Lusail_International_Circuit. 2004 inaugural race (2 Oct, Marlboro GP of Qatar, Sete Gibernau win, Rossi-Gibernau controversy) — en.wikipedia.org/wiki/2004_Qatar_motorcycle_Grand_Prix, the-race.com ('Toby Moody: How a Rossi row made Qatar's first GP legendary'). MotoGP season-opener status since 2007, qatarmotogp.com ('History of the circuit'). 2007 floodlight installation (Musco Lighting, 175 days, 1,000+ structures, 3M kilos concrete, 500km wire) and 2008 first-ever MotoGP night race — speedo-angels.com, en.wikipedia.org/wiki/Lusail_International_Circuit. Singapore's 2008 F1 night race built for European broadcast timing, as contrast — f1chronicle.com, wonderwall.sg, formula1.com ('Do you remember... F1's first ever night race'). F1's 2021 pandemic-calendar debut, 2023 ten-year deal, 2023 pit-lane renovation (402.1m, 50 boxes, longest on F1 calendar), 16-corner (10R/6L) layout — en.wikipedia.org/wiki/2021_Qatar_Grand_Prix, visitqatar.com, oversteer48.com. Verified 13 Sep 2026.",
    publishedAt: new Date(),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
