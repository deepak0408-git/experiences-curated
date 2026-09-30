import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "seventeenth-on-the-grid-first-at-the-flag";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4"; // Japanese GP 2027 (Suzuka)

const bodyContent = `## Starting from nowhere

Kimi Räikkönen qualified 17th for the 2005 Japanese Grand Prix, his McLaren compromised by a fuel-system problem in qualifying that left him starting from the middle of the midfield with no realistic reason to expect a result. A wet Saturday had scrambled the grid further, so the cars ahead of him weren't only slower — some of them were faster cars that had simply qualified badly too.

None of that explains what happened next. By half-distance, Räikkönen had cut through to third. He wasn't picking off backmarkers; he was passing cars that had qualified in the top ten, on a circuit where overtaking was never supposed to be easy.

## The last-lap pass at 200mph

At the front, Giancarlo Fisichella's Renault had led for most of the race and looked settled there. Räikkönen caught him only on the final lap, closing down the gap through Suzuka's high-speed final sector and drawing alongside on the run to the start-finish line. The two cars went past the line side by side, engines against their limiters, wheels close enough that neither driver had room for an error. Räikkönen came out of it in front by a matter of feet, having started the race more than twenty seconds and fourteen positions further back than the man he'd just beaten.

It remains the latest that any front-running pass for a race win has happened at Suzuka, and it's routinely ranked among the best single-lap overtakes F1 has produced anywhere.

## Why it still gets replayed

Suzuka's back half — the esses, 130R, the run to the final chicane — is built for commitment, not overtaking; cars that reach it close together usually stay in that order to the line. Räikkönen's win worked precisely because he'd done the hard part already, grinding through the order lap by lap in traffic, and saved the one pass that actually mattered for the only straight long enough to attempt it.

Two decades on, drivers who've raced at Suzuka since still bring the 2005 race up unprompted when asked what makes the track special — not because it's the fastest circuit or the most technical, but because it's one of the very few where a drive like that was even possible.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Seventeenth on the Grid, First at the Flag",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "rivalry",
    excerpt: "Kimi Räikkönen qualified 17th at Suzuka in 2005 and passed race leader Giancarlo Fisichella on the final lap at 200mph to win. It's still cited as one of F1's greatest single drives.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: PlanetF1, 'The greatest F1 win of the modern era? The 2005 Japanese Grand Prix revisited' — 17th-place qualifying (fuel-system issue), progress to 3rd by half-distance, final-lap pass description. News24, 'F1 Gold: The time Kimi Raikkonen won the 2005 Suzuka GP from 17th on the grid' — race framing and grid-to-win detail. Wikipedia, '2005 Japanese Grand Prix' — race date/classification confirmation. Researched 23 Sep 2026. Article 2 of 5 in the Japanese GP 2027 blog batch (angles locked with founder 23 Sep 2026). Hero image pending — sourced separately, all 5 articles' images to be applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-09-24T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
