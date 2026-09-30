import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-track-that-crosses-itself";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4"; // Japanese GP 2027 (Suzuka)

const bodyContent = `## A shape nobody was really trying to make

Suzuka's most obvious feature — the back straight passing directly over the front section on a purpose-built overpass — wasn't a design flourish. Dutch track architect John Hugenholtz drew the circuit in the late 1950s to fit a plot of land hemmed in by surrounding rice fields, and the figure-eight was the layout that used the available ground most efficiently. The crossover existed to solve a land problem, not to create a spectacle, and it's stayed the circuit's signature ever since.

That land constraint had a second effect nobody was planning for either. Because the lap loops back over itself, Suzuka runs both directions within a single circuit — ten right-hand corners and eight left-handers — which spreads cornering load more evenly across both sides of the car and both sides of a driver's neck than almost any other track on the calendar. Most circuits favour one direction; Suzuka structurally can't.

## Corners that don't get easier with modern cars

The layout that resulted is unusually unforgiving for a circuit this old. The Esses in the first sector demand a string of direction changes at speed with essentially no room for a defensive line. 130R, taken at close to full throttle in a modern F1 car, has stayed on the calendar's short list of genuinely committing corners for three decades, even after a 2003 reprofiling eased its most dangerous edge. Drivers who've raced at circuits built specifically for modern aerodynamics still single Suzuka out as the layout that rewards a clean, committed lap more than raw car performance.

## Built for driving, not for shortcuts

None of what makes Suzuka distinctive was engineered top-down for entertainment value the way some newer circuits are. It's a shape that came from a land survey and a construction budget in 1962, run in both directions because the ground left no other option, and it has outlasted nearly every circuit built with a bigger budget and a cleaner sheet of paper since. Drivers rarely explain exactly why they rate it above smoother, faster, more modern tracks — usually they just point at the Esses and 130R and leave it there.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Track That Crosses Itself",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "history",
    excerpt: "Suzuka's figure-eight layout, with its own overpass, wasn't designed as a gimmick — it came from a 1962 land constraint. It's also the only F1 track that runs both directions in a single lap.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: Honda Global, 'Suzuka Circuit — The Spiritual Home of Japanese Motorsport' — Hugenholtz design, land constraints, figure-eight/overpass origin. Wikipedia, 'Suzuka Circuit' — 1962 opening, 10 right/8 left corner count, both-direction layout. RacingCircuits.info, Suzuka entry — corner character (Esses, 130R), reprofiling history. EssentiallySports, 'Why Is Figure of Eight Feature of Suzuka Circuit...' — driver commentary on layout balance. Researched 23 Sep 2026. Article 3 of 5 in the Japanese GP 2027 blog batch (angles locked with founder 23 Sep 2026). Hero image pending — sourced separately, all 5 articles' images to be applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-09-25T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
