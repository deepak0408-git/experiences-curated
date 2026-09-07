import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "ben-stokes-258-at-newlands";
const ENG_SA_EVENT_ID = "c2bc1d6c-19ab-4d8c-9002-cb41d48a35de"; // England tour of South Africa 2026-27

const bodyContent = `On 3 January 2016, in the second Test of England's tour of South Africa, Ben Stokes scored 258 runs from 198 balls at Newlands. He reached 250 faster than any batsman in Test history, beating a mark Virender Sehwag had set against Sri Lanka in 2009 by 11 balls. His overall double century, reached in 163 balls, is the second-fastest in Test history, behind only Nathan Astle's 153-ball effort for New Zealand in 2002. Along the way he hit 30 fours and 11 sixes, an England record for sixes in a single Test innings.

## Why it worked

England were already committed to attacking cricket that series, batting first and looking to put South Africa under pressure rather than grinding through a survival innings. Stokes came in with that license already given, against a South African attack that included Kagiso Rabada, and simply didn't let up once he found his rhythm. It's the kind of innings where the bowling side's normal plans — bowl tight, wait for a mistake — stop working because the batsman isn't playing that game at all.

## Why it belongs in the story of this rivalry

England-South Africa Tests have a reputation for extreme conditions and hostile fast bowling, and Stokes' innings is the counter-example that makes the rivalry more interesting: proof that the same fixtures capable of grinding out draws over five brutal days can also produce the second-fastest double century anyone has ever scored in the format's history.

Newlands specifically keeps showing up in this rivalry's biggest moments, for better and worse. Whatever the 2026-27 tour produces, it's arriving at a venue with real form for the historically strange.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Ben Stokes' 258 at Newlands Is Still the Benchmark",
    sport: ["cricket"],
    sportingEventId: ENG_SA_EVENT_ID,
    contentCategory: "rivalry",
    excerpt: "In January 2016, Ben Stokes reached 250 faster than anyone in Test history and finished with 258 off 198 balls — the second-fastest Test double century ever scored, at a ground with real form for producing exactly this kind of moment.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/blog/hero/ben-stokes-258-at-newlands.jpg",
    heroImageAlt: "Newlands Cricket Ground with Table Mountain in the background, Cape Town",
    heroImageCredit: null,
    editorialNote: "Sources: Stokes' innings stats (198 balls to 250 - fastest in Test history beating Sehwag by 11 balls; 163-ball double century - second-fastest behind Nathan Astle's 153; 30 fours, 11 sixes - England Test record) — skysports.com, abc.net.au, sportskeeda.com 'Stats: Ben Stokes scores second-fastest double century in Test history'. Hero image: originally set to a portrait sunset/floodlights Newlands shot (curator's Option 2 pick), replaced 6 Sep 2026 with a curator-supplied local file (Images/Newlands Table Mountains Cricket Ground.jpg — a wide panorama, same shot as the Option 3 candidate originally presented) after the founder found the sunset crop 'not good at all, cannot see the ground itself'. Per hero-image-search convention, heroImageCredit left null since this is a user-supplied file, not a freshly-sourced/attributed candidate. Also removed the per-slug object-position crop override in app/blog/[slug]/page.tsx that was tuned for the old portrait image — unnecessary for this wide panoramic replacement.",
    publishedAt: new Date("2026-08-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
