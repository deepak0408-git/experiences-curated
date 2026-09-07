import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "crashgate-the-race-singapore-would-rather-forget";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b"; // Singapore Grand Prix 2026

const bodyContent = `Nelson Piquet Jr. crashed his Renault into the wall at Turn 17 on lap 14 of the 2008 Singapore Grand Prix. At the time it looked like a driver error on a demanding street circuit — the kind of thing that happens most race weekends somewhere on the grid. The safety car came out to clear the debris, and Fernando Alonso, who had pitted for fuel just before the crash, found himself perfectly placed to inherit the lead once the rest of the field cycled through their own delayed stops. He went on to win the race.

A year later, Piquet — by then dropped by the team — told the FIA he had been instructed to crash deliberately, to trigger a safety car at exactly the moment that would benefit his teammate.

## What the investigation found

The FIA opened a case against Renault, and the team chose not to contest the charges once they were laid out. Team principal Flavio Briatore received an indefinite ban from any FIA-sanctioned event, and technical director Pat Symonds was banned for several years, later reduced on appeal. Alonso himself was cleared of any involvement in planning the crash and kept his win.

## Why it still matters for the race itself

Crashgate didn't happen because Singapore is a uniquely easy place to fix a result — it happened because Marina Bay's tight, wall-lined layout makes a single, well-timed crash unusually effective at controlling a race through the safety car alone. That's a real structural feature of the circuit, not just a footnote about one team's decision to exploit it.

It's also a useful reminder that a race's most consequential moment doesn't always look dramatic at the time. Piquet's crash looked like nothing more than an ordinary mistake for almost a full year before anyone knew otherwise.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Crashgate: The Race Singapore Would Rather Forget",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "history",
    excerpt: "Fernando Alonso won the inaugural Singapore Grand Prix in 2008 — and a year later, it emerged the win came from a deliberately staged crash by his own teammate.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/Singapore GP Turn 1 Grandstand.jpg",
    heroImageAlt: "Marina Bay Street Circuit trackside grandstand, Singapore",
    heroImageCredit: null,
    editorialNote: "Sources: Nelson Piquet Jr.'s crash and later admission, Renault investigation, Briatore/Symonds bans, Alonso cleared — en.wikipedia.org 'Renault Formula One crash controversy', racingnews365.com 'F1's biggest scandals: Renault lose £40m a year after Crashgate', espn.co.uk 'Crashgate explained'. Reused existing hero image already licensed for the pack (Turn 1 Grandstand experience) as a general circuit shot — no image of the actual Turn 17 crash site exists in the pack's current image set. Researched 6 Sep 2026.",
    publishedAt: new Date("2026-08-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
