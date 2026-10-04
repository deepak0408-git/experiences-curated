import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-circuit-built-in-18-months-and-the-lap-record-that-still-hasnt-fallen";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese GP 2027 (Shanghai)

const bodyContent = `## A marshland, eighteen months, and $450 million

In April 2003, the site earmarked for what would become Shanghai International Circuit was marshland in the city's Jiading district — not a redeveloped street layout or an existing test track, but open ground with nothing on it. Eighteen months and roughly $450 million later, the finished circuit hosted its first Formula 1 race. Few venues on the current calendar were built from nothing, to championship standard, on that kind of timeline.

The inaugural Chinese Grand Prix ran on 26 September 2004, and Ferrari's Rubens Barrichello won it from pole, with Jenson Button second for BAR-Honda and Kimi Räikkönen third for McLaren. It was a clean result for a brand-new circuit's first outing — no major incidents, a straightforward podium, nothing that suggested the race would be remembered for anything unusual.

## The fastest lap set by a car that started last

What actually made that weekend memorable came from further down the order. Michael Schumacher, then chasing his sixth world title with Ferrari, spun in qualifying and had to start from the pit lane, effectively last on the grid before the race had even begun. He fought back to finish 12th — not a result that shows up in most recaps of the day — but somewhere in that recovery drive he also set the race's fastest lap, a 1:32.238.

That lap has never been beaten in a Formula 1 race at Shanghai since. Cars have gotten faster in almost every measurable way over the two decades since 2004, and Schumacher's benchmark, set by a driver running outside the points in a car that started from the pit lane, is still the one nobody's matched.

## A record that says as much about the track as the driver

Partly, that's about the circuit rather than the lap itself — Shanghai's mix of long, high-speed sections and technical, tyre-punishing corners doesn't reward outright pace the way a shorter, simpler track would, so lap records here have moved less than at most venues on the calendar. But it's also just a genuinely odd piece of trivia: the fastest lap ever set at a circuit is attached to a finish 12th, from a car that didn't even start on the grid.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Circuit Built in 18 Months, and the Lap Record That Still Hasn't Fallen",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "history",
    excerpt: "Shanghai International Circuit was marshland in April 2003 and a finished F1 venue by September 2004. Michael Schumacher's fastest lap from that first race, set from the pit lane, still hasn't been beaten.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: Wikipedia, '2004 Chinese Grand Prix' — race date, Barrichello win, Button/Raikkonen podium, Schumacher's pit-lane start and 12th-place finish. GPFans, 'The incredible F1 record Michael Schumacher STILL holds at the Chinese Grand Prix' — 1:32.238 fastest lap, confirmed still-standing record. Grandprix247, 'Chinese Grand Prix: History of Formula 1 racing in Shanghai' — circuit construction timeline, marshland site, ~$450M build cost, ~18-month build. Researched 23 Sep 2026. Article 1 of 4 in the Chinese GP 2027 blog batch (angles locked with founder 23 Sep 2026). Hero image pending — sourced separately, all 4 articles' images to be applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-09-28T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
