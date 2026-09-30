import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-race-track-honda-built-before-a-grand-prix";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4"; // Japanese GP 2027 (Suzuka)

const bodyContent = `## Built to test motorcycles, not to host a world championship

Suzuka opened in September 1962, twenty-five years before Formula 1 ever raced there. Soichiro Honda commissioned it in the late 1950s as a proving ground for Honda's own road cars and motorcycles — a closed circuit where the company could push products to their limits away from public roads, at a time when Honda was still primarily a motorcycle manufacturer building its case to enter Grand Prix motorcycle racing and, eventually, F1 itself.

Dutch designer John Hugenholtz was brought in to lay out the track, and what he drew — the figure-eight, the overpass, the mix of long corners and tight sections — was shaped by the land available in Mie prefecture rather than by any brief to build a future world-championship venue. For its first quarter-century, that's essentially all Suzuka was: a Honda facility, hosting domestic Japanese racing series, unconnected to F1 in any way.

## The track that had to be changed to host what it became

F1 finally arrived at Suzuka in 1987, and the circuit needed real modification to be ready for it — a chicane was added before the final corner specifically to meet the safety standards a world championship round required, the same chicane that would become the site of Senna and Prost's title-deciding collision just two years later. A facility built to stress-test Honda motorcycles was, within a couple of years of joining the F1 calendar, hosting the two moments that would go on to define its reputation.

## A test track that outlasted its original job

Honda still owns Suzuka. It's no longer primarily a proving ground — it's one of the most recognisable venues in motorsport, and has been for decades — but the ownership never changed hands the way most historic circuits eventually get sold, restructured, or absorbed into event-management companies. The track Soichiro Honda built to test bikes on is the same track F1 still races on today, run by the same company, on land it never stopped owning since 1962.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Race Track Honda Built Before It Ever Saw a Grand Prix",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "history",
    excerpt: "Suzuka opened in 1962 as a Honda proving ground for motorcycles and road cars, 25 years before Formula 1 arrived. Honda still owns it today.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: Honda Global Heritage, 'Completion of Suzuka Circuit / 1962' — Soichiro Honda's commissioning, proving-ground purpose, 1962 opening. Wikipedia, 'Suzuka Circuit' — John Hugenholtz design, 1987 F1 debut, chicane added for safety compliance ahead of F1's arrival. Formula1.com / japan.gp circuit-history pages — general F1-era timeline cross-check. Researched 23 Sep 2026. Article 4 of 5 in the Japanese GP 2027 blog batch (angles locked with founder 23 Sep 2026). Hero image pending — sourced separately, all 5 articles' images to be applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-09-26T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
