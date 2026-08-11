import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "europe-vs-world-ryder-cup-loyalty";

const bodyContent = `Golf is one of the most individual sports there is. The Ryder Cup asks players who compete against each other fifty other weeks a year to suddenly represent a country that, for half the team, isn't actually theirs.

## The team that doesn't belong to one nation

Until 1979, the Ryder Cup pitted the United States against a Great Britain and Ireland side that had won exactly once in over three decades. By the late 1970s, the gap had become embarrassing enough that Jack Nicklaus — an American, arguing against his own team's dominance — lobbied to expand the opposition into a full European team. Spain's Seve Ballesteros and Antonio Garrido became the first continental Europeans to play in 1979, representing a team that suddenly spanned a dozen different countries, languages, and golfing cultures, all wearing the same shirt.

## It didn't work right away, and then it completely did

The first expanded European team still lost, 17 to 11 in 1979. But the shift eventually changed the entire competition: since 1983, Europe holds an 8-5-1 record against the United States, a genuine reversal from the one-sided contest the event used to be. Ballesteros himself became the single biggest reason why — across eight Ryder Cup appearances he won 22.5 of a possible 37 points, and in partnership with fellow Spaniard José María Olazábal, the pair won 11 of 15 matches together against American pairings. Europe's first-ever win on American soil came in 1987, the moment the balance of power genuinely flipped.

## Why the loyalty question is the real story

A Spaniard, an Englishman, and a Swede standing on the same team, cheering each other's putts against a common opponent, is a genuinely unusual sight in professional sport — most team rivalries are built on nationality alone. The Ryder Cup's entire identity depends on golfers who spend most of the year as individual competitors, sometimes against each other, suddenly finding real loyalty to a flag that represents a continent rather than a country.

## Why this rivalry still matters

The Ryder Cup works precisely because that loyalty isn't obvious or automatic — it has to be built fresh every two years, among players who don't share a passport. That's a harder thing to manufacture than pure nationalism, and it's exactly why, once it clicks, it produces some of the most emotional moments in golf.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Europe vs. the World — Why Ryder Cup Loyalty Doesn't Follow Nationality",
    sport: ["golf"],
    sportingEventId: null,
    contentCategory: "rivalry",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "The Ryder Cup asks individual competitors from a dozen different countries to become a team overnight. It shouldn't work — but since 1983, Europe holds an 8-5-1 record proving it does.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: 1979 GB&I-to-Europe expansion, Nicklaus's lobbying, pre-1979 GB&I one-win-in-30-years record — golfcompendium.com and golfcollege.edu. 1979 result (17-11 US win), Ballesteros/Garrido as first continental Europeans — Wikipedia '1979 Ryder Cup'. Europe's 8-5-1 record since 1983, Ballesteros's 22.5/37-point record, Ballesteros-Olazábal 11-of-15 partnership record, 1987 first US-soil win — sportskeeda.com and foxsports.com. No sportingEventId — no Ryder Cup event row exists in our DB yet, kept unlinked rather than attached to an unrelated event. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-20T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
