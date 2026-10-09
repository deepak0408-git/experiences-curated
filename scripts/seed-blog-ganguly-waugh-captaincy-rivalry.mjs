import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "ganguly-waugh-captaincy-rivalry";
const BGT_EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";

const bodyContent = `Steve Waugh called his approach "mental disintegration." Needle an opponent enough, keep the pressure on before a ball's even bowled, and sooner or later something cracks. Worked on almost everyone Australia played through the late 1990s. Against Sourav Ganguly's India, not so much.

## A captain who refused to be rushed

Ganguly had this one habit: showing up late for the coin toss. Waugh wrote in his own book that he thought it was deliberate, and counted roughly seven occasions where Ganguly did it. Ganguly always said the first time, in 2001, was an accident, he'd left his blazer in the dressing room. What he admitted later is that once he noticed it got under Waugh's skin, and the rest of the Australians', he kept doing it on purpose. Small thing on its own. As a signal, it mattered: India's captain wasn't getting hurried by Australia's, on the field or off it.

## The sledge that turned a Test

The clearest case of the tactic backfiring came on the final day of the 2001 Kolkata Test. India was dropping catches, and Waugh told Ganguly, "You just dropped the Test, mate." That's exactly the kind of line mental disintegration ran on: needle the captain, get into his head, wait for the team to fall apart. Instead it seemed to fire the Indians up. Not long after, Harbhajan Singh had Waugh out. Australia walked into that Test 1-0 up in the series. They walked out having lost it 1-2.

## Why this one had a different edge to it

Most captaincy rivalries in cricket are just two sets of tactics quietly working against each other. This one had more friction, because Waugh's whole method depended on opponents getting rattled by aggression, and Ganguly built his India side specifically around not being rattled. Earlier Indian teams touring or hosting Australia had sometimes looked a step behind, even deferential. Ganguly's didn't. Critics called him combative for its own sake at the time. The results say something closer to the opposite: a deliberate refusal to let Australia dictate the terms, held to consistently enough that it changed how this fixture got played for years after he'd left the side.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Ganguly vs. Waugh: The Captains Who Turned Up the Heat",
    sport: ["cricket"],
    sportingEventId: BGT_EVENT_ID,
    contentCategory: "rivalry",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Steve Waugh's \"mental disintegration\" worked on almost everyone Australia faced in the late 1990s. Sourav Ganguly's India was the exception that proved it wrong.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Ganguly's repeated late arrivals at the coin toss, Waugh's claim in his own book it happened ~7 times, Ganguly's account that the first (2001) was accidental (left blazer in dressing room) but later ones deliberate once he saw it worked — crictoday.com, sportzwiki.com, crictracker.com (all citing Ganguly's own later interviews/autobiography excerpts). Waugh's 'mental disintegration' term and philosophy — Wisden tribute (wisden.com) and Wikipedia 'Sledging (cricket)'. The 2001 Kolkata Test sledge ('You just dropped the Test, mate'), Harbhajan dismissing Waugh shortly after, Australia going from 1-0 up to 1-2 down in the series — ESPNcricinfo 'Ganguly reveals how Waugh's sledging backfired' (cricinfo.com/story/ganguly-reveals-how-waugh-s-sledging-backfired-133398), sourced from Ganguly's book 'Ground Rules' excerpted in The Telegraph (Kolkata). Deliberately excluded: Ganguly's 2002 Lord's shirt celebration — that incident was against England, not Australia, and involved a named England player; irrelevant tangent for an India-Australia piece and out of scope per the skill's hard line against unnecessary callouts of named individuals. Verified 8 Oct 2026.",
    publishedAt: new Date("2026-10-08T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
