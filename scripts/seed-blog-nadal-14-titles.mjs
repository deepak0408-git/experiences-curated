import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { blogArticles } from "../schema/database.ts";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";

const localPath = "Images/French Open Blog - Nadal Roland Garros Plaque.jpg";
const r2Key = "blog/hero/rafael-nadal-14-roland-garros-titles.jpg";

const file = readFileSync(localPath);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("✓ Uploaded to R2:", heroImageUrl);

const slug = "the-king-of-clay-rafael-nadal-14-roland-garros-titles";

const bodyContent = `Roland-Garros installed a permanent marble plaque near the net post on Court Philippe-Chatrier on May 25, 2025. It's small, 40 by 30 centimeters, and it carries three things: Rafael Nadal's footprint, an engraving of the Musketeers' Cup, and the number 14. He didn't know it was coming. When he saw it, he said, "Knowing that's going to be forever there, it's a present that I can't describe in words."

Fourteen is the number that made the plaque necessary. No player, man or woman, has won 14 titles at a single Grand Slam. Nadal has, at the same tournament, on the same red clay, across two decades.

## The record, stripped down

He won his first Roland-Garros in 2005 at 19 years old. His last came in 2022, at 36. The years in between: 2006, 2007, 2008, 2010, 2011, 2012, 2013, 2014, 2017, 2018, 2019, 2020. Fourteen finals played, fourteen won. He never lost one. His full match record at the tournament is 112-3 — a 97% win rate with nothing close to it anywhere else in the sport.

Four of the fourteen titles came without dropping a single set: 2008, 2010, 2017, 2020. He was taken to five sets only three times across fourteen championship runs, and between 2010 and 2015 he won 39 straight matches at Roland-Garros, still the tournament record.

People who were there still bring up 2008 unprompted. He beat Novak Djokovic in the semifinal, then lost only 41 games across 21 sets on his way to the title. In an era stacked with genuinely great players, that fortnight barely looked like a contest.

## Why clay, why him

Clay plays slow. The ball sits up higher, rallies run longer, and the surface rewards whoever can out-grind an opponent point after point instead of ending things early with raw pace. That's Nadal's game. His career win rate on clay, across every tournament he's played, sits above 91%, the best of the Open Era on the surface. Roland-Garros is where that number stops looking like dominance and starts looking like ownership.

## What the plaque means if you're going

The Nadal statue already stands nearby, in the Musketeers' garden. The plaque is different. It sits on the court itself, at net level, on the exact patch of clay where 14 finals were decided. Walk Chatrier during the 2027 tournament and you'll pass within a few feet of it on the way to your seat. It isn't behind glass. It's built into a court that's still being played on, every year, by whoever's trying to become the next name people argue about on that same clay.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The King of Clay: Rafael Nadal's 14 Roland-Garros Titles",
    sport: ["tennis"],
    sportingEventId: FRENCH_OPEN_EVENT_ID,
    contentCategory: "history",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "There's a marble plaque near the net on Court Philippe-Chatrier now — Nadal's footprint, the Musketeers' Cup, and the number 14. It took him two decades and 112 wins to earn it.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl,
    heroImageAlt: "Commemorative marble plaque with Rafael Nadal's footprint near the net on Court Philippe-Chatrier, Roland-Garros",
    heroImageCredit: "Like tears in rain (Wikimedia Commons, CC BY-SA 4.0)",
    editorialNote: "Sources, all checked directly 7-8 Sep 2026: plaque unveiling date (25 May 2025), dimensions (40x30cm), location (near net post, Court Philippe-Chatrier), and Nadal's direct quote — rolandgarros.com 'Rafael Nadal: A legend cast in clay' (one-year-anniversary tribute article), fetched directly. Title-count facts (14 titles 2005-2022, 112-3 match record, 97% win rate, 4 titles without dropping a set [2008/2010/2017/2020], 39-match win streak 2010-2015, only 3 five-set matches in 14 runs) — rolandgarros.com's own 'Rafael Nadal & Roland-Garros: the numbers behind the dominance' article, corroborated by ATP Tour's 'How Rafael Nadal became Roland-Garros royalty' retrospective. 2008 specifics (beat Djokovic in semifinal, lost 41 games across 21 sets) — ATP Tour retrospective. Career clay win rate (91%+, best of Open Era) — corroborated across multiple sources including Sports Illustrated's clay-court data feature. The footprint-tile fact is the same one already used in the seeded 'Court Philippe-Chatrier & Suzanne-Lenglen' experience (scripts/update-french-open-chatrier-nadal-tile.mjs) — consistent across both pieces. Hero image: Wikimedia Commons, photographed 29 May 2025 (days after the unveiling), CC BY-SA 4.0, downloaded to Images/ before R2 upload per standing rule.",
    publishedAt: new Date(),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
