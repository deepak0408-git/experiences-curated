import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "deal-mclaren-made-before-melbourne-even-started";
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian Grand Prix 2027

const bodyContent = `## A gentleman's agreement, before a wheel was turned

Mika Hakkinen and David Coulthard went into the 1998 Australian Grand Prix, the first race of a new season, in matching McLaren-Mercedes cars that were fast but had shown real reliability problems in winter testing. Getting both of them to the finish, in any order, already counted as a result. So the two drivers made a deal: whoever reached the first corner in the lead would win the race, and the other would not fight for it.

Hakkinen qualified 0.043 seconds ahead of Coulthard, and he led into Turn 1. On paper, the race was already decided before it began.

## The mix-up that nearly undid it

On lap 36, Hakkinen came into the pits without warning. He later said the team had said something over the radio that he misheard as a call to pit for fresh tyres. It wasn't. He drove down the pit lane without stopping, lost several seconds, and came out behind Coulthard, who inherited the lead he wasn't supposed to have.

Years later, in 2007, McLaren boss Ron Dennis offered a different explanation: that someone outside the team had tapped into McLaren's radio frequency and issued the pit call themselves. That claim was never independently confirmed, and it surfaced nearly a decade after the race, so it sits in the story as Dennis's account rather than an established fact.

## Coulthard keeps his word

With 16 laps to go and a lead of around 12 seconds, Coulthard slowed on the front straight and let Hakkinen back through. He was holding to the pre-race agreement, not racing for the win he was, by that point, actually running.

Hakkinen took the win by 0.702 seconds. Australian Grand Prix Corporation chairman Ron Walker filed an official complaint with the FIA, arguing the race had effectively been decided by a private arrangement between two teammates rather than by racing. The World Motorsport Council investigated and warned that "any future act prejudicial to the interests of competition should be severely punished," but stopped short of overturning the result.

## What it actually changed

The 1998 Melbourne swap didn't end team orders. Ferrari's much more blatant use of them, ordering Rubens Barrichello to hand Michael Schumacher the win at the 2002 Austrian Grand Prix, is the moment usually credited with forcing the FIA's hand, and team orders were formally banned from the 2003 season onward. The ban lasted until December 2010, when the FIA's World Motor Sport Council scrapped it for 2011 after a similar Ferrari incident at that year's German Grand Prix proved the rule was nearly impossible to enforce.

What Melbourne did was put the argument on the table for the first time in the modern era: is a Grand Prix a contest between drivers, or between teams willing to sacrifice one driver for the other? McLaren settled that question for themselves in 1998 with a handshake before the race had even started, and F1 spent the next thirteen years figuring out whether that was actually allowed.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Deal McLaren Made Before Melbourne Even Started",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "rivalry",
    excerpt: "Hakkinen and Coulthard agreed before the 1998 Australian Grand Prix that whoever led at Turn 1 would win. A radio mix-up nearly broke the deal, and the fallout became one of F1's defining team-order controversies.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: 1998 Australian Grand Prix (Wikipedia) — race date 8 Mar 1998, final classification, 0.702s margin, WMSC ruling, Ron Walker/AGPC complaint. Automobilist.com, 'A Mysterious Order: Inside the Controversial 1998 Australian GP' — Hakkinen and Coulthard's own quoted recollections of the pre-race Turn 1 agreement, the lap 36 radio mix-up, Coulthard's 2020 comment on reliability concerns. RacingNews365, 'Hakkinen hack causes McLaren team order controversy' — Ron Dennis's 2007 radio-interference claim, flagged in the article as unconfirmed and disputed, not stated as fact. RaceFans/Autosport — Dec 2010 FIA World Motor Sport Council scrapping the team-orders ban (Article 39.1) for 2011, following the 2010 German GP Ferrari incident. Researched 20 Sep 2026. Article 2 of 4 in the Australian GP 2027 blog batch (angles locked with founder 20 Sep 2026). Hero image pending — all 4 articles' images to be sourced/applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-09-21T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
