import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "grand-prix-that-got-cancelled-at-the-gates";
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian Grand Prix 2027

const bodyContent = `## A positive test on Thursday night

By the second week of March 2020, F1 knew COVID-19 was a real problem for the season, but the plan going into Melbourne was still to race. Support categories ran their scheduled sessions on Thursday, and a two-seater Minardi was doing demonstration laps early Friday morning. Then, Thursday evening, McLaren announced that one of its crew members had tested positive for the virus after arriving in Melbourne with flu-like symptoms. The team withdrew from the weekend, and fourteen more McLaren staff went into quarantine.

## A vote that ran into the early hours

With McLaren already out, the FIA and Formula 1 called a meeting of the nine remaining team principals that Thursday night. The discussion ran past midnight, and it ended with what F1's own statement described as "a majority view of the teams that the race should not go ahead." Victoria's state premier, Daniel Andrews, had separately announced that if the race did continue, it would run without spectators. Between the team vote and that announcement, the writing was on the wall well before anything was made official.

## Fans found out at the gate

The formal cancellation came two hours before Friday's first practice session, but word had already leaked overnight, and confusion at the circuit built well before the announcement landed. People who'd queued up expecting to get into Albert Park that morning were told over a megaphone: "The AGPC has been advised by Formula 1 that the Australian Grand Prix has been cancelled." Reactions in the crowd ranged from confusion over refunds to anger that a sporting event was being shut down while schools and supermarkets stayed open. Australian Grand Prix Corporation chairman Paul Little apologized to ticket holders, saying the health and safety of "the teams and people, the community generally, has to take precedence." CEO Andrew Westacott didn't rule out a later reschedule, though nothing eventuated for 2020, and F1's season didn't actually get underway until Austria that July.

## What it marked, in hindsight

At the time, some in the paddock thought the reaction was overcautious. Lewis Hamilton, weeks later, called the decision to even attempt the race weekend "shocking" given what had already happened elsewhere in global sport, including the NBA suspending its own season. Looked at now, Melbourne wasn't an overreaction so much as the moment the sport ran directly into a situation it had no real plan for. Every major sporting event that followed in 2020, empty stadiums, hastily rearranged calendars, mid-week positive tests threatening entire weekends, traces back to the same basic problem that showed up first at Albert Park: nobody, from the teams to the promoters to the fans already queuing at the gate, had a script for this.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Grand Prix That Got Cancelled at the Gates",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "history",
    excerpt: "Fans were already queuing at Albert Park when a megaphone announcement told them the 2020 Australian Grand Prix wasn't happening. It was F1's first real collision with COVID-19, and it happened two hours before practice was due to start.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: 2020 Australian Grand Prix (Wikipedia) — Thursday support-race schedule, McLaren's positive-test withdrawal and 14-person quarantine, Daniel Andrews' spectator-ban announcement, Lewis Hamilton's 'shocking' quote re: the NBA season suspension, Austria as the eventual 2020 season opener. Motorsport Magazine, 'FIA and F1 announce official cancellation of the Australian Grand Prix' — the Thursday-night 9-team-principal meeting, the majority-vote wording, the full joint FIA/F1/AGPC cancellation statement. ABC News, 'Fans told of Australian Grand Prix cancellation by megaphone at track gates' — the gate-announcement wording, crowd reactions, Paul Little and Andrew Westacott quotes, full-refund confirmation. Researched 20 Sep 2026. Article 3 of 4 in the Australian GP 2027 blog batch (angles locked with founder 20 Sep 2026). Hero image pending — all 4 articles' images to be sourced/applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-09-22T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
