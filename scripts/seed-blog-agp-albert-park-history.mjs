import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "albert-park-tried-to-host-a-grand-prix-twice-before-it-worked";
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian Grand Prix 2027

const bodyContent = `## Two false starts

Albert Park's relationship with motor racing goes back further than most fans realize, and it didn't start well. In 1934, organizers tried to set up a race around the lake and ran straight into local opposition, and the plan died before a single car turned a wheel. A second attempt, a motorcycle race pitched in 1937, met the same fate.

It took until 1953 for the Light Car Club of Victoria to finally get approval, and the first Australian Grand Prix at Albert Park ran that November, won by Doug Whiteford. Over the next five years the park hosted six meetings in total. Stirling Moss won the 1956 Australian Grand Prix there, then came back in 1958 to take the final race before it all shut down.

That shutdown wasn't really about the racing. It was about everything around it: crowd control, damage to the park, and residents who'd had enough of watching their lake get turned into a paddock once a year. After November 1958, Albert Park went quiet for close to four decades.

## The deal made under false names

Melbourne didn't get another shot at hosting a Grand Prix through goodwill. It got one through a secret negotiation most Victorians didn't know was happening until it was already done.

In July 1993, Victorian Premier Jeff Kennett and businessman Ron Walker flew to London to meet Formula 1 boss Bernie Ecclestone, reportedly traveling under aliases so word wouldn't reach South Australia, which had hosted the race on the streets of Adelaide since 1985. Melbourne, still carrying $32 million in debt and still smarting from losing its 1996 Olympic bid to Atlanta, needed something to point to. Kennett announced in December 1993 that the Grand Prix would move to Albert Park from 1996.

Adelaide didn't take it quietly. Walker later described a staff member spitting at his feet on a return visit to the city. Locally, the reaction was just as sharp: in February 1994, Albert Park residents formed a group called Save Albert Park, objecting to a deal struck without public consultation and to the idea of a public lake becoming a racetrack at all. That May, roughly 10,000 people turned out to a rally against the plan. Kennett was unmoved. The race went ahead as scheduled, and Albert Park's F1 debut came on 10 March 1996, Damon Hill beating rookie teammate Jacques Villeneuve, exactly the outcome Save Albert Park had rallied against two years earlier.

## A circuit that still gives the park back

The compromise, such as it is, shows up in how the circuit operates today. For roughly nine months of the year, the roads around Albert Park Lake are just roads: open to runners, cyclists, and anyone walking the dog. It's only in the lead-up to race weekend, and for the teardown after, that the barriers go up and the park becomes a Grand Prix circuit again.

Save Albert Park is still around, still arguing the race doesn't belong there. Nearly thirty years on, the argument that started in a London hotel room under a fake name hasn't fully gone away — it just lost.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Albert Park Tried to Host a Grand Prix Twice Before It Actually Worked",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "history",
    excerpt: "Melbourne's lakeside street circuit failed twice before it ever turned a wheel in anger. The race that finally arrived in 1996 only got there because two men flew to London under fake names.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: Albert Park Circuit (Wikipedia) — 1934/1937 failed attempts, 1953-58 racing era (six meetings, closure due to local opposition/crowd control/park damage), 1996 revival, ~9 months/year public road access vs ~3-month race-weekend closure. Ministry of Sport, 'How Melbourne Secured the F1 Australian Grand Prix' — Kennett/Walker's July 1993 London trip under aliases, Ecclestone deal, Melbourne's $32M debt and lost 1996 Olympic bid, Walker's spitting-incident account. University of Melbourne Library Collections blog, 'Reclaiming Albert Park: The Battle Against Formula 1' — Save Albert Park formed Feb 1994, 15 May 1994 rally (~10,000 attendees). 1985 Australian Grand Prix / Adelaide Street Circuit (Wikipedia) — Adelaide hosted 1985-1995 (11 editions). 1996 Australian Grand Prix (Wikipedia/Motorsport Magazine) — race held 10 March 1996, Damon Hill beat rookie teammate Jacques Villeneuve. Researched 20 Sep 2026. Article 1 of 4 in the Australian GP 2027 blog batch (angles locked with founder same day). Hero image pending — sourced separately, all 4 articles' images to be applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-09-20T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
