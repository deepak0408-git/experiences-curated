import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-rookie-title-lost-in-a-gravel-trap";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese GP 2027 (Shanghai)

const bodyContent = `## Twelve points up, with two races left

Lewis Hamilton arrived at the 2007 Chinese Grand Prix in his rookie season leading the drivers' championship by 12 points over Fernando Alonso and 17 over Kimi Räikkönen, with only two races left on the calendar. A points finish, even a modest one, would have kept the title largely in his own hands going into the final round. He didn't need to win. He needed to survive the weekend.

## A tyre call that went wrong in real time

As the track dried through the race, Hamilton's tyres degraded badly — worn down to the canvas, by most accounts — while his team weighed a pit stop against forecasts of more rain that never fully arrived. The call not to change tyres at his first stop turned into the moment that cost him the race, and very nearly the season.

Coming into the pit lane on lap 30 with those worn tyres, Hamilton couldn't make the sharp left-hander into the pit entry. His McLaren slid straight past the turn-in and beached itself in the gravel trap, stranded at the very edge of the pit lane he'd been trying to reach. It was his first retirement of the season, and it came at the single worst possible moment to have one.

## Seven points, then none at all

Räikkönen went on to win the race. Hamilton's non-finish cut his championship lead from 12 points down to seven heading into the final round in Brazil. He arrived there still in the box seat, but a late mechanical problem in that last race dropped him out of the points entirely, and Räikkönen won both the race and the title by a single point over Hamilton and Alonso, who tied for second.

The gravel trap at the Shanghai pit entry didn't cost Hamilton the championship by itself — Brazil did that on its own — but it's the moment the story usually starts from: a rookie with the title all but in hand, undone by a corner most drivers negotiate at half-attention on their way into the pits.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Rookie Title Lost in a Gravel Trap",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "rivalry",
    excerpt: "Lewis Hamilton led the 2007 championship by 12 points heading into Shanghai. A tyre call gone wrong put him in the gravel trap at the pit entry, and his rookie title bid unraveled from there.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: Sky Sports, 'Flashback: Lewis Hamilton's world title slips away in 2007 Chinese Grand Prix' — championship points gap entering the race, tyre-wear/pit-strategy context, race outcome. Wikipedia, '2007 Chinese Grand Prix' — lap-30 gravel trap incident at the pit entry, Raikkonen race win, points swing. Autosport, 'Memories of China 2007 prevented Hamilton's late F1 Turkish GP stop' — corroborating detail on the gravel-trap retirement's lasting impact on Hamilton's later strategy decisions. Final-round outcome (2007 Brazilian GP, Raikkonen's title by one point over Hamilton/Alonso) is established F1 history, cross-checked via Wikipedia. Researched 23 Sep 2026. Article 3 of 4 in the Chinese GP 2027 blog batch (angles locked with founder 23 Sep 2026). Hero image pending — sourced separately, all 4 articles' images to be applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-09-30T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
