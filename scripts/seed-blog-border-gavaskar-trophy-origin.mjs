import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "border-gavaskar-trophy-origin-story";
const BGT_EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";

const bodyContent = `Most trophies get their names from a sponsor or a venue. This one got its name from two batsmen who spent their careers making life difficult for each other, then became genuinely good friends once the bat and ball were put away.

## Two of the best to ever hold a bat

Sunil Gavaskar was the first player in Test history to reach 10,000 career runs, getting there with a late cut off Pakistan's Ijaz Faqih in Ahmedabad in March 1987. He finished with 10,122 runs from 125 Tests. Allan Border passed him almost six years later, going past 10,000 at the SCG in January 1993 with a drive to mid-on, and finished his own career with 11,174 runs from 156 Tests, a world record at the time.

When Border reached the milestone, Gavaskar sent him a fax welcoming him to what he called "Club 10,000." Two rival captains, from two cricketing nations with real tension between them, taking a minute to acknowledge each other's careers directly. That gesture explains why this trophy carries their names better than any stat does.

## A rivalry with a running joke built in

Border dismissed Gavaskar during the sixth Test of the 1979-80 series in Mumbai, and apparently never let him forget it. Decades later, Gavaskar says Border still greets him the same way whenever they meet: "Hello Bunny, how are you?" Gavaskar calls him "my good friend" right back. Needling like that only works between two people who've earned the right to it.

## Why the trophy exists at all

The Border-Gavaskar Trophy was created in 1996, to put a name on a Test rivalry between India and Australia that had already been running since 1947 without one. It was donated by the Indo-Australian Business Council, timed to the Council's own centenary, specifically to raise the profile of the fixture. The first series under the new name was played in 1996-97 in India.

Naming it after Border and Gavaskar wasn't really about picking the two best batsmen either country had produced, though both men would be on most people's shortlists for that anyway. It was about picking two players who'd defined what it looked like to compete hard against this opponent, for over a decade, without ever letting it turn personal in a way that didn't end in a joke and a handshake.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Border and Gavaskar: The Handshake That Named a Trophy",
    sport: ["cricket"],
    sportingEventId: BGT_EVENT_ID,
    contentCategory: "history",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Allan Border and Sunil Gavaskar spent their careers making life hard for each other, then became genuine friends. In 1996, cricket named a trophy after that respect.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Gavaskar first to 10,000 Test runs (10,122 from 125 Tests, late cut off Ijaz Faqih, Ahmedabad, March 1987) and Border passing 10,000 at SCG Jan 1993, finishing with 11,174 from 156 Tests (world record at the time) — thecricscope.com 'Sunil Gavaskar Stats', gulfnews.com '10,000 Test runs club' photo feature, cricinfo.com gallery 'The 10,000-run club'. Gavaskar's congratulatory fax to Border welcoming him to 'Club 10,000' — cricinfo.com gallery feature (cited alongside the runs-milestone reporting). Border dismissing Gavaskar in the 6th Test, 1979-80 series, Mumbai, and the enduring 'Hello Bunny' greeting plus Gavaskar calling Border 'my good friend' — republicworld.com and cricshots.com, both citing Gavaskar's own retelling. Trophy creation: instituted 1996, donated by the Indo-Australian Business Council to mark its own centenary and raise the fixture's profile, first series played 1996-97 in India — Wikipedia 'Border-Gavaskar Trophy', india.com explainer, mykhel.com history page. Verified 8 Oct 2026.",
    publishedAt: new Date("2026-10-08T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
