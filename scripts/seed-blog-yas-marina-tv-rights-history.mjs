import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "yas-marina-twilight-tv-rights-story";
const ABU_DHABI_EVENT_ID = "8f45cb75-f205-458b-8f31-48551e6d7cb8";

const bodyContent = `A 5pm local start time sounds arbitrary until you check what time that actually is in London, Milan, and Paris.

## Built for television from the very first race

When Abu Dhabi hosted its inaugural Grand Prix in 2009, organizers announced it would be Formula 1's first-ever day-night race — a deliberate first, not an accident of scheduling. The race started at 5:00pm local time, with sunset at 17:43 that day, engineered so the field would start in daylight and finish under floodlights. Yas Marina's own management stated at the time that the circuit had been built from the outset to host day-and-night events, using the inaugural race specifically to demonstrate that built-in flexibility.

## The real reason: Europe is still F1's most valuable audience

Abu Dhabi's 5pm local start lands at 1pm in London, Paris, and most of Western Europe — a genuine midday-to-afternoon slot, not the awkward late-night or pre-dawn window a literal "local evening" race in the Gulf would otherwise force on European viewers. That timing decision reflects a real financial reality: Formula 1's European broadcast deals are enormous. Sky Sports' current UK, Ireland, and Italy rights deal alone is worth roughly £1 billion through 2034, a 55% increase on the previous agreement — and the 2025 season became the most-watched F1 campaign in Sky Sports UK/Ireland history, generating 162 million viewer hours. A season finale that fails to land in a workable European time slot risks a meaningful chunk of that audience.

## Why this history matters

The twilight spectacle at Yas Marina — the sunset over the marina, the floodlights taking over mid-race — reads as pure showmanship, and it is. But it's showmanship built around a genuine commercial constraint: keep the race watchable live for the market paying the most for the privilege. The magic hour wasn't chosen for the photographs. It was chosen because it happens to fall exactly when Europe is free to watch.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Yas Marina's Twilight Start Time Isn't an Accident — the TV-Rights Story Behind It",
    sport: ["formula_one"],
    sportingEventId: ABU_DHABI_EVENT_ID,
    contentCategory: "history",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "The sunset-to-floodlights spectacle at Yas Marina is real showmanship — but the 5pm start time exists because it lands at 1pm across F1's most valuable broadcast market: Europe.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: 2009 inaugural Abu Dhabi GP as F1's first day-night race, 5pm start/17:43 sunset, Yas Marina built for day/night flexibility from the outset — skysports.com and Wikipedia '2009 Abu Dhabi Grand Prix'. Sky Sports UK/Ireland/Italy rights deal value (~£1bn through 2034, 55% increase), 2025 season viewer-hours record (162 million) — sportspro.com and blackbookmotorsport.com. Verified 11 Aug 2026.",
    publishedAt: new Date("2026-07-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
