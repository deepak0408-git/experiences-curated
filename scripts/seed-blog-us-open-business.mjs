import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-business-of-the-us-open";
const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";

const bodyContent = `Every Grand Slam sells tickets and TV rights. Only one of them functions as the financial engine for its entire national federation.

## A nonprofit with a 49% margin

The US Open is owned and run by the United States Tennis Association, a nonprofit under Section 501(c)(6) of the US tax code. Last year the USTA reported $624 million in revenue — and 90% of it came from these two weeks in Flushing Meadows. The tournament's profit margin runs above 49%. That's not a tennis tournament with good business sense attached; that's a business whose product happens to be a tennis tournament.

Compare that to Wimbledon, run by the All England Lawn Tennis Club through a private members' club structure and its own foundation. Or the French Open, under the French Tennis Federation. Every Slam funds player development and grassroots tennis in its home country — but nowhere else does one two-week event carry that close to the entire weight of the federation's finances. When the USTA needs money for the National Junior Tennis and Learning program — over 150,000 under-resourced kids a year, across 250+ nonprofit sites — the US Open is where nearly all of it comes from.

That structural fact explains almost everything else about how the tournament is run.

## Why the prize money keeps climbing faster than anywhere else

The 2026 purse hit $108 million — a record for any tennis tournament ever, up 20% from 2025's $90 million, which was itself up 20% from 2024. Two consecutive 20% raises is not typical Slam behavior; it's what happens when a nonprofit with a 49% margin has both the cash and the incentive to keep its flagship event ahead of the market. A first-round loser this year takes home $140,000 — up 27% in a single year. The men's and women's singles champions each collect $5.5 million.

## Why the roof happened at all

Arthur Ashe Stadium's retractable roof was part of an $800 million-plus renovation of the whole National Tennis Center, with the roof itself running roughly $150 million. It came after five straight years of rain-wrecked scheduling through the early 2010s — a level of disruption that, at a normally-funded tournament, might have stayed a known cost of doing business. The USTA had the balance sheet to just fix it instead. Louis Armstrong Stadium got its own, even larger retractable roof two years later. Weather delays that used to be routine are now, for the two biggest show courts, mostly solved.

## Why ESPN pays more for this Slam than for the others

ESPN's rights deal for the US Open runs 12 years, worth a reported $2.04 billion — about $170 million a year, extending coverage through 2037. That number is inflated by something none of the other three Slams have: it's the only Grand Slam played on US soil, in US time zones, for a US network. Wimbledon, Roland Garros, and the Australian Open all ask American viewers to watch tape-delayed or overnight; the US Open asks nothing of the schedule at all. Home-market advantage is worth a real premium, and ESPN is paying for the one Slam where it doesn't have to fight the clock.

## Why the Honey Deuce isn't a gimmick, it's a business line

The tournament's $23 vodka-and-melon-ball cocktail sold enough units last year to generate over $17 million on a single drink. That's not incidental concessions revenue — at a nonprofit whose margin depends on every dollar per attendee, a signature cocktail that becomes a genuine cultural export (every camera pan through the stands finds one) is a deliberately engineered revenue line, not a happy accident.

None of this makes the tennis any different. But it's worth knowing, next time you're standing under that roof with a $23 drink in your hand, that you're not just watching a Grand Slam — you're funding the exact same organization's youth programs in cities you'll never visit, at a scale no other tournament on the calendar comes close to matching.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Business of the US Open — Why It's Not Like the Other Three Slams",
    sport: ["tennis"],
    sportingEventId: US_OPEN_EVENT_ID,
    contentCategory: "why_go",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "The US Open made $624 million last year — 90% of everything the USTA earns. Here's the structural reason it's a different kind of tournament than Wimbledon, the French Open, or the Australian Open.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Sportico and Yahoo Finance (USTA $624M revenue, 90% from US Open, 49%+ margin, USTA Incorporated 2023 financial statements); Bleacher Report, Yahoo Sports, Tennis Temple, Man of Many (2026 $108M prize purse, 20% YoY growth 2024-2026, first-round/champion payouts); TheScore, Boston Globe, WSP, Architizer (Ashe roof cost ~$150M, part of larger renovation, 5 years of rain delays as origin, Armstrong's later roof); Sportico, Fast Company, Parametric Architecture ($800M+ overall renovation figure); SportsPro, Sportcal, Front Office Sports, Sports Media Watch (ESPN $2.04B/12-year/2037 rights deal, ~$170M/year, US-timezone rationale). Verified 21 Aug 2026.",
    publishedAt: new Date(),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Slug:  ", row.slug);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
