import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "ten-more-sporting-events-every-fan-should-see-live";

const bodyContent = `Our first list covered four events chosen for very different reasons — ceremony, history, scale, and driving. This one goes wider: ten more, across the same four sports, none of them repeats.

## Monaco Grand Prix, for the impossibility of it

Monaco is F1's narrowest circuit, its shortest straight, and — according to three-time champion Nelson Piquet — "like riding a bicycle around your living room." Elevation shifts by 42 meters over one lap, a genuinely extreme swing most street circuits never come close to. Qualifying decides more of the race here than at any other venue, because overtaking on track is close to impossible.

## The Ryder Cup, for the format nobody else uses

Twelve golfers a side, 28 matches across three days, first to 14.5 points — the Ryder Cup is the rare top-tier golf event built entirely around team play instead of individual scoring, and its biennial gap means every edition carries two years of pent-up stakes.

## An IPL Final, for the scale of Indian cricket

The 2025 final at Narendra Modi Stadium in Ahmedabad drew 91,419 fans — the largest cricket stadium on earth, filled for a domestic league final, not an international match. It's proof that cricket's biggest crowds aren't always at World Cups.

## The Australian Open at night, for the heat and the roof

Rod Laver Arena had one of the world's first retractable roofs on a sports venue back in 1987. The tournament's own Heat Stress Scale, introduced in 2019, measures four separate climate factors just to decide when conditions are too dangerous to keep playing — a genuinely unique operational reality no other Slam has to manage.

## The World Test Championship Final, for cricket's newest tradition

First played in 2021, the WTC Final crowns Test cricket's actual world champion — a single match, with a scheduled reserve day built in, a deliberate nod to the format's own unpredictable-weather history. The 2027 final at The Oval lands during the 150th anniversary of Test cricket itself.

## Roland Garros, for the surface itself

Court Philippe-Chatrier's clay is just two millimetres of crushed red brick dust over 1.5 tonnes of terre battue, and the court's 32-foot baseline run-off is the largest of any Grand Slam court in the world — genuinely more time and space to construct a point than tennis offers anywhere else.

## The Masters, for the silence

Augusta National bans cell phones entirely, on the entire property, for every patron — a rule enforced strictly enough that a past major champion has been escorted off the grounds for breaking it. No other major sporting event anywhere asks its crowd to disconnect that completely.

## A T20 World Cup Final, for the chaos a game this short can hold

In 2016, West Indies' Carlos Brathwaite hit four consecutive sixes off the final over to win the title from nowhere — a finish only a format this short and this volatile could produce. Twenty overs a side turns an entire tournament on one over, sometimes one ball.

## The Singapore Grand Prix, for the race that changed the sport's clock

Singapore hosted F1's first-ever night race in 2008, lit by roughly 1,600 custom floodlights around the Marina Bay street circuit — a format built specifically to suit European broadcast times, that's since been copied by half a dozen other races on the calendar.

## The Laver Cup, for the format that punishes a slow start

Team Europe versus Team World, in a competition where points are deliberately weighted — 1 point for a Day 1 win, 2 for Day 2, 3 for Day 3 — so a team that falls behind early has to win harder just to catch up. Roger Federer co-founded it in 2017, and it remains the only regular team event in men's tennis built around continents rather than countries.

## Why these ten

Same rule as the first list: this isn't a ranking. Each one earns its place for a different, specific reason — a format, a fact, a feeling — and together they cover ground the first four didn't touch.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Ten More Sporting Events Every Fan Should See Live",
    sport: ["tennis", "golf", "cricket", "formula_one"],
    sportingEventId: null,
    contentCategory: "bucket_list",
    seriesSlug: "the_events_list",
    seriesPosition: 2,
    excerpt: "Ten more events across the same four sports, none of them repeated from the first list — chosen for a format, a fact, or a feeling nothing else on the calendar has.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Monaco GP narrowness/elevation/Piquet quote — bet365 News and f1-analysis.com. Ryder Cup format/points structure — pgatour.com and brucebolt.us. 2025 IPL final attendance (91,419, Narendra Modi Stadium) — Wikipedia '2025 Indian Premier League final'. Rod Laver Arena 1987 roof, AO Heat Stress Scale (2019) — shadedseats.com and tennis365.com. WTC Final format, reserve day, 2027 Oval/150th-anniversary — icc-cricket.com. Roland Garros Chatrier clay composition and run-off dimensions — rolandgarros.com and stade.rolandgarros.com. Augusta National cell phone ban and enforcement — heavy.com and wrdw.com. 2016 T20 World Cup final, Brathwaite's four sixes — Wikipedia/Britannica 'T20 World Cup'. Singapore GP 2008 first night race, floodlight count — scuderiafans.com and nlb.gov.sg. Laver Cup format, weighted points, 2017 founding — Wikipedia 'Laver Cup' and sportsboom.com. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-17T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
