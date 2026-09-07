import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "australia-returns-to-south-africa-after-sandpapergate";
const AUS_SA_EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806"; // Australia tour of South Africa 2026

const bodyContent = `On the third afternoon of the third Test at Newlands in March 2018, television cameras caught Cameron Bancroft rubbing a cricket ball with a strip of yellow sandpaper hidden in his pocket. He tried to hide it down his trousers the moment he realized he'd been spotted. By that evening he was explaining himself to match officials; within 48 hours, captain Steve Smith and vice-captain David Warner had admitted a "leadership group" planned the whole thing.

## The fallout

Cricket Australia banned Smith and Warner for twelve months each, Bancroft for nine, and coach Darren Lehmann resigned before the tour was even over. It became simply "Sandpapergate" — the kind of scandal that needs no further explanation inside the sport.

## Why this tour is different from a normal one

Australia hasn't played a Test series in South Africa since. Eight years is a long gap for two teams that otherwise tour each other regularly, and it isn't hard to see why: no team wants to walk straight back into the stadium where its captain was banned for cheating, and South African crowds have never been shy about reminding Australian players exactly what happened.

That changes in September and October 2026, when Australia arrives for three ODIs and three Tests across Durban, Johannesburg, Potchefstroom, Gqeberha and finally Cape Town. The Test series ends at Newlands — the same ground, the same city, arguably some of the same stands that watched the scandal unfold in real time in 2018.

## A rivalry that predates the scandal

Australia and South Africa were fierce competitors long before 2018. Both teams play an uncompromising, confrontational style of cricket, and matches between them have rarely stayed polite even when nothing beyond the result was on the line. Sandpapergate didn't create this rivalry — it gave it its most infamous chapter. The rivalry has kept producing new chapters since: in June 2025, South Africa beat Australia by five wickets at Lord's to win the World Test Championship final, Aiden Markram's 136 and Kagiso Rabada's nine wickets in the match delivering South Africa's first ICC men's title in 27 years.

South African players have generally stayed measured in public about not "taunting" Australia over the incident, but eight years of pointed questions from journalists and crowds tends to have its own effect regardless of what anyone says on the record. Whether this tour reopens old wounds or genuinely closes the chapter probably depends less on what either board says beforehand and more on what happens the moment the series actually starts.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Australia Returns to South Africa for the First Time Since Sandpapergate",
    sport: ["cricket"],
    sportingEventId: AUS_SA_EVENT_ID,
    contentCategory: "rivalry",
    excerpt: "In October 2026, Australia plays a Test series in South Africa for the first time since the 2018 ball-tampering scandal that ended at Newlands — and the series closes at the same ground where it all happened.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/where-to-sit-newlands-comparison.jpg",
    heroImageAlt: "Newlands Cricket Ground in Cape Town",
    heroImageCredit: "PaddyBriggs, Public Domain",
    editorialNote: "Sources: Sandpapergate incident, bans, Lehmann resignation — independentaustralia.net, lethbridgeherald.com, outlookindia.com (Sept 2026 previews of the tour, all recapping the 2018 incident consistently). South African players' public restraint on the topic — gulfnews.com. 2026 tour schedule (Durban/Johannesburg/Potchefstroom/Gqeberha/Cape Town, Test series closing at Newlands 31 Oct) — cricsa.co.za, cricstralia.com.au. 2025 WTC final result (SA won by 5 wickets at Lord's, 11-14 June 2025, Markram's 136, Rabada's 9 wickets in the match, SA's first ICC men's title since 1998/27-year drought) — espncricinfo.com match report, icc-cricket.com, abc.net.au. Reused existing hero image already licensed for the Australia-in-South-Africa pack (Newlands comparison experience). Researched 6 Sep 2026, updated 6 Sep 2026 with WTC final addition.",
    publishedAt: new Date("2026-08-31T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
