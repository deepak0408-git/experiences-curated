import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "why-malaysia-built-sepang";
// DB event name is "Bahrain Grand Prix 2026 (Malaysia)" at venue Sepang International
// Circuit — this is CORRECT, not a mislabel. An earlier version of this comment wrongly
// flagged it as a DB bug (6 Sep 2026); retracted the same day after verifying the 2026
// Bahrain GP was genuinely relocated to Sepang following the Gulf conflict (see the
// body content's "Why the circuit's return matters" section for the sourced detail).
const EVENT_ID = "07e23597-720b-41e1-b8ff-419e004307ee";

const bodyContent = `Sepang International Circuit went from groundbreaking to inauguration in under two years, opening in March 1999 under Prime Minister Mahathir Mohamad. It wasn't built simply because Malaysia wanted a Grand Prix. It was one piece of a much larger "Vision 2020" push to position the country as a serious industrial and technological player in Asia, alongside projects like the newly-founded capital of Putrajaya nearby. Hosting Formula 1 was, in part, a statement about what Malaysia could build.

## The template other circuits copied

Hermann Tilke designed the track, and it turned out to be more than just another new venue on the calendar. Sepang became something close to the template for the "modern" generation of purpose-built F1 circuits that followed it — the wide run-off areas, the flowing corner sequences, the amenities built around a single race weekend rather than decades of local racing history. A lot of circuits built in the 2000s and 2010s owe their basic shape to what Tilke worked out first at Sepang.

## A controversial start

Sepang's first Grand Prix in 1999 wasn't a clean debut — it came with real controversy attached, the kind of rocky start that could have derailed a venue with less institutional backing behind it. It didn't. Sepang went on to host the Malaysian Grand Prix from 1999 through 2017, becoming one of the longer-running fixtures of F1's expansion into Asia before the race eventually left the calendar.

## Why the circuit's return matters

When F1 comes back to Sepang in October 2026, it arrives under an unusual name: this round is officially the Bahrain Grand Prix. The original Bahrain and Saudi Arabian races were postponed earlier in the year after conflict broke out in the Gulf, and rather than drop the round entirely, the FIA and Formula 1 struck an agreement with the Bahraini and Malaysian governments to relocate it to Sepang — Bahrain keeps the race's name, ticket pricing, and proceeds, while Malaysia hosts the actual event. It's the first Formula 1 race at Sepang since 2017.

Even under someone else's name, F1 isn't returning to a random venue picked for convenience. It's returning to the circuit that effectively invented the modern F1 venue playbook — and to a country that built it, deliberately, as proof of what it could construct in under two years flat.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Why Malaysia Built Sepang — and Why It Still Matters",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "history",
    excerpt: "Built in under two years as part of a national push to put Malaysia on the map, Sepang became the template every modern F1 circuit copied afterward.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/Sepang_tribune.jpg",
    heroImageAlt: "Sepang International Circuit main tribune, Malaysia",
    heroImageCredit: "Wikimedia Commons",
    editorialNote: "Sources: Sepang construction timeline (1997-99), Mahathir Mohamad/Vision 2020 context, Hermann Tilke design and its influence on later circuits — en.wikipedia.org 'Sepang International Circuit', f1.fandom.com, formulaonehistory.com. 2026 Bahrain GP relocation to Sepang (original Bahrain/Saudi races postponed after the 2026 Gulf conflict, FIA/F1 agreement with Bahraini and Malaysian governments, Bahrain retaining race name/ticket pricing/proceeds, Sepang's first F1 race since 2017) — formula1.com 'Formula 1 and FIA confirm Malaysia will join 2026 calendar as host venue for Bahrain Grand Prix', skysports.com, en.wikipedia.org '2026 Bahrain Grand Prix'. CORRECTION 6 Sep 2026: an earlier version of this note flagged the sporting_events row's name ('Bahrain Grand Prix 2026 (Malaysia)') as a likely DB mislabel/bug. That was wrong — verified this is the real, correct event name; the race genuinely is the Bahrain GP, relocated to and held at Sepang. Retracting that flag. Reused existing hero image already licensed for the pack ('Sepang's History' experience). Researched 6 Sep 2026.",
    publishedAt: new Date("2026-08-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
