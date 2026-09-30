import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "why-japanese-f1-fans-are-on-another-level";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4"; // Japanese GP 2027 (Suzuka)

const bodyContent = `## Nobody wanders off during the session

At most Grands Prix, a meaningful share of the grandstand empties out mid-session — food queues, bathroom breaks, a wander to the merchandise stalls. At Suzuka, that doesn't really happen. Fans arrive at circuit open and stay through to close, and they stay paying attention: tracking tyre strategy across a stint, calling pit-stop windows before they happen, and recognising cars mid-pack by sound alone. It's the kind of crowd behaviour usually associated with home football support, not a Sunday-afternoon motor race.

## Cosplay for drivers nobody else remembers

The costumes are the part visitors notice first. Fans turn up dressed as current drivers and current engineers, which is expected, but also as retired backmarkers from a decade or two ago — hand-painted helmets, replica overalls, homemade signs referencing specific races most of the grid wouldn't remember. Kids come dressed as full driver-and-team combinations their parents clearly built with them the night before. It reads less like fandom performed for cameras and more like fandom that's been rehearsed at home for years.

## A crowd that grew up with the sport

Suzuka's fan culture wasn't built by a streaming series or a marketing push. The fans who watched Senna and Prost collide there in 1989 and 1990 are, by now, bringing their own kids to the same grandstands, and the knowledge gets passed down with the seat. That generational continuity is part of why the crowd tracks strategy and history with the fluency it does — a lot of what's in the stands has effectively been there, in one form or another, since the late '80s.

## What it actually means for a first-time visitor

None of this requires insider access to notice. Sit anywhere in the main grandstands and the atmosphere is audible before the first lights-out — polite, focused, and unmistakably knowledgeable in a way that's genuinely rare on the current F1 calendar. Drivers consistently name Suzuka among their favourite circuits to race at, and the crowd is a real part of why.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Why Japanese F1 Fans Are on Another Level",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "why_go",
    excerpt: "Suzuka's crowd doesn't wander during the race, tracks tyre strategy from memory, and turns up in cosplay for drivers most of the grid has forgotten. It's one of the real reasons drivers rate the circuit so highly.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: The Drive, 'Japanese F1 Fans Are on Another Level' — sustained in-seat attention through sessions, driver/engineer cosplay including retired backmarkers. Motor Sport Magazine, 'F1 drivers' favourite circuit: why they love racing at Suzuka' — driver commentary on crowd and circuit reputation. Fan Voyage Insider (Substack), 'Why Suzuka Has the Best Fans in Formula One' — generational fan-culture framing, community-atmosphere scoring context (used as directional colour, not as a cited statistic). Researched 23 Sep 2026. Article 5 of 5 in the Japanese GP 2027 blog batch (angles locked with founder 23 Sep 2026). Hero image pending — sourced separately, all 5 articles' images to be applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-09-27T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
