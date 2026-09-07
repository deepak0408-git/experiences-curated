import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "the-circuit-named-after-two-brothers-who-died-racing-there";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a"; // Mexico City Grand Prix 2026

const bodyContent = `Most circuits named after people honor careers, not losses. Autódromo Hermanos Rodríguez is different. Ricardo and Pedro Rodríguez were Mexican racing drivers, brothers, and both died racing at the circuit that now carries their name — a fact that sits underneath every modern Grand Prix held there, whether or not anyone mentions it that weekend.

## A venue that keeps returning

Formula 1 first raced at the venue in 1963, stayed through 1970, returned for seven seasons starting in 1986, and came back again in 2015 in the form the sport races today — now branded the Mexico City Grand Prix since 2021, having hosted 24 Grands Prix across those separate eras.

## A circuit that's changed shape entirely

At just 4.304km, Autódromo Hermanos Rodríguez is the third-shortest circuit on the current F1 calendar — short enough that its character has shifted dramatically across the venue's different eras of racing, most obviously with the addition of the Foro Sol stadium section that now defines the modern layout.

## Why the origin still matters

It would be easy for a circuit's origin story to fade once a place becomes known mainly for its atmosphere, and Mexico City's race weekend has become exactly that — a genuine festival built around Formula 1 rather than just a race with some entertainment attached. But the name itself doesn't let the origin disappear entirely. Every time the podium ceremony plays out in the Foro Sol stadium, it's happening at a venue whose own name quietly commemorates two brothers who never got to see the circuit become what it is now.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Circuit Named After Two Brothers Who Died Racing There",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "history",
    excerpt: "Autódromo Hermanos Rodríguez carries the names of Ricardo and Pedro Rodríguez, two Mexican racing drivers who both lost their lives at the same track it's named for.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: Autódromo Hermanos Rodríguez naming, F1 racing eras (1963-70, 1986-92, 2015-present, 24 Grands Prix total), circuit length (4.304km, third-shortest on the calendar) — racingcircuits.info 'Mexico City'. Hero image pending: 3 options presented to curator, not yet chosen (see scratchpad/hero-images-blog-nonlive-events.md). Researched 6 Sep 2026.",
    publishedAt: new Date("2026-08-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
